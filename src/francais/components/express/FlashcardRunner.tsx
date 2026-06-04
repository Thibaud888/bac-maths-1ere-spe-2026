import { useState } from 'react';
import { LiteraryText } from '@/francais/components/text/LiteraryText';
import type { Flashcard, FrenchAccent } from '@/francais/lib/french-types';
import { useFrenchProgressStore } from '@/francais/stores/french-progress-store';

type FlashcardRunnerProps = {
  cards: Flashcard[];
  totalDeckCards: number;
  onClose: () => void;
};

const accentBar: Record<FrenchAccent, string> = {
  red: 'bg-rose-400',
  blue: 'bg-sky-400',
  amber: 'bg-amber-400',
  emerald: 'bg-emerald-400',
  violet: 'bg-violet-400',
  slate: 'bg-slate-400',
};

type Phase = 'front' | 'back';

export default function FlashcardRunner({ cards, totalDeckCards, onClose }: FlashcardRunnerProps) {
  const recordAttempt = useFrenchProgressStore((s) => s.recordAttempt);

  const [queue, setQueue] = useState<Flashcard[]>(() => [...cards]);
  const [requeuedIds, setRequeuedIds] = useState<ReadonlySet<string>>(new Set());
  const [position, setPosition] = useState(0);
  const [phase, setPhase] = useState<Phase>('front');
  const [stats, setStats] = useState({ knew: 0, skip: 0, review: 0 });

  const isDone = position >= queue.length;
  const card = isDone ? null : queue[position];
  const initialCount = totalDeckCards;

  function handleFlip() {
    setPhase('back');
  }

  function handleKnew() {
    if (!card) return;
    recordAttempt(card.id, true);
    setStats((s) => ({ ...s, knew: s.knew + 1 }));
    setPhase('front');
    setPosition((p) => p + 1);
  }

  function handleSkip() {
    setStats((s) => ({ ...s, skip: s.skip + 1 }));
    setPhase('front');
    setPosition((p) => p + 1);
  }

  function handleReview() {
    if (!card) return;
    if (requeuedIds.has(card.id)) {
      recordAttempt(card.id, false);
      setStats((s) => ({ ...s, review: s.review + 1 }));
    } else {
      setQueue((q) => [...q, card]);
      setRequeuedIds((ids) => {
        const next = new Set(ids);
        next.add(card.id);
        return next;
      });
    }
    setPhase('front');
    setPosition((p) => p + 1);
  }

  function handleRestart() {
    setQueue([...cards]);
    setRequeuedIds(new Set());
    setPosition(0);
    setPhase('front');
    setStats({ knew: 0, skip: 0, review: 0 });
  }

  if (isDone) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm">
          <p className="text-4xl">🎉</p>
          <h2 className="mt-3 text-xl font-bold text-slate-900 dark:text-slate-100">
            Session terminée !
          </h2>
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-lg bg-green-50 dark:bg-green-900/20 px-4 py-2">
              <span className="text-green-800 dark:text-green-300">Je savais</span>
              <span className="font-bold text-green-700 dark:text-green-400">{stats.knew}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-amber-50 dark:bg-amber-900/20 px-4 py-2">
              <span className="text-amber-800 dark:text-amber-300">À revoir</span>
              <span className="font-bold text-amber-700 dark:text-amber-400">{stats.review}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-700/40 px-4 py-2">
              <span className="text-slate-600 dark:text-slate-400">Pas utile</span>
              <span className="font-bold text-slate-500 dark:text-slate-400">{stats.skip}</span>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleRestart}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Recommencer
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Choisir les decks
            </button>
          </div>
        </div>
      </div>
    );
  }

  const accentClass = card?.accent ? accentBar[card.accent] : accentBar.slate;
  const progressPct = Math.round((position / initialCount) * 100);

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      {/* Progress bar */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
          {position} / {initialCount}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded px-2 py-1 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          Quitter
        </button>
      </div>

      {/* Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md">
        <div className={`h-1.5 ${accentClass}`} />

        <div className="p-6">
          {/* Front */}
          <div className="min-h-[80px]">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Question
            </p>
            <div className="mt-2 text-base font-semibold leading-snug text-slate-900 dark:text-slate-100">
              <LiteraryText text={card!.front} />
            </div>
          </div>

          {/* Back (revealed) */}
          {phase === 'back' && (
            <>
              <hr className="my-4 border-slate-200 dark:border-slate-700" />
              <div className="min-h-[60px]">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
                  Réponse
                </p>
                <div className="mt-2 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                  <LiteraryText text={card!.back} />
                </div>
                {card!.mnemonic && (
                  <div className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-xs italic text-amber-700 dark:text-amber-300">
                    💡 {card!.mnemonic}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4">
          {phase === 'front' ? (
            <button
              type="button"
              onClick={handleFlip}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Voir la réponse
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleKnew}
                className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700"
              >
                ✓ Je savais
              </button>
              <button
                type="button"
                onClick={handleReview}
                className="flex-1 rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-600"
              >
                ✗ À revoir
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600"
                title="Pas utile"
              >
                ⊘
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
