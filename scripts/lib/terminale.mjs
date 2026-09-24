/**
 * Terminale — lecture et contrôles communs aux scripts (validate-content,
 * couverture-terminale, sans-reponses). Charte : .claude/skills/terminale-charte/SKILL.md.
 *
 * Une « racine » a la forme de content/terminale/ :
 *   <racine>/<matiere>/programme.json        lignes du programme (tableau)
 *   <racine>/<matiere>/annales.json          index des sujets (objet)
 *   <racine>/<matiere>/chapitres/<slug>/     meta, notions, cours, memo, exercices, flash, type-bac
 * Le chapitre-témoin (tests/fixtures/terminale/) a la même forme.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';

export const RACINE_DEPOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const MATIERES = ['maths', 'physique-chimie'];
export const PREFIXE_CAPACITE = { maths: ['bo-m-'], 'physique-chimie': ['bo-pc-', 'bo-pc1-'] };

/** Fichiers d'un chapitre : forme (objet ou tableau d'entrées) et schéma. */
export const FICHIERS_CHAPITRE = {
  meta: { forme: 'objet', schema: 'meta' },
  notions: { forme: 'liste', schema: 'notion' },
  cours: { forme: 'objet', schema: 'cours' },
  memo: { forme: 'liste', schema: 'memo' },
  exercices: { forme: 'liste', schema: 'exercice' },
  flash: { forme: 'liste', schema: 'flash' },
  'type-bac': { forme: 'liste', schema: 'type-bac' },
};

/** Fichiers contrôlés par la partie « cours » (charte § 9.3). */
export const FICHIERS_PARTIE_COURS = ['meta', 'notions', 'cours', 'memo'];

/** Blocs de cours dont capacites est obligatoire (charte § 3.5). */
export const BLOCS_FORMELS = [
  'definition',
  'propriete',
  'demonstration',
  'methode',
  'exemple',
  'experience',
  'complement',
  'code',
  'lien-matiere',
];

/**
 * Compile les schémas de schemas/terminale/ sur une instance Ajv.
 * Renvoie { programme, annales, meta, notion, cours, memo, exercice, flash, 'type-bac', figure }.
 */
export function compilerSchemas(ajv = new Ajv({ allErrors: true, strict: false })) {
  const dossier = join(RACINE_DEPOT, 'schemas', 'terminale');
  const lire = (nom) => JSON.parse(readFileSync(join(dossier, `${nom}.schema.json`), 'utf8'));
  for (const nom of ['commun', 'figure']) {
    const schema = lire(nom);
    if (!ajv.getSchema(schema.$id)) ajv.addSchema(schema);
  }
  const validateurs = { figure: ajv.getSchema('terminale/figure.schema.json') };
  for (const nom of ['programme', 'annales', 'meta', 'notion', 'cours', 'memo', 'exercice', 'flash', 'type-bac']) {
    validateurs[nom] = ajv.compile(lire(nom));
  }
  return validateurs;
}

export function formaterErreurs(validate) {
  // « must match "then" schema » ne fait que répéter l'erreur précise qui le précède.
  return (validate.errors ?? [])
    .filter((e) => e.keyword !== 'if')
    .map((e) => `${e.instancePath || '<racine>'} ${e.message ?? '?'}`)
    .join(' ; ');
}

function existe(chemin) {
  try {
    return statSync(chemin);
  } catch {
    return null;
  }
}

function lireJson(chemin, problemes, contexte) {
  try {
    return JSON.parse(readFileSync(chemin, 'utf8'));
  } catch (err) {
    problemes.push({ ...contexte, message: `JSON illisible : ${err.message}` });
    return undefined;
  }
}

/**
 * Lit une matière sous une racine. Les fichiers absents valent undefined.
 * Renvoie { matiere, dossier, programme, annales, chapitres: Map<slug, {dossier, meta, notions, …}>, problemes }.
 */
