import Ajv, { type ValidateFunction } from 'ajv';
import sourceSchema from '../../schemas/bac/source.schema.json';
import coefficientSchema from '../../schemas/bac/coefficient.schema.json';
import epreuveSchema from '../../schemas/bac/epreuve.schema.json';
import jalonSchema from '../../schemas/bac/jalon.schema.json';
import mentionSchema from '../../schemas/bac/mention.schema.json';
import type {
  BacBloc,
  BacCoefficient,
  BacEpreuve,
  BacJalon,
  BacMention,
  BacPrecision,
  BacSource,
} from './bac-types';

/**
 * Chargeur du mode d'emploi du bac : lit `content/bac/`, valide chaque entrée
 * contre son schéma, et expose des accesseurs triés.
 *
 * Toute donnée chiffrée du bac passe par ici — aucun coefficient n'est écrit
 * en dur dans un composant.
 */

const ajv = new Ajv({ allErrors: true, strict: false });

const validateSource: ValidateFunction<BacSource> =
  ajv.compile<BacSource>(sourceSchema);
const validateCoefficient: ValidateFunction<BacCoefficient> =
  ajv.compile<BacCoefficient>(coefficientSchema);
const validateEpreuve: ValidateFunction<BacEpreuve> =
  ajv.compile<BacEpreuve>(epreuveSchema);
const validateJalon: ValidateFunction<BacJalon> =
  ajv.compile<BacJalon>(jalonSchema);
const validateMention: ValidateFunction<BacMention> =
  ajv.compile<BacMention>(mentionSchema);

const sourceModules = import.meta.glob<BacSource[]>('/content/bac/sources.json', {
  eager: true,
  import: 'default',
});
const coefficientModules = import.meta.glob<BacCoefficient[]>(
  '/content/bac/coefficients.json',
  { eager: true, import: 'default' }
);
const epreuveModules = import.meta.glob<BacEpreuve[]>('/content/bac/epreuves.json', {
  eager: true,
  import: 'default',
});
const jalonModules = import.meta.glob<BacJalon[]>('/content/bac/calendrier.json', {
  eager: true,
  import: 'default',
});
const mentionModules = import.meta.glob<BacMention[]>('/content/bac/mentions.json', {
  eager: true,
  import: 'default',
});

const isDev = import.meta.env.DEV;

function firstValue<T>(modules: Record<string, T[]>): T[] {
  for (const value of Object.values(modules)) return value;
  return [];
}

function load<T>(
  modules: Record<string, T[]>,
  validate: ValidateFunction<T>,
  context: string
): T[] {
  const valid: T[] = [];
  for (const item of firstValue(modules)) {
    if (validate(item)) {
      valid.push(item);
      continue;
    }
    const errors = (validate.errors ?? [])
      .map((e) => `${e.instancePath || '<root>'} ${e.message ?? '?'}`)
      .join(' ; ');
    const message = `${context} : entrée invalide — ${errors}`;
    if (isDev) throw new Error(message);
    console.warn(message, item);
  }
  return valid;
}

function byOrder<T extends { order?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

const sources = load(sourceModules, validateSource, 'content/bac/sources.json');
const coefficients = byOrder(
  load(coefficientModules, validateCoefficient, 'content/bac/coefficients.json')
);
const epreuves = byOrder(
  load(epreuveModules, validateEpreuve, 'content/bac/epreuves.json')
);
const jalons = byOrder(load(jalonModules, validateJalon, 'content/bac/calendrier.json'));
const mentions = byOrder(
  load(mentionModules, validateMention, 'content/bac/mentions.json')
);

const sourceById = new Map(sources.map((s) => [s.id, s]));
const coefficientById = new Map(coefficients.map((c) => [c.id, c]));

export function listBacSources(): BacSource[] {
  return sources;
}

export function getBacSource(id: string): BacSource | undefined {
  return sourceById.get(id);
}

/** Les sources citées par une liste d'identifiants, dans l'ordre du fichier. */
export function resolveBacSources(ids: readonly string[]): BacSource[] {
  const wanted = new Set(ids);
  return sources.filter((s) => wanted.has(s.id));
}

export function listBacCoefficients(): BacCoefficient[] {
  return coefficients;
}

export function getBacCoefficient(id: string): BacCoefficient | undefined {
  return coefficientById.get(id);
}

export function coefficientsOfBloc(bloc: BacBloc): BacCoefficient[] {
  return coefficients.filter((c) => c.bloc === bloc);
}

/** Somme des coefficients d'un bloc. */
export function totalOfBloc(bloc: BacBloc): number {
  return coefficientsOfBloc(bloc).reduce((sum, c) => sum + c.coefficient, 0);
}

/** Le dénominateur de la moyenne du bac, options comprises. */
export function totalCoefficients(): number {
  return coefficients.reduce((sum, c) => sum + c.coefficient, 0);
}

/** Ce qui se joue sur une épreuve, par opposition aux bulletins. */
export function totalEpreuves(): number {
  return totalOfBloc('anticipee') + totalOfBloc('terminale');
}

export function listBacEpreuves(): BacEpreuve[] {
  return epreuves;
}

export function listBacJalons(): BacJalon[] {
  return jalons;
}

export function listBacMentions(): BacMention[] {
  return mentions;
}

export const BLOC_LABEL: Record<BacBloc, string> = {
  anticipee: 'Épreuves passées en fin de première',
  terminale: 'Épreuves de terminale',
  continu: 'Contrôle continu — les moyennes des bulletins',
  option: 'Options',
};

export const BLOC_ORDER: readonly BacBloc[] = [
  'anticipee',
  'terminale',
  'continu',
  'option',
] as const;

/** Ce qu'on sait d'une date, dit en clair (champ `precision` d'un jalon). */
export const PRECISION_LABEL: Record<BacPrecision, string> = {
  jour: 'Date officielle',
  periode: 'Période officielle',
  mois: 'Mois connu',
  inconnue: 'Pas encore publié',
};
