import type { ReactNode } from 'react';
import { LiteraryText } from '@/francais/components/text/LiteraryText';
import type { GrandOralFiche } from '@/lib/grand-oral-types';
import { Refs } from '@/components/shared/Sources';
import { typographie } from '@/lib/typographie';

type Props = {
  fiche: GrandOralFiche;
  /** Numéro de la fiche dans le sommaire de la page. */
  numero?: number | undefined;
  /** Contenu inséré après l'énoncé (liste de critères, par exemple). */
  children?: ReactNode;
  /** Appels de sources [n] à côté du titre ; `false` quand la page ne liste ses sources qu'en bas. */
  appels?: boolean;
};

/**
 * Fiche du grand oral. Le texte officiel et le conseil ne se mélangent jamais :
 * l'énoncé d'une fiche réglementaire ne dit que ce que dit le texte, et le
 * conseil s'affiche à part, sous l'intitulé « Conseil pratique » — dans une
 * colonne à droite sur grand écran, en dessous sinon. Les sources sont des
 * appels numérotés, renvoyant à la liste en bas de page.
 */
export default function FicheGrandOral({ fiche, numero, children, appels = true }: Props) {
  const officiel = fiche.nature === 'reglementaire';
  return (
    <article
      id={fiche.id}
      className={`scroll-mt-20 overflow-hidden rounded-xl border border-l-4 bg-white shadow-sm dark:bg-slate-800 ${
        officiel
          ? 'border-slate-200 border-l-amber-400 dark:border-slate-700 dark:border-l-amber-500'
          : 'border-slate-200 border-l-slate-300 dark:border-slate-700 dark:border-l-slate-500'
      }`}
    >
      <div
        className={
          fiche.conseil ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,17rem)]' : undefined
        }
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            {numero !== undefined && (
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-100 text-xs font-bold tabular-nums text-amber-800 dark:bg-amber-950/70 dark:text-amber-300"
                aria-hidden="true"
              >
                {numero}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold leading-snug text-slate-900 dark:text-slate-100">
                {typographie(fiche.title)}
                {appels && <Refs ids={fiche.sources} className="ml-1 align-super" />}
              </h3>
              <p
                className={`mt-0.5 text-[0.7rem] font-semibold uppercase tracking-wide ${
                  officiel
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {officiel ? 'Texte officiel' : 'Méthode'}
              </p>
            </div>
          </div>
          <div className="mt-4 max-w-prose text-[0.95rem] leading-relaxed text-slate-700 dark:text-slate-300">
            <LiteraryText text={typographie(fiche.statement)} />
          </div>
          {children}
        </div>
        {fiche.conseil && (
          <aside className="border-t border-amber-200 bg-amber-50/70 p-5 dark:border-amber-900/60 dark:bg-amber-950/25 sm:p-6 lg:border-l lg:border-t-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
              Conseil pratique
            </p>
            <div className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              <LiteraryText text={typographie(fiche.conseil)} />
            </div>
          </aside>
        )}
      </div>
    </article>
  );
}
