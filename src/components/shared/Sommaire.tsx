import { useId } from 'react';

export type SommaireEntree = { id: string; label: string };

type Props = {
  entries: readonly SommaireEntree[];
  /** Couleur des numéros et du survol : celle de la page. */
  accent: 'sky' | 'amber';
};

const NUMERO: Record<Props['accent'], string> = {
  sky: 'text-sky-700 dark:text-sky-400',
  amber: 'text-amber-700 dark:text-amber-400',
};

const SURVOL: Record<Props['accent'], string> = {
  sky: 'group-hover:text-sky-700 dark:group-hover:text-sky-400',
  amber: 'group-hover:text-amber-700 dark:group-hover:text-amber-400',
};

/**
 * Sommaire d'une longue page : un encadré titré, une liste numérotée de liens
 * vers les sections. Partagé par « Le bac, mode d'emploi » et le grand oral.
 */
export default function Sommaire({ entries, accent }: Props) {
  const titre = useId();
  return (
    <nav
      aria-labelledby={titre}
      className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
    >
      <p
        id={titre}
        className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400"
      >
        Sommaire
      </p>
      <ol className="mt-2 gap-x-6 sm:columns-2">
        {entries.map((entry, index) => (
          <li key={entry.id} className="break-inside-avoid">
            <a href={`#${entry.id}`} className="group flex gap-2 py-0.5 text-sm">
              <span className={`w-5 shrink-0 text-right font-semibold tabular-nums ${NUMERO[accent]}`}>
                {index + 1}.
              </span>
              <span
                className={`text-slate-700 underline-offset-2 group-hover:underline dark:text-slate-300 ${SURVOL[accent]}`}
              >
                {entry.label}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
