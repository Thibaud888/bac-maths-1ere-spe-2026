import type { ValidateFunction } from 'ajv';
import { erreurs, validateurs } from './validate';
import type {
  Annales,
  Bloc,
  CarteMemo,
  Chapitre,
  ChapitreMeta,
  Cours,
  Exercice,
  ExerciceTypeBac,
  LigneProgramme,
  Matiere,
  Notion,
  QuestionEclair,
} from './types';

/** Un fichier JSON tel que le livre `import.meta.glob`, avant validation. */
export type FichierBrut = { chemin: string; donnees: unknown; temoin: boolean };

export type Signaler = (message: string, element?: unknown) => void;

export type IndexTerminale = {
  chapitres: Map<string, Chapitre>;
  programme: Map<string, LigneProgramme & { matiere: Matiere }>;
  annales: Map<Matiere, Annales>;
  notions: Map<string, { notion: Notion; chapitre: string }>;
  blocs: Map<string, { bloc: Bloc; notion: string; chapitre: string }>;
};

const MATIERES: readonly Matiere[] = ['maths', 'physique-chimie'];
const FICHIERS_LISTE = ['notions', 'memo', 'exercices', 'flash', 'type-bac'] as const;
type FichierListe = (typeof FICHIERS_LISTE)[number];

const RE_MATIERE = /\/terminale\/(maths|physique-chimie)\/(programme|annales)\.json$/;
const RE_CHAPITRE =
  /\/terminale\/(maths|physique-chimie)\/chapitres\/([^/]+)\/(meta|notions|cours|memo|exercices|flash|type-bac)\.json$/;

type Brouillon = {
  matiere: Matiere;
  slug: string;
  temoin: boolean;
  meta?: unknown;
  cours?: unknown;
  listes: Partial<Record<FichierListe, unknown>>;
};

function validerListe<T>(
  donnees: unknown,
  validate: ValidateFunction<T>,
  contexte: string,
  signaler: Signaler
): T[] {
  if (!Array.isArray(donnees)) {
    signaler(`${contexte} : le fichier doit contenir un tableau`, donnees);
    return [];
  }
  const valides: T[] = [];
  for (const item of donnees) {
    if (validate(item)) valides.push(item);
    else signaler(`${contexte} : entrée invalide — ${erreurs(validate)}`, item);
  }
  return valides;
}

function valider<T>(
  donnees: unknown,
  validate: ValidateFunction<T>,
  contexte: string,
  signaler: Signaler
): T | undefined {
  if (validate(donnees)) return donnees;
  signaler(`${contexte} : fichier invalide — ${erreurs(validate)}`, donnees);
  return undefined;
}

/**
 * Construit l'index de la terminale à partir des fichiers bruts : chaque entrée est
 * validée contre son schéma (une entrée invalide est signalée et écartée), les
 * identifiants sont uniques, un slug de chapitre n'apparaît qu'une fois.
 *
 * Le contenu réel passe avant le chapitre-témoin : en cas de collision, c'est le
 * témoin qui est écarté. Fonction pure : `content.ts` lui passe les fichiers de
 * `import.meta.glob`, les tests lui passent les fichiers du témoin.
 */
