import Ajv, { type ValidateFunction } from 'ajv';
import communSchema from '../../../schemas/terminale/commun.schema.json';
import figureSchema from '../../../schemas/terminale/figure.schema.json';
import programmeSchema from '../../../schemas/terminale/programme.schema.json';
import annalesSchema from '../../../schemas/terminale/annales.schema.json';
import metaSchema from '../../../schemas/terminale/meta.schema.json';
import notionSchema from '../../../schemas/terminale/notion.schema.json';
import coursSchema from '../../../schemas/terminale/cours.schema.json';
import memoSchema from '../../../schemas/terminale/memo.schema.json';
import exerciceSchema from '../../../schemas/terminale/exercice.schema.json';
import flashSchema from '../../../schemas/terminale/flash.schema.json';
import typeBacSchema from '../../../schemas/terminale/type-bac.schema.json';
import type {
  Annales,
  CarteMemo,
  ChapitreMeta,
  Cours,
  Exercice,
  ExerciceTypeBac,
  LigneProgramme,
  Notion,
  QuestionEclair,
} from './types';

/**
 * Validateurs Ajv des schémas de terminale. Instance à part : l'identifiant
 * `figure.schema.json` appartient à la première, celui de terminale est
 * `terminale/figure.schema.json`.
 */
const ajv = new Ajv({ allErrors: true, strict: false });
ajv.addSchema(communSchema);
ajv.addSchema(figureSchema);

export const validateurs = {
  programme: ajv.compile<LigneProgramme>(programmeSchema),
  annales: ajv.compile<Annales>(annalesSchema),
  meta: ajv.compile<ChapitreMeta>(metaSchema),
  notions: ajv.compile<Notion>(notionSchema),
  cours: ajv.compile<Cours>(coursSchema),
  memo: ajv.compile<CarteMemo>(memoSchema),
  exercices: ajv.compile<Exercice>(exerciceSchema),
  flash: ajv.compile<QuestionEclair>(flashSchema),
  'type-bac': ajv.compile<ExerciceTypeBac>(typeBacSchema),
};

/** Figure de terminale (chemin `terminale/<matiere>/<chapitre>/<nom>`). */
export const validerFigure = ajv.getSchema('terminale/figure.schema.json') as ValidateFunction;

export function erreurs(validate: ValidateFunction): string {
  // « must match "then" schema » ne fait que répéter l'erreur précise qui le précède.
  return (validate.errors ?? [])
    .filter((e) => e.keyword !== 'if')
    .map((e) => `${e.instancePath || '<racine>'} ${e.message ?? '?'}`)
    .join(' ; ');
}
