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
      className="inline-flex rounded-full bg-slate-100 p-1 text-xs font-medium"
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
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700',
            ].join(' ')}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
