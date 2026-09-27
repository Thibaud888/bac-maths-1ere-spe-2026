import type { GrandOralTemps } from '@/lib/grand-oral-types';
import { typographie } from '@/lib/typographie';

type Props = { temps: readonly GrandOralTemps[] };

/**
 * Les temps minutés de l'épreuve sur une barre, chacun proportionnel à sa durée ;
 * une accolade signale ceux qui se passent face au jury (ils suivent la
 * préparation, comme dans le texte). Tout vient de `deroule.json` : rien n'est
 * écrit en dur.
 */
export default function BarreDuTemps({ temps }: Props) {
  const minutes = temps.filter(
    (t): t is GrandOralTemps & { minutes: number } => t.minutes !== undefined
  );
  const jury = minutes.filter((t) => t.devantJury);
  const avantJury = minutes.filter((t) => !t.devantJury);
  const totalJury = jury.reduce((s, t) => s + t.minutes, 0);
  const totalAvant = avantJury.reduce((s, t) => s + t.minutes, 0);

  return (
    <div>
      <ol
        className="flex h-12 gap-1"
        aria-label={minutes.map((t) => `${t.titre} : ${t.minutes} min`).join(', ')}
      >
        {minutes.map((t) => (
          <li
            key={t.id}
            className={`flex min-w-0 flex-col items-center justify-center rounded-md px-2 text-center ${
              t.devantJury
                ? 'bg-amber-500 text-white dark:bg-amber-600'
                : 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200'
            }`}
            style={{ flexGrow: t.minutes, flexBasis: 0 }}
          >
            <span className="w-full truncate text-xs font-semibold">{typographie(t.titre)}</span>
            <span className="text-xs tabular-nums opacity-90">{t.minutes}&nbsp;min</span>
          </li>
        ))}
      </ol>
      {totalJury > 0 && (
        <div className="mt-1 flex gap-1 text-xs text-slate-600 dark:text-slate-400" aria-hidden="true">
          <span style={{ flexGrow: totalAvant, flexBasis: 0 }} />
          <span
            className="border-x-2 border-b-2 border-amber-400 pb-0.5 pt-1 text-center dark:border-amber-600"
            style={{ flexGrow: totalJury, flexBasis: 0 }}
          />
        </div>
      )}
      {totalJury > 0 && (
        <div className="flex gap-1 text-xs font-medium text-amber-800 dark:text-amber-300">
          <span style={{ flexGrow: totalAvant, flexBasis: 0 }} />
          <span className="pt-1 text-center" style={{ flexGrow: totalJury, flexBasis: 0 }}>
            face au jury&nbsp;: {totalJury}&nbsp;min
          </span>
        </div>
      )}
    </div>
  );
}
