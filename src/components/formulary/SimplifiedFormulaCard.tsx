import { TextWithMath } from '@/components/math/TextWithMath';
import type { Formula } from '@/lib/types';

// Dégradés cohérents avec FormulaCard — même séquence chaud/froid.
const CARD_PALETTE = [
  { bg: 'bg-gradient-to-br from-rose-100 to-white dark:from-rose-900/30 dark:to-slate-800',       visual: 'bg-rose-100 dark:bg-rose-900/30 text-rose-900 dark:text-rose-300' },
  { bg: 'bg-gradient-to-br from-sky-100 to-white dark:from-sky-900/30 dark:to-slate-800',          visual: 'bg-sky-100 dark:bg-sky-900/30 text-sky-900 dark:text-sky-300' },
  { bg: 'bg-gradient-to-br from-amber-100 to-white dark:from-amber-900/30 dark:to-slate-800',      visual: 'bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-300' },
  { bg: 'bg-gradient-to-br from-emerald-100 to-white dark:from-emerald-900/30 dark:to-slate-800',  visual: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-300' },
  { bg: 'bg-gradient-to-br from-violet-100 to-white dark:from-violet-900/30 dark:to-slate-800',    visual: 'bg-violet-100 dark:bg-violet-900/30 text-violet-900 dark:text-violet-300' },
  { bg: 'bg-gradient-to-br from-cyan-100 to-white dark:from-cyan-900/30 dark:to-slate-800',        visual: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-900 dark:text-cyan-300' },
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
  const s = formula.simplified;
  const palette = CARD_PALETTE[(index - 1) % CARD_PALETTE.length] ?? CARD_PALETTE[0] ?? { bg: 'bg-gradient-to-br from-rose-100 to-white dark:from-rose-900/30 dark:to-slate-800' as const, visual: 'bg-rose-100 dark:bg-rose-900/30 text-rose-900 dark:text-rose-300' as const };

  const cardClass = [
    'rounded-xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm transition-shadow hover:shadow-md',
    palette.bg,
  ].join(' ');

  if (!s) {
    return (
      <article className={cardClass}>
        <CardHeader
          title={formula.title}
          index={index}
          hidden={hidden}
          onToggleHidden={onToggleHidden}
        />
        {!hidden && (
          <>
            <p className="mt-3 mb-3 rounded bg-white/70 dark:bg-slate-700/70 px-3 py-1.5 text-xs text-amber-800 dark:text-amber-300 italic">
              Version simplifiée non encore rédigée.
            </p>
            <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
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
        hidden={hidden}
        onToggleHidden={onToggleHidden}
      />

      {!hidden && (
        <>
          <div className="mt-4 whitespace-pre-line text-center text-base leading-relaxed text-slate-800 dark:text-slate-200">
            <TextWithMath text={s.core} />
          </div>

          {s.mnemonic && (
            <p className="mt-3 whitespace-pre-line text-center text-xs italic tracking-wide text-slate-600 dark:text-slate-400">
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
  hidden: boolean;
  onToggleHidden: () => void;
};

function CardHeader({ title, index, hidden, onToggleHidden }: CardHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-3">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        <span className="mr-2 tabular-nums text-slate-400 dark:text-slate-500">{index}.</span>
        <TextWithMath text={title} />
      </h3>
      <div className="flex shrink-0 items-center gap-2">
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
