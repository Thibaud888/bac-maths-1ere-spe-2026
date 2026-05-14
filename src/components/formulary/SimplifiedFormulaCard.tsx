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

const accentBg: Record<FormulaSimplifiedAccent, string> = {
  red: 'bg-red-50/60',
  blue: 'bg-blue-50/60',
  amber: 'bg-amber-50/60',
  emerald: 'bg-emerald-50/60',
  violet: 'bg-violet-50/60',
  slate: 'bg-slate-50/80',
};

const accentChip: Record<FormulaSimplifiedAccent, string> = {
  red: 'bg-red-100 text-red-700',
  blue: 'bg-blue-100 text-blue-700',
  amber: 'bg-amber-100 text-amber-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  violet: 'bg-violet-100 text-violet-700',
  slate: 'bg-slate-200 text-slate-700',
};

const accentVisualBg: Record<FormulaSimplifiedAccent, string> = {
  red: 'bg-red-100/50 text-red-900',
  blue: 'bg-blue-100/50 text-blue-900',
  amber: 'bg-amber-100/50 text-amber-900',
  emerald: 'bg-emerald-100/50 text-emerald-900',
  violet: 'bg-violet-100/50 text-violet-900',
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

  const cardClasses = [
    'rounded border border-l-4 border-slate-200 p-5 shadow-sm transition-opacity',
    accentBorder[accent],
    accentBg[accent],
    hidden ? 'opacity-60' : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (!s) {
    return (
      <article className={cardClasses}>
        <Header
          title={formula.title}
          index={index}
          accent={accent}
          keyword={undefined}
          hidden={hidden}
          onToggleHidden={onToggleHidden}
        />
        {!hidden && (
          <>
            <p className="mt-3 mb-3 rounded bg-amber-100/60 px-3 py-1.5 text-xs text-amber-800">
              Version simplifiée non encore rédigée — affichage détaillé.
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
    <article className={cardClasses}>
      <Header
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
                accentVisualBg[accent],
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

type HeaderProps = {
  title: string;
  index: number;
  accent: FormulaSimplifiedAccent;
  keyword: string | undefined;
  hidden: boolean;
  onToggleHidden: () => void;
};

function Header({
  title,
  index,
  accent,
  keyword,
  hidden,
  onToggleHidden,
}: HeaderProps) {
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
          aria-label={hidden ? 'Afficher cette formule' : 'Masquer cette formule'}
          title={hidden ? 'Afficher' : 'Masquer'}
          className="rounded p-1 text-slate-400 hover:bg-white/60 hover:text-slate-700"
        >
          {hidden ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </header>
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
