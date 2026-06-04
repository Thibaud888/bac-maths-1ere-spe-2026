import { NavLink } from 'react-router-dom';

const tabs: ReadonlyArray<{ to: string; label: string; end: boolean }> = [
  { to: '/francais/oral', label: 'L’épreuve', end: true },
  { to: '/francais/oral/textes', label: 'Textes', end: false },
  { to: '/francais/oral/methode', label: 'Méthode', end: false },
  { to: '/francais/oral/grammaire', label: 'Grammaire', end: false },
  { to: '/francais/oral/entretien', label: 'Entretien', end: false },
  { to: '/francais/oral/simulateur', label: 'Simulateur', end: false },
];

const tabClass = ({ isActive }: { isActive: boolean }): string =>
  [
    'whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-400'
      : 'border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-200',
  ].join(' ');

export default function OralTabs() {
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6">
      {tabs.map((tab) => (
        <NavLink key={tab.to} to={tab.to} end={tab.end} className={tabClass}>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
