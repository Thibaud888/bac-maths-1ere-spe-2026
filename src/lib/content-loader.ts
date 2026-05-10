import type {
  Automatism,
  ChapterContent,
  ChapterMeta,
  ChapterSlug,
  ClassicExercise,
  ExamExercise,
  Formula,
} from './types';
import {
  formatErrors,
  validateAutomatism,
  validateClassic,
  validateExam,
  validateFormula,
} from './validate';

const metaModules = import.meta.glob<ChapterMeta>('/content/chapters/*/meta.json', {
  eager: true,
  import: 'default',
});
const formulaModules = import.meta.glob<Formula[]>(
  '/content/chapters/*/formulas.json',
  { eager: true, import: 'default' }
);
const automatismModules = import.meta.glob<Automatism[]>(
  '/content/chapters/*/automatisms.json',
  { eager: true, import: 'default' }
);
const classicModules = import.meta.glob<ClassicExercise[]>(
  '/content/chapters/*/classics.json',
  { eager: true, import: 'default' }
);
const examModules = import.meta.glob<ExamExercise[]>(
  '/content/chapters/*/exam-style.json',
  { eager: true, import: 'default' }
);

const isDev = import.meta.env.DEV;

function slugFromPath(path: string): ChapterSlug {
  const match = /\/content\/chapters\/([^/]+)\//.exec(path);
  if (!match || !match[1]) {
    throw new Error(`Impossible d'extraire le slug du chemin ${path}`);
  }
  return match[1] as ChapterSlug;
}

function buildSlugMap<T>(modules: Record<string, T>): Map<ChapterSlug, T> {
  const map = new Map<ChapterSlug, T>();
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
const formulasBySlug = buildSlugMap(formulaModules);
const automatismsBySlug = buildSlugMap(automatismModules);
const classicsBySlug = buildSlugMap(classicModules);
const examsBySlug = buildSlugMap(examModules);

export function listChapters(): ChapterMeta[] {
  return [...metaBySlug.values()].sort((a, b) => a.order - b.order);
}

export function getChapterContent(slug: ChapterSlug): ChapterContent | null {
  const meta = metaBySlug.get(slug);
  if (!meta) return null;

  const rawFormulas = formulasBySlug.get(slug) ?? [];
  const rawAutomatisms = automatismsBySlug.get(slug) ?? [];
  const rawClassics = classicsBySlug.get(slug) ?? [];
  const rawExams = examsBySlug.get(slug) ?? [];

  return {
    meta,
    formulas: validateArray<Formula>(
      rawFormulas,
      validateFormula,
      () => formatErrors(validateFormula),
      `formulas[${slug}]`
    ),
    automatisms: validateArray<Automatism>(
      rawAutomatisms,
      validateAutomatism,
      () => formatErrors(validateAutomatism),
      `automatisms[${slug}]`
    ),
    classics: validateArray<ClassicExercise>(
      rawClassics,
      validateClassic,
      () => formatErrors(validateClassic),
      `classics[${slug}]`
    ),
    examStyle: validateArray<ExamExercise>(
      rawExams,
      validateExam,
      () => formatErrors(validateExam),
      `examStyle[${slug}]`
    ),
  };
}

export function chapterExists(slug: string): slug is ChapterSlug {
  return metaBySlug.has(slug as ChapterSlug);
}
