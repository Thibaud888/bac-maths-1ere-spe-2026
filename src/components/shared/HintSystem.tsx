import { useEffect, useState } from 'react';
import { TextWithMath } from '@/components/math/TextWithMath';

type HintSystemProps = {
  hints: readonly string[];
  solution: string;
  expectedAnswer?: string;
  /** Appelé quand l'utilisateur s'auto-évalue après avoir vu la solution. */
  onSelfAssess?: (succeeded: boolean) => void;
  /** Re-set l'état interne quand cette clé change (passage à l'item suivant). */
  resetKey?: string;
};

export default function HintSystem({
  hints,
  solution,
  expectedAnswer,
  onSelfAssess,
  resetKey,
}: HintSystemProps) {
  const [revealedHints, setRevealedHints] = useState(0);
  const [hintsCollapsed, setHintsCollapsed] = useState(false);
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const [solutionCollapsed, setSolutionCollapsed] = useState(false);
  const [assessed, setAssessed] = useState<'success' | 'fail' | null>(null);

  useEffect(() => {
    setRevealedHints(0);
    setHintsCollapsed(false);
    setSolutionRevealed(false);
    setSolutionCollapsed(false);
    setAssessed(null);
  }, [resetKey]);

  return (
    <div className="space-y-3">
      {revealedHints > 0 && (
        <div>
          <button
            type="button"
            onClick={() => { setHintsCollapsed((v) => !v); }}
            className="mb-1 flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline"
          >
            {hintsCollapsed ? (
              <>
                <ChevronDownIcon /> Afficher les indices ({revealedHints})
              </>
            ) : (
              <>
                <ChevronUpIcon /> Masquer les indices
              </>
            )}
          </button>
          {!hintsCollapsed && (
            <ol className="space-y-2">
              {hints.slice(0, revealedHints).map((h, i) => (
                <li
                  key={i}
                  className="rounded border border-amber-200 dark:border-amber-700 bg-amber-50/40 dark:bg-amber-900/20 p-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                >
                  <span className="mr-2 font-semibold text-amber-700 dark:text-amber-400">
                    Indice {i + 1}.
                  </span>
                  <TextWithMath text={h} />
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {revealedHints < hints.length && !solutionRevealed && (
          <button
            type="button"
            onClick={() => {
              setRevealedHints((n) => n + 1);
              setHintsCollapsed(false);
            }}
            className="rounded border border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 text-sm text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40"
          >
            Indice {revealedHints + 1}
          </button>
        )}
        {!solutionRevealed && (
          <button
            type="button"
            onClick={() => {
              setSolutionRevealed(true);
              setSolutionCollapsed(false);
            }}
            className="rounded border border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 text-sm text-blue-800 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40"
          >
            Voir la solution
          </button>
        )}
      </div>

      {solutionRevealed && (
        <div className="rounded border border-blue-200 dark:border-blue-700 bg-blue-50/40 dark:bg-blue-900/20 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Solution
            </p>
            <button
              type="button"
              onClick={() => { setSolutionCollapsed((v) => !v); }}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              {solutionCollapsed ? (
                <><ChevronDownIcon /> Afficher</>
              ) : (
                <><ChevronUpIcon /> Masquer</>
              )}
            </button>
          </div>

          {!solutionCollapsed && (
            <>
              {expectedAnswer && (
                <>
                  <p className="mt-2 text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Réponse attendue
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                    <TextWithMath text={expectedAnswer} />
                  </p>
                </>
              )}
              <p
                className={[
                  'text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400',
                  expectedAnswer ? 'mt-3' : 'mt-2',
                ].join(' ')}
              >
                Solution rédigée
              </p>
              <div className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <TextWithMath text={solution} />
              </div>

              {onSelfAssess && assessed === null && (
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAssessed('success');
                      onSelfAssess(true);
                    }}
                    className="rounded bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
                  >
                    ✓ Je l'ai réussi
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAssessed('fail');
                      onSelfAssess(false);
                    }}
                    className="rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600"
                  >
                    ✗ À retravailler
                  </button>
                </div>
              )}
              {assessed && (
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  {assessed === 'success'
                    ? 'Marqué comme réussi.'
                    : 'Marqué à retravailler.'}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ChevronUpIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3"
      aria-hidden="true"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
