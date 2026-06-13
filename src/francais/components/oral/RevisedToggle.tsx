import { useFrenchProgressStore } from '@/francais/stores/french-progress-store';

type RevisedToggleProps = {
  /** Clé namespacée du suivi, ex. `${eleve}::oeuvre`. */
  checkKey: string;
  /** Libellé affiché à côté de la case (par défaut « Marquer comme révisé »). */
  label?: string;
  /** Variante compacte (pastille seule + libellé court) pour les listes. */
  compact?: boolean;
};

/**
 * Bouton de cochage manuel « révisé » lié au store de progression
 * (`oralChecks`, persistant sous `bfr-2026-progress`). Réutilisé sur le tableau
 * de bord d'accueil et sur les fiches de détail (texte, œuvre choisie).
 */
export default function RevisedToggle({
  checkKey,
  label = 'Marquer comme révisé',
  compact = false,
}: RevisedToggleProps) {
  const checked = useFrenchProgressStore((s) => !!s.oralChecks[checkKey]);
  const toggle = useFrenchProgressStore((s) => s.toggleOralCheck);

  if (compact) {
    return (
      <button
        type="button"
        aria-pressed={checked}
        onClick={() => toggle(checkKey)}
        className={[
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs transition-colors',
          checked
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-slate-300 dark:border-slate-600 text-transparent hover:border-emerald-400',
        ].join(' ')}
        title={checked ? 'Révisé — cliquer pour décocher' : label}
      >
        ✓
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => toggle(checkKey)}
      className={[
        'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
        checked
          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-300'
          : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-emerald-400',
      ].join(' ')}
    >
      <span
        className={[
          'flex h-5 w-5 items-center justify-center rounded-full border text-[11px]',
          checked
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-slate-400 text-transparent',
        ].join(' ')}
      >
        ✓
      </span>
      {checked ? 'Révisé ✓' : label}
    </button>
  );
}
