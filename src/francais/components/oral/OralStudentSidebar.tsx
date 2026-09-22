import { Link, NavLink } from 'react-router-dom';
import { getOralStudent } from '@/francais/lib/french-content-loader';
import SidebarShell from '@/components/layout/SidebarShell';

type NavItem = { to: string; label: string; end?: boolean };
type NavGroup = { label: string; items: NavItem[] };

function linkClass({ isActive }: { isActive: boolean }): string {
  return [
    'block rounded-md px-3 py-1.5 text-sm transition-colors',
    isActive
      ? 'bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-slate-100',
  ].join(' ');
}

type Props = { eleve: string; onCollapse: () => void };

/**
 * Barre latérale de l'espace oral d'un élève : les sections de son descriptif,
 * groupées par partie d'épreuve. Remplace la navigation générale tant qu'on
 * est dans cet espace.
 */
export default function OralStudentSidebar({ eleve, onCollapse }: Props) {
  const student = getOralStudent(eleve);
  const base = `/premiere/francais/oral/${eleve}`;

  const groups: NavGroup[] = [
    {
      label: 'Partie 1',
      items: [
        { to: `${base}/textes`, label: 'Textes' },
        { to: `${base}/grammaire`, label: 'Grammaire' },
      ],
    },
    {
      label: 'Partie 2',
      items: [
        { to: `${base}/oeuvre`, label: 'Œuvre choisie' },
        { to: `${base}/entretien`, label: 'Entretien' },
      ],
    },
    {
      label: 'Outils',
      items: [
        { to: `${base}/express`, label: 'Express' },
        { to: `${base}/methode`, label: 'Méthode' },
        { to: `${base}/epreuve`, label: 'L’épreuve' },
        { to: `${base}/simulateur`, label: 'Oral blanc' },
      ],
    },
  ];

  return (
    <SidebarShell
      onCollapse={onCollapse}
      brand={
        <>
          <Link
            to="/premiere/francais/oral"
            className="text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-400"
          >
            ← Changer d’élève
          </Link>
          <p className="mt-2 text-[17px] font-bold leading-tight text-slate-900 dark:text-white">
            {student?.nom ?? eleve}
          </p>
          <p className="mt-1 text-[11px] leading-snug text-slate-400 dark:text-slate-500">
            Oral · EAF · première
          </p>
        </>
      }
    >
      <div className="shrink-0 border-b border-slate-200 px-3 pb-3 dark:border-slate-700/60">
        <NavLink to={base} end className={linkClass}>
          Tableau de bord
        </NavLink>
      </div>

      <nav aria-label="Sections de l’oral" className="flex-1 overflow-y-auto px-3 pb-6 pt-1">
        {groups.map((group, index) => (
          <section
            key={group.label}
            className={
              index === 0
                ? 'pt-3'
                : 'mt-4 border-t border-slate-200 pt-4 dark:border-slate-700/60'
            }
          >
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.end ?? false} className={linkClass}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>
    </SidebarShell>
  );
}
