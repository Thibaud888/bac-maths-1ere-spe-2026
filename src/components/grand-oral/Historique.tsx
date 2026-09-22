import { listGrandOralCriteres, tempsMinutes, TEMPS_ID } from '@/lib/grand-oral-content';
import { formatDuree } from '@/lib/oral-blanc';
import { useGrandOralStore, type NiveauAuto } from '@/stores/grand-oral-store';
import { NIVEAUX } from './OralBlanc';

const PASTILLE: Record<NiveauAuto, string> = {
  'a-retravailler': 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
  correct: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  solide: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
};

/** Les oraux blancs enregistrés sur cet appareil, du plus récent au plus ancien. */
export default function Historique() {
  const historique = useGrandOralStore((s) => s.historique);
  const effacer = useGrandOralStore((s) => s.effacerHistorique);
  const expose = tempsMinutes().find((t) => t.id === TEMPS_ID.expose);
  const nbCriteres = listGrandOralCriteres().length;

  if (historique.length === 0) return null;

  return (
    <section aria-labelledby="historique-titre" className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="historique-titre"
          className="text-lg font-bold text-slate-900 dark:text-slate-100"
        >
          Tes oraux blancs
        </h2>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Effacer tout l’historique des oraux blancs ?')) effacer();
          }}
          className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-red-400"
        >
          Effacer l’historique
        </button>
      </div>
      <ul className="space-y-2">
        {historique.map((b) => {
          const tenu = expose ? b.durees[expose.id] : undefined;
          const depasse = expose && tenu !== undefined && tenu > expose.minutes * 60;
          return (
            <li
              key={b.id}
              className="rounded-lg border border-slate-200 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium text-slate-900 dark:text-slate-100">{b.question}</p>
                <time
                  dateTime={b.date}
                  className="text-xs text-slate-500 dark:text-slate-400"
                >
                  {new Date(b.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                  })}
                </time>
              </div>
              {expose && tenu !== undefined && (
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Exposé tenu en{' '}
                  <span
                    className={`font-semibold tabular-nums ${
                      depasse ? 'text-red-600 dark:text-red-400' : ''
                    }`}
                  >
                    {formatDuree(tenu)}
                  </span>{' '}
                  sur {expose.minutes} min
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {NIVEAUX.map((n) => {
                  const nb = Object.values(b.auto).filter((v) => v === n.id).length;
                  if (nb === 0) return null;
                  return (
                    <span
                      key={n.id}
                      className={`rounded px-2 py-0.5 text-xs font-medium ${PASTILLE[n.id]}`}
                    >
                      {n.label} : {nb}/{nbCriteres}
                    </span>
                  );
                })}
              </div>
              {b.note && (
                <p className="mt-2 whitespace-pre-line text-xs text-slate-600 dark:text-slate-400">
                  {b.note}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
