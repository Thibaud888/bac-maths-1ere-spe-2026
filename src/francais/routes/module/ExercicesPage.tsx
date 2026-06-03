import { useSearchParams } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getFrenchModuleContent } from '@/francais/lib/french-content-loader';
import FrenchExerciseRunner from '@/francais/components/exercices/FrenchExerciseRunner';
import { useFrenchProgressStore } from '@/francais/stores/french-progress-store';
import type { FrenchModuleSlug } from '@/francais/lib/french-types';

export default function ExercicesPage() {
  const { slug } = useParams<{ slug: string }>();
  const content = slug ? getFrenchModuleContent(slug as FrenchModuleSlug) : null;
  const [searchParams, setSearchParams] = useSearchParams();
  const items = useFrenchProgressStore((s) => s.items);

  if (!content) return null;

  const exercices = [...content.exercices].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );
  const activeId = searchParams.get('exo');
  const active = exercices.find((e) => e.id === activeId);

  const open = (id: string): void => {
    setSearchParams({ exo: id });
  };
  const close = (): void => {
    setSearchParams({});
  };

  if (active) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-6">
        <FrenchExerciseRunner exercise={active} onClose={close} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-6">
      {exercices.length === 0 ? (
        <p className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-sm text-slate-500 dark:text-slate-400">
          Aucun exercice pour ce module pour l’instant.
        </p>
      ) : (
        <ul className="space-y-3">
          {exercices.map((exo) => {
            const leafIds = exo.questions.map((q) => `${exo.id}::${q.id}`);
            const doneCount = leafIds.filter((id) => items[id]?.succeeded).length;
            const status =
              doneCount === 0
                ? 'À faire'
                : doneCount >= leafIds.length
                  ? 'Terminé'
                  : `En cours (${doneCount}/${leafIds.length})`;
            return (
              <li key={exo.id}>
                <button
                  type="button"
                  onClick={() => { open(exo.id); }}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-left shadow-sm transition-colors hover:border-indigo-400 dark:hover:border-indigo-500"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {exo.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      Difficulté {exo.difficulty} · ~{exo.estimatedMinutes} min ·{' '}
                      {exo.questions.length} question{exo.questions.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <span
                    className={[
                      'shrink-0 rounded px-2 py-0.5 text-xs',
                      doneCount >= leafIds.length && leafIds.length > 0
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : doneCount > 0
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
                    ].join(' ')}
                  >
                    {status}
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
