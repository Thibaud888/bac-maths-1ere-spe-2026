#!/usr/bin/env node
/**
 * Garde-fou « texte exact du Bulletin officiel » pour les programmes de terminale :
 * chaque ligne de `content/terminale/<matiere>/programme.json` doit reprendre, mot pour
 * mot et dans l'ordre, le texte officiel enregistré dans
 * `.claude/skills/bac-<matiere>-terminale-2027/texte-officiel/programme*.txt`
 * (extraction brute du PDF du Bulletin officiel).
 *
 * Comparaison :
 * - les formules (`$…$`) sont mises de côté : l'extraction du PDF les abîme, elles se
 *   relisent sur l'image des pages ; restent les morceaux de texte entre les formules ;
 * - seuls comptent les lettres et les chiffres : espaces, ponctuation, apostrophes et
 *   coupures de ligne n'entrent pas en compte ; pieds de page et marques de page du
 *   fichier officiel sont retirés ;
 * - les morceaux d'une ligne doivent se suivre dans le texte officiel, séparés seulement
 *   par des caractères que leurs formules peuvent laisser (au plus ÉCART_MAX) ;
 * - une ligne commence à un début de ligne ou de phrase du texte officiel et finit à une
 *   fin de ligne ou de phrase : on ne peut pas en couper le début ou la fin.
 * Quand l'extraction éclate une formule au milieu d'une phrase (le dénominateur d'une
 * fraction tombe entre deux mots), la ligne, relue sur l'image de la page, est déclarée
 * dans `texte-officiel/ecarts-admis.json` avec sa raison. Un écart admis devenu inutile
 * est signalé comme une erreur, pour que la liste reste exacte.
 *
 * Usage :
 *   node scripts/programme-conforme.mjs              # toutes les matières qui ont un programme.json
 *   node scripts/programme-conforme.mjs maths        # une matière
 * Exit 0 si toutes les lignes sont conformes, 1 sinon (chaque écart est listé).
 * `validate-content.mjs` appelle aussi ce contrôle (donc `node scripts/verify.mjs`).
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const ÉCART_MAX = 120;

const normaliser = (texte) =>
  texte
    .normalize('NFC')
    .replace(/[’‘]/g, "'")
    .replace(/[^\p{L}\p{N}]/gu, '');

/** Lettre de base, sans accent ni signe (Ā → A) : sert aux caractères d'une formule. */
const base = (car) => car.normalize('NFD').replace(/\p{M}/gu, '');

// Ce que deviennent les commandes LaTeX dans le texte extrait du PDF.
const LETTRES = {
  pi: 'π', alpha: 'α', mu: 'μ', sigma: 'σ', delta: 'δ', omega: 'ω', Delta: 'Δ', ell: 'ℓ𝓁',
  ln: 'ln', exp: 'exp', cos: 'cos', sin: 'sin',
};
const AJOURÉES = { R: 'ℝ', Z: 'ℤ', N: 'ℕ' };
const RONDES = { P: '𝒫', B: 'ℬ' };

/** Caractères qu'une formule peut laisser dans le texte extrait (lettres et chiffres). */
function caracteresDeFormule(latex) {
  const texte = latex
    .replace(/\\mathbb\{(\w)\}/g, (_, l) => AJOURÉES[l] ?? l)
    .replace(/\\mathcal\{(\w)\}/g, (_, l) => RONDES[l] ?? l)
    .replace(/\\([a-zA-Z]+)/g, (_, c) => LETTRES[c] ?? '');
  const cars = new Set(Array.from(normaliser(texte), base));
  if (cars.has('f')) cars.add('ƒ');
  return cars;
}

const dossierOfficiel = (matiere) =>
  join(root, '.claude', 'skills', `bac-${matiere}-terminale-2027`, 'texte-officiel');

function ecartsAdmis(matiere) {
  const chemin = join(dossierOfficiel(matiere), 'ecarts-admis.json');
  if (!existsSync(chemin)) return new Map();
  return new Map(JSON.parse(readFileSync(chemin, 'utf8')).map((e) => [e.id, e.raison]));
}

/**
 * Le texte officiel normalisé, avec les positions où une ligne du programme peut
 * commencer (`debuts` : début de ligne ou après un point) et finir (`fins` : fin de
 * ligne ou après un point).
 */
function texteOfficiel(matiere) {
  const dossier = dossierOfficiel(matiere);
  if (!existsSync(dossier)) return null;
  const fichiers = readdirSync(dossier).filter((f) => /^programme.*\.txt$/.test(f));
  if (fichiers.length === 0) return null;
  let texte = '';
  const debuts = new Set();
  const fins = new Set();
  for (const f of fichiers) {
    const brut = readFileSync(join(dossier, f), 'utf8');
    // L'en-tête (provenance) s'arrête à la première ligne de « = ».
    const corps = brut.includes('\n====') ? brut.slice(brut.indexOf('\n====') + 1) : brut;
    for (const ligne of corps.split('\n')) {
      if (/^=+/.test(ligne) || ligne.startsWith('©')) continue;
      fins.add(texte.length);
      debuts.add(texte.length);
      const cars = Array.from(ligne.normalize('NFC').replace(/[’‘]/g, "'"));
      cars.forEach((car, i) => {
        if (/[\p{L}\p{N}]/u.test(car)) texte += car;
        else if (car === '.' && (i === cars.length - 1 || /\s/.test(cars[i + 1]))) {
          fins.add(texte.length);
          debuts.add(texte.length);
        }
      });
    }
    fins.add(texte.length);
    texte += '|'; // jamais une ligne à cheval sur deux fichiers
  }
  return { texte, debuts, fins };
}

