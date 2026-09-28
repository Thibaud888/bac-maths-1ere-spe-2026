#!/usr/bin/env node
/**
 * Ce qui tombe vraiment au bac (charte terminale-charte § 5.1) : pour chaque notion d'un
 * chapitre, le nombre de sujets où au moins une de ses lignes du programme est mobilisée,
 * rapporté aux sujets où elle **pouvait** tomber (un sujet `partiel` ne compte pas pour ses
 * lignes `exclus`).
 *
 * Usage :
 *   node scripts/frequences-annales.mjs <matiere>              un tableau par chapitre
 *   node scripts/frequences-annales.mjs <matiere> <chapitre>   par notion (si notions.json
 *                                                              existe) et par ligne
 *   options : --racine <dossier> (défaut content/terminale), --json
 *
 * Repères : ≥ 50 % → 3 (incontournable) ; 20 à 50 % → 2 (fréquent) ; < 20 % → 1 (plus rare).
 * La priorité proposée est celle des repères, avant la correction « prérequis » que
 * l'architecte applique en la justifiant.
 *
 * Refuse de publier (code 1) tant que annales.json n'a pas `complet: true` : un chiffre
 * calculé sur un index partiel ne s'affiche jamais. Code 2 : usage ou fichier introuvable.
 */

import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { MATIERES, RACINE_DEPOT, lireMatiere } from './lib/terminale.mjs';

const args = process.argv.slice(2);
const option = (nom) => (args.includes(nom) ? args[args.indexOf(nom) + 1] : undefined);
const json = args.includes('--json');
const racine = resolve(option('--racine') ?? join(RACINE_DEPOT, 'content', 'terminale'));
const positionnels = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--racine');
const [matiere, chapitre] = positionnels;

function sortir(message, code) {
  console.error(message);
  process.exit(code);
}

if (!matiere || !MATIERES.includes(matiere)) {
  sortir('Usage : node scripts/frequences-annales.mjs <maths|physique-chimie> [<chapitre>] [--racine <dossier>] [--json]', 2);
}

const donnees = lireMatiere(racine, matiere);
if (donnees.problemes.length > 0) sortir(donnees.problemes.map((p) => `${p.fichier} : ${p.message}`).join('\n'), 2);
if (!donnees.programme) sortir(`programme.json introuvable sous ${join(racine, matiere)}`, 2);
if (!donnees.annales) sortir(`annales.json introuvable sous ${join(racine, matiere)} : rien à compter.`, 2);
if (donnees.annales.complet !== true) {
  sortir(
    `annales.json n'est pas complet (${donnees.annales.sujets.length} sujets indexés) : aucune fréquence n'est publiée tant que l'index n'est pas complet (charte § 5.1).`,
    1
  );
}

const sujets = donnees.annales.sujets;

/** Priorité proposée par les repères de la charte. */
function prioriteDesReperes(part) {
  if (part >= 0.5) return 3;
  if (part >= 0.2) return 2;
  return 1;
}

/**
 * Décompte pour un ensemble de lignes : sujets où l'une au moins pouvait tomber, et
 * sujets où l'une au moins (non exclue) est citée par un exercice.
 */
function compter(lignes) {
  let possibles = 0;
  let tombes = 0;
  for (const sujet of sujets) {
    const exclus = new Set(sujet.programmeEvalue === 'partiel' ? sujet.exclus ?? [] : []);
    const eligibles = lignes.filter((l) => !exclus.has(l));
    if (eligibles.length === 0) continue;
    possibles += 1;
    const citees = new Set(sujet.exercices.flatMap((e) => e.capacites));
    if (eligibles.some((l) => citees.has(l))) tombes += 1;
  }
  const part = possibles === 0 ? 0 : tombes / possibles;
  return { tombes, possibles, part, priorite: prioriteDesReperes(part) };
}

const pourcent = (part) => `${Math.round(part * 100)} %`;
const etoiles = (p) => '★'.repeat(p);

