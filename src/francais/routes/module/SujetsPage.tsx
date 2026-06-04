import { useParams, useSearchParams } from 'react-router-dom';
import { getFrenchModuleContent } from '@/francais/lib/french-content-loader';
import FrenchSubjectRunner from '@/francais/components/subjects/FrenchSubjectRunner';
import { useFrenchProgressStore } from '@/francais/stores/french-progress-store';
import type { FrenchModuleSlug } from '@/francais/lib/french-types';

const typeLabel = {
  commentaire: 'Commentaire',
  dissertation: 'Dissertation',
} as const;

export default function SujetsPage() {
  const { slug } = useParams<{ slug: string }>();
  const content = slug ? getFrenchModuleContent(slug as FrenchModuleSlug) : null;
  const [searchParams, setSearchParams] = useSearchParams();
  const items = useFrenchProgressStore((s) => s.items);

  if (!content) return null;

  const sujets = [...content.sujets].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );
  const activeId = searchParams.get('sujet');
  const active = sujets.find((s) => s.id === activeId);

  const open = (id: string): void => {
    setSearchParams({ sujet: id });
  };
  const close = (): void => {
    setSearchParams({});
  };

  if (active) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-6">
        <FrenchSubjectRunner subject={active} onClose={close} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-6">
      {sujets.length === 0 ? (
        <p className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-sm text-slate-500 dark:text-slate-400">
          Aucun sujet pour ce module pour l’instant.
        </p>
      ) : (
        <ul className="space-y-3">
          {sujets.map((sujet) => {
            const leafIds = sujet.steps.map((s) => `${sujet.id}::${s.id}`);
            const doneCount = leafIds.filter(
              (id) => items[id]?.succeeded
            ).length;
            const status =
              doneCount === 0
                ? 'À faire'
                : doneCount >= leafIds.length
                  ? 'Terminé'
                  : `En cours (${doneCount}/${leafIds.length})`;
            return (
              <li key={sujet.id}>
                <button
                  type="button"
                  onClick={() => { open(sujet.id); }}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-left shadow-sm transition-colors hover:border-indigo-400 dark:hover:border-indigo-500"
                >
                  <div>
                    <span className="inline-block rounded bg-indigo-100 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                      {typeLabel[sujet.type]}
                    </span>
                    <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                      {sujet.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {sujet.oeuvre} · Difficulté {sujet.difficulty} · ~
                      {sujet.estimatedMinutes} min
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
