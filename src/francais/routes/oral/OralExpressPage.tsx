import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { shuffle } from '@/lib/randomizer';
import { getOralContent } from '@/francais/lib/french-content-loader';
import { buildOralExpressDecks } from '@/francais/lib/oral-express';
import type { Flashcard, QuizItem } from '@/francais/lib/french-types';
import DeckCard from '@/francais/components/express/DeckCard';
import FlashcardRunner from '@/francais/components/express/FlashcardRunner';
import QuizRunner from '@/francais/components/quiz/QuizRunner';
import { useFrenchProgressStore } from '@/francais/stores/french-progress-store';

type Mode = 'flashcards' | 'quiz';

export default function OralExpressPage() {
  const { eleve } = useParams<{ eleve: string }>();
  const [mode, setMode] = useState<Mode>('flashcards');

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Révision express ⚡
      </h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Réviser vite et bien : des flashcards qui tournent (tu t'auto-évalues) et
        un quiz éclair de grammaire. Idéal pour la dernière ligne droite.
      </p>

      <div className="mt-5 inline-flex rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1">
        <button
          type="button"
          onClick={() => setMode('flashcards')}
          className={tabClass(mode === 'flashcards')}
        >
          🃏 Flashcards
        </button>
        <button
          type="button"
          onClick={() => setMode('quiz')}
          className={tabClass(mode === 'quiz')}
        >
          ⚡ Quiz éclair
        </button>
      </div>

      <div className="mt-6">
        {mode === 'flashcards' ? (
          <FlashcardsSection eleve={eleve ?? ''} />
        ) : (
          <QuizEclairSection />
        )}
      </div>
    </div>
  );
}

function tabClass(active: boolean): string {
  return [
    'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
    active
      ? 'bg-indigo-600 text-white'
      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
  ].join(' ');
}

/* ------------------------------- Flashcards ------------------------------- */

function FlashcardsSection({ eleve }: { eleve: string }) {
  const decks = useMemo(() => buildOralExpressDecks(eleve), [eleve]);
  const decisions = useFrenchProgressStore((s) => s.flashcardDecisions);
  const clearFlashcardDecisions = useFrenchProgressStore((s) => s.clearFlashcardDecisions);

  const [selectedSlugs, setSelectedSlugs] = useState<ReadonlySet<string>>(
    () => new Set(decks.map((d) => d.slug))
  );
  const [runState, setRunState] = useState<{
    cards: Flashcard[];
    totalDeckCards: number;
  } | null>(null);

  const selectedDecks = decks.filter((d) => selectedSlugs.has(d.slug));
  const allSelectedCards = selectedDecks.flatMap((d) => d.cards);
  const remainingCards = allSelectedCards.filter((c) => !decisions[c.id]);
  const totalSelected = allSelectedCards.length;
  const remainingCount = remainingCards.length;
  const hasProgress = remainingCount < totalSelected && totalSelected > 0;
  const allSelected = decks.length > 0 && selectedSlugs.size === decks.length;

  function toggleDeck(slug: string) {
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function toggleAll() {
    if (allSelected) setSelectedSlugs(new Set());
    else setSelectedSlugs(new Set(decks.map((d) => d.slug)));
  }

  function handleLaunch() {
    if (remainingCards.length === 0) return;
    setRunState({
      cards: shuffle([...remainingCards]),
      totalDeckCards: remainingCards.length,
    });
  }

  function handleResetAll() {
    clearFlashcardDecisions(allSelectedCards.map((c) => c.id));
  }

  if (runState) {
    return (
      <FlashcardRunner
        cards={runState.cards}
        totalDeckCards={runState.totalDeckCards}
        onClose={() => setRunState(null)}
      />
    );
  }

  if (decks.length === 0) {
    return (
      <p className="rounded border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-300">
        Les flashcards se construisent à partir de ton descriptif — ajoute des
        textes, une œuvre choisie ou un entretien pour les voir apparaître.
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Choisir les paquets
        </p>
        <button
          type="button"
          onClick={toggleAll}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          {allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
        </button>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {decks.map((deck) => (
          <DeckCard
            key={deck.slug}
            deck={deck}
            selected={selectedSlugs.has(deck.slug)}
            onToggle={() => toggleDeck(deck.slug)}
          />
        ))}
      </div>

      {hasProgress && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2.5 text-sm">
          <span className="text-emerald-700 dark:text-emerald-300">
            ✓ {totalSelected - remainingCount} carte
            {totalSelected - remainingCount > 1 ? 's' : ''} déjà vue
            {totalSelected - remainingCount > 1 ? 's' : ''} sur {totalSelected}
          </span>
          <button
            type="button"
            onClick={handleResetAll}
            className="ml-auto text-xs text-slate-500 dark:text-slate-400 hover:underline"
          >
            Tout recommencer
          </button>
        </div>
      )}

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={handleLaunch}
          disabled={remainingCount === 0}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {hasProgress ? 'Reprendre' : 'Lancer la révision'}
          {remainingCount > 0 && (
            <span className="ml-1.5 opacity-80">
              ({remainingCount} carte{remainingCount > 1 ? 's' : ''})
            </span>
          )}
        </button>
        {remainingCount === 0 && totalSelected > 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tout est vu —{' '}
            <button
              type="button"
              onClick={handleResetAll}
              className="underline hover:text-indigo-600"
            >
              recommencer
            </button>
          </p>
        )}
        {totalSelected === 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Sélectionne au moins un paquet.
          </p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------- Quiz éclair ------------------------------ */

function QuizEclairSection() {
  const { grammaireQuiz } = getOralContent();
  const [sessionKey, setSessionKey] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);

  const pool = useMemo(
    () => shuffle([...grammaireQuiz]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [grammaireQuiz, sessionKey]
  );

  if (pool.length === 0) {
    return (
      <p className="rounded border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-300">
        Le quiz éclair arrive bientôt.
      </p>
    );
  }

  const restart = () => {
    setSessionKey((k) => k + 1);
    setCursor(0);
    setCorrect(0);
    setAnswered(0);
  };

  const current: QuizItem | undefined = pool[cursor];
  const done = cursor >= pool.length;

  if (done) {
    return (
      <div className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 text-center">
        <p className="text-3xl">{correct === answered ? '🏆' : '💪'}</p>
        <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
          Quiz terminé
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
    );
  }

  return (
    current && (
      <>
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            {cursor + 1} / {pool.length}
          </span>
          {answered > 0 && (
            <span>
              {correct}/{answered} correct
            </span>
          )}
        </div>
        <QuizRunner
          key={current.id}
          item={current}
          timerSeconds={null}
          onResult={(ok) => {
            setAnswered((n) => n + 1);
            if (ok) setCorrect((n) => n + 1);
          }}
          onNext={() => setCursor((c) => c + 1)}
        />
      </>
    )
  );
}
