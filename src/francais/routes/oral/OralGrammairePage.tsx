import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOralContent } from '@/francais/lib/french-content-loader';
import FicheCard from '@/francais/components/fiches/FicheCard';
import QuizRunner from '@/francais/components/quiz/QuizRunner';
import RevisedToggle from '@/francais/components/oral/RevisedToggle';
import { shuffle } from '@/lib/randomizer';

export default function OralGrammairePage() {
  const { eleve } = useParams<{ eleve: string }>();
  const { grammaireFiches, grammaireQuiz } = useMemo(() => getOralContent(), []);

  const [sessionKey, setSessionKey] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);

  const pool = useMemo(
    () => shuffle([...grammaireQuiz]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [grammaireQuiz, sessionKey]
  );

  const current = pool[cursor];
  const done = cursor >= pool.length;

  function restart() {
    setSessionKey((k) => k + 1);
    setCursor(0);
    setCorrect(0);
    setAnswered(0);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Grammaire</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Les points au programme de 1ʳᵉ : les propositions subordonnées,
        l’interrogation et la négation.
      </p>

      {grammaireFiches.length > 0 && (
        <div className="mt-6 space-y-4">
          {grammaireFiches.map((fiche) => (
            <div key={fiche.id}>
              <FicheCard fiche={fiche} />
              <div className="mt-2">
                <RevisedToggle
                  checkKey={`${eleve ?? ''}::gram::${fiche.id}`}
                  compactLabel
                  label="Marquer ce point comme revu"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-8 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        S’entraîner
      </h2>

      {pool.length === 0 ? (
        <p className="mt-3 rounded border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-300">
          Les exercices de grammaire arrivent bientôt.
        </p>
      ) : done ? (
        <div className="mt-3 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 text-center">
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Session terminée
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Score : {correct} / {answered}
          </p>
          <button
            type="button"
            onClick={restart}
            className="mt-4 rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Recommencer
          </button>
        </div>
      ) : (
        current && (
          <div className="mt-3">
            <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
              {cursor + 1} / {pool.length}
            </p>
            <QuizRunner
              key={current.id}
              item={current}
              timerSeconds={null}
              onResult={(ok) => {
                setAnswered((n) => n + 1);
                if (ok) setCorrect((n) => n + 1);
              }}
              onNext={() => { setCursor((c) => c + 1); }}
            />
          </div>
        )
      )}
    </div>
  );
}
