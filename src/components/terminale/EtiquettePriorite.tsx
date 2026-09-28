import type { Priorite } from '@/lib/terminale/types';

export const LIBELLE_PRIORITE: Record<Priorite, string> = {
  3: 'Incontournable',
  2: 'Fréquent',
  1: 'Plus rare',
};

const ETOILES: Record<Priorite, string> = { 3: '★★★', 2: '★★', 1: '★' };

const STYLE: Record<Priorite, string> = {
  3: 'bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-900',
  2: 'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-900',
  1: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-700/60 dark:text-slate-300 dark:ring-slate-600',
};

type Props = {
  priorite: Priorite;
  /** Priorité estimée (pas encore mesurée sur les sujets de bac). */
  estimee?: boolean;
  /** `courte` : les étoiles seules (sommaire, listes serrées). */
  forme?: 'longue' | 'courte';
};

/**
 * Étiquette de priorité d'une notion (charte § 11) : un seul composant, lisible sans
 * la couleur (texte + étoiles), avec la mention « estimé » tant que les sujets de bac
 * n'ont pas été comptés.
 */
export default function EtiquettePriorite({ priorite, estimee = false, forme = 'longue' }: Props) {
  const libelle = LIBELLE_PRIORITE[priorite];
  const description = `Priorité au bac : ${libelle.toLowerCase()}${estimee ? ' (estimation)' : ''}`;

  if (forme === 'courte') {
    return (
      <span
        title={description}
        aria-label={description}
        className={`inline-flex shrink-0 items-center rounded px-1 text-[10px] leading-4 tracking-tight ring-1 ring-inset ${STYLE[priorite]}`}
      >
        <span aria-hidden="true">{ETOILES[priorite]}</span>
      </span>
    );
  }

  return (
    <span
      title={description}
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${STYLE[priorite]}`}
    >
      <span aria-hidden="true" className="tracking-tight">
        {ETOILES[priorite]}
      </span>
      <span>{libelle}</span>
      {estimee && <span className="font-normal opacity-80">· estimé</span>}
    </span>
  );
}
