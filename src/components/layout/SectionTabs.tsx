import { NavLink } from 'react-router-dom';
import type { SpaceAccent } from '@/lib/spaces';

const ACTIVE: Record<SpaceAccent, string> = {
  blue: 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400',
  violet:
    'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400',
  amber: 'border-amber-600 text-amber-600 dark:border-amber-400 dark:text-amber-400',
  sky: 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400',
  indigo:
    'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400',
};

type Props = {
  items: ReadonlyArray<{ to: string; label: string; end?: boolean }>;
  accent: SpaceAccent;
  label: string;
};

/** Onglets d'une matière ou d'un chapitre (modes de travail, sections). */
export default function SectionTabs({ items, accent, label }: Props) {
  return (
    <nav
      aria-label={label}
      className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-6 dark:border-slate-700 dark:bg-slate-800"
    >
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end ?? false}
          className={({ isActive }) =>
            [
              'shrink-0 border-b-2 px-4 py-2 text-sm font-medium transition-colors',
              isActive
                ? ACTIVE[accent]
                : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200',
            ].join(' ')
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
