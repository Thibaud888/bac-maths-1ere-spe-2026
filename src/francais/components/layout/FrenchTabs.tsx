import { NavLink, useParams } from 'react-router-dom';

const tabs: ReadonlyArray<{ to: string; label: string }> = [
  { to: 'fiches', label: 'Fiches' },
  { to: 'quiz', label: 'Quiz' },
  { to: 'exercices', label: 'Exercices' },
];

const tabClass = ({ isActive }: { isActive: boolean }): string =>
  [
    'border-b-2 px-4 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
      : 'border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-200',
  ].join(' ');

export default function FrenchTabs() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return null;

  return (
    <nav className="flex gap-1 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={`/francais/module/${slug}/${tab.to}`}
          className={tabClass}
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
