#!/usr/bin/env node
/**
 * Contrôles mécaniques d'un chapitre de terminale, lancés par les auteurs AVANT de rendre
 * leur fichier (étude chantiers/terminale/optimisation-tokens.md, piste 3) : ce qu'un script
 * trouve sans se fatiguer n'a pas à coûter un tour de relecture. Le relecteur garde toutes
 * ses passes ; ce script ne remplace aucune d'elles.
 *
 * Usage : node scripts/controles-mecaniques.mjs <matiere> <chapitre> [--partie cours|exercices]
 *           [--racine <dossier>] [--json]
 *
 * Bloquants (code de sortie 1) :
 *   - schema, integrite : schémas Ajv, renvois `revoir` / `de` / `n-…` vers rien, doublons,
 *     somme des points d'un type bac (validate-content.mjs, limité au chapitre) ;
 *   - couverture : les écarts de couverture-terminale.mjs (dont nombre d'indices par marche
 *     et par élément noté d'un type bac) ;
 *   - indice-donne-la-valeur : un indice écrit la valeur à saisir (absente de l'énoncé) ;
 *   - katex : formule que KaTeX ne compile pas, macro interdite, `$` non refermé ;
 *   - virgule : nombre décimal écrit `3,4` ou `3.4` dans une formule (attendu : `3{,}4`) ;
 *   - unite (physique-chimie) : réponse numérique sans unité alors que l'énoncé demande une
 *     grandeur qui en a une (concentration, volume, masse…) ;
 *   - tutoiement : « vous », « votre », impératif en -ez dans un texte destiné à l'élève.
 * Avertissements : petite valeur entière présente dans un indice, bonne réponse d'un QCM
 * recopiée dans un indice, point décimal dans le texte, avertissements de la couverture.
 */

import katex from 'katex';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { couverture } from './couverture-terminale.mjs';
import {
  FICHIERS_PARTIE_COURS,
  MATIERES,
  RACINE_DEPOT,
  blocsDuCours,
  compilerSchemas,
  controlerIntegrite,
  lireMatiere,
  lireRacine,
  questionsAPlat,
  validerSchemas,
} from './lib/terminale.mjs';

const liste = (v) => (Array.isArray(v) ? v : []);

/** Champs qui ne sont pas du texte affiché à l'élève, ou qui ne se contrôlent pas ici. */
const CLES_IGNOREES = new Set(['id', 'chapitre', 'notion', 'notions', 'capacites', 'revoir', 'de', 'prerequis', 'code', 'source', 'image', 'fichier', 'widget', 'type', 'genre', 'priorisation']);
/** Formulations recopiées des annales : on ne les retouche pas (ni tutoiement ni virgule). */
const CLES_CITEES = new Set(['attendusBac']);

