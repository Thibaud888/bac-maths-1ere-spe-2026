import { LiteraryText } from '@/francais/components/text/LiteraryText';
import HintSystem from '@/components/shared/HintSystem';
import type { FrenchSubject } from '@/francais/lib/french-types';
import { useFrenchProgressStore } from '@/francais/stores/french-progress-store';

type FrenchSubjectRunnerProps = {
  subject: FrenchSubject;
  onClose?: () => void;
};

const typeLabel: Record<FrenchSubject['type'], string> = {
  commentaire: 'Commentaire',
  dissertation: 'Dissertation',
};

export default function FrenchSubjectRunner({
  subject,
  onClose,
}: FrenchSubjectRunnerProps) {
  const recordAttempt = useFrenchProgressStore((s) => s.recordAttempt);

  return (
    <article className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
      <header className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {typeLabel[subject.type]} · Difficulté {subject.difficulty} · ~
            {subject.estimatedMinutes} min
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {subject.title}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {subject.oeuvre}
            {subject.parcours && (
              <> · parcours « {subject.parcours} »</>
            )}
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded px-2 py-1 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Fermer
          </button>
        )}
      </header>

      <section className="mt-4 rounded border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
          Sujet
        </p>
        <div className="mt-2 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
          <LiteraryText text={subject.consigne} />
        </div>
      </section>

      {subject.extract && (
        <figure className="mt-4 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-4">
          <div className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
            <LiteraryText text={subject.extract} preserveLineBreaks />
          </div>
          {subject.extractSource && (
            <figcaption className="mt-2 text-right text-xs italic text-slate-500 dark:text-slate-400">
              — {subject.extractSource}
            </figcaption>
          )}
        </figure>
      )}

      {subject.methodeRappel && (
        <div className="mt-4 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Rappel de méthode
          </p>
          <LiteraryText text={subject.methodeRappel} />
        </div>
      )}

      <div className="mt-6">
        <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Corrigé guidé — {subject.steps.length} étape
          {subject.steps.length > 1 ? 's' : ''}
        </p>
        <ol className="mt-3 space-y-6">
          {subject.steps.map((step) => (
            <li key={step.id}>
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {step.label}
              </div>
              <div className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <LiteraryText text={step.statement} />
              </div>
              <div className="mt-3">
                <HintSystem
                  hints={step.hints}
                  solution={step.solution}
                  {...(step.expectedAnswer !== undefined && {
                    expectedAnswer: step.expectedAnswer,
                  })}
                  resetKey={`${subject.id}::${step.id}`}
                  onSelfAssess={(ok) => {
                    recordAttempt(`${subject.id}::${step.id}`, ok);
                  }}
                />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}
