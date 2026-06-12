import { LiteraryText } from '@/francais/components/text/LiteraryText';
import { useFrenchAppStore } from '@/francais/stores/french-app-store';
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

function TextHeader({ text }: { text: OralText }) {
  return (
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
  );
}

function LectureCallout({ text }: { text: OralText }) {
  if (!text.lectureExpressive) return null;
  return (
    <div className="mt-5 rounded-lg border border-blue-200 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/20 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
        Lecture à voix haute (2 pts)
      </p>
      <div className="mt-1">
        <LiteraryText text={text.lectureExpressive.conseils} />
      </div>
    </div>
  );
}

function GrammaireSection({ text }: { text: OralText }) {
  return (
    <>
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
    </>
  );
}

/** Vue « Essentiel » : ce que l'élève doit dire, en mots simples. */
function EssentielView({ text, hideBody }: { text: OralText; hideBody: boolean }) {
  const e = text.essentiel!;
  return (
    <article className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      <TextHeader text={text} />

      {!hideBody && (
        <div className="mt-5">
          <OralTextBody text={text} />
        </div>
      )}

      <LectureCallout text={text} />

      <div className="mt-5 rounded-lg border border-emerald-200 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          En bref
        </p>
        <div className="mt-1">
          <LiteraryText text={e.enBref} />
        </div>
      </div>

      <SectionTitle>Ma problématique</SectionTitle>
      <p className="mt-2 font-medium text-slate-900 dark:text-slate-100">
        <LiteraryText text={e.problematique} />
      </p>

      <SectionTitle>Ce que je dois dire</SectionTitle>
      <ol className="mt-2 space-y-3">
        {e.mouvementsCles.map((m, i) => (
          <li
            key={i}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4"
          >
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {i + 1}. {m.titre}
            </p>
            <p className="mt-1">
              <LiteraryText text={m.phrase} />
            </p>
          </li>
        ))}
      </ol>

      <SectionTitle>Ma conclusion</SectionTitle>
      <p className="mt-2">
        <LiteraryText text={e.conclusion} />
      </p>

      {e.aRetenir && e.aRetenir.length > 0 && (
        <>
          <SectionTitle>À retenir absolument</SectionTitle>
          <ul className="mt-2 space-y-1">
            {e.aRetenir.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                <span>
                  <LiteraryText text={item} />
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      <GrammaireSection text={text} />
    </article>
  );
}

/** Vue « Détaillé » : l'analyse linéaire complète (inchangée). */
function DetailView({
  text,
  hideBody,
  fallbackNote,
}: {
  text: OralText;
  hideBody: boolean;
  fallbackNote?: boolean;
}) {
  return (
    <article className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      <TextHeader text={text} />

      {fallbackNote && (
        <p className="mt-4 rounded border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-3 text-xs text-amber-800 dark:text-amber-300">
          La version simplifiée de ce texte arrive bientôt — voici la version
          détaillée.
        </p>
      )}

      {!hideBody && (
        <div className="mt-5">
          <OralTextBody text={text} />
        </div>
      )}

      <LectureCallout text={text} />

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

      <GrammaireSection text={text} />
    </article>
  );
}

export default function OralTextDetail({ text, hideBody = false }: OralTextDetailProps) {
  const oralViewMode = useFrenchAppStore((s) => s.oralViewMode);

  if (oralViewMode === 'essentiel') {
    if (text.essentiel) {
      return <EssentielView text={text} hideBody={hideBody} />;
    }
    // Pas encore de version simplifiée : on montre le détail avec une note.
    return <DetailView text={text} hideBody={hideBody} fallbackNote />;
  }

  return <DetailView text={text} hideBody={hideBody} />;
}
