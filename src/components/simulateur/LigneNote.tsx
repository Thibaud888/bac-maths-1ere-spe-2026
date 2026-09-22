import {
  ANNEE_LABEL,
  contribution,
  couleurLigne,
  fmt,
  type SimulateurLigne,
} from '@/lib/simulateur';

/**
 * Une note réglable : un curseur, une saisie au quart de point, un cadenas.
 *
 * Le cadenas sert aux notes déjà connues — elles restent dans la moyenne mais
 * le simulateur ne propose plus de les faire bouger.
 */

type Props = {
  ligne: SimulateurLigne;
  note: number;
  figee: boolean;
  onNote: (note: number) => void;
  onFigee: () => void;
};

export default function LigneNote({ ligne, note, figee, onNote, onFigee }: Props) {
  const couleur = couleurLigne(ligne.id);
  const nom = ligne.partagee
    ? `${ligne.label} — ${ANNEE_LABEL[ligne.annee]}`
    : ligne.label;

  return (
    <div
      className={`rounded-lg border p-3 ${
        figee
          ? 'border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800/60'
          : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
      }`}
    >
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span
          className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: couleur }}
          aria-hidden
        />
        <span className="grow text-sm font-medium text-slate-900 dark:text-slate-100">
          {nom}
        </span>
        <span className="shrink-0 rounded bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
          coef {ligne.coefficient}
        </span>
        <label className="shrink-0">
          <span className="sr-only">Note de {nom}</span>
          <input
            type="number"
            min={0}
            max={20}
            step={0.25}
            inputMode="decimal"
            value={note}
            disabled={figee}
            onChange={(e) => {
              const v = Number.parseFloat(e.target.value);
              if (Number.isFinite(v)) onNote(v);
            }}
            className="w-[4.5rem] rounded border border-slate-300 bg-white px-2 py-1 text-right text-sm tabular-nums text-slate-900 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
        </label>
        <button
          type="button"
          onClick={onFigee}
          aria-pressed={figee}
          title={figee ? 'Libérer cette note' : 'Figer cette note (déjà connue)'}
          className="shrink-0 rounded border border-slate-300 px-2 py-1 text-sm hover:border-sky-400 dark:border-slate-600 dark:hover:border-sky-600"
        >
          <span aria-hidden>{figee ? '🔒' : '🔓'}</span>
          <span className="sr-only">
            {figee ? `Libérer la note de ${nom}` : `Figer la note de ${nom}`}
          </span>
        </button>
      </div>

      <input
        type="range"
        min={0}
        max={20}
        step={0.25}
        value={note}
        disabled={figee}
        aria-label={`Curseur de la note de ${nom}`}
        onChange={(e) => onNote(Number.parseFloat(e.target.value))}
        style={{ accentColor: couleur }}
        className="mt-2 w-full disabled:opacity-50"
      />

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {ligne.quand}
        {ligne.portee === 'profil' && ligne.profilNote ? ` · ${ligne.profilNote}` : ''}
        {` · apporte ${fmt(contribution(ligne, note))} sur la moyenne finale`}
      </p>
    </div>
  );
}
