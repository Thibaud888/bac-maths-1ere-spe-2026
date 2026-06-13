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
  simplified?: FicheSimplified;
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

/** Un mouvement résumé en une phrase, pour la vue « Essentiel ». */
export type OralEssentielMouvement = {
  titre: string;
  phrase: string;
};

/**
 * Couche simplifiée d'un texte (« ce que je dois dire ») destinée à un élève
 * en difficulté : l'indispensable, en mots simples. La version détaillée
 * (projetLecture / mouvements / conclusion) reste inchangée.
 */
export type OralEssentiel = {
  enBref: string;
  problematique: string;
  mouvementsCles: OralEssentielMouvement[];
  conclusion: string;
  aRetenir?: string[];
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
  essentiel?: OralEssentiel;
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
  reponseEssentielle?: string;
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

export type OralOeuvrePersonnage = {
  nom: string;
  role: string;
  description?: string;
};

export type OralOeuvreTheme = {
  titre: string;
  developpement: string;
};

export type OralOeuvrePassage = {
  titre: string;
  situation: string;
  interet: string;
  reference?: string;
};

export type OralOeuvreArgument = {
  argumentaire: string;
  pistes?: string[];
};

/** Un sous-point titré du fil de présentation de l'œuvre (Auteur, Intrigue…). */
export type OralFilSegment = {
  titre: string;
  contenu: string;
};

export type OralOeuvrePresentation = {
  pourquoiCeChoix: OralOeuvreArgument;
  fil: OralFilSegment[];
  jugementPersonnel: OralOeuvreArgument;
};

export type OralOeuvreOuverture = {
  type?: string;
  cible: string;
  lien: string;
};

/**
 * Dossier de l'œuvre choisie par l'élève pour la 2ᵈᵉ partie de l'oral (8 pts).
 * Un objet par élève, sous `content/francais/oral/eleves/<id>/oeuvre.json`.
 * Si `domainePublic` est `false`, aucune citation longue (collage local au
 * runtime, jamais commité).
 */
export type OralOeuvre = {
  oeuvre: string;
  auteur: string;
  date?: string;
  genre?: string;
  editeur?: string;
  distinction?: string;
  parcours?: string;
  domainePublic: boolean;
  accroche?: string;
  auteurNotice?: string;
  contexte?: string;
  resume?: string;
  structure?: string;
  personnages?: OralOeuvrePersonnage[];
  themes?: OralOeuvreTheme[];
  passagesCles?: OralOeuvrePassage[];
  presentationOrale: OralOeuvrePresentation;
  ouvertures?: OralOeuvreOuverture[];
  accent?: FrenchAccent;
  tags?: string[];
};

/** Une œuvre intégrale au programme d'un élève (affichage + repère entretien). */
export type OralStudentOeuvre = {
  oeuvre: string;
  auteur?: string;
  parcours?: string;
};

/**
 * Profil d'un élève : identité + contexte. Son descriptif oral (textes et
 * entretien) vit sous `content/francais/oral/eleves/<id>/` et n'est partagé
 * avec aucun autre élève. Le reste de l'oral (épreuve, méthode, grammaire) est
 * commun à tous.
 */
export type OralStudent = {
  id: string;
  nom: string;
  parcours?: string;
  contexte?: string;
  oeuvres?: OralStudentOeuvre[];
  accent?: FrenchAccent;
  order?: number;
};

/**
 * Contenu oral **commun** à tous les élèves (épreuve, méthode, grammaire).
 * Les `textes` et `entretien`, propres à chaque élève, sont chargés séparément
 * via `getOralStudentTextes` / `getOralStudentEntretien`.
 */
export type OralContent = {
  meta: OralMeta | null;
  epreuve: OralFiche[];
  methode: OralFiche[];
  grammaireFiches: OralFiche[];
  grammaireQuiz: QuizItem[];
};
