import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFrenchModuleContent } from '@/francais/lib/french-content-loader';
import QuizRunner from '@/francais/components/quiz/QuizRunner';
import { shuffle } from '@/lib/randomizer';
import { useFrenchAppStore } from '@/francais/stores/french-app-store';
import { useFrenchProgressStore } from '@/francais/stores/french-progress-store';
import type { FrenchModuleSlug, QuizItem } from '@/francais/lib/french-types';

export default function QuizPage() {
  const { slug } = useParams<{ slug: string }>();
  // Memoïsé sur le slug : getFrenchModuleContent reconstruit des tableaux
  // neufs à chaque appel, ce qui ferait remonter le QuizRunner à chaque
  // re-render (et masquerait la correction).
  const content = useMemo(
    () => (slug ? getFrenchModuleContent(slug as FrenchModuleSlug) : null),
    [slug]
  );

  const timerEnabled = useFrenchAppStore((s) => s.quizTimerEnabled);
  const setTimerEnabled = useFrenchAppStore((s) => s.setQuizTimerEnabled);
  const timerSeconds = useFrenchAppStore((s) => s.quizTimerSeconds);
  const filterSucceeded = useFrenchAppStore((s) => s.quizFilterSucceeded);
  const setFilterSucceeded = useFrenchAppStore((s) => s.setQuizFilterSucceeded);

  const [sessionKey, setSessionKey] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);

  const pool = useMemo(() => {
    const allQuiz = content?.quiz ?? [];
    // Le filtre "masquer les réussis" est figé au démarrage de la session
    // (lecture ponctuelle du store, hors dépendances) pour ne pas reshuffler
    // pendant qu'on répond.
    const base = filterSucceeded
      ? allQuiz.filter(
          (q) => !useFrenchProgressStore.getState().items[q.id]?.succeeded
        )
      : allQuiz;
    return shuffle(base);
    // sessionKey force le re-mélange au redémarrage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, filterSucceeded, sessionKey]);

  if (!content) return null;

  const restart = (): void => {
    setSessionKey((k) => k + 1);
    setCursor(0);
    setCorrect(0);
    setAnswered(0);
  };

  const current: QuizItem | undefined = pool[cursor];
  const done = cursor >= pool.length;

  return (
    <div className="mx-auto max-w-2xl px-6 py-6">
      <div className="mb-4 flex flex-wrap items-center gap-4 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm">
        <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={filterSucceeded}
            onChange={(e) => { setFilterSucceeded(e.target.checked); }}
          />
          Masquer les réussis
        </label>
        <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={timerEnabled}
            onChange={(e) => { setTimerEnabled(e.target.checked); }}
          />
          Chronomètre
        </label>
        <span className="ml-auto text-slate-500 dark:text-slate-400">
          {answered > 0 && `${correct}/${answered} correct`}
        </span>
      </div>

      {pool.length === 0 ? (
        <div className="rounded border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 p-6 text-center">
          <p className="text-sm text-emerald-800 dark:text-emerald-300">
            Rien à réviser ici — tout est marqué comme réussi. 🎉
          </p>
          <button
            type="button"
            onClick={() => { setFilterSucceeded(false); }}
            className="mt-3 rounded bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Tout revoir
          </button>
        </div>
      ) : done ? (
        <div className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 text-center">
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Session terminée
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Score : {correct} / {answered}
          </p>
          <button
            type="button"
            onClick={restart}
            className="mt-4 rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Recommencer
          </button>
        </div>
      ) : (
        current && (
          <>
            <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
              {cursor + 1} / {pool.length}
            </p>
            <QuizRunner
              key={current.id}
              item={current}
              timerSeconds={timerEnabled ? timerSeconds : null}
              onResult={(ok) => {
                setAnswered((n) => n + 1);
                if (ok) setCorrect((n) => n + 1);
              }}
              onNext={() => { setCursor((c) => c + 1); }}
            />
          </>
        )
      )}
    </div>
  );
}
