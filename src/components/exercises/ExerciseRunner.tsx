import { useState } from 'react';
import { FigureRenderer } from '@/components/figures';
import HintSystem from '@/components/shared/HintSystem';
import { TextWithMath } from '@/components/math/TextWithMath';
import type { ClassicExercise } from '@/lib/types';
import { useProgressStore } from '@/stores/progress-store';

type ExerciseRunnerProps = {
  exercise: ClassicExercise;
  onClose?: () => void;
};

export default function ExerciseRunner({
  exercise,
  onClose,
}: ExerciseRunnerProps) {
  const [cursor, setCursor] = useState(0);
  const recordAttempt = useProgressStore((s) => s.recordAttempt);
  const question = exercise.questions[cursor];

  if (!question) {
    return (
      <div className="rounded border border-slate-200 bg-white p-4 text-sm text-slate-600">
        Aucune question.
      </div>
    );
  }

  const isLast = cursor === exercise.questions.length - 1;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Exercice classique · difficulté {exercise.difficulty} ·{' '}
            ~{exercise.estimatedMinutes} min
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            <TextWithMath text={exercise.title} />
          </h2>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-800"
          >
            Fermer
          </button>
        )}
      </header>

      {exercise.preamble && (
        <div className="mt-4 rounded bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
          <TextWithMath text={exercise.preamble} />
        </div>
      )}
      {exercise.figure && <FigureRenderer figure={exercise.figure} />}

      <div className="mt-5">
        <p className="text-sm font-semibold text-slate-900">
          Question {question.label}
        </p>
        <div className="mt-1 text-sm leading-relaxed text-slate-700">
          <TextWithMath text={question.statement} />
        </div>
        {question.figure && <FigureRenderer figure={question.figure} />}
      </div>

      <div className="mt-4">
        <HintSystem
          hints={question.hints}
          solution={question.solution}
          {...(question.expectedAnswer
            ? { expectedAnswer: question.expectedAnswer }
            : {})}
          resetKey={`${exercise.id}-${question.id}`}
          onSelfAssess={(succeeded) => {
            recordAttempt(`${exercise.id}::${question.id}`, succeeded);
          }}
        />
      </div>

      <footer className="mt-6 flex items-center justify-between">
        <button
          type="button"
          disabled={cursor === 0}
          onClick={() => {
            setCursor((c) => c - 1);
          }}
          className="rounded border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Précédente
        </button>
        <span className="text-xs text-slate-500">
          {cursor + 1} / {exercise.questions.length}
        </span>
        <button
          type="button"
          disabled={isLast}
          onClick={() => {
            setCursor((c) => c + 1);
          }}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Suivante →
        </button>
      </footer>
    </article>
  );
}