/**
 * Une ligne découpée : ses morceaux de texte normalisés et, autour d'eux, les
 * caractères que les formules peuvent laisser (`autour[0]` avant le premier morceau,
 * `autour[k]` entre les morceaux k-1 et k, le dernier après le dernier morceau).
 */
function decouper(texte) {
  const parts = [];
  const autour = [new Set()];
  texte.split(/(\$[^$]*\$)/).forEach((bout) => {
    if (bout.startsWith('$') && bout.endsWith('$') && bout.length > 1) {
      for (const c of caracteresDeFormule(bout.slice(1, -1))) autour[autour.length - 1].add(c);
      return;
    }
    const n = normaliser(bout);
    if (n.length === 0) return;
    parts.push(n);
    autour.push(new Set());
  });
  return { parts, autour };
}

const toutPermis = (bout, permis) => Array.from(bout).every((c) => permis.has(base(c)));

/**
 * Vrai si la ligne se retrouve dans le texte officiel : morceaux dans l'ordre, séparés
 * seulement par des caractères de leurs formules (au plus ÉCART_MAX), commençant à un
 * début et finissant à une fin de ligne ou de phrase.
 */
function seRetrouve({ texte, debuts, fins }, { parts, autour }) {
  if (parts.length === 0) return true;
  const avant = autour[0];
  const apres = autour[autour.length - 1];
  for (let d = texte.indexOf(parts[0]); d !== -1; d = texte.indexOf(parts[0], d + 1)) {
    let debutOk = false;
    for (let s = d; s >= Math.max(0, d - ÉCART_MAX) && !debutOk; s -= 1) {
      debutOk = debuts.has(s) && toutPermis(texte.slice(s, d), avant);
    }
    if (!debutOk) continue;
    let fin = d + parts[0].length;
    let ok = true;
    for (let k = 1; k < parts.length && ok; k += 1) {
      const i = texte.indexOf(parts[k], fin);
      ok = i !== -1 && i - fin <= ÉCART_MAX && toutPermis(texte.slice(fin, i), autour[k]);
      if (ok) fin = i + parts[k].length;
    }
    if (!ok) continue;
    for (let t = fin; t <= Math.min(texte.length, fin + ÉCART_MAX); t += 1) {
      if (fins.has(t) && toutPermis(texte.slice(fin, t), apres)) return true;
    }
  }
  return false;
}

/**
 * Contrôle une matière. Renvoie { lignes, ecarts, admis } où chaque écart est
 * { id, message } et `admis` le nombre d'écarts admis constatés ;
 * `texteManquant: true` si le texte officiel n'est pas enregistré.
 */
export function verifierProgramme(matiere) {
  const chemin = join(root, 'content', 'terminale', matiere, 'programme.json');
  const lignes = JSON.parse(readFileSync(chemin, 'utf8'));
  const officiel = texteOfficiel(matiere);
  if (officiel === null) return { lignes: lignes.length, ecarts: [], admis: 0, texteManquant: true };
  const admisDeclares = ecartsAdmis(matiere);
  const ids = new Set(lignes.map((l) => l.id));
  const ecarts = [];
  let admis = 0;
  for (const id of admisDeclares.keys()) {
    if (!ids.has(id)) ecarts.push({ id, message: 'écart admis pour une ligne qui n\'existe pas' });
  }
  for (const ligne of lignes) {
    const decoupe = decouper(ligne.texte ?? '');
    const conforme = seRetrouve(officiel, decoupe);
    if (admisDeclares.has(ligne.id)) {
      if (conforme) ecarts.push({ id: ligne.id, message: 'écart admis devenu inutile : le retirer de ecarts-admis.json' });
      else admis += 1;
      continue;
    }
    if (conforme) continue;
    // Premier morceau introuvable : c'est lui qu'on montre.
    const fautif = decoupe.parts.find((p) => !officiel.texte.includes(p));
    ecarts.push({
      id: ligne.id,
      message: fautif
        ? `texte absent du Bulletin officiel : « ${fautif.slice(0, 60)} »`
        : 'mots présents, mais pas dans cet ordre, séparés par autre chose que leurs formules, ou ligne tronquée au début ou à la fin',
    });
  }
  return { lignes: lignes.length, ecarts, admis, texteManquant: false };
}

export function matieresAvecProgramme() {
  const dossier = join(root, 'content', 'terminale');
  if (!existsSync(dossier)) return [];
  return readdirSync(dossier).filter((m) => existsSync(join(dossier, m, 'programme.json')));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const demandees = process.argv.slice(2);
  const matieres = demandees.length > 0 ? demandees : matieresAvecProgramme();
  let echec = false;
  for (const matiere of matieres) {
    const { lignes, ecarts, admis, texteManquant } = verifierProgramme(matiere);
    if (texteManquant) {
      echec = true;
      console.error(`✗ ${matiere} : texte officiel non enregistré (texte-officiel/programme*.txt).`);
      continue;
    }
    if (ecarts.length === 0) {
      const note = admis > 0 ? ` (dont ${admis} relue(s) sur l'image : ecarts-admis.json)` : '';
      console.log(`✓ ${matiere} : ${lignes} lignes, toutes conformes au texte officiel${note}.`);
      continue;
    }
    echec = true;
    console.error(`✗ ${matiere} : ${ecarts.length} ligne(s) sur ${lignes} s'écartent du texte officiel :`);
    for (const e of ecarts) console.error(`  [${e.id}] ${e.message}`);
  }
  process.exit(echec ? 1 : 0);
}
