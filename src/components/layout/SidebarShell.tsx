import type { ReactNode } from 'react';

type Props = {
  /** Replie la colonne (bouton dupliqué dans le bandeau supérieur). */
  onCollapse: () => void;
  /** Bloc d'identité ; par défaut, le titre du site. */
  brand?: ReactNode;
  children: ReactNode;
};

/**
 * Coquille commune à toutes les barres latérales : identité, bouton de repli,
 * puis le contenu propre à la barre.
 */
export default function SidebarShell({ onCollapse, brand, children }: Props) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-700/60 dark:bg-slate-900">
      <div className="flex shrink-0 items-start gap-2 px-4 pb-3 pt-5">
        <div className="min-w-0 flex-1">
          {brand ?? (
            <>
              <p className="text-[17px] font-bold leading-tight text-slate-900 dark:text-white">
                Bac 2027
              </p>
              <p className="mt-1 text-[11px] leading-snug text-slate-400 dark:text-slate-500">
                Première &amp; terminale
              </p>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={onCollapse}
          aria-label="Replier le menu"
          className="shrink-0 rounded-md border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
        >
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
        </button>
      </div>
      {children}
    </aside>
  );
}
