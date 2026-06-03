import { Link } from 'react-router-dom';

type Subject = 'maths' | 'francais';

const SUBJECTS: { id: Subject; label: string; icon: string; to: string }[] = [
  { id: 'maths', label: 'Maths', icon: '∑', to: '/' },
  { id: 'francais', label: 'Français', icon: 'A', to: '/francais' },
];

export default function SubjectSwitcher({ current }: { current: Subject }) {
  return (
    <div className="grid grid-cols-2 gap-1.5 px-3 py-3 border-b border-slate-200 dark:border-slate-700">
      {SUBJECTS.map((s) =>
        s.id === current ? (
          <div
            key={s.id}
            className="flex flex-col items-center rounded-lg px-2 py-2.5 bg-indigo-600 text-white select-none"
          >
            <span className="text-lg font-bold leading-none">{s.icon}</span>
            <span className="mt-1 text-[11px] font-semibold">{s.label}</span>
          </div>
        ) : (
          <Link
            key={s.id}
            to={s.to}
            className="flex flex-col items-center rounded-lg px-2 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="text-lg font-bold leading-none">{s.icon}</span>
            <span className="mt-1 text-[11px] font-medium">{s.label}</span>
          </Link>
        )
      )}
    </div>
  );
}
