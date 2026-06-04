import type {
  Fiche,
  FlashcardDeck,
  FrenchExercise,
  FrenchModuleContent,
  FrenchModuleMeta,
  FrenchModuleSlug,
  FrenchSubject,
  QuizItem,
} from './french-types';
import {
  formatFrenchErrors,
  validateFiche,
  validateFlashcardDeck,
  validateFrenchExercise,
  validateFrenchSubject,
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
