/**
 * Types des chapitres de terminale (maths, physique-chimie).
 *
 * Miroir des schémas `schemas/terminale/` : c'est le schéma qui fait foi pour les
 * noms de champs (charte `.claude/skills/terminale-charte/SKILL.md` § 3).
 */

import type { Figure } from '../figure-types';

export type Matiere = 'maths' | 'physique-chimie';

/** 3 = Incontournable, 2 = Fréquent, 1 = Plus rare (charte § 5). */
export type Priorite = 1 | 2 | 3;

/** 1 = Comprendre, 2 = S'entraîner, 3 = Approfondir (charte § 6). */
export type Niveau = 1 | 2 | 3;

/** Programme affiché en chasse fixe, jamais passé par le rendu du texte. */
export type Code = { langage: 'python'; source: string };

// --- Référentiel ---------------------------------------------------------------

export type Rubrique =
  | 'contenu'
  | 'capacite'
  | 'demonstration'
  | 'algorithme'
  | 'experimentale'
  | 'numerique'
  | 'mathematique'
  | 'approfondissement';

/** Une ligne de `programme.json` : texte exact du Bulletin officiel. */
export type LigneProgramme = {
  id: string;
  chapitre?: string;
  partie: string;
  section: string;
  rubrique: Rubrique;
  exigible: boolean;
  texte: string;
  premiere: boolean;
};

export type AnnaleExercice = {
  numero: number;
  points: number;
  titre: string;
  capacites: string[];
  formulations: string[];
};

export type AnnaleSujet = {
  id: string;
  annee: number;
  lieu: string;
  url: string;
  programmeEvalue: 'complet' | 'partiel';
  exclus?: string[];
  exercices: AnnaleExercice[];
};

/** `annales.json` : tant que `complet` vaut false, aucune fréquence n'est publiée. */
export type Annales = { complet: boolean; depuis: number; sujets: AnnaleSujet[] };

// --- Chapitre ------------------------------------------------------------------

export type DomaineMaths = 'analyse' | 'geometrie' | 'probabilites' | 'combinatoire';
export type DomainePhysiqueChimie = 'matiere' | 'mouvement' | 'energie' | 'ondes';

export type ChapitreMeta = {
  slug: string;
  matiere: Matiere;
  titre: string;
  titreCourt: string;
  /** Absent pour le chapitre transverse « Méthodes ». */
  domaine?: DomaineMaths | DomainePhysiqueChimie;
  ordre: number;
  transverse: boolean;
  description: string;
  essentiel: string[];
};

export type Notion = {
  id: string;
  chapitre: string;
  titre: string;
  ordre: number;
  priorite: Priorite;
  priorisation: 'annales' | 'estimation';
  pourquoi: string;
  capacites: string[];
  /** Notions antérieures (`n-…`) ou chapitres de maths de première (`1e:<slug>`). */
  prerequis: string[];
  attendusBac: string[];
};

// --- Réponses vérifiables (charte § 3.6) ------------------------------------------

export type ReponseQcm = {
  type: 'qcm';
  choix: string[];
  bonne: number;
  /** Un message par choix, `null` pour le bon. */
  pourquoiFaux?: (string | null)[];
};
export type ReponseQcmMultiple = { type: 'qcm-multiple'; choix: string[]; bonnes: number[] };
export type ReponseVraiFaux = { type: 'vrai-faux'; valeur: boolean; justification: string };
export type ReponseNumerique = {
  type: 'numerique';
  /** Nombre, ou fraction « a/b ». */
  valeur: number | string;
  tolerance?: number;
  toleranceRelative?: number;
  unite?: string;
  chiffresSignificatifs?: number;
};
export type ReponseOrdre = { type: 'ordre'; elements: string[] };
export type ReponseRedaction = { type: 'redaction' };

/** Réponse contrôlée automatiquement : « vérifie », questions éclair, marche 1. */
export type ReponseVerifiable =
  | ReponseQcm
  | ReponseQcmMultiple
  | ReponseVraiFaux
  | ReponseNumerique
  | ReponseOrdre;
export type Reponse = ReponseVerifiable | ReponseRedaction;

export type QuestionVerifiable = {
  enonce: string;
  code?: Code;
  reponse: ReponseVerifiable;
  explication: string;
};

// --- Cours (charte §§ 3.5, 4.2) ----------------------------------------------------

export type Etape = { texte: string; pourquoi?: string };

type BlocBase<T extends string> = {
  id: string;
  type: T;
  titre?: string;
  capacites?: string[];
};

