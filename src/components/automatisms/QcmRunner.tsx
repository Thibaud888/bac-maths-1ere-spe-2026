import { useEffect, useMemo, useState } from 'react';
import { TextWithMath } from '@/components/math/TextWithMath';
import Timer from '@/components/shared/Timer';
import FigureRenderer from '@/components/figures/FigureRenderer';
import { shuffleChoices } from '@/lib/randomizer';
import type { Automatism } from '@/lib/types';
import { useProgressStore } from '@/stores/progress-store';

type QcmRunnerProps = {
  automatism: Automatism;
  onNext?: () => void;
  /**
   * Durée du timer en secondes. `null` désactive complètement le timer
   * (pas d'affichage, pas de timeout). `undefined` retombe sur la durée
   * spécifiée par l'item (ou 60 s par défaut).
   */
  timerSeconds?: number | null;
};

type Phase = 'idle' | 'revealed';

function parseNumericInput(input: string): number | null {
  const trimmed = input.trim().replace(',', '.');
  if (trimmed === '') return null;
  const fractionMatch = /^(-?\d+)\/(\d+)$/.exec(trimmed);
  if (fractionMatch) {
    const num = Number(fractionMatch[1]);
    const den = Number(fractionMatch[2]);
    if (den === 0) return null;
    return num / den;
  }
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function targetAnswerAsNumber(answer: number | string): number | null {
  if (typeof answer === 'number') return answer;
  return parseNumericInput(answer);
}

export default function QcmRunner({
  automatism,
  onNext,
  timerSeconds,
}: QcmRunnerProps) {
  const timerActive = timerSeconds !== null;
  const effectiveDuration =
    timerSeconds === undefined || timerSeconds === null
      ? (automatism.timeLimitSeconds ?? 60)
      : timerSeconds;
  const recordAttempt = useProgressStore((s) => s.recordAttempt);
  const [phase, setPhase] = useState<Phase>('idle');
  const [picked, setPicked] = useState<number | null>(null);
  const [numericInput, setNumericInput] = useState('');
  const [wasCorrect, setWasCorrect] = useState(false);

  // Mélange aléatoire des choix QCM, recalculé à chaque nouvelle question.
  const shuffled = useMemo(() => {
    if (automatism.type !== 'qcm' || !automatism.choices) {
      return null;
    }
    const correctIndex =
      typeof automatism.answer === 'number' ? automatism.answer : 0;
    return shuffleChoices(automatism.choices, correctIndex);
  }, [automatism]);

  // Reset state quand on change d'item.
  useEffect(() => {
    setPhase('idle');
    setPicked(null);
    setNumericInput('');
    setWasCorrect(false);
  }, [automatism.id]);

  const submitQcm = (chosenIdx: number): void => {
    if (phase !== 'idle' || !shuffled) return;
    const correct = chosenIdx === shuffled.correctIndex;
    setPicked(chosenIdx);
    setWasCorrect(correct);
    setPhase('revealed');
    recordAttempt(automatism.id, correct);
  };

  const submitNumeric = (): void => {
    if (phase !== 'idle') return;
    const userValue = parseNumericInput(numericInput);
    const target = targetAnswerAsNumber(automatism.answer);
    const tolerance = automatism.tolerance ?? 0;
    const correct =
      userValue !== null &&
      target !== null &&
      Math.abs(userValue - target) <= tolerance + 1e-9;
    setWasCorrect(correct);
    setPhase('revealed');
    recordAttempt(automatism.id, correct);
  };

  const onTimeout = (): void => {
    if (phase !== 'idle') return;
    setWasCorrect(false);
    setPhase('revealed');
    recordAttempt(automatism.id, false);
  };

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex items-start justify-between gap-3">
        <span className="text-xs uppercase tracking-wider text-slate-500">
          Automatisme · {automatism.domain}
        </span>
        {timerActive && (
          <Timer
            durationSeconds={effectiveDuration}
            paused={phase !== 'idle'}
            onTimeout={onTimeout}
            resetKey={automatism.id}
          />
        )}
      </header>

      <div className="mt-3 text-base leading-relaxed text-slate-800">
        <TextWithMath text={automatism.statement} />
      </div>

      {automatism.figure && (
        <div className="mt-3">
          <FigureRenderer figure={automatism.figure} />
        </div>
      )}

      {automatism.type === 'qcm' && shuffled && (
        <ul className="mt-4 space-y-2">
          {shuffled.choices.map((choice, idx) => {
            const isPicked = picked === idx;
            const isCorrect = idx === shuffled.correctIndex;
            const showAsCorrect = phase === 'revealed' && isCorrect;
            const showAsWrong = phase === 'revealed' && isPicked && !isCorrect;
            return (
              <li key={idx}>
                <button
                  type="button"
                  disabled={phase !== 'idle'}
                  onClick={() => {
                    submitQcm(idx);
                  }}
                  className={[
                    'w-full rounded border px-3 py-2 text-left text-sm transition-colors',
                    showAsCorrect
                      ? 'border-green-400 bg-green-50 text-green-900'
                      : showAsWrong
                        ? 'border-red-400 bg-red-50 text-red-900'
                        : phase === 'revealed'
                          ? 'border-slate-200 bg-slate-50 text-slate-500'
                          : 'border-slate-300 bg-white text-slate-800 hover:border-blue-400 hover:bg-blue-50',
                  ].join(' ')}
                >
                  <TextWithMath text={choice} />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {automatism.type === 'numeric' && (
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            inputMode="decimal"
            disabled={phase !== 'idle'}
            value={numericInput}
            onChange={(e) => {
              setNumericInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitNumeric();
            }}
            placeholder="Valeur ou fraction (ex. 3/4)"
            className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-slate-50"
          />
          <button
            type="button"
            disabled={phase !== 'idle' || numericInput.trim() === ''}
            onClick={submitNumeric}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Valider
          </button>
        </div>
      )}

      {phase === 'revealed' && (
        <div
          className={[
            'mt-4 rounded border p-4',
            wasCorrect
              ? 'border-green-200 bg-green-50/50'
              : 'border-red-200 bg-red-50/50',
          ].join(' ')}
        >
          <p
            className={[
              'text-sm font-semibold',
              wasCorrect ? 'text-green-800' : 'text-red-800',
            ].join(' ')}
          >
            {wasCorrect ? '✓ Correct.' : '✗ Pas tout à fait.'}
          </p>
          {automatism.type === 'numeric' && !wasCorrect && (
            <p className="mt-1 text-xs text-slate-600">
              Réponse attendue :{' '}
              <span className="font-mono">{String(automatism.answer)}</span>
            </p>
          )}
          <div className="mt-2 text-sm leading-relaxed text-slate-700">
            <TextWithMath text={automatism.explanation} />
          </div>
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="mt-3 rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Question suivante →
            </button>
          )}
        </div>
      )}
    </article>
  );
}
