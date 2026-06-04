import { LiteraryText } from '@/francais/components/text/LiteraryText';
import type { OralText } from '@/francais/lib/french-types';
import OralTextBody from './OralTextBody';
import RevealPanel from './RevealPanel';
import { grammairePointLabel } from './oral-labels';

type OralTextDetailProps = {
  text: OralText;
  /** Masque le corps du texte (le simulateur l'affiche déjà séparément). */
  hideBody?: boolean;
};

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="mt-8 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
      {children}
    </h2>
  );
}

export default function OralTextDetail({ text, hideBody = false }: OralTextDetailProps) {
  return (
    <article className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {text.titre}
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          {text.auteur}, <span className="italic">{text.oeuvre}</span>
          {text.dateOeuvre ? ` (${text.dateOeuvre})` : ''}
        </p>
        {text.parcours && (
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-500">
            Parcours : {text.parcours}
          </p>
        )}
      </header>

      {!hideBody && (
        <div className="mt-5">
          <OralTextBody text={text} />
        </div>
      )}

      {text.lectureExpressive && (
        <div className="mt-5 rounded-lg border border-blue-200 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
            Lecture à voix haute (2 pts)
          </p>
          <div className="mt-1">
            <LiteraryText text={text.lectureExpressive.conseils} />
          </div>
        </div>
      )}

      <SectionTitle>Introduction — projet de lecture</SectionTitle>
      <div className="mt-2 space-y-2">
        {text.projetLecture.accroche && (
          <p>
            <span className="font-semibold text-slate-900 dark:text-slate-100">Accroche. </span>
            <LiteraryText text={text.projetLecture.accroche} />
          </p>
        )}
        <p>
          <span className="font-semibold text-slate-900 dark:text-slate-100">Situation. </span>
          <LiteraryText text={text.projetLecture.situation} />
        </p>
        <p>
          <span className="font-semibold text-slate-900 dark:text-slate-100">Problématique. </span>
          <LiteraryText text={text.projetLecture.problematique} />
        </p>
        <p>
          <span className="font-semibold text-slate-900 dark:text-slate-100">Mouvements. </span>
          <LiteraryText text={text.projetLecture.annonceMouvements} />
        </p>
      </div>

      <SectionTitle>Explication linéaire (8 pts)</SectionTitle>
      <div className="mt-2 space-y-5">
        {text.mouvements.map((mvt, idx) => (
          <div
            key={mvt.id}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4"
          >
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {idx + 1}. {mvt.titre}
              </h3>
              <span className="shrink-0 rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                {mvt.bornes}
              </span>
            </div>
            <p className="mt-1 italic text-slate-600 dark:text-slate-400">
              <LiteraryText text={mvt.idee} />
            </p>
            <ul className="mt-3 space-y-2">
              {mvt.analyses.map((a, i) => (
                <li
                  key={i}
                  className="rounded border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-3"
                >
                  {a.citation && (
                    <p className="italic text-slate-800 dark:text-slate-200">
                      «&nbsp;<LiteraryText text={a.citation} />&nbsp;»
                    </p>
                  )}
                  <p className={a.citation ? 'mt-1' : ''}>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {a.procede}
                    </span>{' '}
                    → <LiteraryText text={a.effet} />
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <SectionTitle>Conclusion</SectionTitle>
      <div className="mt-2 space-y-2">
        <p>
          <span className="font-semibold text-slate-900 dark:text-slate-100">Bilan. </span>
          <LiteraryText text={text.conclusion.bilan} />
        </p>
        <p>
          <span className="font-semibold text-slate-900 dark:text-slate-100">Ouverture. </span>
          <LiteraryText text={text.conclusion.ouverture} />
        </p>
      </div>

      <SectionTitle>Question de grammaire (2 pts)</SectionTitle>
      <div className="mt-2 rounded-lg border border-violet-200 dark:border-violet-700 bg-violet-50/50 dark:bg-violet-900/20 p-4">
        <span className="inline-block rounded bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
          {grammairePointLabel[text.questionGrammaire.point]}
        </span>
        <p className="mt-2 font-medium text-slate-900 dark:text-slate-100">
          <LiteraryText text={text.questionGrammaire.enonce} />
        </p>
        <div className="mt-3">
          <RevealPanel label="Voir le corrigé">
            <LiteraryText text={text.questionGrammaire.corrige} />
          </RevealPanel>
        </div>
      </div>
    </article>
  );
}
