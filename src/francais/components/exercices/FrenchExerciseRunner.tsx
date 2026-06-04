import { useState } from 'react';
import { LiteraryText } from '@/francais/components/text/LiteraryText';
import HintSystem from '@/components/shared/HintSystem';
import type { FrenchExercise } from '@/francais/lib/french-types';
import { useFrenchProgressStore } from '@/francais/stores/french-progress-store';

type FrenchExerciseRunnerProps = {
  exercise: FrenchExercise;
  onClose?: () => void;
};

export default function FrenchExerciseRunner({
  exercise,
  onClose,
}: FrenchExerciseRunnerProps) {
  const recordAttempt = useFrenchProgressStore((s) => s.recordAttempt);
  const [cursor, setCursor] = useState(0);

  const question = exercise.questions[cursor];
  const total = exercise.questions.length;

  if (!question) return null;

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
      <header className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {exercise.title}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Difficulté {exercise.difficulty} · ~{exercise.estimatedMinutes} min
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

      {exercise.preamble && (
        <div className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <LiteraryText text={exercise.preamble} />
        </div>
      )}

      {exercise.extract && (
        <figure className="mt-4 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-4">
          <div className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
            <LiteraryText text={exercise.extract} preserveLineBreaks />
          </div>
          {exercise.extractSource && (
            <figcaption className="mt-2 text-right text-xs italic text-slate-500 dark:text-slate-400">
              — {exercise.extractSource}
            </figcaption>
          )}
        </figure>
      )}

      <div className="mt-5">
        <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Question {cursor + 1} / {total}
        </p>
        <div className="mt-2 text-base font-medium text-slate-900 dark:text-slate-100">
          <span className="mr-2 text-indigo-600 dark:text-indigo-400">{question.label}</span>
          <LiteraryText text={question.statement} />
        </div>

        <div className="mt-4">
          <HintSystem
            hints={question.hints}
            solution={question.solution}
            {...(question.expectedAnswer !== undefined && { expectedAnswer: question.expectedAnswer })}
            resetKey={`${exercise.id}::${question.id}`}
            onSelfAssess={(ok) => {
              recordAttempt(`${exercise.id}::${question.id}`, ok);
            }}
          />
        </div>
      </div>

      <footer className="mt-6 flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-4">
        <button
          type="button"
          disabled={cursor === 0}
          onClick={() => { setCursor((c) => Math.max(0, c - 1)); }}
          className="rounded border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          ← Précédente
        </button>
        <button
          type="button"
          disabled={cursor >= total - 1}
          onClick={() => { setCursor((c) => Math.min(total - 1, c + 1)); }}
          className="rounded border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          Suivante →
        </button>
      </footer>
    </div>
  );
}
