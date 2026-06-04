import { useState } from 'react';
import { shuffle } from '@/lib/randomizer';
import { getExpressDecks } from '@/francais/lib/french-content-loader';
import type { Flashcard } from '@/francais/lib/french-types';
import DeckCard from '@/francais/components/express/DeckCard';
import FlashcardRunner from '@/francais/components/express/FlashcardRunner';
import { useFrenchProgressStore } from '@/francais/stores/french-progress-store';

export default function ExpressPage() {
  const decks = getExpressDecks();
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
  const allSelected = selectedSlugs.size === decks.length;

  function toggleDeck(slug: string) {
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  }

  function toggleAll() {
    if (allSelected) {
      setSelectedSlugs(new Set());
    } else {
      setSelectedSlugs(new Set(decks.map((d) => d.slug)));
    }
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
      <div className="px-4 py-6">
        <FlashcardRunner
          cards={runState.cards}
          totalDeckCards={runState.totalDeckCards}
          onClose={() => setRunState(null)}
        />
      </div>
    );
  }

  if (decks.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Révision express
        </h1>
        <p className="mt-4 rounded border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-300">
          Les decks arrivent bientôt.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Révision express
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Active recall par flashcards — retournez la carte, puis évaluez-vous honnêtement.
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Sélectionner les decks
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
            ✓ {totalSelected - remainingCount} carte{totalSelected - remainingCount > 1 ? 's' : ''} déjà traitée{totalSelected - remainingCount > 1 ? 's' : ''} sur {totalSelected}
          </span>
          <button
            type="button"
            onClick={handleResetAll}
            className="ml-auto text-xs text-slate-500 dark:text-slate-400 hover:underline"
          >
            Tout recommencer depuis zéro
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
          {hasProgress ? 'Reprendre la révision' : 'Lancer la révision'}
          {remainingCount > 0 && (
            <span className="ml-1.5 opacity-80">({remainingCount} carte{remainingCount > 1 ? 's' : ''})</span>
          )}
        </button>
        {remainingCount === 0 && totalSelected > 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Toutes les cartes ont été traitées —{' '}
            <button type="button" onClick={handleResetAll} className="underline hover:text-indigo-600">
              recommencer depuis zéro
            </button>
          </p>
        )}
        {totalSelected === 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Sélectionne au moins un deck.
          </p>
        )}
      </div>
    </div>
  );
}
