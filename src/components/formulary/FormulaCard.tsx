import { TextWithMath } from '@/components/math/TextWithMath';
import type { Formula, FormulaLevel } from '@/lib/types';

const levelStyle: Record<
  FormulaLevel,
  { label: string; chip: string; numBadge: string }
> = {
  essentiel: {
    label: 'Essentiel',
    chip: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 ring-1 ring-red-500/30',
    numBadge: 'bg-red-500 text-white',
  },
  'a-connaitre': {
    label: 'À connaître',
    chip: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-1 ring-blue-500/30',
    numBadge: 'bg-blue-500 text-white',
  },
  approfondissement: {
    label: 'Approfondissement',
    chip: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 ring-1 ring-amber-500/30',
    numBadge: 'bg-amber-500 text-white',
  },
};

// Dégradés chauds/froids alternés — plus vivants et distincts qu'un aplat pâle.
const CARD_BG = [
  'bg-gradient-to-br from-rose-100 to-white dark:from-rose-900/30 dark:to-slate-800',
  'bg-gradient-to-br from-sky-100 to-white dark:from-sky-900/30 dark:to-slate-800',
  'bg-gradient-to-br from-amber-100 to-white dark:from-amber-900/30 dark:to-slate-800',
  'bg-gradient-to-br from-emerald-100 to-white dark:from-emerald-900/30 dark:to-slate-800',
  'bg-gradient-to-br from-violet-100 to-white dark:from-violet-900/30 dark:to-slate-800',
  'bg-gradient-to-br from-cyan-100 to-white dark:from-cyan-900/30 dark:to-slate-800',
] as const;

type FormulaCardProps = {
  formula: Formula;
  index: number;
  hidden: boolean;
  onToggleHidden: () => void;
};

export default function FormulaCard({
  formula,
  index,
  hidden,
  onToggleHidden,
}: FormulaCardProps) {
  const level = levelStyle[formula.level];
  const bg = CARD_BG[(index - 1) % CARD_BG.length] ?? CARD_BG[0] ?? 'bg-rose-50/80';

  return (
    <article
      className={[
        'rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm transition-shadow hover:shadow-md',
        bg,
      ].join(' ')}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <span
            className={[
              'flex h-6 w-6 flex-none items-center justify-center rounded-full text-xs font-semibold tabular-nums',
              level.numBadge,
            ].join(' ')}
            aria-hidden="true"
          >
            {index}
          </span>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            <TextWithMath text={formula.title} />
          </h3>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!hidden && (
            <span
              className={[
                'rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
                level.chip,
              ].join(' ')}
            >
              {level.label}
            </span>
          )}
          <button
            type="button"
            onClick={onToggleHidden}
            aria-label={hidden ? 'Développer cette formule' : 'Réduire cette formule'}
            title={hidden ? 'Développer' : 'Réduire'}
            className="rounded p-1 text-slate-400 dark:text-slate-500 hover:bg-white/60 dark:hover:bg-slate-700/60 hover:text-slate-700 dark:hover:text-slate-300"
          >
            {hidden ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </button>
        </div>
      </header>

      {!hidden && (
        <>
          <div className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <TextWithMath text={formula.statement} />
          </div>

          {formula.conditions && (
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">Conditions : </span>
              <TextWithMath text={formula.conditions} />
            </div>
          )}

          {formula.example && (
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                Exemple
              </summary>
              <div className="mt-2 rounded-lg bg-white/80 dark:bg-slate-700/80 p-3 text-slate-700 dark:text-slate-300 ring-1 ring-black/5 dark:ring-white/5">
                <TextWithMath text={formula.example} />
              </div>
            </details>
          )}

          {formula.tags && formula.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {formula.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/80 dark:bg-slate-700/80 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-400 ring-1 ring-black/10 dark:ring-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </article>
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
      className="h-4 w-4"
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
      className="h-4 w-4"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
