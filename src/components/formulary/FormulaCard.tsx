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

type FormulaCardProps = {
  formula: Formula;
  index: number;
};

export default function FormulaCard({ formula, index }: FormulaCardProps) {
  const level = levelStyle[formula.level];
  return (
    <article
      className={[
        'rounded border border-l-4 border-slate-200 bg-white p-4 shadow-sm',
        level.border,
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
            {formula.title}
          </h3>
        </div>
        <span
          className={[
            'rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
            level.chip,
          ].join(' ')}
        >
          {level.label}
        </span>
      </header>

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
          <div className="mt-2 rounded bg-slate-50 p-3 text-slate-700">
            <TextWithMath text={formula.example} />
          </div>
        </details>
      )}

      {formula.tags && formula.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {formula.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
