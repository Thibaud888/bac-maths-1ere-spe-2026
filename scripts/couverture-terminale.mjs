#!/usr/bin/env node
/**
 * Contrôle de couverture d'un chapitre de terminale (charte terminale-charte § 9.3).
 *
 * Usage : node scripts/couverture-terminale.mjs <matiere> <chapitre>
 *           [--partie cours|exercices] [--racine <dossier>] [--json]
 *
 *   --partie cours      ne contrôle que meta, notions, cours, memo et ce qui en dépend
 *   --partie exercices  contrôle tout (valeur par défaut)
 *   --racine            dossier au format de content/terminale/ (défaut) ;
 *                       ex. : tests/fixtures/terminale pour le chapitre-témoin
 *   --json              sortie { ecarts, avertissements, quotas } pour les outils
 *
 * Écarts (bloquants : le rapport d'un chapitre fini est vide) : fichier illisible ou non
 * conforme au schéma, identifiant inconnu ou en double, ligne du chapitre hors notion ou
 * dans plusieurs notions, exigence du § 9.2 non remplie, plancher du § 5.3 non atteint,
 * citation interdite (chapitre ultérieur, ligne non exigible hors complement / marche 3,
 * ligne d'une notion que l'élément ne déclare pas), forme d'une marche (§ 6), déroulé d'une
 * section (§ 4.1), nombre de notions (§ 11), garde-fou des incontournables (§ 5.1),
 * formulation « du bac » absente des annales, figure introuvable.
 * Avertissements (à regarder) : plafond indicatif dépassé (double du plancher), carte de
 * mémo pour une notion ★, indices sans « revoir », valeur numérique sans unité en
 * physique-chimie, priorité estimée dont le « pourquoi » contient un chiffre.
 *
 * Code de sortie : 0 rapport vide, 1 écarts, 2 usage ou chapitre introuvable.
 */

import { existsSync } from 'node:fs';
import { basename, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BLOCS_FORMELS,
  FICHIERS_PARTIE_COURS,
  MATIERES,
  RACINE_DEPOT,
  blocsDuCours,
  compilerSchemas,
  controlerIntegrite,
  elementsCitants,
  figuresDuChapitre,
  lireRacine,
  questionsAPlat,
  validerSchemas,
} from './lib/terminale.mjs';

// --- Planchers par notion (charte § 5.3) ; plafond indicatif = double ---------------
const PLANCHERS = {
  exemples: { libelle: 'exemples', partie: 'cours', valeurs: { 3: 2, 2: 1, 1: 1 } },
  verifie: { libelle: 'vérifie', partie: 'cours', valeurs: { 3: 2, 2: 1, 1: 1 } },
  m1: { libelle: 'M1', partie: 'exercices', valeurs: { 3: 3, 2: 2, 1: 1 } },
  m2: { libelle: 'M2', partie: 'exercices', valeurs: { 3: 3, 2: 2, 1: 1 } },
  m3: { libelle: 'M3', partie: 'exercices', valeurs: { 3: 1, 2: 1, 1: 0 } },
  flash: { libelle: 'éclair', partie: 'exercices', valeurs: { 3: 3, 2: 2, 1: 1 } },
  memo: { libelle: 'mémo', partie: 'cours', valeurs: { 3: 1, 2: 1, 1: 0 } },
  typeBac: { libelle: 'type bac', partie: 'exercices', valeurs: { 3: 2, 2: 1, 1: 0 } },
};

// --- Forme des marches (charte § 6) ------------------------------------------------
const MARCHES = {
  1: { nom: 'Comprendre', questions: [1, 3], duree: [1, 5], indices: [0, 1], notionsMin: 1, notionsMax: 1 },
  2: { nom: "S'entraîner", questions: [2, 5], duree: [5, 15], indices: [3, 3], notionsMin: 1 },
  3: { nom: 'Approfondir', questions: [3, 6], duree: [15, 30], indices: [2, 3], notionsMin: 2 },
};
const TYPE_BAC_PAR_CHAPITRE = [3, 5];
const NOTIONS_PAR_CHAPITRE = [3, 6];

