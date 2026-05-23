import type { FormularyViewMode } from '@/stores/app-store';

type Props = {
  value: FormularyViewMode;
  onChange: (next: FormularyViewMode) => void;
};

const MODES: { value: FormularyViewMode; label: string }[] = [
  { value: 'detailed', label: 'Détaillé' },
  { value: 'simplified', label: 'Simplifié' },
];

export default function ViewModeToggle({ value, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Mode d'affichage"
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
                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
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
