import Ajv, { type ValidateFunction } from 'ajv';
import ficheSchema from '../../../schemas/francais/fiche.schema.json';
import quizSchema from '../../../schemas/francais/quiz.schema.json';
import exerciseSchema from '../../../schemas/francais/french-exercise.schema.json';
import subjectSchema from '../../../schemas/francais/french-subject.schema.json';
import flashcardDeckSchema from '../../../schemas/francais/flashcard-deck.schema.json';
import type { Fiche, FlashcardDeck, FrenchExercise, FrenchSubject, QuizItem } from './french-types';

const ajv = new Ajv({ allErrors: true, strict: false });

export const validateFiche: ValidateFunction<Fiche> =
  ajv.compile<Fiche>(ficheSchema);
export const validateQuiz: ValidateFunction<QuizItem> =
  ajv.compile<QuizItem>(quizSchema);
export const validateFrenchExercise: ValidateFunction<FrenchExercise> =
  ajv.compile<FrenchExercise>(exerciseSchema);
export const validateFrenchSubject: ValidateFunction<FrenchSubject> =
  ajv.compile<FrenchSubject>(subjectSchema);
export const validateFlashcardDeck: ValidateFunction<FlashcardDeck> =
  ajv.compile<FlashcardDeck>(flashcardDeckSchema);

export function formatFrenchErrors(validate: ValidateFunction): string {
  return (validate.errors ?? [])
    .map((e) => `${e.instancePath || '<root>'} ${e.message ?? '?'}`)
    .join('; ');
}
