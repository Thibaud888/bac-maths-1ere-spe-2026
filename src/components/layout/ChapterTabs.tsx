import { NavLink, useParams } from 'react-router-dom';

const tabs: ReadonlyArray<{ to: string; label: string }> = [
  { to: 'formulaire', label: 'Formulaire' },
  { to: 'automatismes', label: 'Automatismes' },
  { to: 'classiques', label: 'Classiques' },
  { to: 'examen', label: 'Type bac' },
];

const tabClass = ({ isActive }: { isActive: boolean }): string =>
  [
    'border-b-2 px-4 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'border-blue-600 text-blue-600'
      : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900',
  ].join(' ');

export default function ChapterTabs() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return null;

  return (
    <nav className="flex gap-1 border-b border-slate-200 bg-white px-6">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={`/chapitre/${slug}/${tab.to}`}
          className={tabClass}
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
