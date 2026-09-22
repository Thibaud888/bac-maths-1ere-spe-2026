import Ajv, { type ValidateFunction } from 'ajv';
import ficheSchema from '../../schemas/grand-oral/fiche.schema.json';
import tempsSchema from '../../schemas/grand-oral/temps.schema.json';
import critereSchema from '../../schemas/grand-oral/critere.schema.json';
import relanceSchema from '../../schemas/grand-oral/relance.schema.json';
import {
  getBacCoefficient,
  getBacSource,
  listBacEpreuves,
  listBacJalons,
  resolveBacSources,
} from './bac-content';
import type { BacCoefficient, BacEpreuve, BacJalon, BacSource } from './bac-types';
import type {
  GrandOralCritere,
  GrandOralFiche,
  GrandOralRelance,
  GrandOralSection,
  GrandOralTemps,
  RelanceCategorie,
} from './grand-oral-types';

/**
 * Chargeur du grand oral : lit `content/terminale/grand-oral/`, valide chaque
 * entrée contre son schéma, et expose des accesseurs triés.
 *
 * Ce qui est déjà dans `content/bac/` (coefficient, format résumé, période de
 * passage, sources) n'est pas recopié : on le relit ici par `bac-content`.
 */

const ajv = new Ajv({ allErrors: true, strict: false });

const validateFiche: ValidateFunction<GrandOralFiche> =
  ajv.compile<GrandOralFiche>(ficheSchema);
const validateTemps: ValidateFunction<GrandOralTemps> =
  ajv.compile<GrandOralTemps>(tempsSchema);
const validateCritere: ValidateFunction<GrandOralCritere> =
  ajv.compile<GrandOralCritere>(critereSchema);
const validateRelance: ValidateFunction<GrandOralRelance> =
  ajv.compile<GrandOralRelance>(relanceSchema);

const DIR = '/content/terminale/grand-oral';

const ficheModules = import.meta.glob<GrandOralFiche[]>(
  [
    '/content/terminale/grand-oral/epreuve.json',
    '/content/terminale/grand-oral/preparation.json',
    '/content/terminale/grand-oral/entretien.json',
  ],
  { eager: true, import: 'default' }
);
const tempsModules = import.meta.glob<GrandOralTemps[]>(
  '/content/terminale/grand-oral/deroule.json',
  { eager: true, import: 'default' }
);
const critereModules = import.meta.glob<GrandOralCritere[]>(
  '/content/terminale/grand-oral/criteres.json',
  { eager: true, import: 'default' }
);
const relanceModules = import.meta.glob<GrandOralRelance[]>(
  '/content/terminale/grand-oral/relances.json',
  { eager: true, import: 'default' }
);

const isDev = import.meta.env.DEV;

function report(message: string, item?: unknown): void {
  if (isDev) throw new Error(message);
  console.warn(message, item);
}

function load<T extends { id: string }>(
  modules: Record<string, T[]>,
  validate: ValidateFunction<T>
): T[] {
  const valid: T[] = [];
  for (const [path, items] of Object.entries(modules)) {
    const file = path.replace(`${DIR}/`, '');
    for (const item of items) {
      if (!validate(item)) {
        const errors = (validate.errors ?? [])
          .map((e) => `${e.instancePath || '<root>'} ${e.message ?? '?'}`)
          .join(' ; ');
        report(`grand-oral/${file} : entrée invalide — ${errors}`, item);
        continue;
      }
      // Une source citée doit exister dans le registre de content/bac/.
      const cited = (item as { sources?: string[] }).sources ?? [];
      const unknown = cited.filter((id) => !getBacSource(id));
      if (unknown.length > 0) {
        report(`grand-oral/${file} : source inconnue — ${unknown.join(', ')}`, item);
        continue;
      }
      valid.push(item);
    }
  }
  return valid;
}