export function lireMatiere(racine, matiere) {
  const dossier = join(racine, matiere);
  const problemes = [];
  const donnees = { matiere, dossier, programme: undefined, annales: undefined, chapitres: new Map(), problemes };
  if (!existe(dossier)) return donnees;
  for (const nom of ['programme', 'annales']) {
    const chemin = join(dossier, `${nom}.json`);
    if (existe(chemin)) donnees[nom] = lireJson(chemin, problemes, { matiere, fichier: chemin });
  }
  const dossierChapitres = join(dossier, 'chapitres');
  if (!existe(dossierChapitres)) return donnees;
  for (const slug of readdirSync(dossierChapitres).sort()) {
    const dossierChapitre = join(dossierChapitres, slug);
    if (!statSync(dossierChapitre).isDirectory()) continue;
    const chapitre = { slug, dossier: dossierChapitre };
    for (const nom of Object.keys(FICHIERS_CHAPITRE)) {
      const chemin = join(dossierChapitre, `${nom}.json`);
      if (existe(chemin)) chapitre[nom] = lireJson(chemin, problemes, { matiere, chapitre: slug, fichier: chemin });
    }
    donnees.chapitres.set(slug, chapitre);
  }
  return donnees;
}

/** Lit toutes les matières présentes sous une racine. */
export function lireRacine(racine) {
  return MATIERES.map((m) => lireMatiere(racine, m)).filter((d) => existe(d.dossier));
}

/**
 * Validation Ajv de toute une matière. Chaque problème : { matiere, chapitre?, fichier, id?, message }.
 * Renvoie { total, problemes }.
 */
export function validerSchemas(donnees, validateurs) {
  const problemes = [];
  let total = 0;
  const verifier = (validate, valeur, contexte) => {
    total += 1;
    if (validate(valeur)) return;
    problemes.push({ ...contexte, message: formaterErreurs(validate) });
  };
  const { matiere, dossier } = donnees;
  const verifierListe = (validate, liste, contexte) => {
    if (!Array.isArray(liste)) {
      total += 1;
      problemes.push({ ...contexte, message: 'Le fichier doit contenir un tableau.' });
      return;
    }
    liste.forEach((item, i) => verifier(validate, item, { ...contexte, id: item?.id ?? `<index ${i}>` }));
  };
  if (donnees.programme !== undefined) {
    verifierListe(validateurs.programme, donnees.programme, { matiere, fichier: join(dossier, 'programme.json') });
  }
  if (donnees.annales !== undefined) {
    verifier(validateurs.annales, donnees.annales, { matiere, fichier: join(dossier, 'annales.json') });
  }
  for (const chapitre of donnees.chapitres.values()) {
    for (const [nom, { forme, schema }] of Object.entries(FICHIERS_CHAPITRE)) {
      const valeur = chapitre[nom];
      if (valeur === undefined) continue;
      const contexte = { matiere, chapitre: chapitre.slug, fichier: join(chapitre.dossier, `${nom}.json`) };
      if (forme === 'liste') verifierListe(validateurs[schema], valeur, contexte);
      else verifier(validateurs[schema], valeur, contexte);
    }
  }
  return { total, problemes };
}

// --- Parcours du contenu ------------------------------------------------------

const liste = (valeur) => (Array.isArray(valeur) ? valeur : []);

/** Les blocs du cours d'un chapitre, avec la notion de leur section. */
export function blocsDuCours(chapitre) {
  const blocs = [];
  for (const section of liste(chapitre.cours?.sections)) {
    for (const bloc of liste(section?.blocs)) blocs.push({ bloc, notion: section.notion });
  }
  return blocs;
}

/** Questions d'un exercice ou d'un type bac, sous-questions comprises (à plat). */
export function questionsAPlat(exercice) {
  const toutes = [];
  for (const q of liste(exercice?.questions)) {
    toutes.push(q);
    for (const sq of liste(q?.sousQuestions)) toutes.push(sq);
  }
  return toutes;
}

