import { TextWithMath } from '@/components/math/TextWithMath';
import type { Formula, FormulaLevel } from '@/lib/types';

const levelStyle: Record<
  FormulaLevel,
  { label: string; chip: string; border: string; numBadge: string }
> = {
  essentiel: {
    label: 'Essentiel',
    chip: 'bg-red-100 text-red-700',
    border: 'border-l-red-500',
    numBadge: 'bg-red-500 text-white',
  },
  'a-connaitre': {
    label: 'À connaître',
    chip: 'bg-blue-100 text-blue-700',
    border: 'border-l-blue-500',
    numBadge: 'bg-blue-500 text-white',
  },
  approfondissement: {
    label: 'Approfondissement',
    chip: 'bg-amber-100 text-amber-700',
    border: 'border-l-amber-500',
    numBadge: 'bg-amber-500 text-white',
  },
};

// 6-color cycling palette — warm/cool alternation ensures elegance and no two
// consecutive cards share the same background.
const CARD_BG = [
  'bg-rose-50/80',
  'bg-sky-50/80',
  'bg-amber-50/70',
  'bg-emerald-50/80',
  'bg-violet-50/70',
  'bg-teal-50/70',
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
        'rounded border border-l-4 border-slate-200 p-4 shadow-sm',
        level.border,
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
          <h3 className="text-sm font-semibold text-slate-900">
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
            className="rounded p-1 text-slate-400 hover:bg-white/60 hover:text-slate-700"
          >
            {hidden ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </button>
        </div>
      </header>

      {!hidden && (
        <>
          <div className="mt-3 text-sm leading-relaxed text-slate-700">
            <TextWithMath text={formula.statement} />
          </div>

          {formula.conditions && (
            <div className="mt-2 text-xs text-slate-500">
              <span className="font-medium">Conditions : </span>
              <TextWithMath text={formula.conditions} />
            </div>
          )}

          {formula.example && (
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer text-xs font-medium text-blue-600 hover:underline">
                Exemple
              </summary>
              <div className="mt-2 rounded bg-white/70 p-3 text-slate-700">
                <TextWithMath text={formula.example} />
              </div>
            </details>
          )}

          {formula.tags && formula.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {formula.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-white/60 px-2 py-0.5 text-xs text-slate-600"
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
