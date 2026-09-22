import type { ReactNode } from 'react';
import type { SpaceAccent } from '@/lib/spaces';

const BADGE: Record<SpaceAccent, string> = {
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  violet: 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  sky: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
  indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
};

export type PlannedItem = { label: string; description: string };

type Props = {
  title: string;
  /** Une ou deux phrases : à quoi sert cette page. */
  lead: string;
  accent: SpaceAccent;
  /** Ce que la page contiendra, une carte par entrée. */
  planned?: readonly PlannedItem[];
  /** Précision de bas de page (source, dépendance, calendrier). */
  footnote?: ReactNode;
};

/**
 * Page en attente de contenu : elle existe, elle s'ouvre, et elle annonce ce
 * qui va y arriver. Sert de gabarit à toutes les pages créées à vide.
 */
export default function EmptyState({
  title,
  lead,
  accent,
  planned = [],
  footnote,
}: Props) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-8">
      <header>
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${BADGE[accent]}`}
        >
          Contenu à venir
        </span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{lead}</p>
      </header>

      {planned.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {planned.map((item) => (
            <li
              key={item.label}
              className="rounded-lg border border-dashed border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-800"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {item.label}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      )}

      {footnote && (
        <p className="border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
          {footnote}
        </p>
      )}
    </div>
  );
}
