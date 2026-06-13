import type { OralViewMode } from '@/francais/stores/french-app-store';

type Props = {
  value: OralViewMode;
  onChange: (next: OralViewMode) => void;
};

const MODES: { value: OralViewMode; label: string }[] = [
  { value: 'essentiel', label: 'Essentiel' },
  { value: 'detaille', label: 'Détaillé' },
];

/**
 * Bascule globale de l'oral : « Essentiel » (l'indispensable rédigé) ou
 * « Détaillé » (l'analyse complète). Vocabulaire distinct du formulaire maths.
 */
export default function OralViewModeToggle({ value, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Mode d'affichage de l'oral"
      className="inline-flex rounded-full bg-slate-100 dark:bg-slate-700 p-1 text-xs font-medium"
    >
      {MODES.map((mode) => {
        const active = value === mode.value;
        return (
          <button
            key={mode.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(mode.value)}
            className={[
              'rounded-full px-3 py-1 transition-colors',
              active
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
            ].join(' ')}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
