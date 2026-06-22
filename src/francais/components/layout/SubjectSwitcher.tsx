import { Link } from 'react-router-dom';

type Subject = 'maths' | 'francais';

const SUBJECTS: { id: Subject; label: string; icon: string; to: string }[] = [
  { id: 'maths', label: 'Maths', icon: '∑', to: '/' },
  { id: 'francais', label: 'Français', icon: 'A', to: '/francais' },
];

type Props = { current: Subject };

/**
 * Sélecteur de matière (Maths / Français). Variante unique — segmented
 * control — toujours placée au même endroit dans le bandeau supérieur.
 */
export default function SubjectSwitcher({ current }: Props) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
      {SUBJECTS.map((s) =>
        s.id === current ? (
          <span
            key={s.id}
            className="flex select-none items-center gap-1.5 rounded-md bg-white px-3 py-1 text-sm font-semibold text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
          >
            <span className="text-base font-bold leading-none">{s.icon}</span>
            {s.label}
          </span>
        ) : (
          <Link
            key={s.id}
            to={s.to}
            className="flex items-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <span className="text-base font-bold leading-none">{s.icon}</span>
            {s.label}
          </Link>
        )
      )}
    </div>
  );
}
