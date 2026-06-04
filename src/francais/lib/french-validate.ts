import Ajv, { type ValidateFunction } from 'ajv';
import ficheSchema from '../../../schemas/francais/fiche.schema.json';
import quizSchema from '../../../schemas/francais/quiz.schema.json';
import exerciseSchema from '../../../schemas/francais/french-exercise.schema.json';
import subjectSchema from '../../../schemas/francais/french-subject.schema.json';
import flashcardDeckSchema from '../../../schemas/francais/flashcard-deck.schema.json';
import oralTextSchema from '../../../schemas/francais/oral-text.schema.json';
import entretienSchema from '../../../schemas/francais/entretien-question.schema.json';
import oralFicheSchema from '../../../schemas/francais/oral-fiche.schema.json';
import oralQuizSchema from '../../../schemas/francais/oral-quiz.schema.json';
import oralMetaSchema from '../../../schemas/francais/oral-meta.schema.json';
import type {
  EntretienQuestion,
  Fiche,
  FlashcardDeck,
  FrenchExercise,
  FrenchSubject,
  OralFiche,
  OralMeta,
  OralText,
  QuizItem,
} from './french-types';

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
export const validateOralText: ValidateFunction<OralText> =
  ajv.compile<OralText>(oralTextSchema);
export const validateEntretienQuestion: ValidateFunction<EntretienQuestion> =
  ajv.compile<EntretienQuestion>(entretienSchema);
export const validateOralFiche: ValidateFunction<OralFiche> =
  ajv.compile<OralFiche>(oralFicheSchema);
export const validateOralQuiz: ValidateFunction<QuizItem> =
  ajv.compile<QuizItem>(oralQuizSchema);
export const validateOralMeta: ValidateFunction<OralMeta> =
  ajv.compile<OralMeta>(oralMetaSchema);

export function formatFrenchErrors(validate: ValidateFunction): string {
  return (validate.errors ?? [])
    .map((e) => `${e.instancePath || '<root>'} ${e.message ?? '?'}`)
    .join('; ');
}
