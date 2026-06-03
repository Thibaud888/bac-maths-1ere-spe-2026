import { LiteraryText } from '@/francais/components/text/LiteraryText';
import type { Fiche, FrenchAccent, FrenchLevel } from '@/francais/lib/french-types';

type FicheCardProps = {
  fiche: Fiche;
  hidden: boolean;
  onToggleHidden: () => void;
};

const levelAccent: Record<FrenchLevel, FrenchAccent> = {
  essentiel: 'red',
  'a-connaitre': 'blue',
  approfondissement: 'amber',
};

const accentClasses: Record<FrenchAccent, { badge: string; bar: string }> = {
  red: { badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300', bar: 'bg-rose-400' },
  blue: { badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300', bar: 'bg-sky-400' },
  amber: { badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', bar: 'bg-amber-400' },
  emerald: { badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', bar: 'bg-emerald-400' },
  violet: { badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300', bar: 'bg-violet-400' },
  slate: { badge: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300', bar: 'bg-slate-400' },
};

const levelLabel: Record<FrenchLevel, string> = {
  essentiel: 'Essentiel',
  'a-connaitre': 'À connaître',
  approfondissement: 'Approfondissement',
};

export default function FicheCard({ fiche, hidden, onToggleHidden }: FicheCardProps) {
  const accent = levelAccent[fiche.level];
  const classes = accentClasses[accent];

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <div className={`h-1 ${classes.bar}`} />
      <div className="p-5">
        <header className="flex items-start justify-between gap-3">
          <div>
            <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${classes.badge}`}>
              {levelLabel[fiche.level]}
            </span>
            <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
              {fiche.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onToggleHidden}
            className="shrink-0 rounded px-2 py-1 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {hidden ? 'Afficher' : 'Masquer'}
          </button>
        </header>

        {!hidden && (
          <div className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <LiteraryText text={fiche.statement} />

            {fiche.example && (
              <div className="mt-3 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-3">
                <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Exemple
                </p>
                <div className="mt-1">
                  <LiteraryText text={fiche.example} preserveLineBreaks />
                </div>
              </div>
            )}

            {fiche.tags && fiche.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {fiche.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-xs text-slate-500 dark:text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
