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
  red: 'bg-red-100 text-red-700',
  blue: 'bg-blue-100 text-blue-700',
  amber: 'bg-amber-100 text-amber-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  violet: 'bg-violet-100 text-violet-700',
  slate: 'bg-slate-200 text-slate-700',
};

const defaultAccent: Record<FormulaLevel, FormulaSimplifiedAccent> = {
  essentiel: 'red',
  'a-connaitre': 'blue',
  approfondissement: 'amber',
};

// 6-color cycling palette — warm/cool alternation, same sequence as FormulaCard
// so the visual language is consistent across both modes.
const CARD_PALETTE = [
  { bg: 'bg-rose-50/80',    visual: 'bg-rose-100/60 text-rose-900' },
  { bg: 'bg-sky-50/80',     visual: 'bg-sky-100/60 text-sky-900' },
  { bg: 'bg-amber-50/70',   visual: 'bg-amber-100/60 text-amber-900' },
  { bg: 'bg-emerald-50/80', visual: 'bg-emerald-100/60 text-emerald-900' },
  { bg: 'bg-violet-50/70',  visual: 'bg-violet-100/60 text-violet-900' },
  { bg: 'bg-teal-50/70',    visual: 'bg-teal-100/60 text-teal-900' },
] as const;

type Props = {
  formula: Formula;
  index: number;
  hidden: boolean;
  onToggleHidden: () => void;
};

export default function SimplifiedFormulaCard({
  formula,
  index,
  hidden,
  onToggleHidden,
}: Props) {
  const accent = formula.simplified?.accent ?? defaultAccent[formula.level];
  const s = formula.simplified;
  const palette = CARD_PALETTE[(index - 1) % CARD_PALETTE.length] ?? CARD_PALETTE[0] ?? { bg: 'bg-rose-50/80' as const, visual: 'bg-rose-100/60 text-rose-900' as const };

  const cardClass = [
    'rounded border border-l-4 border-slate-200 p-5 shadow-sm',
    accentBorder[accent],
    palette.bg,
  ].join(' ');

  if (!s) {
    return (
      <article className={cardClass}>
        <CardHeader
          title={formula.title}
          index={index}
          accent={accent}
          keyword={undefined}
          hidden={hidden}
          onToggleHidden={onToggleHidden}
        />
        {!hidden && (
          <>
            <p className="mt-3 mb-3 rounded bg-white/70 px-3 py-1.5 text-xs text-amber-800 italic">
              Version simplifiée non encore rédigée.
            </p>
            <div className="text-sm leading-relaxed text-slate-700">
              <TextWithMath text={formula.statement} />
            </div>
          </>
        )}
      </article>
    );
  }

  return (
    <article className={cardClass}>
      <CardHeader
        title={formula.title}
        index={index}
        accent={accent}
        keyword={s.keyword}
        hidden={hidden}
        onToggleHidden={onToggleHidden}
      />

      {!hidden && (
        <>
          <div className="mt-4 whitespace-pre-line text-center text-base leading-relaxed text-slate-800">
            <TextWithMath text={s.core} />
          </div>

          {s.mnemonic && (
            <p className="mt-3 whitespace-pre-line text-center text-xs italic tracking-wide text-slate-600">
              <TextWithMath text={s.mnemonic} />
            </p>
          )}

          {s.visual && (
            <div
              className={[
                'mt-3 whitespace-pre-line rounded px-3 py-2 text-xs',
                palette.visual,
              ].join(' ')}
            >
              <TextWithMath text={s.visual} />
            </div>
          )}
        </>
      )}
    </article>
  );
}

type CardHeaderProps = {
  title: string;
  index: number;
  accent: FormulaSimplifiedAccent;
  keyword: string | undefined;
  hidden: boolean;
  onToggleHidden: () => void;
};

function CardHeader({
  title,
  index,
  accent,
  keyword,
  hidden,
  onToggleHidden,
}: CardHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-3">
      <h3 className="text-sm font-semibold text-slate-900">
        <span className="mr-2 tabular-nums text-slate-400">{index}.</span>
        <TextWithMath text={title} />
      </h3>
      <div className="flex shrink-0 items-center gap-2">
        {keyword && !hidden && (
          <span
            className={[
              'rounded-full px-2 py-0.5 text-xs font-medium',
              accentChip[accent],
            ].join(' ')}
          >
            {keyword}
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
