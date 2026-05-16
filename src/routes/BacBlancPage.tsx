import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import BacBlancRunner from '@/components/bac-blanc/BacBlancRunner';
import {
  getBacBlancPaper,
  listBacBlancPapers,
  resolveExamExercises,
} from '@/lib/bac-blanc-loader';
import type { BacBlancPaper } from '@/lib/types';
import { useProgressStore, type ItemProgress } from '@/stores/progress-store';

type Status = 'not-started' | 'in-progress' | 'completed';

const statusStyle: Record<
  Status,
  { dot: string; chip: string; label: string }
> = {
  'not-started': {
    dot: 'bg-slate-300',
    chip: 'bg-slate-100 text-slate-600',
    label: 'Pas commencé',
  },
  'in-progress': {
    dot: 'bg-amber-500',
    chip: 'bg-amber-100 text-amber-800',
    label: 'En cours',
  },
  completed: {
    dot: 'bg-green-500',
    chip: 'bg-green-100 text-green-800',
    label: 'Terminé',
  },
};

function paperLeafIds(paper: BacBlancPaper): string[] {
  const ids: string[] = [...paper.part1.automatismIds];
  const exercises = resolveExamExercises(paper.part2.exerciseIds);
  for (const exo of exercises) {
    for (const q of exo.questions) {
      if (q.subquestions && q.subquestions.length > 0) {
        for (const sub of q.subquestions) {
          ids.push(`${exo.id}::${sub.id}`);
        }
      } else {
        ids.push(`${exo.id}::${q.id}`);
      }
    }
  }
  return ids;
}

function paperStatus(
  paper: BacBlancPaper,
  items: Record<string, ItemProgress>
): { status: Status; attempted: number; succeeded: number; total: number } {
  const ids = paperLeafIds(paper);
  const total = ids.length;
  let attempted = 0;
  let succeeded = 0;
  for (const id of ids) {
    const entry = items[id];
    if (entry) {
      attempted += 1;
      if (entry.succeeded) succeeded += 1;
    }
  }
  let status: Status;
  if (attempted === 0) status = 'not-started';
  else if (succeeded === total) status = 'completed';
  else status = 'in-progress';
  return { status, attempted, succeeded, total };
}

export default function BacBlancPage() {
  const papers = useMemo(() => listBacBlancPapers(), []);
  const [searchParams, setSearchParams] = useSearchParams();
  const items = useProgressStore((s) => s.items);

  const activeId = searchParams.get('sujet');
  const active = activeId ? getBacBlancPaper(activeId) : null;

  const setActive = (id: string | null): void => {
    if (id === null) {
      setSearchParams({});
    } else {
      setSearchParams({ sujet: id });
    }
  };

  if (papers.length === 0) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-sm text-slate-600">
        Aucun sujet de bac blanc disponible pour le moment.
      </div>
    );
  }

  if (active) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <BacBlancRunner
          paper={active}
          onClose={() => {
            setActive(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Bac blanc
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Sujets d'entraînement complets, format EAM 2026 : 2 heures, sans
          calculatrice. Chaque sujet comporte une Partie 1 d'automatismes
          (6 pts) et une Partie 2 de deux exercices indépendants (14 pts).
        </p>
      </section>

      <ul className="space-y-3">
        {papers.map((paper) => {
          const { status, succeeded, total } = paperStatus(paper, items);
          const sty = statusStyle[status];
          return (
            <li key={paper.id}>
              <button
                type="button"
                onClick={() => {
                  setActive(paper.id);
                }}
                className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left transition-colors hover:border-blue-400"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`h-2.5 w-2.5 flex-none rounded-full ${sty.dot}`}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {paper.title}
                    </p>
                    {paper.subtitle && (
                      <p className="mt-0.5 truncate text-xs text-slate-600">
                        {paper.subtitle}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">
                      {paper.durationMinutes} min ·{' '}
                      {paper.part1.totalMarks + paper.part2.totalMarks} pts
                    </p>
                  </div>
                </div>
                <span
                  className={`flex-none rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${sty.chip}`}
                >
                  {status === 'not-started'
                    ? sty.label
                    : `${sty.label} (${succeeded}/${total})`}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
