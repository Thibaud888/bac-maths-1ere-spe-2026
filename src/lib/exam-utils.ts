import type { ExamExercise } from './types';

export function leafIds(exercise: ExamExercise): string[] {
  const ids: string[] = [];
  for (const q of exercise.questions) {
    if (q.subquestions && q.subquestions.length > 0) {
      for (const sq of q.subquestions) {
        ids.push(`${exercise.id}::${sq.id}`);
      }
    } else {
      ids.push(`${exercise.id}::${q.id}`);
    }
  }
  return ids;
}
