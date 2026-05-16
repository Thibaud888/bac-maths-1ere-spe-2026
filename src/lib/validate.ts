import Ajv, { type ValidateFunction } from 'ajv';
import formulaSchema from '../../schemas/formula.schema.json';
import automatismSchema from '../../schemas/automatism.schema.json';
import classicSchema from '../../schemas/classic-exercise.schema.json';
import examSchema from '../../schemas/exam-exercise.schema.json';
import figureSchema from '../../schemas/figure.schema.json';
import bacBlancPaperSchema from '../../schemas/bac-blanc-paper.schema.json';
import type {
  Automatism,
  BacBlancPaper,
  ClassicExercise,
  ExamExercise,
  Formula,
} from './types';

const ajv = new Ajv({ allErrors: true, strict: false });
ajv.addSchema(figureSchema, 'figure.schema.json');

export const validateFormula: ValidateFunction<Formula> =
  ajv.compile<Formula>(formulaSchema);
export const validateAutomatism: ValidateFunction<Automatism> =
  ajv.compile<Automatism>(automatismSchema);
export const validateClassic: ValidateFunction<ClassicExercise> =
  ajv.compile<ClassicExercise>(classicSchema);
export const validateExam: ValidateFunction<ExamExercise> =
  ajv.compile<ExamExercise>(examSchema);
export const validateBacBlancPaper: ValidateFunction<BacBlancPaper> =
  ajv.compile<BacBlancPaper>(bacBlancPaperSchema);

export function formatErrors(validate: ValidateFunction): string {
  return (validate.errors ?? [])
    .map((e) => `${e.instancePath || '<root>'} ${e.message ?? '?'}`)
    .join('; ');
}
