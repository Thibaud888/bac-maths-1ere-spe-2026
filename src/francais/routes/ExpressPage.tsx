import { useState } from 'react';
import { shuffle } from '@/lib/randomizer';
import { getExpressDecks } from '@/francais/lib/french-content-loader';
import type { Flashcard } from '@/francais/lib/french-types';
import DeckCard from '@/francais/components/express/DeckCard';
import FlashcardRunner from '@/francais/components/express/FlashcardRunner';

export default function ExpressPage() {
  const decks = getExpressDecks();

  const [selectedSlugs, setSelectedSlugs] = useState<ReadonlySet<string>>(
    () => new Set(decks.map((d) => d.slug))
  );
  const [runState, setRunState] = useState<{
    cards: Flashcard[];
    totalDeckCards: number;
  } | null>(null);

  const selectedDecks = decks.filter((d) => selectedSlugs.has(d.slug));
  const totalSelected = selectedDecks.reduce((n, d) => n + d.cards.length, 0);
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
    const combined = selectedDecks.flatMap((d) => d.cards);
    if (combined.length === 0) return;
    setRunState({
      cards: shuffle(combined),
      totalDeckCards: combined.length,
    });
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

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={handleLaunch}
          disabled={totalSelected === 0}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Lancer la révision
          {totalSelected > 0 && (
            <span className="ml-1.5 opacity-80">({totalSelected} cartes)</span>
          )}
        </button>
        {totalSelected === 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Sélectionne au moins un deck.
          </p>
        )}
      </div>
    </div>
  );
}
