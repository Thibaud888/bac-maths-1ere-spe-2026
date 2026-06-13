import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { shuffle } from '@/lib/randomizer';
import { buildGrammarQuizDeck, buildOralExpressDecks } from '@/francais/lib/oral-express';
import type { Flashcard } from '@/francais/lib/french-types';
import DeckCard from '@/francais/components/express/DeckCard';
import FlashcardRunner from '@/francais/components/express/FlashcardRunner';
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
          <QuizEclairSection eleve={eleve ?? ''} />
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

function QuizEclairSection({ eleve }: { eleve: string }) {
  const deck = useMemo(() => buildGrammarQuizDeck(eleve), [eleve]);
  const decisions = useFrenchProgressStore((s) => s.flashcardDecisions);
  const clearFlashcardDecisions = useFrenchProgressStore((s) => s.clearFlashcardDecisions);
  const [runCards, setRunCards] = useState<Flashcard[] | null>(null);

  if (!deck) {
    return (
      <p className="rounded border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-300">
        Le quiz éclair arrive bientôt.
      </p>
    );
  }

  const remaining = deck.cards.filter((c) => !decisions[c.id]);
  const doneCount = deck.cards.length - remaining.length;

  if (runCards) {
    return (
      <FlashcardRunner
        cards={runCards}
        totalDeckCards={runCards.length}
        onClose={() => setRunCards(null)}
      />
    );
  }

  return (
    <div>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Question de grammaire → réponse révélée. Marque <strong>« Je savais »</strong>
        {' '}(la carte ne reviendra plus) ou <strong>« À revoir »</strong> pour la
        repasser.
      </p>

      {doneCount > 0 && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2.5 text-sm">
          <span className="text-emerald-700 dark:text-emerald-300">
            ✓ {doneCount} validée{doneCount > 1 ? 's' : ''} sur {deck.cards.length}
          </span>
          <button
            type="button"
            onClick={() => clearFlashcardDecisions(deck.cards.map((c) => c.id))}
            className="ml-auto text-xs text-slate-500 dark:text-slate-400 hover:underline"
          >
            Tout recommencer
          </button>
        </div>
      )}

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={() => setRunCards(shuffle([...remaining]))}
          disabled={remaining.length === 0}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {doneCount > 0 ? 'Reprendre' : 'Lancer le quiz'}
          {remaining.length > 0 && (
            <span className="ml-1.5 opacity-80">
              ({remaining.length} question{remaining.length > 1 ? 's' : ''})
            </span>
          )}
        </button>
        {remaining.length === 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tout est validé —{' '}
            <button
              type="button"
              onClick={() => clearFlashcardDecisions(deck.cards.map((c) => c.id))}
              className="underline hover:text-indigo-600"
            >
              recommencer
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
