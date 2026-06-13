import { NavLink } from 'react-router-dom';

type OralTabsProps = {
  /** Identifiant de l'élève : tous les onglets sont préfixés par son espace. */
  eleve: string;
};

type OralTab = {
  to: string;
  label: string;
  end: boolean;
  /** Partie de l'épreuve (badge P1/P2 facultatif). */
  part?: 1 | 2;
};

export default function OralTabs({ eleve }: OralTabsProps) {
  const base = `/francais/oral/${eleve}`;
  const tabs: ReadonlyArray<OralTab> = [
    { to: base, label: 'Tableau de bord', end: true },
    { to: `${base}/textes`, label: 'Textes', end: false, part: 1 },
    { to: `${base}/grammaire`, label: 'Grammaire', end: false, part: 1 },
    { to: `${base}/oeuvre`, label: 'Œuvre choisie', end: false, part: 2 },
    { to: `${base}/entretien`, label: 'Entretien', end: false, part: 2 },
    { to: `${base}/methode`, label: 'Méthode', end: false },
    { to: `${base}/epreuve`, label: 'L’épreuve', end: false },
    { to: `${base}/simulateur`, label: 'Oral blanc', end: false },
  ];

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6">
      {tabs.map((tab) => (
        <NavLink key={tab.to} to={tab.to} end={tab.end} className={tabClass}>
          {tab.part && (
            <span className="mr-1.5 rounded bg-emerald-100 px-1 py-0.5 text-[10px] font-bold leading-none text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              P{tab.part}
            </span>
          )}
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}

const tabClass = ({ isActive }: { isActive: boolean }): string =>
  [
    'flex items-center whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-400'
      : 'border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-200',
  ].join(' ');