// --- Arguments ------------------------------------------------------------------------
function lireArguments(argv) {
  const positionnels = [];
  const options = { partie: 'exercices', racine: join(RACINE_DEPOT, 'content', 'terminale'), json: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--json') options.json = true;
    else if (a === '--partie') options.partie = argv[++i];
    else if (a === '--racine') options.racine = resolve(argv[++i] ?? '');
    else if (a.startsWith('--')) throw new Error(`option inconnue : ${a}`);
    else positionnels.push(a);
  }
  const [matiere, chapitre] = positionnels;
  if (!MATIERES.includes(matiere)) throw new Error(`matière attendue : ${MATIERES.join(' | ')}`);
  if (!chapitre) throw new Error('chapitre attendu (slug)');
  if (!['cours', 'exercices'].includes(options.partie)) throw new Error('--partie attend cours ou exercices');
  return { matiere, slug: chapitre, ...options };
}

const liste = (v) => (Array.isArray(v) ? v : []);
const nomFichier = (chemin) => basename(chemin ?? '', '.json');

/**
 * Calcule le rapport de couverture. Exporté pour être réutilisé ; le script en est
 * l'interface en ligne de commande.
 */
export function couverture({ matiere, slug, partie, racine }) {
  const ecarts = [];
  const avertissements = [];
  const ecart = (regle, id, message) => ecarts.push({ regle, ...(id ? { id } : {}), message });
  const avertir = (regle, id, message) => avertissements.push({ regle, ...(id ? { id } : {}), message });

  const matieres = lireRacine(racine);
  const d = matieres.find((m) => m.matiere === matiere);
  const chapitre = d?.chapitres.get(slug);
  if (!chapitre) return { introuvable: true, ecarts, avertissements, quotas: [] };

  const partieCours = partie === 'cours';
  const dansLaPartie = (fichier) => !partieCours || FICHIERS_PARTIE_COURS.includes(fichier);
  const concerne = (p) =>
    ['programme', 'annales'].includes(nomFichier(p.fichier)) ||
    (p.chapitre === slug && dansLaPartie(nomFichier(p.fichier)));

  // 1. Lecture, schémas, intégrité : rien d'autre n'a de sens si les données sont cassées.
  const validateurs = compilerSchemas();
  for (const p of d.problemes.filter(concerne)) ecart('lecture', undefined, `${relative(RACINE_DEPOT, p.fichier)} : ${p.message}`);
  for (const p of validerSchemas(d, validateurs).problemes.filter(concerne)) {
    ecart('schema', p.id, `${nomFichier(p.fichier)}.json : ${p.message}`);
  }
  for (const p of controlerIntegrite(matieres).filter((p) => p.matiere === matiere && concerne(p))) {
    ecart('integrite', p.id, `${nomFichier(p.fichier)}.json : ${p.message}`);
  }
  if (!d.programme) {
    ecart('referentiel', undefined, `${matiere}/programme.json absent : aucun contenu sans référentiel (charte § 1).`);
    return { ecarts, avertissements, quotas: [] };
  }

  const lignes = new Map(liste(d.programme).map((l) => [l.id, l]));
  const meta = chapitre.meta ?? {};
  const transverse = meta.transverse === true;
  const notions = [...liste(chapitre.notions)].sort((a, b) => a.ordre - b.ordre);
  const notionParId = new Map(notions.map((n) => [n.id, n]));
  const lignesDuChapitre = liste(d.programme).filter((l) => l.chapitre === slug && !l.premiere);
  const blocs = blocsDuCours(chapitre);
  const exercices = partieCours ? [] : liste(chapitre.exercices);
  const flash = partieCours ? [] : liste(chapitre.flash);
  const typeBac = partieCours ? [] : liste(chapitre['type-bac']);
  const memo = liste(chapitre.memo);
  const estTransverse = (s) => d.chapitres.get(s)?.meta?.transverse === true || s?.startsWith('methodes-');

  // 2. Structure du chapitre (§§ 4.1, 5.1, 11).
  if (notions.length < NOTIONS_PAR_CHAPITRE[0] || notions.length > NOTIONS_PAR_CHAPITRE[1]) {
    ecart('nombre-notions', undefined, `${notions.length} notion(s) : un chapitre en a de ${NOTIONS_PAR_CHAPITRE[0]} à ${NOTIONS_PAR_CHAPITRE[1]} (charte § 11).`);
  }
  const incontournables = notions.filter((n) => n.priorite === 3);
  if (incontournables.length * 2 > notions.length && !incontournables.every((n) => n.priorisation === 'annales')) {
    ecart('trop-incontournables', undefined, `${incontournables.length} incontournables sur ${notions.length} notions : au plus la moitié, sauf mesure sur les annales (charte § 5.1).`);
  }
  for (const n of notions) {
    if (n.priorisation === 'estimation' && /\d/.test(n.pourquoi ?? '')) {
      avertir('pourquoi-chiffre', n.id, 'priorité estimée : le « pourquoi » ne doit pas avancer de chiffre (charte § 5.1).');
    }
  }
  const formulations = new Set(
    liste(d.annales?.sujets).flatMap((s) => liste(s.exercices).flatMap((e) => liste(e.formulations)))
  );
  for (const n of notions) {
    for (const f of liste(n.attendusBac)) {
      if (!formulations.has(f)) ecart('attendu-hors-annales', n.id, `« ${f} » ne figure pas dans annales.json (charte § 3.4).`);
    }
  }
  if (!chapitre.cours) {
    ecart('cours-absent', undefined, 'cours.json absent.');
  } else {
    const sections = liste(chapitre.cours.sections);
    const ordreAttendu = notions.map((n) => n.id);
    const ordreLu = sections.map((s) => s.notion);
    for (const id of ordreAttendu) {
      if (!ordreLu.includes(id)) ecart('section-manquante', id, 'notion sans section dans cours.json.');
    }
    const communs = ordreLu.filter((id) => ordreAttendu.includes(id));
    if (communs.join() !== ordreAttendu.filter((id) => communs.includes(id)).join()) {
      ecart('ordre-sections', undefined, `sections dans l'ordre ${communs.join(', ')} ; ordre des notions : ${ordreAttendu.join(', ')}.`);
    }
    for (const s of sections) {
      const b = liste(s.blocs);
      if (b.length === 0) continue;
      if (b[0].type !== 'idee') ecart('deroule', b[0].id, `la section ${s.notion} commence par « ${b[0].type} » : « idee » d'abord (charte § 4.1).`);
      const dernier = b[b.length - 1];
      if (dernier.type !== 'retenir') ecart('deroule', dernier.id, `la section ${s.notion} finit par « ${dernier.type} » : « retenir » en dernier (charte § 4.1).`);
    }
  }
  const motsCles = new Map();
  for (const carte of memo) {
    const mot = carte.simplifie?.motCle;
    if (!mot) continue;
    if (motsCles.has(mot)) ecart('mot-cle', carte.id, `motCle « ${mot} » déjà pris par ${motsCles.get(mot)} (charte § 3.9).`);
    else motsCles.set(mot, carte.id);
  }

  // 3. Rattachement au programme (§ 9.1).
  for (const ligne of lignesDuChapitre) {
    const porteuses = notions.filter((n) => liste(n.capacites).includes(ligne.id));
    if (porteuses.length === 0) ecart('hors-notion', ligne.id, 'ligne du chapitre rattachée à aucune notion.');
    if (porteuses.length > 1) ecart('plusieurs-notions', ligne.id, `ligne rattachée à ${porteuses.map((n) => n.id).join(' et ')} : une seule notion.`);
  }
  for (const n of notions) {
    for (const c of liste(n.capacites)) {
      const l = lignes.get(c);
      if (l && (l.chapitre !== slug || l.premiere)) ecart('ligne-autre-chapitre', n.id, `${c} n'est pas une ligne de ce chapitre.`);
    }
    for (const p of liste(n.prerequis)) {
      if (!p.startsWith('n-')) continue;
      const cible = [...d.chapitres.values()].find((c) => liste(c.notions).some((x) => x.id === p));
      if (!cible) continue;
      if (cible.slug === slug) {
        const autre = notionParId.get(p);
        if (autre && autre.ordre >= n.ordre) ecart('prerequis-ulterieur', n.id, `prérequis ${p} placé après la notion dans le cours.`);
      } else if (!estTransverse(cible.slug) && (cible.meta?.ordre ?? Infinity) >= (meta.ordre ?? 0)) {
        ecart('prerequis-ulterieur', n.id, `prérequis ${p} d'un chapitre ultérieur (${cible.slug}).`);
      }
    }
  }
  for (const el of elementsCitants(chapitre)) {
    if (el.genre === 'notion' || el.blocType === 'lien-matiere' || !dansLaPartie(el.fichier)) continue;
    const propres = new Set(el.notions.flatMap((id) => liste(notionParId.get(id)?.capacites)));
    const nonExigibleAdmis = el.blocType === 'complement' || (el.genre === 'exercice' && el.niveau === 3);
    for (const c of el.capacites) {
      const l = lignes.get(c);
      if (!l || l.premiere) continue;
      if (!l.exigible && !nonExigibleAdmis) {
        ecart('non-exigible', el.id, `${c} n'est pas exigible : seulement dans un bloc complement ou un exercice de marche 3.`);
      }
      if (l.chapitre === slug) {
        if (!propres.has(c)) ecart('hors-notions-de-l-element', el.id, `${c} appartient à une notion que l'élément ne déclare pas.`);
      } else if (!estTransverse(l.chapitre)) {
        const autre = d.chapitres.get(l.chapitre)?.meta;
        if (!autre) ecart('chapitre-non-ecrit', el.id, `${c} vient du chapitre ${l.chapitre}, pas encore écrit : impossible de dire s'il précède celui-ci.`);
        else if (autre.ordre >= (meta.ordre ?? 0)) ecart('chapitre-ulterieur', el.id, `${c} vient du chapitre ${l.chapitre}, qui vient après celui-ci (règle d'or 5).`);
      }
    }
  }

  // 4. Exigences par ligne exigible (§ 9.2).
  const citePar = (items, c) => items.some((x) => liste(x.capacites).includes(c));
  const blocsFormels = blocs.filter(({ bloc }) => BLOCS_FORMELS.includes(bloc.type) && bloc.type !== 'lien-matiere').map(({ bloc }) => bloc);
  const demonstrations = blocs.filter(({ bloc }) => bloc.type === 'demonstration' && bloc.exigible).map(({ bloc }) => bloc);
  const blocsCode = blocs.filter(({ bloc }) => bloc.type === 'code' || (bloc.type === 'methode' && bloc.code)).map(({ bloc }) => bloc);
  const experiences = blocs.filter(({ bloc }) => bloc.type === 'experience').map(({ bloc }) => bloc);
  const exercicesMatiere = partieCours ? [] : [...d.chapitres.values()].flatMap((c) => liste(c.exercices));
  for (const l of lignesDuChapitre.filter((x) => x.exigible)) {
    const manque = [];
    switch (l.rubrique) {
      case 'contenu':
      case 'capacite':
        if (!citePar(blocsFormels, l.id)) manque.push('un bloc formel du cours');
        if (!partieCours && !citePar(exercices, l.id)) manque.push('un exercice');
        if (!partieCours && !citePar(flash, l.id)) manque.push('une question éclair');
        break;
      case 'demonstration':
        if (!citePar(demonstrations, l.id)) manque.push('un bloc demonstration avec exigible: true');
        break;
      case 'algorithme':
      case 'numerique':
        if (!citePar(blocsCode, l.id)) manque.push('un bloc code (ou methode avec code)');
        if (!partieCours && !citePar(exercices, l.id)) manque.push('un exercice');
        break;
      case 'experimentale':
        if (!partieCours && !citePar(experiences, l.id) && !citePar(exercices, l.id)) manque.push('un bloc experience ou un exercice');
        break;
      case 'mathematique':
        if (!partieCours && !citePar(exercicesMatiere, l.id)) manque.push('un exercice');
        break;
      default:
        break;
    }
    if (manque.length > 0) ecart('exigence', l.id, `(${l.rubrique}) il manque : ${manque.join(', ')} (charte § 9.2).`);
  }
  for (const bloc of demonstrations) {
    if (!liste(bloc.capacites).some((c) => lignes.get(c)?.rubrique === 'demonstration')) {
      ecart('demonstration-exigible', bloc.id, 'exigible: true sans ligne de rubrique demonstration dans capacites (charte § 4.2).');
    }
  }

  // 5. Planchers par notion (§ 5.3).
  const quotas = notions.map((n) => {
    const section = blocs.filter((b) => b.notion === n.id).map((b) => b.bloc);
    const compte = {
      exemples: section.filter((b) => b.type === 'exemple').length,
      verifie: section.filter((b) => b.type === 'verifie').length,
      m1: exercices.filter((x) => x.niveau === 1 && x.notions?.[0] === n.id).length,
      m2: exercices.filter((x) => x.niveau === 2 && x.notions?.[0] === n.id).length,
      m3: exercices.filter((x) => x.niveau === 3 && liste(x.notions).includes(n.id)).length,
      flash: flash.filter((f) => f.notion === n.id).length,
      memo: memo.filter((m) => m.notion === n.id).length,
      typeBac: typeBac.filter((t) => liste(t.notions).includes(n.id)).length,
    };
    for (const [cle, { libelle, partie: p, valeurs }] of Object.entries(PLANCHERS)) {
      if (partieCours && p !== 'cours') continue;
      if (cle === 'typeBac' && transverse) continue;
      const plancher = valeurs[n.priorite] ?? 0;
      if (compte[cle] < plancher) ecart('plancher', n.id, `${libelle} : ${compte[cle]} pour un plancher de ${plancher} (priorité ${n.priorite}, charte § 5.3).`);
      else if (plancher > 0 && compte[cle] > 2 * plancher) avertir('plafond', n.id, `${libelle} : ${compte[cle]}, au-delà du double du plancher (${plancher}) — règle d'or 7.`);
    }
    if (n.priorite === 1 && compte.memo > 0) avertir('memo-plus-rare', n.id, 'carte de mémo pour une notion ★ : seulement pour une formule à connaître par cœur (charte § 8).');
    return { notion: n.id, priorite: n.priorite, ...compte };
  });

  // 6. Forme des marches et du type bac (§§ 5.3, 6, 7).
  if (!partieCours) {
    const nbTypeBac = typeBac.length;
    if (transverse && nbTypeBac > 0) ecart('type-bac-nombre', undefined, 'un chapitre transverse n\'a pas de type bac (charte § 2.1).');
    if (!transverse && (nbTypeBac < TYPE_BAC_PAR_CHAPITRE[0] || nbTypeBac > TYPE_BAC_PAR_CHAPITRE[1])) {
      ecart('type-bac-nombre', undefined, `${nbTypeBac} exercice(s) type bac : de ${TYPE_BAC_PAR_CHAPITRE[0]} à ${TYPE_BAC_PAR_CHAPITRE[1]} par chapitre (charte § 5.3).`);
    }
    for (const x of exercices) {
      const r = MARCHES[x.niveau];
      if (!r) continue;
      const qs = liste(x.questions);
      const nom = `marche ${x.niveau} (${r.nom})`;
      if (qs.length < r.questions[0] || qs.length > r.questions[1]) ecart('marche', x.id, `${nom} : ${qs.length} question(s), de ${r.questions[0]} à ${r.questions[1]} attendues.`);
      if (x.duree < r.duree[0] || x.duree > r.duree[1]) ecart('marche', x.id, `${nom} : ${x.duree} min, de ${r.duree[0]} à ${r.duree[1]} attendues.`);
      const nbNotions = liste(x.notions).length;
      if (nbNotions < r.notionsMin || (r.notionsMax && nbNotions > r.notionsMax)) {
        ecart('marche', x.id, `${nom} : ${nbNotions} notion(s) ; ${r.notionsMax ? `exactement ${r.notionsMax}` : `au moins ${r.notionsMin}`} attendue(s).`);
      }
      for (const q of qs) {
        const nbIndices = liste(q.indices).length;
        if (nbIndices < r.indices[0] || nbIndices > r.indices[1]) {
          ecart('marche', `${x.id} ${q.id}`, `${nom} : ${nbIndices} indice(s), de ${r.indices[0]} à ${r.indices[1]} attendus.`);
        }
        if (x.niveau === 1) {
          if (!q.reponse || q.reponse.type === 'redaction') ecart('marche', `${x.id} ${q.id}`, 'marche 1 : réponse vérifiable obligatoire (pas redaction).');
          if (q.reponse?.type === 'qcm' && !q.reponse.pourquoiFaux) ecart('marche', `${x.id} ${q.id}`, 'marche 1 : un QCM porte pourquoiFaux.');
        }
        if (nbIndices >= 2 && !q.revoir) avertir('revoir', `${x.id} ${q.id}`, 'indices sans « revoir » vers le bloc de cours (charte § 6).');
      }
    }
    if (matiere === 'physique-chimie') {
      const numeriques = [
        ...exercices.flatMap((x) => questionsAPlat(x).map((q) => [`${x.id} ${q.id}`, q.reponse])),
        ...typeBac.flatMap((x) => questionsAPlat(x).map((q) => [`${x.id} ${q.id}`, q.reponse])),
        ...flash.map((f) => [f.id, f.reponse]),
      ];
      for (const [id, rep] of numeriques) {
        if (rep?.type === 'numerique' && !rep.unite) avertir('unite', id, 'valeur numérique sans unité : obligatoire si la grandeur en a une (charte § 3.6).');
      }
    }
  }
  if (matiere === 'physique-chimie') {
    for (const { bloc } of blocs) {
      if (bloc.type === 'verifie' && bloc.question?.reponse?.type === 'numerique' && !bloc.question.reponse.unite) {
        avertir('unite', bloc.id, 'valeur numérique sans unité : obligatoire si la grandeur en a une (charte § 3.6).');
      }
    }
  }

  // 7. Figures : le fichier existe sous public/figures/.
  for (const { fichier, id, figure } of figuresDuChapitre(chapitre)) {
    if (!dansLaPartie(fichier) || figure.type !== 'image') continue;
    const chemin = join(RACINE_DEPOT, 'public', 'figures', figure.data?.src ?? '');
    if (!existsSync(chemin)) ecart('figure-absente', id, `public/figures/${figure.data?.src} introuvable.`);
  }

  return { ecarts, avertissements, quotas };
}

