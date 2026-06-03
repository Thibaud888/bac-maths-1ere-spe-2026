import { useEffect, useMemo, useRef, useState } from 'react';
import { LiteraryText } from '@/francais/components/text/LiteraryText';
import Timer from '@/components/shared/Timer';
import { shuffle, shuffleChoices } from '@/lib/randomizer';
import type { QuizItem } from '@/francais/lib/french-types';
import { useFrenchProgressStore } from '@/francais/stores/french-progress-store';

type QuizRunnerProps = {
  item: QuizItem;
  onNext?: () => void;
  onResult?: (succeeded: boolean) => void;
  timerSeconds?: number | null;
};

// 'correcting' only used for ordering: user sees green/red and can fix wrong items
type Phase = 'idle' | 'correcting' | 'revealed';

export default function QuizRunner({
  item,
  onNext,
  onResult,
  timerSeconds,
}: QuizRunnerProps) {
  const timerActive = timerSeconds !== null;
  const effectiveDuration =
    timerSeconds === undefined || timerSeconds === null
      ? (item.timeLimitSeconds ?? 60)
      : timerSeconds;
  const recordAttempt = useFrenchProgressStore((s) => s.recordAttempt);

  const [phase, setPhase] = useState<Phase>('idle');
  const [wasCorrect, setWasCorrect] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [ordered, setOrdered] = useState<{ text: string; original: number }[]>([]);
  // Index of the currently-selected ordering item (for click-to-swap)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const feedbackRef = useRef<HTMLDivElement>(null);

  // QCM : mélange des choix avec suivi de la bonne réponse.
  const qcm = useMemo(() => {
    if (item.type !== 'qcm' || !item.choices) return null;
    return shuffleChoices(item.choices, item.answer ?? 0);
  }, [item]);

  // Multi : choix mélangés en gardant l'index d'origine.
  const multi = useMemo(() => {
    if (item.type !== 'multi' || !item.choices) return null;
    const withIndex = item.choices.map((text, original) => ({ text, original }));
    return shuffle(withIndex);
  }, [item]);

  // Ordering : éléments mélangés, l'ordre attendu est l'ordre d'origine.
  const orderingShuffled = useMemo(() => {
    if (item.type !== 'ordering' || !item.items) return null;
    const withIndex = item.items.map((text, original) => ({ text, original }));
    return shuffle(withIndex);
  }, [item]);

  useEffect(() => {
    setPhase('idle');
    setWasCorrect(false);
    setPicked(null);
    setChecked(new Set());
    setOrdered(orderingShuffled ? [...orderingShuffled] : []);
    setSelectedIdx(null);
  }, [item.id, orderingShuffled]);

  // Auto-scroll to feedback when revealed
  useEffect(() => {
    if (phase === 'revealed' || phase === 'correcting') {
      feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [phase]);

  const reveal = (correct: boolean): void => {
    setWasCorrect(correct);
    setPhase('revealed');
    recordAttempt(item.id, correct);
    onResult?.(correct);
  };

  const submitQcm = (idx: number): void => {
    if (phase !== 'idle' || !qcm) return;
    setPicked(idx);
    reveal(idx === qcm.correctIndex);
  };

  const toggleCheck = (idx: number): void => {
    if (phase !== 'idle') return;
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const submitMulti = (): void => {
    if (phase !== 'idle' || !multi) return;
    const expected = new Set(item.answers ?? []);
    const selectedOriginals = new Set(
      [...checked].map((displayIdx) => multi[displayIdx]?.original ?? -1)
    );
    const correct =
      expected.size === selectedOriginals.size &&
      [...expected].every((e) => selectedOriginals.has(e));
    reveal(correct);
  };

  // Click-to-select-swap for ordering
  const handleOrderingClick = (idx: number): void => {
    if (phase === 'revealed') return;

    // In correcting phase, only allow moving items that are still wrong
    if (phase === 'correcting') {
      const el = ordered[idx];
      const isCorrectlyPlaced = el !== undefined && el.original === idx;
      // If clicking a correctly-placed item while nothing is selected, ignore
      if (isCorrectlyPlaced && selectedIdx === null) return;
    }

    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else if (selectedIdx === idx) {
      // Deselect
      setSelectedIdx(null);
    } else {
      // Swap the two items
      setOrdered((prev) => {
        const next = [...prev];
        const a = next[selectedIdx];
        const b = next[idx];
        if (a !== undefined && b !== undefined) {
          next[selectedIdx] = b;
          next[idx] = a;
        }
        return next;
      });
      setSelectedIdx(null);
    }
  };

  const submitOrdering = (): void => {
    if (phase !== 'idle') return;
    const correct = ordered.every((el, idx) => el.original === idx);
    setWasCorrect(correct);
    recordAttempt(item.id, correct);
    onResult?.(correct);
    if (correct) {
      setPhase('revealed');
    } else {
      setPhase('correcting'); // show green/red, allow fixing wrong items
    }
  };

  const onTimeout = (): void => {
    if (phase !== 'idle') return;
    reveal(false);
  };

  const isCorrectlyPlaced = (el: { original: number }, idx: number): boolean =>
    el.original === idx;

  return (
    <article className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
      <header className="flex items-start justify-between gap-3">
        <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Repère · {item.category}
        </span>
        {timerActive && (
          <Timer
            durationSeconds={effectiveDuration}
            paused={phase !== 'idle'}
            onTimeout={onTimeout}
            resetKey={item.id}
          />
        )}
      </header>

      <div className="mt-3 text-base leading-relaxed text-slate-800 dark:text-slate-200">
        <LiteraryText text={item.statement} />
      </div>

      {/* QCM */}
      {item.type === 'qcm' && qcm && (
        <ul className="mt-4 space-y-2">
          {qcm.choices.map((choice, idx) => {
            const isPicked = picked === idx;
            const isCorrect = idx === qcm.correctIndex;
            const showAsCorrect = phase === 'revealed' && isCorrect;
            const showAsWrong = phase === 'revealed' && isPicked && !isCorrect;
            return (
              <li key={idx}>
                <button
                  type="button"
                  disabled={phase !== 'idle'}
                  onClick={() => { submitQcm(idx); }}
                  className={choiceClass(showAsCorrect, showAsWrong, phase === 'revealed')}
                >
                  <LiteraryText text={choice} />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* MULTI */}
      {item.type === 'multi' && multi && (
        <>
          <ul className="mt-4 space-y-2">
            {multi.map((choice, idx) => {
              const isChecked = checked.has(idx);
              const isCorrect = (item.answers ?? []).includes(choice.original);
              const showAsCorrect = phase === 'revealed' && isCorrect;
              const showAsWrong = phase === 'revealed' && isChecked && !isCorrect;
              return (
                <li key={idx}>
                  <button
                    type="button"
                    disabled={phase !== 'idle'}
                    onClick={() => { toggleCheck(idx); }}
                    className={[
                      choiceClass(showAsCorrect, showAsWrong, phase === 'revealed'),
                      'flex items-center gap-2',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px]',
                        isChecked
                          ? 'border-indigo-500 bg-indigo-500 text-white'
                          : 'border-slate-400 text-transparent',
                      ].join(' ')}
                    >
                      ✓
                    </span>
                    <LiteraryText text={choice.text} />
                  </button>
                </li>
              );
            })}
          </ul>
          {phase === 'idle' && (
            <button
              type="button"
              onClick={submitMulti}
              className="mt-3 rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Valider
            </button>
          )}
        </>
      )}

      {/* ORDERING */}
      {item.type === 'ordering' && (
        <>
          {phase === 'idle' && (
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Touche un élément pour le sélectionner, puis touche un autre pour les échanger.
            </p>
          )}
          {phase === 'correcting' && (
            <p className="mt-3 text-xs text-amber-700 dark:text-amber-400 font-medium">
              Les éléments mal placés sont en rouge — tu peux encore les déplacer.
            </p>
          )}
          <ol className="mt-3 space-y-2">
            {ordered.map((el, idx) => {
              const isSelected = selectedIdx === idx && phase !== 'revealed';
              const placed = phase !== 'idle' && isCorrectlyPlaced(el, idx);
              const misplaced = phase !== 'idle' && !isCorrectlyPlaced(el, idx);
              const canInteract = phase !== 'revealed';
              // In correcting phase, correctly-placed items are locked (no pointer cursor)
              const isLocked = phase === 'correcting' && placed;

              return (
                <li
                  key={el.original}
                  onClick={() => { if (canInteract && !isLocked) handleOrderingClick(idx); }}
                  className={[
                    'flex items-center gap-3 rounded border px-3 py-2.5 text-sm transition-colors',
                    canInteract && !isLocked ? 'cursor-pointer' : 'cursor-default',
                    isSelected
                      ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-400'
                      : placed
                        ? 'border-green-400 bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-300'
                        : misplaced
                          ? 'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-300'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-300 dark:hover:border-indigo-600',
                  ].join(' ')}
                >
                  <span className="shrink-0 text-xs font-bold text-slate-400 w-4 text-center">
                    {idx + 1}
                  </span>
                  <LiteraryText text={el.text} />
                  {isSelected && (
                    <span className="ml-auto shrink-0 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      ↕ sélectionné
                    </span>
                  )}
                </li>
              );
            })}
          </ol>

          {phase === 'idle' && (
            <button
              type="button"
              onClick={submitOrdering}
              className="mt-3 rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Valider l'ordre
            </button>
          )}

          {phase === 'correcting' && (
            <div ref={feedbackRef} className="mt-4 rounded border border-amber-200 dark:border-amber-700 bg-amber-50/60 dark:bg-amber-900/20 p-4">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                ✗ Pas tout à fait — certains éléments sont mal placés.
              </p>
              <p className="mt-1 text-xs text-amber-700 dark:text-amber-500">
                Tu peux corriger les éléments rouges, puis voir la correction complète.
              </p>
              <button
                type="button"
                onClick={() => { setPhase('revealed'); }}
                className="mt-3 rounded bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Voir la correction →
              </button>
            </div>
          )}
        </>
      )}

      {/* Feedback panel — shown after validation for QCM/multi, or after "Voir la correction" for ordering */}
      {phase === 'revealed' && (
        <div
          ref={item.type !== 'ordering' ? feedbackRef : undefined}
          className={[
            'mt-4 rounded border p-4',
            wasCorrect
              ? 'border-green-200 dark:border-green-700 bg-green-50/50 dark:bg-green-900/20'
              : 'border-red-200 dark:border-red-700 bg-red-50/50 dark:bg-red-900/20',
          ].join(' ')}
        >
          <p
            className={[
              'text-sm font-semibold',
              wasCorrect ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400',
            ].join(' ')}
          >
            {wasCorrect ? '✓ Correct !' : '✗ Pas tout à fait.'}
          </p>
          <div className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <LiteraryText text={item.explanation} />
          </div>
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="mt-3 rounded bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Question suivante →
            </button>
          )}
        </div>
      )}
    </article>
  );
}

function choiceClass(correct: boolean, wrong: boolean, revealed: boolean): string {
  return [
    'w-full rounded border px-3 py-2 text-left text-sm transition-colors',
    correct
      ? 'border-green-400 bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-300'
      : wrong
        ? 'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-300'
        : revealed
          ? 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
  ].join(' ');
}
