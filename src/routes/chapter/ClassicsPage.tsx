import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ExerciseRunner from '@/components/exercises/ExerciseRunner';
import { getChapterContent } from '@/lib/content-loader';
import type { ChapterSlug } from '@/lib/types';

const difficultyLabel = ['', 'Facile', 'Standard', 'Exigeant'] as const;

export default function ClassicsPage() {
  const { slug } = useParams<{ slug: string }>();
  const chapter = slug ? getChapterContent(slug as ChapterSlug) : null;

  const exercises = useMemo(() => {
    const list = chapter?.classics ?? [];
    return [...list].sort((a, b) => {
      const orderDelta = (a.order ?? 999) - (b.order ?? 999);
      if (orderDelta !== 0) return orderDelta;
      return a.difficulty - b.difficulty;
    });
  }, [chapter]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const active = exercises.find((e) => e.id === activeId) ?? null;

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
            setActiveId(null);
          }}
        />
      ) : (
        <ul className="space-y-2">
          {exercises.map((exo) => (
            <li key={exo.id}>
              <button
                type="button"
                onClick={() => {
                  setActiveId(exo.id);
                }}
                className="flex w-full items-center justify-between rounded border border-slate-200 bg-white p-3 text-left hover:border-blue-400"
              >
                <span className="text-sm font-medium text-slate-900">
                  {exo.title}
                </span>
                <span className="text-xs text-slate-500">
                  {difficultyLabel[exo.difficulty]} · ~{exo.estimatedMinutes} min · {exo.questions.length} question(s)
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