export type BlocIdee = BlocBase<'idee'> & { texte: string };
export type BlocDefinition = BlocBase<'definition'> & { titre: string; texte: string; capacites: string[] };
export type BlocPropriete = BlocBase<'propriete'> & {
  titre: string;
  texte: string;
  conditions: string[];
  admise: boolean;
  capacites: string[];
};
export type BlocDemonstration = BlocBase<'demonstration'> & {
  /** Identifiant du bloc `propriete` démontré. */
  de: string;
  exigible: boolean;
  etapes: Etape[];
  capacites: string[];
};
export type BlocExemple = BlocBase<'exemple'> & {
  titre: string;
  enonce: string;
  etapes: Etape[];
  code?: Code;
  capacites: string[];
};
export type BlocMethode = BlocBase<'methode'> & {
  titre: string;
  etapes: string[];
  /** Identifiant d'un bloc `exemple`. */
  exemple?: string;
  code?: Code;
  capacites: string[];
};
export type BlocCode = BlocBase<'code'> & { titre: string; code: Code; texte: string; capacites: string[] };
export type BlocPiege = BlocBase<'piege'> & { faux: string; juste: string; explication: string };
export type BlocRetenir = BlocBase<'retenir'> & { texte: string };
/** `lien` : `n-…` (notion), `l-…` (bloc) ou `1e:<slug>` (chapitre de maths de première). */
export type BlocRappel = BlocBase<'rappel'> & { texte: string; lien?: string };
export type BlocVerifie = BlocBase<'verifie'> & { question: QuestionVerifiable };
export type BlocFigure = BlocBase<'figure'> & { figure: Figure };
export type BlocAnime = BlocBase<'anime'> & {
  widget: string;
  parametres: Record<string, unknown>;
  consigne: string;
};
export type BlocExperience = BlocBase<'experience'> & {
  titre: string;
  protocole: string;
  observation: string;
  interpretation: string;
  capacites: string[];
};
export type BlocComplement = BlocBase<'complement'> & { titre: string; texte: string; capacites: string[] };
/** « Et en physique ? » / « Et en maths ? » : `capacites` = lignes de l'autre matière. */
export type BlocLienMatiere = BlocBase<'lien-matiere'> & {
  matiere: Matiere;
  texte: string;
  lien?: string;
  capacites: string[];
};

export type Bloc =
  | BlocIdee
  | BlocDefinition
  | BlocPropriete
  | BlocDemonstration
  | BlocExemple
  | BlocMethode
  | BlocCode
  | BlocPiege
  | BlocRetenir
  | BlocRappel
  | BlocVerifie
  | BlocFigure
  | BlocAnime
  | BlocExperience
  | BlocComplement
  | BlocLienMatiere;

export type TypeBloc = Bloc['type'];

export type SectionCours = { notion: string; blocs: Bloc[] };
export type Cours = { chapitre: string; sections: SectionCours[] };

// --- Exercices, type bac, mémo, questions éclair (charte §§ 3.7-3.9) --------------------

/** Exercice adapté d'un vrai sujet : `annale` (index) ou `url` (sujet officiel). */
export type SourceExercice = { annale?: string; url?: string; adaptation: string };

export type QuestionExercice = {
  id: string;
  label: string;
  enonce: string;
  code?: Code;
  reponse?: Reponse;
  indices?: string[];
  /** Bloc de cours à revoir. */
  revoir?: string;
  solution: string;
  erreurFrequente?: string;
};

export type Exercice = {
  id: string;
  chapitre: string;
  niveau: Niveau;
  /** `notions[0]` : la notion principale. */
  notions: string[];
  capacites: string[];
  titre: string;
  /** En minutes. */
  duree: number;
  calculatrice: boolean;
  ordre: number;
  preambule?: string;
  code?: Code;
  figure?: Figure;
  source?: SourceExercice;
  questions: QuestionExercice[];
};

export type SousQuestionTypeBac = {
  id: string;
  label: string;
  enonce: string;
  code?: Code;
  points: number;
  reponse?: Reponse;
  indices?: string[];
  revoir?: string;
  attenduCorrecteur: string;
  solution: string;
  erreurFrequente?: string;
};

/** Avec `sousQuestions`, la question n'a ni `solution` ni `attenduCorrecteur` propres. */
export type QuestionTypeBac = {
  id: string;
  label: string;
  enonce: string;
  code?: Code;
  points: number;
  sousQuestions?: SousQuestionTypeBac[];
  reponse?: Reponse;
  indices?: string[];
  revoir?: string;
  attenduCorrecteur?: string;
  solution?: string;
  erreurFrequente?: string;
};

export type ExerciceTypeBac = {
  id: string;
  chapitre: string;
  notions: string[];
  capacites: string[];
  titre: string;
  points: number;
  duree: number;
  calculatrice: boolean;
  ordre: number;
  preambule?: string;
  code?: Code;
  figure?: Figure;
  source?: SourceExercice;
  questions: QuestionTypeBac[];
};

export type CarteMemo = {
  id: string;
  chapitre: string;
  notion: string;
  genre: 'definition' | 'propriete' | 'formule' | 'methode';
  titre: string;
  enonce: string;
  conditions?: string;
  exemple?: string;
  simplifie: { coeur: string; moyenMemo?: string; motCle?: string; image?: string };
};

export type QuestionEclair = {
  id: string;
  chapitre: string;
  notion: string;
  capacites: string[];
  enonce: string;
  code?: Code;
  reponse: ReponseVerifiable;
  explication: string;
  /** En secondes (≤ 60). */
  duree: number;
};

/** Un chapitre chargé et validé, prêt pour les pages. */
export type Chapitre = {
  meta: ChapitreMeta;
  /** Triées par `ordre` (ordre logique du cours). */
  notions: Notion[];
  cours?: Cours;
  memo: CarteMemo[];
  exercices: Exercice[];
  flash: QuestionEclair[];
  typeBac: ExerciceTypeBac[];
  /** true pour le chapitre-témoin (tests/fixtures/terminale/, développement seulement). */
  temoin: boolean;
};