const MACROS_INTERDITES = /\\(newcommand|renewcommand|def|require|gdef|let)\b/;
const VOUVOIEMENT = /\b(vous|votre|vos)\b/i;
const IMPERATIF_EZ = /(?:^|[.!?:;]\s+|\n\s*-\s+|«\s*)([A-ZÉÈÀ][a-zéèêàâîôûç]+ez)\b/g;
const FAUX_IMPERATIFS = new Set(['Chez', 'Assez']);
const GRANDEUR_A_UNITE = /\b(concentration|volume|masse|quantité de matière|vitesse|durée|temps|énergie|température|pression|longueur|distance|tension|intensité|puissance|fréquence|période|longueur d'onde|charge|résistance|capacité)\b/i;
const SANS_UNITE = /\b(pH|pK|rapport|facteur|nombre|combien de fois|pourcentage|taux|coefficient|proportion)\b/i;

/** Segments mathématiques d'une chaîne : [{ formule, display }] ; `ouvert` si un `$` reste seul. */
export function formulesDe(texte) {
  const formules = [];
  const propre = texte.replace(/\\\$/g, '');
  let i = 0;
  let ouvert = false;
  while (i < propre.length) {
    const debut = propre.indexOf('$', i);
    if (debut < 0) break;
    const display = propre[debut + 1] === '$';
    const delim = display ? '$$' : '$';
    const fin = propre.indexOf(delim, debut + delim.length);
    if (fin < 0) {
      ouvert = true;
      break;
    }
    formules.push({ formule: propre.slice(debut + delim.length, fin), display });
    i = fin + delim.length;
  }
  return { formules, ouvert };
}

/** Le texte hors formules. */
function horsFormules(texte) {
  return texte.replace(/\$\$[\s\S]*?\$\$|\$[^$]*\$/g, ' ');
}

/** Nombres écrits dans un texte (formules comprises), normalisés : « 1{,}5 », « 10\,000 », « 2,5 ». */
export function nombresDe(texte) {
  const normalise = texte
    .replace(/\{,\}/g, ',')
    .replace(/(\d)(?:\\,|\\ | | |~)(?=\d{3}\b)/g, '$1')
    .replace(/(\d) (?=\d{3}\b)/g, '$1');
  const nombres = [];
  for (const m of normalise.matchAll(/(?<![\w.,^_])-?\d+(?:[.,]\d+)?(?![\w])/g)) {
    nombres.push(Number(m[0].replace(',', '.')));
  }
  return nombres;
}

/** Parcourt toutes les chaînes d'une valeur JSON : visite(chaine, cle, chemin). */
function chaines(valeur, visite, cle = '', chemin = '') {
  if (typeof valeur === 'string') visite(valeur, cle, chemin);
  else if (Array.isArray(valeur)) valeur.forEach((v, i) => chaines(v, visite, cle, `${chemin}[${i}]`));
  else if (valeur && typeof valeur === 'object') {
    for (const [k, v] of Object.entries(valeur)) {
      if (CLES_IGNOREES.has(k)) continue;
      chaines(v, visite, k, chemin ? `${chemin}.${k}` : k);
    }
  }
}

/** Les éléments d'un fichier du chapitre, avec leur identifiant : [{ id, valeur }]. */
function elementsDuFichier(chapitre, fichier) {
  if (fichier === 'cours') return blocsDuCours(chapitre).map(({ bloc }) => ({ id: bloc.id, valeur: bloc }));
  if (fichier === 'meta') return chapitre.meta ? [{ id: 'meta', valeur: chapitre.meta }] : [];
  return liste(chapitre[fichier]).map((x) => ({ id: x.id, valeur: x }));
}

/** Questions qui portent des indices : vérifie du cours, exercices, type bac (avec l'énoncé du contexte). */
function questionsAvecIndices(chapitre, fichiers) {
  const questions = [];
  if (fichiers.includes('cours')) {
    for (const { bloc } of blocsDuCours(chapitre)) {
      if (bloc.type === 'verifie' && bloc.question) questions.push({ id: bloc.id, q: bloc.question, contexte: bloc.question.enonce ?? '' });
    }
  }
  for (const nom of ['exercices', 'type-bac']) {
    if (!fichiers.includes(nom)) continue;
    for (const x of liste(chapitre[nom])) {
      const contexteExercice = [x.preambule, ...liste(x.donnees), ...liste(x.documents).map((d) => JSON.stringify(d))].filter(Boolean).join(' ');
      for (const q of liste(x.questions)) {
        const contexteQ = `${contexteExercice} ${q.enonce ?? ''}`;
        questions.push({ id: `${x.id} ${q.id}`, q, contexte: contexteQ });
        for (const sq of liste(q.sousQuestions)) questions.push({ id: `${x.id} ${sq.id}`, q: sq, contexte: `${contexteQ} ${sq.enonce ?? ''}` });
      }
    }
  }
  return questions;
}

/** Contrôles propres à ce script. Renvoie { ecarts, avertissements } ({ regle, id, message }). */
export function controlesTexte(chapitre, { matiere, fichiers }) {
  const ecarts = [];
  const avertissements = [];
  const stats = { formules: 0, indices: 0, textes: 0 };
  const ecart = (regle, id, message) => ecarts.push({ regle, id, message });
  const avertir = (regle, id, message) => avertissements.push({ regle, id, message });

  // Indice qui donne la valeur à saisir (ou la bonne réponse d'un QCM).
  for (const { id, q, contexte } of questionsAvecIndices(chapitre, fichiers)) {
    const rep = q.reponse;
    const indices = liste(q.indices);
    stats.indices += indices.length;
    if (!rep || indices.length === 0) continue;
    if (rep.type === 'numerique' && typeof rep.valeur === 'number') {
      const v = rep.valeur;
      const tol = Math.max(Number(rep.tolerance) || 0, Math.abs(v) * (Number(rep.toleranceRelative) || 0), 1e-9);
      const egal = (n) => Math.abs(n - v) <= tol && (Number.isInteger(v) ? n === v : true);
      const dansLEnonce = nombresDe(contexte).some(egal);
      indices.forEach((indice, i) => {
        if (!nombresDe(indice).some(egal)) return;
        const petit = Number.isInteger(v) && Math.abs(v) < 10;
        const message = `l'indice ${i + 1} écrit ${String(v).replace('.', ',')}, la valeur à saisir (charte § 6 : aucun indice ne la donne).`;
        if (dansLEnonce || petit) avertir('indice-donne-la-valeur', id, `${message} ${dansLEnonce ? 'Elle figure aussi dans l\'énoncé' : 'Petit entier'} : à vérifier.`);
        else ecart('indice-donne-la-valeur', id, message);
      });
    }
    if ((rep.type === 'qcm' || rep.type === 'vrai-faux') && Array.isArray(rep.choix) && typeof rep.bonne === 'number') {
      const bonne = String(rep.choix[rep.bonne] ?? '').trim();
      if (bonne.replace(/\$/g, '').length >= 8) {
        indices.forEach((indice, i) => {
          if (indice.includes(bonne)) avertir('indice-donne-la-reponse', id, `l'indice ${i + 1} recopie la bonne réponse « ${bonne.slice(0, 50)} ».`);
        });
      }
    }
  }

  // Unité d'une réponse numérique (physique-chimie).
  if (matiere === 'physique-chimie') {
    for (const { id, q, contexte } of questionsAvecIndices(chapitre, fichiers)) {
      const rep = q.reponse;
      if (rep?.type !== 'numerique' || rep.unite || rep.decimales !== undefined) continue;
      const enonce = q.enonce ?? contexte;
      if (GRANDEUR_A_UNITE.test(enonce) && !SANS_UNITE.test(enonce)) {
        ecart('unite', id, `réponse numérique sans unité alors que l'énoncé demande une grandeur (« ${enonce.match(GRANDEUR_A_UNITE)[0]} ») : champ \`unite\` (charte § 3.6).`);
      }
    }
    for (const f of fichiers.includes('exercices') ? liste(chapitre.flash) : []) {
      const rep = f.reponse;
      if (rep?.type === 'numerique' && !rep.unite && rep.decimales === undefined && GRANDEUR_A_UNITE.test(f.enonce ?? '') && !SANS_UNITE.test(f.enonce ?? '')) {
        ecart('unite', f.id, 'réponse numérique sans unité alors que l\'énoncé demande une grandeur : champ `unite` (charte § 3.6).');
      }
    }
  }

  // Textes : KaTeX, virgule décimale, tutoiement.
  for (const fichier of fichiers) {
    for (const { id, valeur } of elementsDuFichier(chapitre, fichier)) {
      chaines(valeur, (texte, cle, chemin) => {
        const ou = `${id}${chemin ? ` (${chemin})` : ''}`;
        stats.textes += 1;
        const { formules, ouvert } = formulesDe(texte);
        if (ouvert) ecart('katex', ou, '`$` non refermé.');
        for (const { formule, display } of formules) {
          stats.formules += 1;
          if (MACROS_INTERDITES.test(formule)) ecart('katex', ou, `macro interdite dans « ${formule.slice(0, 60)} » (charte § 10).`);
          try {
            katex.renderToString(formule, { displayMode: display, throwOnError: true, strict: 'ignore', output: 'html' });
          } catch (e) {
            ecart('katex', ou, `${String(e.message).replace(/^KaTeX parse error: /, '').slice(0, 140)} — « ${formule.slice(0, 60)} »`);
          }
          if (!CLES_CITEES.has(cle)) {
            const decimal = formule.replace(/\{,\}/g, '').match(/(?<![\w\\{])\d+[.,]\d+(?![\w])/);
            if (decimal && !/\\[{(]|;/.test(formule.slice(Math.max(0, decimal.index - 3), decimal.index))) {
              ecart('virgule', ou, `« ${decimal[0]} » dans une formule : écrire ${decimal[0].replace(/[.,]/, '{,}')} (charte § 10).`);
            }
          }
        }
        if (CLES_CITEES.has(cle)) return;
        const texteSeul = horsFormules(texte).replace(/`[^`]*`|\b\w+\([^)]*\)/g, ' ');
        const pointDecimal = texteSeul.match(/(?<![\w.§])\d+\.\d+(?![\w.])/);
        if (pointDecimal) avertir('virgule', ou, `« ${pointDecimal[0]} » : point décimal dans le texte (virgule attendue).`);
        const vous = texteSeul.match(VOUVOIEMENT);
        if (vous) ecart('tutoiement', ou, `« ${vous[0]} » : on tutoie l'élève (charte § 4.3).`);
        for (const m of texteSeul.matchAll(IMPERATIF_EZ)) {
          if (!FAUX_IMPERATIFS.has(m[1])) ecart('tutoiement', ou, `« ${m[1]} » : on tutoie l'élève (charte § 4.3).`);
        }
      });
    }
  }
  return { ecarts, avertissements, stats };
}

/** Tous les contrôles d'un chapitre. Renvoie { ecarts, avertissements }. */
export function controlesMecaniques({ racine, matiere, slug, partie = 'exercices' }) {
  const donnees = lireMatiere(racine, matiere);
  const chapitre = donnees.chapitres.get(slug);
  if (!chapitre) return undefined;
  const fichiers = partie === 'cours' ? FICHIERS_PARTIE_COURS : ['meta', 'notions', 'cours', 'memo', 'exercices', 'flash', 'type-bac'];
  const ecarts = [];
  const avertissements = [];

  // Schémas et intégrité (renvois, doublons, points), limités au chapitre.
  const { problemes: schemas } = validerSchemas(donnees, compilerSchemas());
  // Toutes les matières : un bloc lien-matiere renvoie vers l'autre.
  const integrite = controlerIntegrite(lireRacine(racine));
  for (const p of [...donnees.problemes, ...schemas]) {
    if (p.chapitre === slug) ecarts.push({ regle: 'schema', id: p.id ?? p.fichier, message: p.message });
  }
  for (const p of integrite) {
    if (p.chapitre === slug) ecarts.push({ regle: 'integrite', id: p.id ?? p.fichier, message: p.message });
  }

  // Couverture (forme des marches, indices, quotas…).
  const rapport = couverture({ matiere, slug, partie, racine });
  for (const e of rapport.ecarts) ecarts.push({ regle: `couverture/${e.regle}`, id: e.id, message: e.message });
  for (const a of rapport.avertissements) avertissements.push({ regle: `couverture/${a.regle}`, id: a.id, message: a.message });

  const texte = controlesTexte(chapitre, { matiere, fichiers: fichiers.filter((f) => chapitre[f] !== undefined) });
  ecarts.push(...texte.ecarts);
  avertissements.push(...texte.avertissements);
  return { ecarts, avertissements, stats: texte.stats };
}

const estLeScript = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (estLeScript) {
  const argv = process.argv.slice(2);
  const positionnels = [];
  let racine = join(RACINE_DEPOT, 'content', 'terminale');
  let partie = 'exercices';
  let json = false;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--racine') racine = resolve(argv[++i] ?? '');
    else if (argv[i] === '--partie') partie = argv[++i] ?? '';
    else if (argv[i] === '--json') json = true;
    else positionnels.push(argv[i]);
  }
  const [matiere, slug] = positionnels;
  if (!MATIERES.includes(matiere) || !slug || !['cours', 'exercices'].includes(partie)) {
    console.error('Usage : node scripts/controles-mecaniques.mjs <maths|physique-chimie> <chapitre> [--partie cours|exercices] [--racine <dossier>] [--json]');
    process.exit(2);
  }
  const resultat = controlesMecaniques({ racine, matiere, slug, partie });
  if (!resultat) {
    console.error(`Chapitre introuvable : ${matiere}/${slug}`);
    process.exit(2);
  }
  if (json) console.log(JSON.stringify(resultat, null, 2));
  else {
    const ligne = (x) => `  [${x.regle}]${x.id ? ` ${x.id} —` : ''} ${x.message}`;
    const { formules, indices, textes } = resultat.stats;
    console.log(`Contrôles mécaniques — ${matiere}/${slug} (partie ${partie}) : ${textes} textes, ${formules} formules compilées par KaTeX, ${indices} indices.`);
    console.log(resultat.ecarts.length === 0 ? 'Aucun bloquant.' : `${resultat.ecarts.length} bloquant(s) :`);
    resultat.ecarts.forEach((e) => console.log(ligne(e)));
    if (resultat.avertissements.length > 0) {
      console.log(`${resultat.avertissements.length} avertissement(s) (à regarder, non bloquants) :`);
      resultat.avertissements.forEach((a) => console.log(ligne(a)));
    }
  }
  process.exitCode = resultat.ecarts.length === 0 ? 0 : 1;
}
