import { TextWithMath } from '@/components/math/TextWithMath';
import type { Formula, FormulaLevel } from '@/lib/types';

const levelStyle: Record<FormulaLevel, { label: string; className: string }> = {
  essentiel: {
    label: 'Essentiel',
    className: 'bg-red-100 text-red-700',
  },
  'a-connaitre': {
    label: 'À connaître',
    className: 'bg-blue-100 text-blue-700',
  },
  approfondissement: {
    label: 'Approfondissement',
    className: 'bg-slate-200 text-slate-700',
  },
};

export default function FormulaCard({ formula }: { formula: Formula }) {
  const level = levelStyle[formula.level];
  return (
    <article className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <header className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900">{formula.title}</h3>
        <span
          className={[
            'rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
            level.className,
          ].join(' ')}
        >
          {level.label}
        </span>
      </header>

      <div className="mt-3 text-sm leading-relaxed text-slate-700">
        <TextWithMath text={formula.statement} />
      </div>

      {formula.conditions && (
        <p className="mt-2 text-xs text-slate-500">
          <span className="font-medium">Conditions : </span>
          <TextWithMath text={formula.conditions} />
        </p>
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
