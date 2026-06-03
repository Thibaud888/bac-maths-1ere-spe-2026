import Ajv, { type ValidateFunction } from 'ajv';
import ficheSchema from '../../../schemas/francais/fiche.schema.json';
import quizSchema from '../../../schemas/francais/quiz.schema.json';
import exerciseSchema from '../../../schemas/francais/french-exercise.schema.json';
import type { Fiche, FrenchExercise, QuizItem } from './french-types';

const ajv = new Ajv({ allErrors: true, strict: false });

export const validateFiche: ValidateFunction<Fiche> =
  ajv.compile<Fiche>(ficheSchema);
export const validateQuiz: ValidateFunction<QuizItem> =
  ajv.compile<QuizItem>(quizSchema);
export const validateFrenchExercise: ValidateFunction<FrenchExercise> =
  ajv.compile<FrenchExercise>(exerciseSchema);

export function formatFrenchErrors(validate: ValidateFunction): string {
  return (validate.errors ?? [])
    .map((e) => `${e.instancePath || '<root>'} ${e.message ?? '?'}`)
    .join('; ');
}
