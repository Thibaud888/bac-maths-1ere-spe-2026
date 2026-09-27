#!/usr/bin/env node
/**
 * Garde-fou « aucun fait modifié » pour le contenu réglementaire et de méthode :
 * `content/bac/*.json` et `content/terminale/grand-oral/*.json`.
 *
 * Compare, entrée par entrée (clé : l'`id`), les faits d'une version de référence
 * (une révision git, `origin/main` par défaut) et ceux de l'arbre de travail.
 * Une reformulation ou une mise en forme ne doit faire apparaître aucune différence.
 *
 * Faits relevés dans chaque entrée :
 * - les nombres des textes : chiffres (« 0,8 » = « 0.8 ») et nombres écrits en
 *   lettres (« dix minutes » = « 10 min ») ;
 * - les dates : jour et mois (« lundi 14 juin 2027 »), mois et année
 *   (« juin 2026 »), jour de semaine suivi d'un numéro (« jeudi 17 »), saison
 *   (« printemps ») ;
 * - les sources citées (`sources`, `coefficientId`) ;
 * - les champs codés : tout nombre, booléen ou texte sans espace ni accent
 *   (identifiant, énumération, adresse), comparé tel quel avec son nom de champ.
 * Les apostrophes, espaces et la ponctuation n'entrent pas en compte.
 *
 * Usage :
 *   node scripts/faits-inchanges.mjs                  # origin/main → arbre de travail
 *   node scripts/faits-inchanges.mjs --avant <rév>    # autre référence (ex. HEAD~1)
 *   node scripts/faits-inchanges.mjs --apres <rév>    # comparer deux révisions
 *   node scripts/faits-inchanges.mjs --json           # sortie en JSON
 * Exit 0 si aucun fait ne diffère, 1 sinon (chaque différence est listée).
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const DOSSIERS = ['content/bac', 'content/terminale/grand-oral'];

const args = process.argv.slice(2);
function option(nom) {
  const i = args.indexOf(nom);
  return i === -1 ? undefined : args[i + 1];
}
const asJson = args.includes('--json');

function git(...params) {
  return execFileSync('git', params, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
}

function refExiste(ref) {
  try {
    git('rev-parse', '--verify', '--quiet', `${ref}^{commit}`);
    return true;
  } catch {
    return false;
  }
}

const avant = option('--avant') ?? (refExiste('origin/main') ? 'origin/main' : 'main');
const apres = option('--apres'); // absent : l'arbre de travail

// ---------------------------------------------------------------------------
// Lecture des fichiers, à une révision git ou sur le disque
// ---------------------------------------------------------------------------

/** { chemin → contenu JSON } pour une révision (ou le disque si `ref` est absent). */
function lireContenu(ref) {
  const fichiers = {};
  if (ref) {
    const liste = git('ls-tree', '-r', '--name-only', ref, '--', ...DOSSIERS)
      .split('\n')
      .filter((p) => p.endsWith('.json'));
    for (const chemin of liste) fichiers[chemin] = JSON.parse(git('show', `${ref}:${chemin}`));
  } else {
    for (const dossier of DOSSIERS) {
      const absolu = join(root, dossier);
      if (!existsSync(absolu)) continue;
      for (const nom of readdirSync(absolu).filter((n) => n.endsWith('.json')).sort()) {
        const chemin = `${dossier}/${nom}`;
        fichiers[chemin] = JSON.parse(readFileSync(join(root, chemin), 'utf8'));
      }
    }
  }
  return fichiers;
}

// ---------------------------------------------------------------------------
// Extraction des faits d'un texte
// ---------------------------------------------------------------------------

