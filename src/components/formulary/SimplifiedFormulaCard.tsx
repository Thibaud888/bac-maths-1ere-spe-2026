import { TextWithMath } from '@/components/math/TextWithMath';
import type { Formula, FormulaLevel, FormulaSimplifiedAccent } from '@/lib/types';

const accentBorder: Record<FormulaSimplifiedAccent, string> = {
  red: 'border-l-red-500',
  blue: 'border-l-blue-500',
  amber: 'border-l-amber-500',
  emerald: 'border-l-emerald-500',
  violet: 'border-l-violet-500',
  slate: 'border-l-slate-400',
};

const accentChip: Record<FormulaSimplifiedAccent, string> = {
  red: 'bg-red-50 text-red-700',
  blue: 'bg-blue-50 text-blue-700',
  amber: 'bg-amber-50 text-amber-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  violet: 'bg-violet-50 text-violet-700',
  slate: 'bg-slate-100 text-slate-700',
};

const defaultAccent: Record<FormulaLevel, FormulaSimplifiedAccent> = {
  essentiel: 'red',
  'a-connaitre': 'blue',
  approfondissement: 'amber',
};

type Props = {
  formula: Formula;
  index: number;
};

export default function SimplifiedFormulaCard({ formula, index }: Props) {
  const accent =
    formula.simplified?.accent ?? defaultAccent[formula.level];
  const s = formula.simplified;

  if (!s) {
    return (
      <article
        className={[
          'rounded border border-l-4 border-slate-200 bg-white p-5 shadow-sm',
          accentBorder[accent],
        ].join(' ')}
      >
        <p className="mb-3 rounded bg-amber-50 px-3 py-1.5 text-xs text-amber-700">
          Version simplifiée non encore rédigée — affichage détaillé.
        </p>
        <h3 className="text-sm font-semibold text-slate-900">
          <span className="mr-2 tabular-nums text-slate-400">{index}.</span>
          {formula.title}
        </h3>
        <div className="mt-3 text-sm leading-relaxed text-slate-700">
          <TextWithMath text={formula.statement} />
        </div>
      </article>
    );
  }

  return (
    <article
      className={[
        'rounded border border-l-4 border-slate-200 bg-white p-5 shadow-sm',
        accentBorder[accent],
      ].join(' ')}
    >
      <header className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900">
          <span className="mr-2 tabular-nums text-slate-400">{index}.</span>
          {formula.title}
        </h3>
        {s.keyword && (
          <span
            className={[
              'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
              accentChip[accent],
            ].join(' ')}
          >
            {s.keyword}
          </span>
        )}
      </header>

      <div className="mt-4 text-center text-base leading-relaxed text-slate-800">
        <TextWithMath text={s.core} />
      </div>

      {s.mnemonic && (
        <p className="mt-3 text-center text-xs italic tracking-wide text-slate-500">
          <TextWithMath text={s.mnemonic} />
        </p>
      )}

      {s.visual && (
        <div className="mt-3 rounded bg-slate-50 px-3 py-2 text-xs text-slate-600">
          <TextWithMath text={s.visual} />
        </div>
      )}
    </article>
  );
}
