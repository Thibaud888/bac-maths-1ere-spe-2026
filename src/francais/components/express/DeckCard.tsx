import type { FlashcardDeck, FrenchAccent } from '@/francais/lib/french-types';
import { useFrenchProgressStore } from '@/francais/stores/french-progress-store';

type DeckCardProps = {
  deck: FlashcardDeck;
  selected: boolean;
  onToggle: () => void;
};

const accentClasses: Record<
  FrenchAccent,
  { bar: string; badge: string; check: string }
> = {
  red: {
    bar: 'bg-rose-400',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    check: 'border-rose-400 bg-rose-400',
  },
  blue: {
    bar: 'bg-sky-400',
    badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    check: 'border-sky-400 bg-sky-400',
  },
  amber: {
    bar: 'bg-amber-400',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    check: 'border-amber-400 bg-amber-400',
  },
  emerald: {
    bar: 'bg-emerald-400',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    check: 'border-emerald-400 bg-emerald-400',
  },
  violet: {
    bar: 'bg-violet-400',
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    check: 'border-violet-400 bg-violet-400',
  },
  slate: {
    bar: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
    check: 'border-slate-400 bg-slate-400',
  },
};

export default function DeckCard({ deck, selected, onToggle }: DeckCardProps) {
  const items = useFrenchProgressStore((s) => s.items);
  const classes = accentClasses[deck.accent];

  const seenCount = deck.cards.filter((c) => items[c.id] !== undefined).length;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        'relative overflow-hidden rounded-xl border text-left transition-all',
        selected
          ? 'border-indigo-400 dark:border-indigo-500 shadow-md ring-2 ring-indigo-300 dark:ring-indigo-700'
          : 'border-slate-200 dark:border-slate-700 shadow-sm hover:border-slate-300 dark:hover:border-slate-600',
        'bg-white dark:bg-slate-800',
      ].join(' ')}
    >
      <div className={`h-1 ${classes.bar}`} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {deck.title}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
              {deck.description}
            </p>
          </div>
          <span
            className={[
              'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 text-white text-xs transition-colors',
              selected ? classes.check : 'border-slate-300 dark:border-slate-600 bg-transparent',
            ].join(' ')}
          >
            {selected && '✓'}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
          <span>{deck.cards.length} cartes</span>
          <span>~{deck.estimatedMinutes} min</span>
          {seenCount > 0 && (
            <span className={`${classes.badge} rounded px-1.5 py-0.5 font-medium`}>
              {seenCount}/{deck.cards.length} vues
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
