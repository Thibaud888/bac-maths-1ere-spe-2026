export type FrenchModuleSlug =
  | 'methode-commentaire'
  | 'methode-dissertation'
  | 'figures-de-style'
  | 'mouvements-litteraires'
  | 'registres-genres'
  | 'poesie'
  | 'litterature-idees'
  | 'roman'
  | 'theatre';

export type FrenchFamily = 'methode' | 'reperes' | 'objet-etude';

export type FicheCategory =
  | 'methode'
  | 'figure'
  | 'mouvement'
  | 'registre'
  | 'genre'
  | 'notion';

export type FrenchLevel = 'essentiel' | 'a-connaitre' | 'approfondissement';

export type FrenchAccent =
  | 'red' | 'blue' | 'amber' | 'emerald' | 'violet' | 'slate';

export type FicheSimplified = {
  core: string;
  mnemonic?: string;
  keyword?: string;
  accent?: FrenchAccent;
};

export type FrenchModuleMeta = {
  slug: FrenchModuleSlug;
  title: string;
  shortTitle?: string;
  family: FrenchFamily;
  order: number;
  description?: string;
};

export type Fiche = {
  id: string;
  module: FrenchModuleSlug;
  category: FicheCategory;
  title: string;
  statement: string;
  example?: string;
  tags?: string[];
  order?: number;
  level: FrenchLevel;
  simplified?: FicheSimplified;
};

export type QuizType = 'qcm' | 'multi' | 'ordering';

export type QuizCategory =
  | 'figures'
  | 'mouvements'
  | 'registres'
  | 'genres'
  | 'methode'
  | 'culture';

export type QuizItem = {
  id: string;
  module?: FrenchModuleSlug | 'transverse';
  category: QuizCategory;
  type: QuizType;
  statement: string;
  choices?: string[];
  answer?: number;
  answers?: number[];
  items?: string[];
  explanation: string;
  difficulty: 1 | 2 | 3;
  timeLimitSeconds?: number;
  tags?: string[];
};

export type FrenchQuestion = {
  id: string;
  label: string;
  statement: string;
  hints: string[];
  expectedAnswer?: string;
  solution: string;
};

export type FrenchExercise = {
  id: string;
  module: FrenchModuleSlug;
  title: string;
  difficulty: 1 | 2 | 3;
  estimatedMinutes: number;
  preamble?: string;
  extract?: string;
  extractSource?: string;
  questions: FrenchQuestion[];
  tags?: string[];
  order?: number;
};

export type FrenchModuleContent = {
  meta: FrenchModuleMeta;
  fiches: Fiche[];
  quiz: QuizItem[];
  exercices: FrenchExercise[];
};
