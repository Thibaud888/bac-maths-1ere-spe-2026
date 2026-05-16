import type { Automatism, BacBlancPaper, ExamExercise } from './types';
import {
  formatErrors,
  validateAutomatism,
  validateBacBlancPaper,
  validateExam,
} from './validate';

const papersModules = import.meta.glob<BacBlancPaper[]>(
  '/content/bac-blanc/papers.json',
  { eager: true, import: 'default' }
);
const automatismsModules = import.meta.glob<Automatism[]>(
  '/content/bac-blanc/automatisms.json',
  { eager: true, import: 'default' }
);
const examModules = import.meta.glob<ExamExercise[]>(
  '/content/bac-blanc/exam-style.json',
  { eager: true, import: 'default' }
);

const isDev = import.meta.env.DEV;

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

function firstModule<T>(modules: Record<string, T[]>): T[] {
  const entries = Object.values(modules);
  return entries[0] ?? [];
}

const rawPapers = firstModule(papersModules);
const rawAutomatisms = firstModule(automatismsModules);
const rawExams = firstModule(examModules);

const papers = validateArray<BacBlancPaper>(
  rawPapers,
  validateBacBlancPaper,
  () => formatErrors(validateBacBlancPaper),
  'bac-blanc/papers.json'
);

const automatisms = validateArray<Automatism>(
  rawAutomatisms,
  validateAutomatism,
  () => formatErrors(validateAutomatism),
  'bac-blanc/automatisms.json'
);

const exams = validateArray<ExamExercise>(
  rawExams,
  validateExam,
  () => formatErrors(validateExam),
  'bac-blanc/exam-style.json'
);

const automatismById = new Map(automatisms.map((a) => [a.id, a]));
const examById = new Map(exams.map((e) => [e.id, e]));

export function listBacBlancPapers(): BacBlancPaper[] {
  return [...papers].sort((a, b) => a.order - b.order);
}

export function getBacBlancPaper(id: string): BacBlancPaper | null {
  return papers.find((p) => p.id === id) ?? null;
}

export function resolveAutomatisms(ids: string[]): Automatism[] {
  const out: Automatism[] = [];
  for (const id of ids) {
    const a = automatismById.get(id);
    if (a) out.push(a);
    else if (isDev) {
      throw new Error(`Bac blanc : automatisme introuvable « ${id} »`);
    }
  }
  return out;
}

export function resolveExamExercises(ids: string[]): ExamExercise[] {
  const out: ExamExercise[] = [];
  for (const id of ids) {
    const e = examById.get(id);
    if (e) out.push(e);
    else if (isDev) {
      throw new Error(`Bac blanc : exercice introuvable « ${id} »`);
    }
  }
  return out;
}
