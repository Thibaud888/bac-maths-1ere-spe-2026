import { useId, type ReactNode } from 'react';
import type { Accent } from '@/components/shared/Sommaire';

const CADRE: Record<Accent, string> = {
  sky: 'border-sky-200 border-l-sky-500 dark:border-sky-900 dark:border-l-sky-500',
  amber: 'border-amber-200 border-l-amber-500 dark:border-amber-900 dark:border-l-amber-500',
};

const TITRE: Record<Accent, string> = {
  sky: 'text-sky-700 dark:text-sky-400',
  amber: 'text-amber-700 dark:text-amber-400',
};

/**
 * « L'essentiel » : ce qu'il faut retenir de la page, lu avant tout le reste.
 * Trois points au plus ; le détail suit dans les sections.
 */
export default function Essentiel({ accent, children }: { accent: Accent; children: ReactNode }) {
  const titre = useId();
  return (
    <section
      aria-labelledby={titre}
      className={`rounded-xl border border-l-4 bg-white p-5 shadow-sm dark:bg-slate-800 sm:p-6 ${CADRE[accent]}`}
    >
      <h2
        id={titre}
        className={`text-xs font-semibold uppercase tracking-[0.12em] ${TITRE[accent]}`}
      >
        L’essentiel
      </h2>
      <div className="mt-4 space-y-5">{children}</div>
    </section>
  );
}

/** Une rangée de chiffres clés, chacun suivi de sa phrase. */
export function Chiffres({ children }: { children: ReactNode }) {
  return <ul className="grid gap-4 sm:grid-cols-3 sm:gap-6">{children}</ul>;
}

export function Chiffre({
  valeur,
  accent,
  children,
}: {
  valeur: ReactNode;
  accent: Accent;
  children: ReactNode;
}) {
  return (
    <li className="flex items-baseline gap-3 sm:block">
      <p
        className={`w-24 shrink-0 text-2xl font-bold tabular-nums tracking-tight sm:w-auto sm:text-3xl ${TITRE[accent]}`}
      >
        {valeur}
      </p>
      <p className="text-sm leading-snug text-slate-700 dark:text-slate-300 sm:mt-1">{children}</p>
    </li>
  );
}

/** Trois idées à retenir, chacune renvoyant à la fiche qui la développe. */
export function Points({ children }: { children: ReactNode }) {
  return <ol className="grid gap-4 sm:grid-cols-3 sm:gap-6">{children}</ol>;
}

export function Point({
  numero,
  titre,
  vers,
  accent,
  children,
}: {
  numero: number;
  titre: string;
  /** Ancre de la fiche qui développe l'idée. */
  vers: string;
  accent: Accent;
  children: ReactNode;
}) {
  return (
    <li>
      <p className={`text-3xl font-bold tabular-nums tracking-tight ${TITRE[accent]}`}>{numero}</p>
      <p className="mt-1 font-semibold leading-snug text-slate-900 dark:text-slate-100">{titre}</p>
      <p className="mt-1 text-sm leading-snug text-slate-700 dark:text-slate-300">
        {children}{' '}
        <a
          href={`#${vers}`}
          className={`whitespace-nowrap font-medium underline underline-offset-2 ${TITRE[accent]}`}
        >
          Lire la fiche
        </a>
      </p>
    </li>
  );
}
