import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import QcmRunner from '@/components/automatisms/QcmRunner';
import { getChapterContent } from '@/lib/content-loader';
import { shuffle } from '@/lib/randomizer';
import type { Automatism, ChapterSlug } from '@/lib/types';
import { useProgressStore } from '@/stores/progress-store';

export default function AutomatismsPage() {
  const { slug } = useParams<{ slug: string }>();
  const chapter = slug ? getChapterContent(slug as ChapterSlug) : null;
  const automatisms = chapter?.automatisms ?? [];

  const [sessionId, setSessionId] = useState(0);
  const [cursor, setCursor] = useState(0);

  const session: Automatism[] = useMemo(
    () => shuffle(automatisms),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sessionId, automatisms.length, slug]
  );

  const items = useProgressStore((s) => s.items);

  if (automatisms.length === 0) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-sm text-slate-600">
        Aucun automatisme pour ce chapitre pour le moment.
      </div>
    );
  }

  const current = session[cursor];
  const isFinished = cursor >= session.length;
  const sessionCorrect = session.filter((a) => items[a.id]?.succeeded).length;

  const restart = (): void => {
    setSessionId((n) => n + 1);
    setCursor(0);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      <header className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Question {Math.min(cursor + 1, session.length)} / {session.length}
        </p>
        <button
          type="button"
          onClick={restart}
          className="text-xs text-blue-600 hover:underline"
        >
          Recommencer une session
        </button>
      </header>

      {!isFinished && current && (
        <QcmRunner
          automatism={current}
          onNext={() => {
            setCursor((c) => c + 1);
          }}
        />
      )}

      {isFinished && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 text-center">
          <h3 className="text-lg font-semibold text-slate-900">
            Session terminée
          </h3>
          <p className="mt-2 text-sm text-slate-700">
            {sessionCorrect} / {session.length} réussite(s) (cumul historique du chapitre).
          </p>
          <button
            type="button"
            onClick={restart}
            className="mt-4 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Refaire une session
          </button>
        </div>
      )}
    </div>
  );
}
