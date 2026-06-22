import { Fragment } from 'react';
import { useAppStore } from '@/stores/app-store';
import SubjectSwitcher from '@/francais/components/layout/SubjectSwitcher';

export type Crumb = { label: string; muted?: boolean };

type Props = {
  subject: 'maths' | 'francais';
  /** Fil d'Ariane contextuel (domaine › chapitre, famille › module, etc.). */
  crumbs?: Crumb[];
};

/**
 * Bandeau supérieur global, identique sur toutes les pages de l'application.
 * Porte le repli de la barre latérale, le sélecteur de matière (toujours au
 * même endroit) et la bascule de thème.
 */
export default function TopBar({ subject, crumbs = [] }: Props) {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5">
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={collapsed ? 'Afficher le menu' : 'Masquer le menu'}
        aria-pressed={!collapsed}
        className="rounded-md p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        <MenuIcon />
      </button>

      <SubjectSwitcher current={subject} />

      {crumbs.length > 0 && (
        <nav
          aria-label="Fil d'Ariane"
          className="flex min-w-0 items-center gap-2 text-sm"
        >
          <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">
            /
          </span>
          {crumbs.map((crumb, index) => (
            <Fragment key={`${crumb.label}-${index}`}>
              {index > 0 && (
                <span
                  className="text-slate-300 dark:text-slate-600"
                  aria-hidden="true"
                >
                  ›
                </span>
              )}
              <span
                className={
                  crumb.muted
                    ? 'shrink-0 text-slate-400 dark:text-slate-500'
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
        className="ml-auto rounded-md p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  );
}

function MenuIcon() {
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
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
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