function byOrder<T extends { order?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

const fiches = byOrder(load(ficheModules, validateFiche));
const temps = byOrder(load(tempsModules, validateTemps));
const criteres = byOrder(load(critereModules, validateCritere));
const relances = byOrder(load(relanceModules, validateRelance));

/** Étapes du déroulé que l'oral blanc traite à part (plan à revoir, relances). */
export const TEMPS_ID = {
  preparation: 'gt-preparation',
  expose: 'gt-expose',
  echange: 'gt-echange',
} as const;

/** La fiche de la page « L'épreuve » sous laquelle s'affichent les critères du jury. */
export const FICHE_GRILLE_ID = 'go-epreuve-note';

/** Identifiants des lignes de `content/bac/` qui concernent le grand oral. */
export const GRAND_ORAL_BAC_IDS = {
  epreuve: 'ep-grand-oral',
  coefficient: 'co-grand-oral',
  jalon: 'ca-grand-oral',
} as const;

export function fichesOfSection(section: GrandOralSection): GrandOralFiche[] {
  return fiches.filter((f) => f.section === section);
}

export function listGrandOralFiches(): GrandOralFiche[] {
  return fiches;
}

/** Le déroulé officiel, dans l'ordre. */
export function listGrandOralTemps(): GrandOralTemps[] {
  return temps;
}

/** Les étapes minutées, dans l'ordre : ce que joue l'oral blanc. */
export function tempsMinutes(): (GrandOralTemps & { minutes: number })[] {
  return temps.filter(
    (t): t is GrandOralTemps & { minutes: number } => t.minutes !== undefined
  );
}

/** Minutes passées face au jury (hors préparation). */
export function minutesDevantJury(): number {
  return tempsMinutes()
    .filter((t) => t.devantJury)
    .reduce((sum, t) => sum + t.minutes, 0);
}

/** Minutes de préparation. */
export function minutesPreparation(): number {
  return tempsMinutes()
    .filter((t) => !t.devantJury)
    .reduce((sum, t) => sum + t.minutes, 0);
}

export function listGrandOralCriteres(): GrandOralCritere[] {
  return criteres;
}

export function listGrandOralRelances(): GrandOralRelance[] {
  return relances;
}

export const RELANCE_CATEGORIE_LABEL: Record<RelanceCategorie, string> = {
  question: 'Sur ta question',
  cours: 'Questions de cours',
  demarche: 'Ta démarche',
  orientation: 'Ton projet',
  piege: 'Pour te déstabiliser',
};

export const RELANCE_CATEGORIE_ORDER: readonly RelanceCategorie[] = [
  'question',
  'cours',
  'demarche',
  'orientation',
  'piege',
] as const;

/** L'épreuve telle que décrite dans `content/bac/epreuves.json`. */
export function grandOralEpreuve(): BacEpreuve | undefined {
  return listBacEpreuves().find((e) => e.id === GRAND_ORAL_BAC_IDS.epreuve);
}

/** La ligne du barème : coefficient 8 en 2027, lu dans `coefficients.json`. */
export function grandOralCoefficient(): BacCoefficient | undefined {
  return getBacCoefficient(GRAND_ORAL_BAC_IDS.coefficient);
}

/** La période de passage, lue dans `calendrier.json`. */
export function grandOralJalon(): BacJalon | undefined {
  return listBacJalons().find((j) => j.id === GRAND_ORAL_BAC_IDS.jalon);
}

/** Toutes les sources citées par le grand oral, sans doublon, dans l'ordre du registre. */
export function grandOralSources(): BacSource[] {
  const ids = new Set<string>();
  const add = (list: readonly string[] | undefined) => {
    for (const id of list ?? []) ids.add(id);
  };
  for (const f of fiches) add(f.sources);
  for (const t of temps) add(t.sources);
  for (const c of criteres) add(c.sources);
  add(grandOralEpreuve()?.sources);
  add(grandOralCoefficient()?.sources);
  add(grandOralJalon()?.sources);
  return resolveBacSources([...ids]);
}
