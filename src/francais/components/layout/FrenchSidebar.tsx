import { NavLink } from 'react-router-dom';
import { listFrenchModules } from '@/francais/lib/french-content-loader';
import SubjectSwitcher from '@/francais/components/layout/SubjectSwitcher';
import type { FrenchFamily } from '@/francais/lib/french-types';

const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
  [
    'block rounded px-3 py-2 text-sm transition-colors',
    isActive
      ? 'bg-indigo-600 text-white'
      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',
  ].join(' ');

const familyLabels: Record<FrenchFamily, string> = {
  methode: 'Méthode',
  reperes: 'Repères',
  'objet-etude': 'Objets d’étude',
};

const familyOrder: FrenchFamily[] = ['methode', 'reperes', 'objet-etude'];

export default function FrenchSidebar() {
  const modules = listFrenchModules();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Bac 1ʳᵉ · 2026
        </p>
      </div>

      <SubjectSwitcher current="francais" />

      <nav className="flex-1 overflow-y-auto p-3">
        <NavLink to="/francais" end className={navLinkClass}>
          Accueil
        </NavLink>

        <NavLink
          to="/francais/express"
          className={({ isActive }) =>
            [
              'mt-2 flex items-center gap-2 rounded px-3 py-2 text-sm font-semibold transition-colors',
              isActive
                ? 'bg-amber-500 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/40',
            ].join(' ')
          }
        >
          <span>⚡</span>
          <span>Révision express</span>
        </NavLink>

        {familyOrder.map((family) => {
          const inFamily = modules.filter((m) => m.family === family);
          if (inFamily.length === 0) return null;
          return (
            <div key={family}>
              <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {familyLabels[family]}
              </p>
              <ul className="mt-2 space-y-1">
                {inFamily.map((m) => (
                  <li key={m.slug}>
                    <NavLink to={`/francais/module/${m.slug}`} className={navLinkClass}>
                      {m.shortTitle ?? m.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