const MOIS = 'janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre';
const JOURS = 'lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche';
const NOMBRES_EN_LETTRES = {
  deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8, neuf: 9, dix: 10,
  onze: 11, douze: 12, treize: 13, quatorze: 14, quinze: 15, seize: 16, vingt: 20,
  trente: 30, quarante: 40, cinquante: 50, soixante: 60, cent: 100, mille: 1000,
};
// Lettres de part et d'autre : « dix » compte, « dixième » ou « Dixon » non.
const RE_LETTRES = new RegExp(
  `(?<!\\p{L})(${Object.keys(NOMBRES_EN_LETTRES).join('|')})(?!\\p{L})`,
  'giu'
);
const RE_CHIFFRES = /\d+(?:[,.]\d+)?/g;
const RE_DATE = new RegExp(`(?:(${JOURS})\\s+)?(\\d{1,2})(?:er)?\\s+(${MOIS})(?:\\s+(\\d{4}))?`, 'giu');
const RE_JOUR_NUMERO = new RegExp(`(?<!\\p{L})(${JOURS})\\s+(\\d{1,2})(?:er)?(?!\\d)`, 'giu');
const RE_MOIS_ANNEE = new RegExp(`(?<!\\p{L})(${MOIS})\\s+(\\d{4})`, 'giu');
// « été » est laissé de côté : c'est aussi un participe (« a été »).
const RE_SAISON = /(?<!\p{L})(printemps|automne|hiver)(?!\p{L})/giu;
// Valeur codée : identifiant, énumération, adresse — aucun espace, aucune lettre accentuée.
const RE_CODE = /^[A-Za-z0-9_.\-:/%?=#@+&~]+$/;

/** Les faits d'un texte libre, sous forme d'étiquettes (« nombre:8 », « date:… »). */
function faitsDuTexte(texte) {
  const faits = [];
  for (const m of texte.matchAll(RE_CHIFFRES)) faits.push(`nombre:${Number(m[0].replace(',', '.'))}`);
  for (const m of texte.matchAll(RE_LETTRES)) {
    faits.push(`nombre:${NOMBRES_EN_LETTRES[m[1].toLowerCase()]}`);
  }
  for (const m of texte.matchAll(RE_DATE)) {
    const [, jour, numero, mois, annee] = m;
    faits.push(
      `date:${[jour?.toLowerCase(), Number(numero), mois.toLowerCase(), annee].filter(Boolean).join(' ')}`
    );
  }
  for (const m of texte.matchAll(RE_JOUR_NUMERO)) faits.push(`jour:${m[1].toLowerCase()} ${Number(m[2])}`);
  for (const m of texte.matchAll(RE_MOIS_ANNEE)) faits.push(`mois:${m[1].toLowerCase()} ${m[2]}`);
  for (const m of texte.matchAll(RE_SAISON)) faits.push(`saison:${m[1].toLowerCase()}`);
  return faits;
}

/** Tous les faits d'une entrée JSON, parcourue récursivement. */
function faitsDeLEntree(entree) {
  const faits = [];
  function visiter(valeur, champ) {
    if (Array.isArray(valeur)) {
      if (champ === 'sources') {
        for (const id of valeur) faits.push(`source:${id}`);
        return;
      }
      valeur.forEach((v, i) => visiter(v, `${champ}[${i}]`));
      return;
    }
    if (valeur !== null && typeof valeur === 'object') {
      for (const [cle, v] of Object.entries(valeur)) visiter(v, champ ? `${champ}.${cle}` : cle);
      return;
    }
    if (champ === 'coefficientId') {
      faits.push(`source:${valeur}`);
      return;
    }
    if (typeof valeur === 'string' && !RE_CODE.test(valeur)) {
      faits.push(...faitsDuTexte(valeur));
      return;
    }
    // Nombre, booléen, identifiant, énumération, adresse : comparé tel quel.
    faits.push(`champ:${champ.replace(/\[\d+\]/g, '[]')}=${String(valeur)}`);
  }
  visiter(entree, '');
  return faits;
}

// ---------------------------------------------------------------------------
// Comparaison
// ---------------------------------------------------------------------------

/** { « fichier › id » → faits } pour un ensemble de fichiers. */
function indexer(fichiers) {
  const index = new Map();
  for (const [chemin, contenu] of Object.entries(fichiers)) {
    const entrees = Array.isArray(contenu) ? contenu : [contenu];
    entrees.forEach((entree, i) => {
      const id = entree && typeof entree === 'object' && 'id' in entree ? entree.id : `#${i}`;
      index.set(`${chemin} › ${id}`, faitsDeLEntree(entree));
    });
  }
  return index;
}

function compter(liste) {
  const n = new Map();
  for (const x of liste) n.set(x, (n.get(x) ?? 0) + 1);
  return n;
}

/** Ce qui est dans `a` et plus dans `b`, en respectant les répétitions. */
function difference(a, b) {
  const nb = compter(b);
  const reste = [];
  for (const [x, k] of compter(a)) {
    for (let i = 0; i < k - (nb.get(x) ?? 0); i++) reste.push(x);
  }
  return reste.sort();
}

const indexAvant = indexer(lireContenu(avant));
const indexApres = indexer(lireContenu(apres));
const cles = [...new Set([...indexAvant.keys(), ...indexApres.keys()])].sort();

const ecarts = [];
for (const cle of cles) {
  const a = indexAvant.get(cle);
  const b = indexApres.get(cle);
  if (!a) {
    ecarts.push({ entree: cle, etat: 'ajoutée', ajoutes: b, retires: [] });
    continue;
  }
  if (!b) {
    ecarts.push({ entree: cle, etat: 'retirée', ajoutes: [], retires: a });
    continue;
  }
  const retires = difference(a, b);
  const ajoutes = difference(b, a);
  if (retires.length || ajoutes.length) ecarts.push({ entree: cle, etat: 'modifiée', ajoutes, retires });
}

const nbFaits = [...indexAvant.values()].reduce((s, f) => s + f.length, 0);
const apresLabel = apres ?? 'arbre de travail';

if (asJson) {
  console.log(JSON.stringify({ avant, apres: apresLabel, entrees: cles.length, faits: nbFaits, ecarts }, null, 2));
} else {
  console.log(`Faits comparés : ${avant} → ${apresLabel}`);
  console.log(`${cles.length} entrées, ${nbFaits} faits relevés avant.`);
  if (ecarts.length === 0) {
    console.log('Aucun fait modifié.');
  } else {
    console.log(`${ecarts.length} entrée(s) dont les faits diffèrent :`);
    for (const e of ecarts) {
      console.log(`\n• ${e.entree} (${e.etat})`);
      if (e.retires.length) console.log(`  − ${e.retires.join(', ')}`);
      if (e.ajoutes.length) console.log(`  + ${e.ajoutes.join(', ')}`);
    }
  }
}

process.exit(ecarts.length === 0 ? 0 : 1);
