import type {
  EntretienQuestion,
  Fiche,
  FlashcardDeck,
  FrenchExercise,
  FrenchModuleContent,
  FrenchModuleMeta,
  FrenchModuleSlug,
  FrenchSubject,
  OralContent,
  OralFiche,
  OralMeta,
  OralText,
  QuizItem,
} from './french-types';
import {
  formatFrenchErrors,
  validateEntretienQuestion,
  validateFiche,
  validateFlashcardDeck,
  validateFrenchExercise,
  validateFrenchSubject,
  validateOralFiche,
  validateOralMeta,
  validateOralQuiz,
  validateOralText,
  validateQuiz,
} from './french-validate';

const metaModules = import.meta.glob<FrenchModuleMeta>(
  '/content/francais/*/meta.json',
  { eager: true, import: 'default' }
);
const ficheModules = import.meta.glob<Fiche[]>(
  '/content/francais/*/fiches.json',
  { eager: true, import: 'default' }
);
const quizModules = import.meta.glob<QuizItem[]>(
  '/content/francais/*/quiz.json',
  { eager: true, import: 'default' }
);
const exerciceModules = import.meta.glob<FrenchExercise[]>(
  '/content/francais/*/exercices.json',
  { eager: true, import: 'default' }
);
const sujetModules = import.meta.glob<FrenchSubject[]>(
  '/content/francais/*/sujets.json',
  { eager: true, import: 'default' }
);
const deckModules = import.meta.glob<FlashcardDeck>(
  '/content/francais/express/deck-*.json',
  { eager: true, import: 'default' }
);

// --- Oral EAF : espace spécial (globs dédiés, jamais des noms de fichiers
// modules — meta/fiches/quiz/exercices/sujets — pour éviter toute collision).
const oralMetaModule = import.meta.glob<OralMeta>(
  '/content/francais/oral/oral-meta.json',
  { eager: true, import: 'default' }
);
const oralEpreuveModule = import.meta.glob<OralFiche[]>(
  '/content/francais/oral/epreuve.json',
  { eager: true, import: 'default' }
);
const oralMethodeModule = import.meta.glob<OralFiche[]>(
  '/content/francais/oral/methode.json',
  { eager: true, import: 'default' }
);
const oralTextesModule = import.meta.glob<OralText[]>(
  '/content/francais/oral/textes.json',
  { eager: true, import: 'default' }
);
const oralGrammaireFichesModule = import.meta.glob<OralFiche[]>(
  '/content/francais/oral/grammaire-fiches.json',
  { eager: true, import: 'default' }
);
const oralGrammaireQuizModule = import.meta.glob<QuizItem[]>(
  '/content/francais/oral/grammaire-quiz.json',
  { eager: true, import: 'default' }
);
const oralEntretienModule = import.meta.glob<EntretienQuestion[]>(
  '/content/francais/oral/entretien.json',
  { eager: true, import: 'default' }
);

const isDev = import.meta.env.DEV;

function slugFromPath(path: string): FrenchModuleSlug {
  const match = /\/content\/francais\/([^/]+)\//.exec(path);
  if (!match || !match[1]) {
    throw new Error(`Impossible d'extraire le slug du chemin ${path}`);
  }
  return match[1] as FrenchModuleSlug;
}

function buildSlugMap<T>(modules: Record<string, T>): Map<FrenchModuleSlug, T> {
  const map = new Map<FrenchModuleSlug, T>();
  for (const [path, value] of Object.entries(modules)) {
    map.set(slugFromPath(path), value);
  }
  return map;
}

function validateArray<T>(
  items: unknown[],
  validator: (data: unknown) => boolean,
  formatter: () => string,
  context: string
): T[] {
  const valid: T[] = [];
  for (const item of items) {
    if (validator(item)) {
      valid.push(item as T);
    } else {
      const message = `${context} : item invalide — ${formatter()}`;
      if (isDev) {
        throw new Error(message);
      }
      console.warn(message, item);
    }
  }
  return valid;
}

const metaBySlug = buildSlugMap(metaModules);
const fichesBySlug = buildSlugMap(ficheModules);
const quizBySlug = buildSlugMap(quizModules);
const exercicesBySlug = buildSlugMap(exerciceModules);
const sujetsBySlug = buildSlugMap(sujetModules);

export function listFrenchModules(): FrenchModuleMeta[] {
  return [...metaBySlug.values()].sort((a, b) => a.order - b.order);
}