/**
 * Tout ce qui cite des lignes du programme dans un chapitre, sous une forme commune :
 * { fichier, id, genre, niveau?, notions, capacites, blocType? }.
 * Le mémo n'y est pas : ses cartes héritent des lignes de leur notion.
 */
export function elementsCitants(chapitre) {
  const elements = [];
  for (const n of liste(chapitre.notions)) {
    elements.push({ fichier: 'notions', id: n.id, genre: 'notion', notions: [n.id], capacites: liste(n.capacites) });
  }
  for (const { bloc, notion } of blocsDuCours(chapitre)) {
    elements.push({
      fichier: 'cours',
      id: bloc.id,
      genre: 'bloc',
      blocType: bloc.type,
      notions: [notion],
      capacites: liste(bloc.capacites),
    });
  }
  for (const x of liste(chapitre.exercices)) {
    elements.push({ fichier: 'exercices', id: x.id, genre: 'exercice', niveau: x.niveau, notions: liste(x.notions), capacites: liste(x.capacites) });
  }
  for (const f of liste(chapitre.flash)) {
    elements.push({ fichier: 'flash', id: f.id, genre: 'flash', notions: [f.notion], capacites: liste(f.capacites) });
  }
  for (const t of liste(chapitre['type-bac'])) {
    elements.push({ fichier: 'type-bac', id: t.id, genre: 'type-bac', notions: liste(t.notions), capacites: liste(t.capacites) });
  }
  return elements;
}

/** Toutes les réponses d'un chapitre (vérifie, exercices, type bac, éclair), avec leur porteur. */
function reponsesDuChapitre(chapitre) {
  const reponses = [];
  for (const { bloc } of blocsDuCours(chapitre)) {
    if (bloc.type === 'verifie' && bloc.question?.reponse) {
      reponses.push({ fichier: 'cours', id: bloc.id, reponse: bloc.question.reponse });
    }
  }
  for (const nom of ['exercices', 'type-bac']) {
    for (const x of liste(chapitre[nom])) {
      for (const q of questionsAPlat(x)) {
        if (q?.reponse) reponses.push({ fichier: nom, id: `${x.id} ${q.id}`, reponse: q.reponse });
      }
    }
  }
  for (const f of liste(chapitre.flash)) {
    if (f?.reponse) reponses.push({ fichier: 'flash', id: f.id, reponse: f.reponse });
  }
  return reponses;
}

/** Figures d'un chapitre (blocs figure, exercices, type bac). */
export function figuresDuChapitre(chapitre) {
  const figures = [];
  for (const { bloc } of blocsDuCours(chapitre)) {
    if (bloc.type === 'figure' && bloc.figure) figures.push({ fichier: 'cours', id: bloc.id, figure: bloc.figure });
  }
  for (const nom of ['exercices', 'type-bac']) {
    for (const x of liste(chapitre[nom])) {
      if (x?.figure) figures.push({ fichier: nom, id: x.id, figure: x.figure });
    }
  }
  return figures;
}

// --- Intégrité ------------------------------------------------------------------

/** Chapitres de maths de première (cible des renvois 1e:<slug>). */
export function chapitresDePremiere() {
  const dossier = join(RACINE_DEPOT, 'content', 'chapters');
  if (!existe(dossier)) return new Set();
  return new Set(readdirSync(dossier).filter((s) => statSync(join(dossier, s)).isDirectory()));
}

/**
 * Intégrité d'une ou plusieurs matières lues sous une même racine : ce qui rend les
 * données inutilisables (renvoi vers rien, doublon, total faux), indépendamment de la
 * couverture. Chaque problème : { matiere, chapitre?, fichier, id?, message }.
 */
