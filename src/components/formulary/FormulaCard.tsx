import { TextWithMath } from '@/components/math/TextWithMath';
import type { Formula, FormulaLevel } from '@/lib/types';

const levelStyle: Record<
  FormulaLevel,
  { label: string; chip: string; border: string; numBadge: string; bg: string }
> = {
  essentiel: {
    label: 'Essentiel',
    chip: 'bg-red-100 text-red-700',
    border: 'border-l-red-500',
    numBadge: 'bg-red-500 text-white',
    bg: 'bg-red-50/40',
  },
  'a-connaitre': {
    label: 'À connaître',
    chip: 'bg-blue-100 text-blue-700',
    border: 'border-l-blue-500',
    numBadge: 'bg-blue-500 text-white',
    bg: 'bg-blue-50/40',
  },
  approfondissement: {
    label: 'Approfondissement',
    chip: 'bg-amber-100 text-amber-700',
    border: 'border-l-amber-500',
    numBadge: 'bg-amber-500 text-white',
    bg: 'bg-amber-50/40',
  },
};

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
  return (
    <article
      className={[
        'rounded border border-l-4 border-slate-200 p-4 shadow-sm transition-opacity',
        level.border,
        level.bg,
        hidden ? 'opacity-60' : '',
      ]
        .filter(Boolean)
        .join(' ')}
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
            aria-label={hidden ? 'Afficher cette formule' : 'Masquer cette formule'}
            title={hidden ? 'Afficher' : 'Masquer'}
            className="rounded p-1 text-slate-400 hover:bg-white/60 hover:text-slate-700"
          >
            {hidden ? <EyeOffIcon /> : <EyeIcon />}
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
                  className="rounded bg-white/70 px-2 py-0.5 text-xs text-slate-600"
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

function EyeIcon() {
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
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
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
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-6.5 0-10-7-10-7a19.6 19.6 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c6.5 0 10 7 10 7a19.6 19.6 0 0 1-3.16 4.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}
