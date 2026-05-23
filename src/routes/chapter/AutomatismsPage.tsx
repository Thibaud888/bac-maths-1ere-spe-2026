import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import QcmRunner from '@/components/automatisms/QcmRunner';
import { getChapterContent } from '@/lib/content-loader';
import { shuffle } from '@/lib/randomizer';
import type { Automatism, ChapterSlug } from '@/lib/types';
import { useAppStore } from '@/stores/app-store';
import { useProgressStore } from '@/stores/progress-store';

const TIMER_PRESETS = [60, 90, 120, 180] as const;

export default function AutomatismsPage() {
  const { slug } = useParams<{ slug: string }>();
  const chapter = slug ? getChapterContent(slug as ChapterSlug) : null;
  const automatisms = chapter?.automatisms ?? [];

  const [sessionId, setSessionId] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [sessionSuccesses, setSessionSuccesses] = useState(0);

  const timerEnabled = useAppStore((s) => s.automatismTimerEnabled);
  const setTimerEnabled = useAppStore((s) => s.setAutomatismTimerEnabled);
  const timerSeconds = useAppStore((s) => s.automatismTimerSeconds);
  const setTimerSeconds = useAppStore((s) => s.setAutomatismTimerSeconds);
  const filterSucceeded = useAppStore((s) => s.automatismFilterSucceeded);
  const setFilterSucceeded = useAppStore((s) => s.setAutomatismFilterSucceeded);

  const items = useProgressStore((s) => s.items);

  // Pool figé au démarrage de la session (snapshot de items au moment du calcul).
  // items n'est pas dans les dépendances pour éviter un reshuffling mid-session.
  const session: Automatism[] = useMemo(() => {
    const pending = automatisms.filter((a) => !items[a.id]?.succeeded);
    const pool = filterSucceeded && pending.length > 0 ? pending : automatisms;
    return shuffle(pool);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, automatisms.length, slug]);

  if (automatisms.length === 0) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-sm text-slate-600 dark:text-slate-400">
        Aucun automatisme pour ce chapitre pour le moment.
      </div>
    );
  }

  const current = session[cursor];
  const isFinished = cursor >= session.length;

  // Compteurs globaux (historique, pas spécifiques à la session).
  const totalSucceeded = automatisms.filter((a) => items[a.id]?.succeeded).length;
  const totalPending = automatisms.length - totalSucceeded;

  const restart = (): void => {
    setSessionId((n) => n + 1);
    setCursor(0);
    setSessionSuccesses(0);
  };

  const handleFilterChange = (checked: boolean): void => {
    setFilterSucceeded(checked);
    restart();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      <header className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Question {Math.min(cursor + 1, session.length)} / {session.length}
            {cursor > 0 && (
              <span className="ml-3 font-medium text-green-600 dark:text-green-400">
                ✓ {sessionSuccesses} réussi{sessionSuccesses !== 1 ? 's' : ''}
              </span>
            )}
          </p>
          {filterSucceeded && totalPending < automatisms.length && (
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {totalPending > 0
                ? `${totalPending} à travailler · ${totalSucceeded} déjà réussi${totalSucceeded !== 1 ? 's' : ''}`
                : `Tous les ${automatisms.length} automatismes sont réussis — on revoit tout !`}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={restart}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          Recommencer une session
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-3 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-700 dark:text-slate-300">
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={timerEnabled}
            onChange={(e) => {
              setTimerEnabled(e.target.checked);
            }}
            className="h-4 w-4 cursor-pointer"
          />
          <span className="font-medium">Chronomètre</span>
        </label>
        {timerEnabled && (
          <div className="inline-flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400">durée :</span>
            <select
              value={timerSeconds}
              onChange={(e) => {
                setTimerSeconds(Number(e.target.value));
              }}
              className="rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-2 py-1 text-xs"
            >
              {TIMER_PRESETS.map((s) => (
                <option key={s} value={s}>
                  {s < 60 ? `${s} s` : `${Math.round(s / 60)} min`}
                </option>
              ))}
            </select>
          </div>
        )}
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={filterSucceeded}
            onChange={(e) => {
              handleFilterChange(e.target.checked);
            }}
            className="h-4 w-4 cursor-pointer"
          />
          <span className="font-medium">Masquer les exercices déjà réussis</span>
        </label>
      </div>

      {!isFinished && current && (
        <QcmRunner
          automatism={current}
          onNext={() => {
            setCursor((c) => c + 1);
          }}
          onResult={(ok) => {
            if (ok) setSessionSuccesses((n) => n + 1);
          }}
          timerSeconds={timerEnabled ? timerSeconds : null}
        />
      )}

      {isFinished && (
        <div className="rounded-lg border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 p-6 text-center">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Session terminée
          </h3>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
            Cette session :{' '}
            <span className="font-semibold text-green-700 dark:text-green-400">
              {sessionSuccesses} / {session.length} réussi{sessionSuccesses !== 1 ? 's' : ''}
            </span>
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Total du chapitre : {totalSucceeded} / {automatisms.length} réussi{totalSucceeded !== 1 ? 's' : ''}
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