export function controlerIntegrite(matieres, { premiere = chapitresDePremiere() } = {}) {
  const problemes = [];
  const lignesParMatiere = new Map();
  const toutesLesLignes = new Map();
  const vus = new Map(); // identifiant → où il a été vu la première fois

  const signaler = (contexte, message) => problemes.push({ ...contexte, message });
  const enregistrer = (id, contexte) => {
    if (typeof id !== 'string') return;
    const deja = vus.get(id);
    if (deja) signaler(contexte, `identifiant en double : ${id} (déjà dans ${deja})`);
    else vus.set(id, `${contexte.matiere}/${contexte.chapitre ?? ''}/${contexte.nomFichier}`);
  };

  for (const d of matieres) {
    const lignes = new Map();
    for (const ligne of liste(d.programme)) {
      const contexte = { matiere: d.matiere, fichier: join(d.dossier, 'programme.json'), nomFichier: 'programme', id: ligne.id };
      enregistrer(ligne.id, contexte);
      if (!PREFIXE_CAPACITE[d.matiere].some((p) => ligne.id?.startsWith(p))) {
        signaler(contexte, `préfixe incompatible avec la matière ${d.matiere}`);
      }
      lignes.set(ligne.id, ligne);
      toutesLesLignes.set(ligne.id, { ...ligne, matiere: d.matiere });
    }
    lignesParMatiere.set(d.matiere, lignes);
  }

  // Notions et blocs de toutes les matières : un lien-matiere renvoie à l'autre.
  const toutesNotions = new Map();
  const tousBlocs = new Map();
  for (const d of matieres) {
    for (const chapitre of d.chapitres.values()) {
      for (const n of liste(chapitre.notions)) toutesNotions.set(n.id, { notion: n, matiere: d.matiere });
      for (const { bloc } of blocsDuCours(chapitre)) tousBlocs.set(bloc.id, { bloc, matiere: d.matiere });
    }
  }

  for (const d of matieres) {
    const lignes = lignesParMatiere.get(d.matiere);
    const dansLaMatiere = (carte) => new Map([...carte].filter(([, v]) => v.matiere === d.matiere));
    const notions = dansLaMatiere(toutesNotions);
    const blocs = dansLaMatiere(tousBlocs);
    const sujets = new Set(liste(d.annales?.sujets).map((s) => s.id));
    for (const sujet of liste(d.annales?.sujets)) {
      const contexte = { matiere: d.matiere, fichier: join(d.dossier, 'annales.json'), nomFichier: 'annales', id: sujet.id };
      enregistrer(sujet.id, contexte);
      for (const ex of liste(sujet.exercices)) {
        for (const c of liste(ex.capacites)) {
          if (!lignes.has(c)) signaler(contexte, `exercice ${ex.numero} : ligne du programme inconnue ${c}`);
        }
      }
      for (const c of liste(sujet.exclus)) {
        if (!lignes.has(c)) signaler(contexte, `exclus : ligne du programme inconnue ${c}`);
      }
    }
    for (const chapitre of d.chapitres.values()) {
      const slug = chapitre.slug;
      const ctx = (nomFichier, id) => ({
        matiere: d.matiere,
        chapitre: slug,
        fichier: join(chapitre.dossier, `${nomFichier}.json`),
        nomFichier,
        ...(id !== undefined ? { id } : {}),
      });

      if (!chapitre.meta) signaler(ctx('meta'), 'meta.json manquant');
      else {
        if (chapitre.meta.slug !== slug) signaler(ctx('meta'), `slug « ${chapitre.meta.slug} » ≠ dossier « ${slug} »`);
        if (chapitre.meta.matiere !== d.matiere) signaler(ctx('meta'), `matière « ${chapitre.meta.matiere} » ≠ dossier « ${d.matiere} »`);
        if (chapitre.meta.transverse && liste(chapitre['type-bac']).length > 0) {
          signaler(ctx('type-bac'), 'un chapitre transverse n\'a pas de type bac (charte § 2.1)');
        }
      }
      if (chapitre.cours && chapitre.cours.chapitre !== slug) {
        signaler(ctx('cours'), `chapitre « ${chapitre.cours.chapitre} » ≠ dossier « ${slug} »`);
      }

      // Identifiants : uniques, préfixés par le chapitre, champ chapitre cohérent.
      const prefixe = {
        notions: `n-${slug}-`,
        cours: `l-${slug}-`,
        memo: `m-${slug}-`,
        exercices: `x-${slug}-`,
        flash: `fl-${slug}-`,
        'type-bac': `tb-${slug}-`,
      };
      for (const nom of ['notions', 'memo', 'exercices', 'flash', 'type-bac']) {
        for (const item of liste(chapitre[nom])) {
          const c = ctx(nom, item.id);
          enregistrer(item.id, c);
          if (typeof item.id === 'string' && !item.id.startsWith(prefixe[nom])) {
            signaler(c, `l'identifiant doit commencer par ${prefixe[nom]}`);
          }
          if (item.chapitre !== slug) signaler(c, `chapitre « ${item.chapitre} » ≠ dossier « ${slug} »`);
        }
      }
      for (const { bloc } of blocsDuCours(chapitre)) {
        const c = ctx('cours', bloc.id);
        enregistrer(bloc.id, c);
        if (typeof bloc.id === 'string' && !bloc.id.startsWith(prefixe.cours)) {
          signaler(c, `l'identifiant doit commencer par ${prefixe.cours}`);
        }
      }

      // Renvois vers des notions.
      const notionsDuChapitre = new Set(liste(chapitre.notions).map((n) => n.id));
      for (const section of liste(chapitre.cours?.sections)) {
        if (!notionsDuChapitre.has(section.notion)) {
          signaler(ctx('cours'), `section de la notion ${section.notion}, absente de notions.json`);
        }
      }
      for (const nom of ['exercices', 'type-bac']) {
        for (const x of liste(chapitre[nom])) {
          for (const n of liste(x.notions)) {
            if (!notionsDuChapitre.has(n)) signaler(ctx(nom, x.id), `notion inconnue dans ce chapitre : ${n}`);
          }
        }
      }
      for (const nom of ['memo', 'flash']) {
        for (const item of liste(chapitre[nom])) {
          if (!notionsDuChapitre.has(item.notion)) signaler(ctx(nom, item.id), `notion inconnue dans ce chapitre : ${item.notion}`);
        }
      }
      for (const n of liste(chapitre.notions)) {
        for (const p of liste(n.prerequis)) {
          if (p.startsWith('1e:')) {
            if (!premiere.has(p.slice(3))) signaler(ctx('notions', n.id), `chapitre de première inconnu : ${p}`);
          } else if (!notions.has(p)) {
            signaler(ctx('notions', n.id), `prérequis inconnu : ${p}`);
          }
        }
      }

      // Lignes du programme citées.
      for (const el of elementsCitants(chapitre)) {
        const autreMatiere = el.blocType === 'lien-matiere';
        for (const c of el.capacites) {
          if (autreMatiere) {
            const ligne = toutesLesLignes.get(c);
            if (!ligne) signaler(ctx(el.fichier, el.id), `ligne du programme inconnue : ${c}`);
            else if (ligne.matiere === d.matiere) {
              signaler(ctx(el.fichier, el.id), `un lien-matiere cite les lignes de l'autre matière : ${c}`);
            }
          } else if (!lignes.has(c)) {
            signaler(ctx(el.fichier, el.id), `ligne du programme inconnue : ${c}`);
          }
        }
      }

      // Renvois vers des blocs (demonstration.de, methode.exemple, rappel.lien, revoir).
      const renvoiBloc = (cible, c, attendu, carte = blocs) => {
        const trouve = carte.get(cible);
        if (!trouve) signaler(c, `bloc inconnu : ${cible}`);
        else if (attendu && trouve.bloc.type !== attendu) signaler(c, `${cible} est un bloc « ${trouve.bloc.type} », « ${attendu} » attendu`);
      };
      const renvoiCours = (cible, c, { notionsCibles = notions, blocsCibles = blocs } = {}) => {
        if (cible.startsWith('1e:')) {
          if (!premiere.has(cible.slice(3))) signaler(c, `chapitre de première inconnu : ${cible}`);
        } else if (cible.startsWith('n-')) {
          if (!notionsCibles.has(cible)) signaler(c, `notion inconnue : ${cible}`);
        } else renvoiBloc(cible, c, undefined, blocsCibles);
      };
      for (const { bloc } of blocsDuCours(chapitre)) {
        const c = ctx('cours', bloc.id);
        if (bloc.type === 'demonstration' && bloc.de) renvoiBloc(bloc.de, c, 'propriete');
        if (bloc.type === 'methode' && bloc.exemple) renvoiBloc(bloc.exemple, c, 'exemple');
        if (bloc.type === 'rappel' && bloc.lien) renvoiCours(bloc.lien, c);
        if (bloc.type === 'lien-matiere' && bloc.lien) {
          renvoiCours(bloc.lien, c, { notionsCibles: toutesNotions, blocsCibles: tousBlocs });
        }
      }
      for (const nom of ['exercices', 'type-bac']) {
        for (const x of liste(chapitre[nom])) {
          const ids = new Set();
          for (const q of questionsAPlat(x)) {
            if (ids.has(q.id)) signaler(ctx(nom, x.id), `question en double : ${q.id}`);
            ids.add(q.id);
            if (q.revoir) renvoiBloc(q.revoir, ctx(nom, `${x.id} ${q.id}`));
          }
          if (x.source?.annale && !sujets.has(x.source.annale)) {
            signaler(ctx(nom, x.id), `sujet d'annales inconnu : ${x.source.annale}`);
          }
        }
      }

      // Totaux de points du type bac.
      for (const t of liste(chapitre['type-bac'])) {
        const somme = (items) => items.reduce((s, q) => s + (Number(q?.points) || 0), 0);
        const arrondi = (x) => Math.round(x * 1000) / 1000;
        if (arrondi(somme(liste(t.questions))) !== arrondi(Number(t.points))) {
          signaler(ctx('type-bac', t.id), `points : ${t.points} annoncés, ${somme(liste(t.questions))} dans les questions`);
        }
        for (const q of liste(t.questions)) {
          if (q.sousQuestions && arrondi(somme(q.sousQuestions)) !== arrondi(Number(q.points))) {
            signaler(ctx('type-bac', `${t.id} ${q.id}`), `points : ${q.points} annoncés, ${somme(q.sousQuestions)} dans les sous-questions`);
          }
        }
      }

      // Cohérence des réponses.
      for (const { fichier, id, reponse } of reponsesDuChapitre(chapitre)) {
        const c = ctx(fichier, id);
        if (reponse.type === 'qcm') {
          const n = liste(reponse.choix).length;
          if (reponse.bonne >= n) signaler(c, `bonne = ${reponse.bonne}, hors des ${n} choix`);
          if (reponse.pourquoiFaux) {
            if (reponse.pourquoiFaux.length !== n) signaler(c, `pourquoiFaux : ${reponse.pourquoiFaux.length} messages pour ${n} choix`);
            reponse.pourquoiFaux.forEach((m, i) => {
              if (i === reponse.bonne && m !== null) signaler(c, 'pourquoiFaux : null attendu pour le bon choix');
              if (i !== reponse.bonne && (m === null || m === '')) signaler(c, `pourquoiFaux : message manquant pour le choix ${i}`);
            });
          }
        }
        if (reponse.type === 'qcm-multiple') {
          const n = liste(reponse.choix).length;
          for (const b of liste(reponse.bonnes)) if (b >= n) signaler(c, `bonnes : ${b} hors des ${n} choix`);
        }
        if (reponse.type === 'numerique' && typeof reponse.valeur === 'string' && /\/0+$/.test(reponse.valeur)) {
          signaler(c, `fraction de dénominateur nul : ${reponse.valeur}`);
        }
      }
    }
  }
  return problemes.map(({ nomFichier: _nomFichier, ...p }) => p);
}
