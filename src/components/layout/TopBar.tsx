import { Fragment } from 'react';
import ThemePicker from '@/components/layout/ThemePicker';

export type Crumb = { label: string; muted?: boolean };

type Props = {
  /** La barre latérale est-elle ouverte ? Fermée, le bandeau offre de la rouvrir. */
  navOpen: boolean;
  onOpenNav: () => void;
  /** Fil d'Ariane contextuel (année › matière › page). */
  crumbs?: Crumb[];
};

/**
 * Bandeau supérieur global, identique sur toutes les pages : réouverture du
 * menu (le repli se fait depuis la barre elle-même), fil d'Ariane, choix du
 * thème.
 */
export default function TopBar({ navOpen, onOpenNav, crumbs = [] }: Props) {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5 dark:border-slate-700 dark:bg-slate-800">
      {!navOpen && (
        <button
          type="button"
          onClick={onOpenNav}
          aria-label="Afficher le menu"
          aria-expanded={false}
          className="flex shrink-0 items-center gap-2 rounded-md border border-slate-200 px-2.5 py-1.5 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <ExpandIcon />
          <span className="text-xs font-semibold">Menu</span>
        </button>
      )}

      {crumbs.length > 0 && (
        <nav
          aria-label="Fil d'Ariane"
          className="flex min-w-0 items-center gap-2 text-sm"
        >
          {crumbs.map((crumb, index) => (
            <Fragment key={`${crumb.label}-${index}`}>
              {index > 0 && (
                <span
                  className="shrink-0 text-slate-300 dark:text-slate-600"
                  aria-hidden="true"
                >
                  ›
                </span>
              )}
              <span
                className={
                  crumb.muted
                    ? 'hidden shrink-0 text-slate-400 sm:inline dark:text-slate-500'
                    : 'min-w-0 truncate font-semibold text-slate-900 dark:text-slate-100'
                }
              >
                {crumb.label}
              </span>
            </Fragment>
          ))}
        </nav>
      )}

      <ThemePicker />
    </header>
  );
}

function ExpandIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <line x1="4" y1="5" x2="4" y2="19" />
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}
