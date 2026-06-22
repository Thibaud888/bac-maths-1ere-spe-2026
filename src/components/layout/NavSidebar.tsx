import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

/** Lien simple de navigation (accueil, chapitre, module, section d'oral…). */
export type NavItem = { to: string; label: string; end?: boolean };

/** Groupe de liens coiffé d'un en-tête (domaine maths, famille français…). */
export type NavGroup = { label: string; dot: string; items: NavItem[] };

/** Couleur d'accent de l'état actif, propre à chaque matière/espace. */
export type NavAccent = 'blue' | 'indigo' | 'emerald';

type Props = {
  /** Bloc d'identité en haut (titre de la matière ou de l'élève). */
  brand: ReactNode;
  /** Liens principaux non groupés (Accueil, Bac blanc…). */
  primary?: NavItem[];
  /** Sections groupées (chapitres par domaine, modules par famille…). */
  groups: NavGroup[];
  accent: NavAccent;
};

const ACTIVE_ITEM: Record<NavAccent, string> = {
  blue: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold',
  indigo:
    'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold',
  emerald:
    'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold',
};

function primaryLinkClass({ isActive }: { isActive: boolean }): string {
  return [
    'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100',
  ].join(' ');
}

function makeItemClass(accent: NavAccent) {
  return ({ isActive }: { isActive: boolean }): string =>
    [
      // Les items sont indentés (pl-8) pour passer clairement sous l'en-tête
      // de groupe : la hiérarchie domaine → chapitre devient lisible.
      'block rounded-md py-1.5 pl-8 pr-3 text-sm transition-colors',
      isActive
        ? ACTIVE_ITEM[accent]
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100',
    ].join(' ');
}

export default function NavSidebar({ brand, primary, groups, accent }: Props) {
  const itemClass = makeItemClass(accent);

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900">
      <div className="shrink-0">{brand}</div>

      {primary && primary.length > 0 && (
        <>
          <div className="mx-4 shrink-0 border-t border-slate-200 dark:border-slate-700/60" />
          <div className="shrink-0 space-y-0.5 px-3 py-3">
            {primary.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end ?? false}
                className={primaryLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </>
      )}

      <nav className="flex-1 overflow-y-auto px-3 pb-6 pt-1">
        {groups.map((group, index) => (
          <section
            key={group.label}
            className={
              index === 0
                ? 'pt-2'
                : 'mt-4 border-t border-slate-200 pt-4 dark:border-slate-700/60'
            }
          >
            <header className="mb-2 flex items-center gap-2 px-3">
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${group.dot}`}
                aria-hidden="true"
              />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                {group.label}
              </span>
            </header>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.end ?? false} className={itemClass}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>
    </aside>
  );
}
