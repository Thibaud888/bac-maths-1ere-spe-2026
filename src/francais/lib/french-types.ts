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

/**
 * Sous-ensemble structurel des champs réellement affichés par `FicheCard`.
 * Permet de réutiliser la carte aussi bien pour les fiches écrit (`Fiche`)
 * que pour les fiches oral (`OralFiche`), qui n'ont pas de `module`.
 */
export type FicheLike = {
  id: string;
  title: string;
  statement: string;
  example?: string;
  tags?: string[];
  level: FrenchLevel;
};

export type QuizType = 'qcm' | 'multi' | 'ordering';

export type QuizCategory =
  | 'figures'
  | 'mouvements'
  | 'registres'
  | 'genres'
  | 'methode'
  | 'culture'
  | 'grammaire';

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

export type FrenchSubjectType = 'commentaire' | 'dissertation';

export type FrenchSubjectStep = {
  id: string;
  label: string;
  statement: string;
  hints: string[];
  expectedAnswer?: string;
  solution: string;
};

export type FrenchSubject = {
  id: string;
  module: FrenchModuleSlug;
  type: FrenchSubjectType;
  title: string;
  oeuvre: string;
  parcours?: string;
  difficulty: 1 | 2 | 3;
  estimatedMinutes: number;
  consigne: string;
  extract?: string;
  extractSource?: string;
  methodeRappel?: string;
  steps: FrenchSubjectStep[];
  tags?: string[];
  order?: number;
};

export type FrenchModuleContent = {
  meta: FrenchModuleMeta;
  fiches: Fiche[];
  quiz: QuizItem[];
  exercices: FrenchExercise[];
  sujets: FrenchSubject[];
};

export type Flashcard = {
  id: string;
  deck: string;
  front: string;
  back: string;
  mnemonic?: string;
  accent?: FrenchAccent;
  tags?: string[];
};

export type FlashcardDeck = {
  slug: string;
  title: string;
  description: string;
  accent: FrenchAccent;
  order: number;
  estimatedMinutes: number;
  cards: Flashcard[];
};

// --- Oral EAF -------------------------------------------------------------

/** Fiche oral (épreuve, méthode, grammaire) : comme `Fiche`, sans `module`. */
export type OralFiche = {
  id: string;
  category: FicheCategory;
  title: string;
  statement: string;
  example?: string;
  tags?: string[];
  order?: number;
  level: FrenchLevel;
  simplified?: FicheSimplified;
};

export type GrammairePoint =
  | 'subordonnee-relative'
  | 'subordonnee-completive'
  | 'subordonnee-circonstancielle'
  | 'interrogation'
  | 'negation';

export type OralAnalyse = {
  citation?: string;
  procede: string;
  effet: string;
};

export type OralMouvement = {
  id: string;
  titre: string;
  bornes: string;
  idee: string;
  analyses: OralAnalyse[];
};

export type OralProjetLecture = {
  accroche?: string;
  situation: string;
  problematique: string;
  annonceMouvements: string;
};

export type OralQuestionGrammaire = {
  point: GrammairePoint;
  enonce: string;
  corrige: string;
};

export type OralText = {
  id: string;
  oeuvre: string;
  auteur: string;
  titre: string;
  parcours?: string;
  dateOeuvre?: string;
  domainePublic: boolean;
  textSource?: string;
  text?: string;
  lectureExpressive?: { conseils: string };
  projetLecture: OralProjetLecture;
  mouvements: OralMouvement[];
  conclusion: { bilan: string; ouverture: string };
  questionGrammaire: OralQuestionGrammaire;
  level?: FrenchLevel;
  accent?: FrenchAccent;
  order?: number;
  tags?: string[];
};

export type EntretienCategory =
  | 'choix-oeuvre'
  | 'comprehension'
  | 'interpretation'
  | 'gout-personnel'
  | 'culture'
  | 'ouverture';

export type EntretienQuestion = {
  id: string;
  oeuvre: string;
  auteur?: string;
  question: string;
  category: EntretienCategory;
  pistes?: string[];
  difficulty?: 1 | 2 | 3;
  order?: number;
  tags?: string[];
};

export type OralMeta = {
  title: string;
  description?: string;
  epreuveResume?: string;
  accent?: FrenchAccent;
};

export type OralContent = {
  meta: OralMeta | null;
  epreuve: OralFiche[];
  methode: OralFiche[];
  textes: OralText[];
  grammaireFiches: OralFiche[];
  grammaireQuiz: QuizItem[];
  entretien: EntretienQuestion[];
};
