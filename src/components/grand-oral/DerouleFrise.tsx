import type { GrandOralTemps } from '@/lib/grand-oral-types';

type Props = { temps: readonly GrandOralTemps[] };

/** Le déroulé officiel, étape par étape ; les minutes viennent de `deroule.json`. */
export default function DerouleFrise({ temps }: Props) {
  return (
    <ol className="space-y-5 border-l-2 border-amber-200 pl-6 dark:border-amber-800">
      {temps.map((t, index) => (
        <li key={t.id} className="relative">
          <span
            className="absolute -left-[37px] flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white dark:bg-amber-600"
            aria-hidden="true"
          >
            {index + 1}
          </span>
          <div className="flex flex-wrap items-baseline gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t.titre}</h3>
            <span className="rounded bg-amber-50 px-2 py-0.5 text-xs font-semibold tabular-nums text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              {t.minutes !== undefined ? `${t.minutes} min` : 'non minuté'}
            </span>
            {t.devantJury && (
              <span className="text-xs text-slate-500 dark:text-slate-400">face au jury</span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{t.resume}</p>
        </li>
      ))}
    </ol>
  );
}