export function getFrenchModuleContent(
  slug: FrenchModuleSlug
): FrenchModuleContent | null {
  const meta = metaBySlug.get(slug);
  if (!meta) return null;

  const rawFiches = fichesBySlug.get(slug) ?? [];
  const rawQuiz = quizBySlug.get(slug) ?? [];
  const rawExercices = exercicesBySlug.get(slug) ?? [];
  const rawSujets = sujetsBySlug.get(slug) ?? [];

  return {
    meta,
    fiches: validateArray<Fiche>(
      rawFiches,
      validateFiche,
      () => formatFrenchErrors(validateFiche),
      `fiches[${slug}]`
    ),
    quiz: validateArray<QuizItem>(
      rawQuiz,
      validateQuiz,
      () => formatFrenchErrors(validateQuiz),
      `quiz[${slug}]`
    ),
    exercices: validateArray<FrenchExercise>(
      rawExercices,
      validateFrenchExercise,
      () => formatFrenchErrors(validateFrenchExercise),
      `exercices[${slug}]`
    ),
    sujets: validateArray<FrenchSubject>(
      rawSujets,
      validateFrenchSubject,
      () => formatFrenchErrors(validateFrenchSubject),
      `sujets[${slug}]`
    ),
  };
}

export function frenchModuleExists(slug: string): slug is FrenchModuleSlug {
  return metaBySlug.has(slug as FrenchModuleSlug);
}

export function getExpressDecks(): FlashcardDeck[] {
  const decks: FlashcardDeck[] = [];
  for (const [path, deck] of Object.entries(deckModules)) {
    if (validateFlashcardDeck(deck)) {
      decks.push(deck);
    } else {
      const message = `flashcard deck invalide (${path}) — ${formatFrenchErrors(validateFlashcardDeck)}`;
      if (isDev) throw new Error(message);
      console.warn(message, deck);
    }
  }
  return decks.sort((a, b) => a.order - b.order);
}

// --- Oral EAF -------------------------------------------------------------

// `import.meta.glob` renvoie {} quand aucun fichier ne correspond : tous les
// accesseurs ci-dessous tolèrent l'absence de contenu (empty-states).
function firstValue<T>(modules: Record<string, T>): T | null {
  for (const value of Object.values(modules)) return value;
  return null;
}

function sortByOrder<T extends { order?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getOralContent(): OralContent {
  const rawMeta = firstValue(oralMetaModule);
  const meta =
    rawMeta && validateOralMeta(rawMeta) ? rawMeta : null;

  const epreuve = sortByOrder(
    validateArray<OralFiche>(
      firstValue(oralEpreuveModule) ?? [],
      validateOralFiche,
      () => formatFrenchErrors(validateOralFiche),
      'oral/epreuve'
    )
  );
  const methode = sortByOrder(
    validateArray<OralFiche>(
      firstValue(oralMethodeModule) ?? [],
      validateOralFiche,
      () => formatFrenchErrors(validateOralFiche),
      'oral/methode'
    )
  );
  const textes = sortByOrder(
    validateArray<OralText>(
      firstValue(oralTextesModule) ?? [],
      validateOralText,
      () => formatFrenchErrors(validateOralText),
      'oral/textes'
    )
  );
  const grammaireFiches = sortByOrder(
    validateArray<OralFiche>(
      firstValue(oralGrammaireFichesModule) ?? [],
      validateOralFiche,
      () => formatFrenchErrors(validateOralFiche),
      'oral/grammaire-fiches'
    )
  );
  const grammaireQuiz = validateArray<QuizItem>(
    firstValue(oralGrammaireQuizModule) ?? [],
    validateOralQuiz,
    () => formatFrenchErrors(validateOralQuiz),
    'oral/grammaire-quiz'
  );
  const entretien = sortByOrder(
    validateArray<EntretienQuestion>(
      firstValue(oralEntretienModule) ?? [],
      validateEntretienQuestion,
      () => formatFrenchErrors(validateEntretienQuestion),
      'oral/entretien'
    )
  );

  return { meta, epreuve, methode, textes, grammaireFiches, grammaireQuiz, entretien };
}

export function getOralTextes(): OralText[] {
  return getOralContent().textes;
}

export function getOralText(id: string): OralText | null {
  return getOralTextes().find((t) => t.id === id) ?? null;
}