function tableau(entetes, lignes) {
  const largeurs = entetes.map((e, i) => Math.max(e.length, ...lignes.map((l) => String(l[i]).length)));
  const ligne = (cols) => `| ${cols.map((c, i) => String(c).padEnd(largeurs[i])).join(' | ')} |`;
  return [ligne(entetes), `|${largeurs.map((l) => '-'.repeat(l + 2)).join('|')}|`, ...lignes.map(ligne)].join('\n');
}

const lignesDe = (slug) => donnees.programme.filter((l) => l.chapitre === slug).map((l) => l.id);
const annees = [...new Set(sujets.map((s) => s.annee))].sort();
const intro = `${sujets.length} sujets indexés (${annees[0]}–${annees[annees.length - 1]}, tous lieux d'examen).`;

if (!chapitre) {
  const slugs = [...new Set(donnees.programme.map((l) => l.chapitre).filter(Boolean))];
  const resultats = slugs
    .map((slug) => ({ chapitre: slug, ...compter(lignesDe(slug)) }))
    .sort((a, b) => b.part - a.part);
  if (json) {
    console.log(JSON.stringify({ sujets: sujets.length, chapitres: resultats }, null, 2));
  } else {
    console.log(intro);
    console.log('Par chapitre : sujets où au moins une ligne du chapitre est mobilisée.\n');
    console.log(
      tableau(
        ['chapitre', 'tombé', 'part', 'repère'],
        resultats.map((r) => [r.chapitre, `${r.tombes} / ${r.possibles}`, pourcent(r.part), etoiles(r.priorite)])
      )
    );
  }
  process.exit(0);
}

const lignesChapitre = lignesDe(chapitre);
if (lignesChapitre.length === 0) sortir(`Aucune ligne de programme.json n'a « chapitre: ${chapitre} ».`, 2);
const texte = new Map(donnees.programme.map((l) => [l.id, l]));
const parLigne = lignesChapitre.map((id) => ({ id, ...compter([id]) }));
const notions = donnees.chapitres.get(chapitre)?.notions;
const parNotion = Array.isArray(notions)
  ? notions.map((n) => ({
      id: n.id,
      titre: n.titre,
      prioriteActuelle: n.priorite,
      ...compter(n.capacites.filter((c) => lignesChapitre.includes(c))),
    }))
  : undefined;
const ensemble = compter(lignesChapitre);

if (json) {
  console.log(JSON.stringify({ sujets: sujets.length, chapitre, ensemble, notions: parNotion, lignes: parLigne }, null, 2));
  process.exit(0);
}

console.log(intro);
console.log(
  `Chapitre ${chapitre} : au moins une ligne mobilisée dans ${ensemble.tombes} sujets sur ${ensemble.possibles} (${pourcent(ensemble.part)}).\n`
);
if (parNotion) {
  console.log('Par notion (phrase « pourquoi » proposée : « Tombé dans n sujets sur N depuis 2021. ») :\n');
  console.log(
    tableau(
      ['notion', 'tombé', 'part', 'repère', 'actuelle'],
      parNotion.map((n) => [n.id, `${n.tombes} / ${n.possibles}`, pourcent(n.part), etoiles(n.priorite), etoiles(n.prioriteActuelle)])
    )
  );
  console.log('');
}
console.log('Par ligne du programme :\n');
console.log(
  tableau(
    ['ligne', 'rubrique', 'tombé', 'part', 'texte'],
    parLigne.map((l) => {
      const ligne = texte.get(l.id);
      const extrait = (ligne?.texte ?? '').replace(/\s+/g, ' ');
      return [
        l.id,
        `${ligne?.rubrique ?? ''}${ligne?.exigible === false ? ' (non exig.)' : ''}`,
        `${l.tombes} / ${l.possibles}`,
        pourcent(l.part),
        extrait.length > 70 ? `${extrait.slice(0, 69)}…` : extrait,
      ];
    })
  )
);
if (!existsSync(join(racine, matiere, 'chapitres', chapitre))) {
  console.log(`\n(Le chapitre n'est pas encore écrit : décompte par ligne seulement.)`);
}
