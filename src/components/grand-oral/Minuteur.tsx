import { formatHorloge } from '@/lib/oral-blanc';

type Props = {
  titre: string;
  /** Durée officielle de la phase, en secondes. */
  dureeSecondes: number;
  /** Secondes restantes ; négatif en cas de dépassement. */
  restant: number;
  enPause: boolean;
};

/**
 * Affichage du minuteur d'une phase : compte à rebours, puis dépassement en
 * rouge (« +00:35 ») — on ne coupe pas l'élève, on lui montre de combien il déborde.
 */
export default function Minuteur({ titre, dureeSecondes, restant, enPause }: Props) {
  const depasse = restant < 0;
  const bientot = !depasse && restant <= 60;
  const ecoule = dureeSecondes - restant;
  const progression = Math.min(100, Math.max(0, (ecoule / dureeSecondes) * 100));
  const couleur = depasse
    ? 'text-red-600 dark:text-red-400'
    : bientot
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-slate-900 dark:text-slate-100';

  return (
    <div
      className="rounded-lg border border-slate-200 bg-white p-4 text-center dark:border-slate-700 dark:bg-slate-800"
      role="timer"
      aria-label={`Minuteur : ${titre}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {titre}
        {enPause && ' · en pause'}
      </p>
      <p
        className={`mt-1 font-mono text-5xl font-bold tabular-nums sm:text-6xl ${couleur}`}
        data-testid="horloge"
      >
        {formatHorloge(restant)}
      </p>
      <p className="mt-1 h-5 text-sm font-medium" aria-live="polite">
        {depasse ? (
          <span className="text-red-600 dark:text-red-400">Temps écoulé</span>
        ) : bientot ? (
          <span className="text-amber-700 dark:text-amber-400">Dernière minute</span>
        ) : null}
      </p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div
          className={`h-full ${depasse ? 'bg-red-500' : 'bg-amber-500'}`}
          style={{ width: `${progression}%` }}
        />
      </div>
    </div>
  );
}