function afficher({ matiere, slug, partie, racine }, rapport) {
  const lignes = [];
  lignes.push(`Couverture — ${matiere} / ${slug} (partie : ${partie})`);
  const relatif = relative(RACINE_DEPOT, racine);
  lignes.push(`Racine : ${relatif.startsWith('..') ? racine : relatif}`);
  lignes.push('');
  if (rapport.ecarts.length === 0) lignes.push('✓ Rapport vide : aucun écart.');
  else {
    lignes.push(`✗ ${rapport.ecarts.length} écart(s) :`);
    for (const e of rapport.ecarts) lignes.push(`  [${e.regle}]${e.id ? ` ${e.id} —` : ''} ${e.message}`);
  }
  if (rapport.avertissements.length > 0) {
    lignes.push('');
    lignes.push(`Avertissements (${rapport.avertissements.length}, à regarder, non bloquants) :`);
    for (const a of rapport.avertissements) lignes.push(`  [${a.regle}]${a.id ? ` ${a.id} —` : ''} ${a.message}`);
  }
  if (rapport.quotas.length > 0) {
    const colonnes = Object.keys(PLANCHERS).filter((c) => partie !== 'cours' || PLANCHERS[c].partie === 'cours');
    lignes.push('');
    lignes.push(`| notion | priorité | ${colonnes.map((c) => PLANCHERS[c].libelle).join(' | ')} |`);
    lignes.push(`|---|---|${colonnes.map(() => '---').join('|')}|`);
    for (const q of rapport.quotas) {
      const cellules = colonnes.map((c) => `${q[c]} / ${PLANCHERS[c].valeurs[q.priorite] ?? 0}`);
      lignes.push(`| ${q.notion} | ${q.priorite} | ${cellules.join(' | ')} |`);
    }
    lignes.push('(compté / plancher)');
  }
  console.log(lignes.join('\n'));
}

const estLeScript = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (estLeScript) {
  let args;
  try {
    args = lireArguments(process.argv.slice(2));
  } catch (err) {
    console.error(`Erreur : ${err.message}`);
    console.error('Usage : node scripts/couverture-terminale.mjs <matiere> <chapitre> [--partie cours|exercices] [--racine <dossier>] [--json]');
    process.exit(2);
  }
  const rapport = couverture(args);
  if (rapport.introuvable) {
    console.error(`Chapitre introuvable : ${relative(RACINE_DEPOT, join(args.racine, args.matiere, 'chapitres', args.slug))}`);
    process.exit(2);
  }
  if (args.json) console.log(JSON.stringify(rapport, null, 2));
  else afficher(args, rapport);
  process.exit(rapport.ecarts.length === 0 ? 0 : 1);
}
