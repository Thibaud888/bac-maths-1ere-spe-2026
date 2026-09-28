import type { Resultat } from './progression';
import type {
  Exercice,
  ExerciceTypeBac,
  Niveau,
  Priorite,
  QuestionEclair,
  QuestionTypeBac,
} from './types';

/**
 * Logique des pages d'entraînement (exercices en trois marches, type bac, questions
 * éclair) : pure et testée. Les pages lui passent les priorités des notions.
 */

export const MARCHES: readonly { niveau: Niveau; nom: string; but: string }[] = [
  { niveau: 1, nom: 'Comprendre', but: 'Vérifier une notion juste après le cours.' },
  { niveau: 2, nom: 'S’entraîner', but: 'Appliquer une méthode du cours, avec des indices.' },
  { niveau: 3, nom: 'Approfondir', but: 'Combiner plusieurs notions, prendre une initiative.' },
];

export function nomMarche(niveau: Niveau): string {
  return MARCHES.find((m) => m.niveau === niveau)?.nom ?? '';
}

/** Note d'une question : 1 réussie, ½ à moitié, 0 ratée. */
export const NOTE: Record<Resultat, number> = { reussi: 1, moitie: 0.5, rate: 0 };

/** Résultat d'une part réussie (entre 0 et 1) : réussi dès 80 %, à moitié dès 40 %. */
export function resultatDePart(part: number): Resultat {
  if (part >= 0.8 - 1e-9) return 'reussi';
  if (part >= 0.4 - 1e-9) return 'moitie';
  return 'rate';
}

/**
 * Résultat d'un exercice à partir de ses questions : `undefined` tant qu'une question
 * n'a pas de résultat, sinon la moyenne des notes.
 */
export function resultatExercice(
  questions: readonly string[],
  resultats: Readonly<Record<string, Resultat>>
): Resultat | undefined {
  if (questions.length === 0) return undefined;
  const notes = questions.map((id) => resultats[id]);
  if (notes.some((n) => n === undefined)) return undefined;
  const somme = notes.reduce((s, n) => s + NOTE[n as Resultat], 0);
  return resultatDePart(somme / questions.length);
}

/** Les éléments notés d'un exercice type bac : questions, ou leurs sous-questions. */
export function elementsNotes(questions: readonly QuestionTypeBac[]): { id: string; points: number }[] {
  return questions.flatMap((q) =>
    q.sousQuestions && q.sousQuestions.length > 0
      ? q.sousQuestions.map((s) => ({ id: `${q.id}.${s.id}`, points: s.points }))
      : [{ id: q.id, points: q.points }]
  );
}

/** Points estimés d'un exercice type bac, d'après l'auto-évaluation de chaque élément. */
export function pointsTypeBac(
  exercice: Pick<ExerciceTypeBac, 'questions'>,
  resultats: Readonly<Record<string, Resultat>>
): { obtenus: number; total: number; complet: boolean } {
  const elements = elementsNotes(exercice.questions);
  const total = elements.reduce((s, e) => s + e.points, 0);
  const obtenus = elements.reduce((s, e) => {
    const r = resultats[e.id];
    return s + (r ? NOTE[r] * e.points : 0);
  }, 0);
  return { obtenus, total, complet: elements.every((e) => resultats[e.id] !== undefined) };
}

/** Filtre des exercices : une marche, une notion (citée par l'exercice). */
export function filtrerExercices(
  exercices: readonly Exercice[],
  filtre: { niveau?: Niveau | undefined; notion?: string | undefined }
): Exercice[] {
  return exercices.filter(
    (x) =>
      (filtre.niveau === undefined || x.niveau === filtre.niveau) &&
      (filtre.notion === undefined || x.notions.includes(filtre.notion))
  );
}

/**
 * Ordre dans une marche (charte § 6) : priorité de la notion principale décroissante,
 * puis `ordre`, puis durée croissante (la difficulté suit la durée).
 */
export function trierExercices<T extends Pick<Exercice, 'notions' | 'ordre' | 'duree'>>(
  exercices: readonly T[],
  priorite: (notion: string | undefined) => Priorite
): T[] {
  return exercices
    .map((x, rang) => ({ x, rang, p: priorite(x.notions[0]) }))
    .sort((a, b) => b.p - a.p || a.x.ordre - b.x.ordre || a.x.duree - b.x.duree || a.rang - b.rang)
    .map(({ x }) => x);
}

/** Questions éclair d'une série : les plus importantes d'abord, puis l'ordre du fichier. */
export function serieEclair(
  questions: readonly QuestionEclair[],
  priorite: (notion: string) => Priorite
): QuestionEclair[] {
  return questions
    .map((q, rang) => ({ q, rang, p: priorite(q.notion) }))
    .sort((a, b) => b.p - a.p || a.rang - b.rang)
    .map(({ q }) => q);
}

/** Segment d'adresse d'un exercice : la fin de `x-<chapitre>-<num>` ou `tb-<chapitre>-<num>`. */
export function segmentExercice(id: string, chapitre: string): string {
  for (const prefixe of [`x-${chapitre}-`, `tb-${chapitre}-`]) {
    if (id.startsWith(prefixe)) return id.slice(prefixe.length);
  }
  return id;
}
