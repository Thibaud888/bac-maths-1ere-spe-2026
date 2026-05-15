import type { Figure } from './figure-types';

export type { Figure } from './figure-types';

export type ChapterSlug =
  | 'suites'
  | 'second-degre'
  | 'derivation'
  | 'exponentielle'
  | 'trigonometrie'
  | 'produit-scalaire'
  | 'geometrie-reperee'
  | 'probas-cond'
  | 'variables-aleatoires';

export type Domain = 'algebre' | 'analyse' | 'geometrie' | 'probabilites';

export type AutomatismDomain =
  | 'calcul-numerique-algebrique'
  | 'proportions-pourcentages'
  | 'evolutions-variations'
  | 'fonctions-representations'
  | 'statistiques'
  | 'probabilites';

export type Difficulty = 1 | 2 | 3;
export type FormulaLevel = 'essentiel' | 'a-connaitre' | 'approfondissement';
export type FormulaSimplifiedAccent =
  | 'red' | 'blue' | 'amber' | 'emerald' | 'violet' | 'slate';

export type FormulaSimplified = {
  core: string;
  mnemonic?: string;
  keyword?: string;
  visual?: string;
  accent?: FormulaSimplifiedAccent;
};

export type ChapterMeta = {
  slug: ChapterSlug;
  title: string;
  shortTitle?: string;
  domain: Domain;
  order: number;
  description?: string;
};

export type Formula = {
  id: string;
  chapter: ChapterSlug;
  domain: Domain;
  title: string;
  statement: string;
  conditions?: string;
  example?: string;
  tags?: string[];
  order?: number;
  level: FormulaLevel;
  relatedFormulas?: string[];
  simplified?: FormulaSimplified;
};

export type Automatism = {
  id: string;
  chapter?: ChapterSlug | 'transverse';
  domain: AutomatismDomain;
  type: 'qcm' | 'numeric';
  statement: string;
  choices?: string[];
  answer: number | string;
  tolerance?: number;
  explanation: string;
  difficulty: Difficulty;
  timeLimitSeconds?: number;
  tags?: string[];
  figure?: Figure;
};

export type ClassicQuestion = {
  id: string;
  label: string;
  statement: string;
  hints: string[];
  expectedAnswer?: string;
  solution: string;
  figure?: Figure;
};

export type ClassicExercise = {
  id: string;
  chapter: ChapterSlug;
  title: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  prerequisites?: string[];
  preamble?: string;
  figure?: Figure;
  questions: ClassicQuestion[];
  tags?: string[];
  order?: number;
};

export type ExamSubquestion = {
  id: string;
  label: string;
  statement: string;
  marks?: number;
  hints: string[];
  expectedAnswer?: string;
  solution: string;
  figure?: Figure;
};

export type ExamQuestion = {
  id: string;
  label: string;
  statement: string;
  marks: number;
  subquestions?: ExamSubquestion[];
  hints: string[];
  expectedAnswer?: string;
  solution: string;
  figure?: Figure;
};

export type ExamExercise = {
  id: string;
  chapter: ChapterSlug | 'transverse';
  title: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  totalMarks: number;
  inspiredBy?: string;
  preamble?: string;
  figure?: Figure;
  questions: ExamQuestion[];
  tags?: string[];
  order?: number;
};

export type ChapterContent = {
  meta: ChapterMeta;
  formulas: Formula[];
  automatisms: Automatism[];
  classics: ClassicExercise[];
  examStyle: ExamExercise[];
};
