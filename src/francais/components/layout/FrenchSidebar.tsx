import { NavLink } from 'react-router-dom';
import { listFrenchModules } from '@/francais/lib/french-content-loader';
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
      <div className="border-b border-slate-200 dark:border-slate-700 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Bac Français · 1ʳᵉ
        </p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Écrit · EAF 2026
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <NavLink
          to="/"
          className="mb-2 block rounded px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          ← Mathématiques
        </NavLink>

        <NavLink to="/francais" end className={navLinkClass}>
          Accueil
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
