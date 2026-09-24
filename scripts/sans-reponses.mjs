#!/usr/bin/env node
/**
 * Version sans réponses des exercices d'un chapitre de terminale, pour tle-eleve-testeur
 * (charte § 12, étape 6) : l'élève-testeur essaie les exercices avant de voir les corrections.
 *
 * Usage : node scripts/sans-reponses.mjs <matiere> <chapitre> [--racine <dossier>] [--sortie <fichier>]
 *
 * Retire : solution, indices, revoir, erreurFrequente, attenduCorrecteur, explication, et,
 * dans chaque réponse, ce qui la donne (bonne, bonnes, valeur, justification, pourquoiFaux,
 * tolérances). Garde ce que l'élève verrait à l'écran pour répondre : le type de réponse,
 * les choix d'un QCM, les éléments à remettre dans l'ordre (mélangés), l'unité attendue.
 * Sans --sortie, le JSON est écrit sur la sortie standard.
 */

import { writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MATIERES, RACINE_DEPOT, lireMatiere } from './lib/terminale.mjs';

const CLES_RETIREES = new Set(['solution', 'indices', 'revoir', 'erreurFrequente', 'attenduCorrecteur', 'explication']);
const CHAMPS_VISIBLES_REPONSE = ['type', 'choix', 'elements', 'unite', 'chiffresSignificatifs'];

/** Mélange déterministe (graine = identifiant), jamais dans l'ordre d'origine. */
export function melanger(elements, graine) {
  let h = 2166136261;
  for (const c of graine) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
  const suivant = () => {
    h = (Math.imul(h, 1664525) + 1013904223) >>> 0;
    return h / 2 ** 32;
  };
  const copie = [...elements];
  for (let i = copie.length - 1; i > 0; i -= 1) {
    const j = Math.floor(suivant() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  const inchange = copie.every((e, i) => e === elements[i]);
  return inchange && copie.length > 1 ? [...copie.slice(1), copie[0]] : copie;
}

function masquerReponse(reponse, graine) {
  const visible = {};
  for (const cle of CHAMPS_VISIBLES_REPONSE) {
    if (reponse[cle] !== undefined) visible[cle] = reponse[cle];
  }
  if (reponse.type === 'ordre') visible.elements = melanger(reponse.elements ?? [], graine);
  return visible;
}

function masquer(valeur, graine) {
  if (Array.isArray(valeur)) return valeur.map((v) => masquer(v, graine));
  if (!valeur || typeof valeur !== 'object') return valeur;
  const copie = {};
  const graineLocale = typeof valeur.id === 'string' ? `${graine}/${valeur.id}` : graine;
  for (const [cle, v] of Object.entries(valeur)) {
    if (CLES_RETIREES.has(cle)) continue;
    copie[cle] = cle === 'reponse' && v && typeof v === 'object' ? masquerReponse(v, graineLocale) : masquer(v, graineLocale);
  }
  return copie;
}

/** Exercices, type bac et questions éclair du chapitre, sans ce qui donne la réponse. */
export function sansReponses({ racine, matiere, slug }) {
  const chapitre = lireMatiere(racine, matiere).chapitres.get(slug);
  if (!chapitre) return undefined;
  return {
    matiere,
    chapitre: slug,
    avertissement:
      'Version sans réponses (scripts/sans-reponses.mjs) : ni solution, ni indice, ni explication. Les QCM gardent leurs choix, les remises en ordre sont mélangées.',
    exercices: masquer(chapitre.exercices ?? [], slug),
    typeBac: masquer(chapitre['type-bac'] ?? [], slug),
    flash: masquer(chapitre.flash ?? [], slug),
  };
}

const estLeScript = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (estLeScript) {
  const argv = process.argv.slice(2);
  const positionnels = [];
  let racine = join(RACINE_DEPOT, 'content', 'terminale');
  let sortie;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--racine') racine = resolve(argv[++i] ?? '');
    else if (argv[i] === '--sortie') sortie = resolve(argv[++i] ?? '');
    else positionnels.push(argv[i]);
  }
  const [matiere, slug] = positionnels;
  if (!MATIERES.includes(matiere) || !slug) {
    console.error('Usage : node scripts/sans-reponses.mjs <maths|physique-chimie> <chapitre> [--racine <dossier>] [--sortie <fichier>]');
    process.exit(2);
  }
  const version = sansReponses({ racine, matiere, slug });
  if (!version) {
    console.error(`Chapitre introuvable : ${relative(RACINE_DEPOT, join(racine, matiere, 'chapitres', slug))}`);
    process.exit(2);
  }
  const texte = `${JSON.stringify(version, null, 2)}\n`;
  if (sortie) {
    writeFileSync(sortie, texte);
    console.error(`Version sans réponses écrite : ${sortie}`);
  } else process.stdout.write(texte);
}
