import type { ReactNode } from 'react';
import { LiteraryText } from '@/francais/components/text/LiteraryText';
import type { GrandOralFiche } from '@/lib/grand-oral-types';
import { Refs } from '@/components/shared/Sources';

type Props = {
  fiche: GrandOralFiche;
  /** Contenu inséré après l'énoncé (liste de critères, par exemple). */
  children?: ReactNode;
  /** Appels de sources [n] à côté du titre ; `false` quand la page ne liste ses sources qu'en bas. */
  appels?: boolean;
};

/**
 * Fiche du grand oral. Le texte officiel et le conseil ne se mélangent jamais :
 * l'énoncé d'une fiche réglementaire ne dit que ce que dit le texte, et le
 * conseil s'affiche à part, sous l'intitulé « Conseil pratique ». Les sources
 * sont des appels numérotés, renvoyant à la liste en bas de page.
 */
export default function FicheGrandOral({ fiche, children, appels = true }: Props) {
  const officiel = fiche.nature === 'reglementaire';
  return (
    <article
      id={fiche.id}
      className="scroll-mt-20 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
    >
      <div className={`h-1 ${officiel ? 'bg-amber-400' : 'bg-slate-300 dark:bg-slate-600'}`} />
      <div className="p-4 sm:p-5">
        <span
          className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
            officiel
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
          }`}
        >
          {officiel ? 'Texte officiel' : 'Méthode'}
        </span>
        <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
          {fiche.title}
          {appels && <Refs ids={fiche.sources} className="ml-1 align-super" />}
        </h3>
        <div className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <LiteraryText text={fiche.statement} />
        </div>
        {children}
        {fiche.conseil && (
          <div className="mt-4 rounded-md border-l-4 border-amber-300 bg-amber-50/70 p-3 dark:border-amber-700 dark:bg-amber-950/30">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
              Conseil pratique
            </p>
            <div className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              <LiteraryText text={fiche.conseil} />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
