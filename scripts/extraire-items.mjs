#!/usr/bin/env node
/**
 * Extrait des items d'un chapitre de terminale par identifiant, ou ceux qui ont changé depuis
 * un instantané : pour les tours 2 et 3 de tle-relecteur, qui ne relit que ce qui a été
 * corrigé (étude chantiers/terminale/optimisation-tokens.md, piste 3).
 *
 * Usage :
 *   node scripts/extraire-items.mjs <matiere> <chapitre> --instantane <dossier>
 *       copie les fichiers du chapitre dans <dossier> (avant d'envoyer les corrections) ;
 *   node scripts/extraire-items.mjs <matiere> <chapitre> --depuis <dossier> [--sortie <fichier>]
 *       items ajoutés ou modifiés depuis l'instantané, et identifiants supprimés ;
 *   node scripts/extraire-items.mjs <matiere> <chapitre> <id> [<id>…] [--sortie <fichier>]
 *       items nommés (notion n-…, bloc l-…, carte m-…, exercice x-…, éclair fl-…, type bac tb-…).
 * Option : --racine <dossier> (défaut content/terminale).
 *
 * Chaque item sort avec son fichier et, pour un bloc, sa notion ; un exercice ou un type bac
 * sort entier (on ne relit pas une question sans son énoncé). meta.json compte comme l'item
 * « meta ». Sortie : JSON { matiere, chapitre, items: [{ fichier, id, notion?, item }], supprimes }.
 */

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FICHIERS_CHAPITRE, MATIERES, RACINE_DEPOT, blocsDuCours, lireMatiere } from './lib/terminale.mjs';

const liste = (v) => (Array.isArray(v) ? v : []);

/** Tous les items d'un chapitre, indexés par identifiant : Map<id, { fichier, id, notion?, item }>. */
export function itemsDuChapitre(chapitre) {
  const items = new Map();
  const ajouter = (fichier, id, item, notion) => items.set(id, { fichier, id, ...(notion ? { notion } : {}), item });
  if (chapitre.meta) ajouter('meta', 'meta', chapitre.meta);
  for (const n of liste(chapitre.notions)) ajouter('notions', n.id, n);
  for (const { bloc, notion } of blocsDuCours(chapitre)) ajouter('cours', bloc.id, bloc, notion);
  for (const nom of ['memo', 'exercices', 'flash', 'type-bac']) {
    for (const x of liste(chapitre[nom])) ajouter(nom, x.id, x);
  }
  return items;
}

/** Items ajoutés ou modifiés, et identifiants supprimés, entre deux lectures du chapitre. */
export function itemsModifies(avant, apres) {
  const anciens = itemsDuChapitre(avant);
  const nouveaux = itemsDuChapitre(apres);
  const items = [...nouveaux.values()].filter((x) => JSON.stringify(anciens.get(x.id)?.item) !== JSON.stringify(x.item));
  const supprimes = [...anciens.keys()].filter((id) => !nouveaux.has(id));
  return { items, supprimes };
}

const estLeScript = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (estLeScript) {
  const argv = process.argv.slice(2);
  const positionnels = [];
  let racine = join(RACINE_DEPOT, 'content', 'terminale');
  let sortie;
  let depuis;
  let instantane;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--racine') racine = resolve(argv[++i] ?? '');
    else if (argv[i] === '--sortie') sortie = resolve(argv[++i] ?? '');
    else if (argv[i] === '--depuis') depuis = resolve(argv[++i] ?? '');
    else if (argv[i] === '--instantane') instantane = resolve(argv[++i] ?? '');
    else positionnels.push(argv[i]);
  }
  const [matiere, slug, ...ids] = positionnels;
  const usage = 'Usage : node scripts/extraire-items.mjs <maths|physique-chimie> <chapitre> (--instantane <dossier> | --depuis <dossier> | <id>…) [--sortie <fichier>] [--racine <dossier>]';
  if (!MATIERES.includes(matiere) || !slug || [instantane, depuis, ids.length > 0 ? 1 : undefined].filter(Boolean).length !== 1) {
    console.error(usage);
    process.exit(2);
  }
  const chapitre = lireMatiere(racine, matiere).chapitres.get(slug);
  if (!chapitre) {
    console.error(`Chapitre introuvable : ${matiere}/${slug}`);
    process.exit(2);
  }
  if (instantane) {
    // Même arborescence que la racine, pour la relire avec lireMatiere.
    const cible = join(instantane, matiere, 'chapitres', slug);
    mkdirSync(cible, { recursive: true });
    for (const nom of Object.keys(FICHIERS_CHAPITRE)) {
      const source = join(chapitre.dossier, `${nom}.json`);
      if (existsSync(source)) cpSync(source, join(cible, `${nom}.json`));
    }
    console.error(`Instantané de ${matiere}/${slug} : ${instantane}`);
    process.exit(0);
  }
  let resultat;
  if (depuis) {
    const avant = lireMatiere(depuis, matiere).chapitres.get(slug);
    if (!avant) {
      console.error(`Pas d'instantané de ${matiere}/${slug} dans ${depuis} (créé par --instantane).`);
      process.exit(2);
    }
    resultat = itemsModifies(avant, chapitre);
  } else {
    const tous = itemsDuChapitre(chapitre);
    const inconnus = ids.filter((id) => !tous.has(id));
    if (inconnus.length > 0) {
      console.error(`Identifiant(s) inconnu(s) : ${inconnus.join(', ')}`);
      process.exit(2);
    }
    resultat = { items: ids.map((id) => tous.get(id)), supprimes: [] };
  }
  const texte = `${JSON.stringify({ matiere, chapitre: slug, ...resultat }, null, 2)}\n`;
  if (sortie) {
    writeFileSync(sortie, texte);
    console.error(`${resultat.items.length} item(s), ${resultat.supprimes.length} supprimé(s) : ${sortie}`);
  } else process.stdout.write(texte);
}
