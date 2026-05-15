import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ExerciseRunner from '@/components/exercises/ExerciseRunner';
import { TextWithMath } from '@/components/math/TextWithMath';
import { getChapterContent } from '@/lib/content-loader';
import type { ChapterSlug, ClassicExercise } from '@/lib/types';
import { useProgressStore, type ItemProgress } from '@/stores/progress-store';

const difficultyLabel = ['', 'Facile', 'Standard', 'Exigeant'] as const;

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
    label: 'À retravailler',
  },
  completed: {
    dot: 'bg-green-500',
    chip: 'bg-green-100 text-green-800',
    label: 'Réussi',
  },
};

function exerciseStatus(
  exercise: ClassicExercise,
  items: Record<string, ItemProgress>
): { status: Status; succeeded: number; attempted: number; total: number } {
  const total = exercise.questions.length;
  let attempted = 0;
  let succeeded = 0;
  for (const q of exercise.questions) {
    const entry = items[`${exercise.id}::${q.id}`];
    if (entry) {
      attempted += 1;
      if (entry.succeeded) succeeded += 1;
    }
  }
  let status: Status;
  if (attempted === 0) status = 'not-started';
  else if (succeeded === total) status = 'completed';
  else status = 'in-progress';
  return { status, succeeded, attempted, total };
}

export default function ClassicsPage() {
  const { slug } = useParams<{ slug: string }>();
  const chapter = slug ? getChapterContent(slug as ChapterSlug) : null;
  const [searchParams, setSearchParams] = useSearchParams();
  const items = useProgressStore((s) => s.items);

  const exercises = useMemo(() => {
    const list = chapter?.classics ?? [];
    return [...list].sort((a, b) => {
      const orderDelta = (a.order ?? 999) - (b.order ?? 999);
      if (orderDelta !== 0) return orderDelta;
      return a.difficulty - b.difficulty;
    });
  }, [chapter]);

  const activeId = searchParams.get('exo');
  const active = exercises.find((e) => e.id === activeId) ?? null;
  const setActive = (id: string | null): void => {
    if (id === null) {
      setSearchParams({});
    } else {
      setSearchParams({ exo: id });
    }
  };

  if (exercises.length === 0) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-sm text-slate-600">
        Aucun exercice classique pour ce chapitre pour le moment.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      {active ? (
        <ExerciseRunner
          exercise={active}
          onClose={() => {
            setActive(null);
          }}
        />
      ) : (
        <ul className="space-y-2">
          {exercises.map((exo) => {
            const { status, succeeded, total } = exerciseStatus(exo, items);
            const sty = statusStyle[status];
            return (
              <li key={exo.id}>
                <button
                  type="button"
                  onClick={() => {
                    setActive(exo.id);
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded border border-slate-200 bg-white p-3 text-left hover:border-blue-400"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 flex-none rounded-full ${sty.dot}`}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        <TextWithMath text={exo.title} />
                      </p>
                      <p className="text-xs text-slate-500">
                        {difficultyLabel[exo.difficulty]} · ~{exo.estimatedMinutes} min · {total} question{total > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`flex-none rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${sty.chip}`}
                  >
                    {status === 'completed'
                      ? `${sty.label} (${succeeded}/${total})`
                      : status === 'in-progress'
                        ? `${sty.label} (${succeeded}/${total})`
                        : sty.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
