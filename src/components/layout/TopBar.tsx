import { Fragment } from 'react';
import { useAppStore } from '@/stores/app-store';

export type Crumb = { label: string; muted?: boolean };

type Props = {
  /** La barre latérale est-elle ouverte ? (pilote l'icône du bouton) */
  navOpen: boolean;
  onToggleNav: () => void;
  /** Fil d'Ariane contextuel (année › matière › page). */
  crumbs?: Crumb[];
};

/**
 * Bandeau supérieur global, identique sur toutes les pages : ouverture et
 * fermeture du menu, fil d'Ariane, bascule de thème.
 */
export default function TopBar({ navOpen, onToggleNav, crumbs = [] }: Props) {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5 dark:border-slate-700 dark:bg-slate-800">
      <button
        type="button"
        onClick={onToggleNav}
        aria-label={navOpen ? 'Replier le menu' : 'Afficher le menu'}
        aria-expanded={navOpen}
        className="flex shrink-0 items-center gap-2 rounded-md border border-slate-200 px-2.5 py-1.5 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
      >
        {navOpen ? <CollapseIcon /> : <ExpandIcon />}
        <span className="text-xs font-semibold">Menu</span>
      </button>

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

      <button
        type="button"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
        className="ml-auto shrink-0 rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  );
}

function CollapseIcon() {
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
      <polyline points="15 18 9 12 15 6" />
    </svg>
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

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}
