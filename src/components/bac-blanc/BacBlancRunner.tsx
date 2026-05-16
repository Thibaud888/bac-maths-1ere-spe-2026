import { useMemo, useState } from 'react';
import ExamRunner from '@/components/exam/ExamRunner';
import Timer from '@/components/shared/Timer';
import Part1Runner from './Part1Runner';
import {
  resolveAutomatisms,
  resolveExamExercises,
} from '@/lib/bac-blanc-loader';
import type { BacBlancPaper } from '@/lib/types';

type Props = {
  paper: BacBlancPaper;
  onClose: () => void;
};

type Tab = 'part1' | 'part2';

export default function BacBlancRunner({ paper, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('part1');

  const automatisms = useMemo(
    () => resolveAutomatisms(paper.part1.automatismIds),
    [paper]
  );
  const exercises = useMemo(
    () => resolveExamExercises(paper.part2.exerciseIds),
    [paper]
  );

  const tabClass = (active: boolean): string =>
    [
      'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
      active
        ? 'bg-white text-slate-900 shadow-sm'
        : 'text-slate-600 hover:text-slate-900',
    ].join(' ');

  return (
    <div className="space-y-5">
      <header className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Bac blanc · {paper.durationMinutes} min · sans calculatrice
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {paper.title}
            </h2>
            {paper.subtitle && (
              <p className="mt-1 text-sm text-slate-600">{paper.subtitle}</p>
            )}
            <p className="mt-2 text-xs text-slate-500">
              Partie 1 : {paper.part1.totalMarks} pts ({automatisms.length} automatismes) ·
              Partie 2 : {paper.part2.totalMarks} pts ({exercises.length} exercices)
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Timer
              durationSeconds={paper.durationMinutes * 60}
              resetKey={paper.id}
            />
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-slate-500 hover:text-slate-800"
            >
              Quitter le sujet
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-1 rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setTab('part1');
            }}
            className={tabClass(tab === 'part1')}
          >
            Partie 1 — Automatismes
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('part2');
            }}
            className={tabClass(tab === 'part2')}
          >
            Partie 2 — Exercices
          </button>
        </div>
      </header>

      {tab === 'part1' && (
        <Part1Runner paperId={paper.id} automatisms={automatisms} />
      )}

      {tab === 'part2' && (
        <div className="space-y-6">
          {exercises.map((exo, idx) => (
            <section key={exo.id}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Exercice {idx + 1}
              </p>
              <ExamRunner exercise={exo} />
            </section>
          ))}
          {exercises.length === 0 && (
            <p className="text-sm text-slate-500">
              Aucun exercice disponible pour la Partie 2.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