export function indexerTerminale(fichiers: FichierBrut[], signaler: Signaler): IndexTerminale {
  const index: IndexTerminale = {
    chapitres: new Map(),
    programme: new Map(),
    annales: new Map(),
    notions: new Map(),
    blocs: new Map(),
  };
  // Le contenu réel d'abord, pour qu'il l'emporte sur le témoin.
  const ordonnes = [...fichiers].sort((a, b) => Number(a.temoin) - Number(b.temoin));
  const brouillons = new Map<string, Brouillon>();

  for (const { chemin, donnees, temoin } of ordonnes) {
    const matiereFichier = RE_MATIERE.exec(chemin);
    if (matiereFichier) {
      const matiere = matiereFichier[1] as Matiere;
      if (matiereFichier[2] === 'programme') {
        for (const ligne of validerListe(donnees, validateurs.programme, chemin, signaler)) {
          if (index.programme.has(ligne.id)) signaler(`${chemin} : ligne en double ${ligne.id}`, ligne);
          else index.programme.set(ligne.id, { ...ligne, matiere });
        }
      } else {
        const annales = valider(donnees, validateurs.annales, chemin, signaler);
        if (!annales) continue;
        const deja = index.annales.get(matiere);
        // Témoin après réel : ses sujets s'ajoutent, sans changer « complet ».
        index.annales.set(matiere, deja ? { ...deja, sujets: [...deja.sujets, ...annales.sujets] } : annales);
      }
      continue;
    }
    const chapitreFichier = RE_CHAPITRE.exec(chemin);
    if (!chapitreFichier) continue;
    const matiere = chapitreFichier[1] as Matiere;
    const slug = chapitreFichier[2] ?? '';
    const nom = chapitreFichier[3] ?? '';
    const cle = `${temoin ? 'temoin' : 'contenu'}:${matiere}:${slug}`;
    const brouillon = brouillons.get(cle) ?? { matiere, slug, temoin, listes: {} };
    brouillons.set(cle, brouillon);
    if (nom === 'meta') brouillon.meta = donnees;
    else if (nom === 'cours') brouillon.cours = donnees;
    else brouillon.listes[nom as FichierListe] = donnees;
  }

  const idsVus = new Set<string>();
  const unique = <T extends { id: string }>(items: T[], contexte: string): T[] =>
    items.filter((item) => {
      if (idsVus.has(item.id)) {
        signaler(`${contexte} : identifiant en double ${item.id}`, item);
        return false;
      }
      idsVus.add(item.id);
      return true;
    });

  for (const b of brouillons.values()) {
    const contexte = `${b.temoin ? 'témoin ' : ''}${b.matiere}/${b.slug}`;
    const meta = valider<ChapitreMeta>(b.meta, validateurs.meta, `${contexte}/meta.json`, signaler);
    if (!meta) continue;
    if (meta.slug !== b.slug || meta.matiere !== b.matiere) {
      signaler(`${contexte}/meta.json : slug ou matière ≠ dossier`, meta);
      continue;
    }
    if (index.chapitres.has(b.slug)) {
      signaler(`${contexte} : le slug ${b.slug} existe déjà (slugs uniques entre matières)`, meta);
      continue;
    }
    const liste = <T extends { id: string }>(nom: FichierListe, validate: ValidateFunction<T>): T[] =>
      b.listes[nom] === undefined
        ? []
        : unique(validerListe(b.listes[nom], validate, `${contexte}/${nom}.json`, signaler), `${contexte}/${nom}.json`);

    const notions = liste<Notion>('notions', validateurs.notions).sort((x, y) => x.ordre - y.ordre);
    const coursBrut =
      b.cours === undefined
        ? undefined
        : valider<Cours>(b.cours, validateurs.cours, `${contexte}/cours.json`, signaler);
    const cours: Cours | undefined = coursBrut && {
      ...coursBrut,
      sections: coursBrut.sections.map((s) => ({ ...s, blocs: unique(s.blocs, `${contexte}/cours.json`) })),
    };
    for (const section of cours?.sections ?? []) {
      for (const bloc of section.blocs) {
        index.blocs.set(bloc.id, { bloc, notion: section.notion, chapitre: b.slug });
      }
    }
    const chapitre: Chapitre = {
      meta,
      notions,
      ...(cours ? { cours } : {}),
      memo: liste<CarteMemo>('memo', validateurs.memo),
      exercices: liste<Exercice>('exercices', validateurs.exercices),
      flash: liste<QuestionEclair>('flash', validateurs.flash),
      typeBac: liste<ExerciceTypeBac>('type-bac', validateurs['type-bac']),
      temoin: b.temoin,
    };
    for (const notion of notions) index.notions.set(notion.id, { notion, chapitre: b.slug });
    index.chapitres.set(b.slug, chapitre);
  }

  for (const matiere of MATIERES) {
    const transverses = [...index.chapitres.values()].filter(
      (c) => c.meta.matiere === matiere && c.meta.transverse && !c.temoin
    );
    if (transverses.length > 1) {
      signaler(`${matiere} : plusieurs chapitres transverses (${transverses.map((c) => c.meta.slug).join(', ')})`);
    }
  }
  return index;
}
