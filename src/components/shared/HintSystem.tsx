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
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const [assessed, setAssessed] = useState<'success' | 'fail' | null>(null);

  useEffect(() => {
    setRevealedHints(0);
    setSolutionRevealed(false);
    setAssessed(null);
  }, [resetKey]);

  return (
    <div className="space-y-3">
      {revealedHints > 0 && (
        <ol className="space-y-2">
          {hints.slice(0, revealedHints).map((h, i) => (
            <li
              key={i}
              className="rounded border border-amber-200 bg-amber-50/40 p-3 text-sm leading-relaxed text-slate-700"
            >
              <span className="mr-2 font-semibold text-amber-700">
                Indice {i + 1}.
              </span>
              <TextWithMath text={h} />
            </li>
          ))}
        </ol>
      )}

      <div className="flex flex-wrap gap-2">
        {revealedHints < hints.length && !solutionRevealed && (
          <button
            type="button"
            onClick={() => {
              setRevealedHints((n) => n + 1);
            }}
            className="rounded border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm text-amber-800 hover:bg-amber-100"
          >
            Indice {revealedHints + 1}
          </button>
        )}
        {!solutionRevealed && (
          <button
            type="button"
            onClick={() => {
              setSolutionRevealed(true);
            }}
            className="rounded border border-blue-300 bg-blue-50 px-3 py-1.5 text-sm text-blue-800 hover:bg-blue-100"
          >
            Voir la solution
          </button>
        )}
      </div>

      {solutionRevealed && (
        <div className="rounded border border-blue-200 bg-blue-50/40 p-4">
          {expectedAnswer && (
            <>
              <p className="text-xs uppercase tracking-wider text-blue-600">
                Réponse attendue
              </p>
              <p className="mt-1 text-sm font-medium text-slate-800">
                <TextWithMath text={expectedAnswer} />
              </p>
            </>
          )}
          <p
            className={[
              'text-xs uppercase tracking-wider text-blue-600',
              expectedAnswer ? 'mt-3' : '',
            ].join(' ')}
          >
            Solution rédigée
          </p>
          <div className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-700">
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
                className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                ✗ À retravailler
              </button>
            </div>
          )}
          {assessed && (
            <p className="mt-3 text-xs text-slate-500">
              {assessed === 'success'
                ? 'Marqué comme réussi.'
                : 'Marqué à retravailler.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
