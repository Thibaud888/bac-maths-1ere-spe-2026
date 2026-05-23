import { useMemo, useState } from 'react';
import QcmRunner from '@/components/automatisms/QcmRunner';
import type { Automatism } from '@/lib/types';
import { useProgressStore } from '@/stores/progress-store';

type Props = {
  paperId: string;
  automatisms: Automatism[];
};

export default function Part1Runner({ paperId, automatisms }: Props) {
  const [cursor, setCursor] = useState(0);
  const items = useProgressStore((s) => s.items);

  const session = useMemo(() => automatisms, [automatisms]);

  if (session.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Aucun automatisme disponible pour la Partie 1.
      </p>
    );
  }

  const isFinished = cursor >= session.length;
  const current = session[cursor];
  const correct = session.filter((a) => items[a.id]?.succeeded).length;

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <span>
          Question {Math.min(cursor + 1, session.length)} / {session.length}
        </span>
        <button
          type="button"
          onClick={() => {
            setCursor(0);
          }}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Recommencer la Partie 1
        </button>
      </header>

      {!isFinished && current && (
        <QcmRunner
          key={`${paperId}-${current.id}`}
          automatism={current}
          onNext={() => {
            setCursor((c) => c + 1);
          }}
          timerSeconds={null}
        />
      )}

      {isFinished && (
        <div className="rounded-lg border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 p-6 text-center">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Partie 1 terminée
          </h3>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
            {correct} / {session.length} bonne(s) réponse(s) (cumul historique).
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Passe à la Partie 2 en cliquant sur l'onglet ci-dessus.
          </p>
        </div>
      )}
    </div>
  );
}
