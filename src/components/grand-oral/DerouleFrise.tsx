import type { GrandOralTemps } from '@/lib/grand-oral-types';
import { typographie } from '@/lib/typographie';

type Props = { temps: readonly GrandOralTemps[] };

/**
 * Le déroulé officiel, étape par étape : la durée à gauche, l'étape à droite,
 * reliées par un fil. Les minutes viennent de `deroule.json`.
 */
export default function DerouleFrise({ temps }: Props) {
  return (
    <ol>
      {temps.map((t, index) => (
        <li
          key={t.id}
          className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-x-6"
        >
          <div className="pt-0.5 text-right">
            <p className="text-base font-bold tabular-nums text-amber-700 dark:text-amber-400 sm:text-lg">
              {t.minutes !== undefined ? `${t.minutes} min` : '—'}
            </p>
            <p className="text-[0.65rem] font-medium uppercase leading-tight tracking-wide text-slate-500 dark:text-slate-400">
              {t.minutes === undefined && 'non minuté'}
              {t.minutes === undefined && t.devantJury && <br />}
              {t.devantJury && 'face au jury'}
            </p>
          </div>
          <div
            className={`relative border-l-2 pl-8 ${
              index < temps.length - 1
                ? 'border-amber-200 pb-7 dark:border-amber-900'
                : 'border-transparent'
            }`}
          >
            <span
              className="absolute -left-[15px] top-0 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white dark:bg-amber-600"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <h3 className="font-semibold leading-7 text-slate-900 dark:text-slate-100">
              {typographie(t.titre)}
            </h3>
            <p className="mt-1 max-w-prose text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {typographie(t.resume)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
