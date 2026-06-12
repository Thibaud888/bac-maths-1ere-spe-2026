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

/** En-tête de zone (Oral / Écrit) avec barre d'accent colorée. */
function ZoneHeader({ accent, children }: { accent: 'emerald' | 'indigo'; children: string }) {
  const bar = accent === 'emerald' ? 'bg-emerald-500' : 'bg-indigo-500';
  const text =
    accent === 'emerald'
      ? 'text-emerald-700 dark:text-emerald-400'
      : 'text-indigo-700 dark:text-indigo-400';
  return (
    <div className="mt-2 flex items-center gap-2 px-3">
      <span className={`h-3 w-1 rounded-full ${bar}`} />
      <p className={`text-xs font-bold uppercase tracking-wider ${text}`}>{children}</p>
    </div>
  );
}

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

        {/* --- Zone ORAL (épreuve à venir) --- */}
        <div className="mt-3 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-900/10 p-2">
          <ZoneHeader accent="emerald">🎙️ Oral</ZoneHeader>
          <NavLink
            to="/francais/oral"
            className={({ isActive }) =>
              [
                'mt-2 flex items-center gap-2 rounded px-3 py-2 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-100/70 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-200 dark:hover:bg-emerald-900/50',
              ].join(' ')
            }
          >
            <span>🎙️</span>
            <span>Préparer l’oral</span>
          </NavLink>
        </div>

        {/* --- Zone ÉCRIT --- */}
        <div className="mt-4 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-900/10 p-2">
          <ZoneHeader accent="indigo">✍️ Écrit</ZoneHeader>

          <NavLink
            to="/francais/ecrit"
            end
            className={({ isActive }) =>
              [
                'mt-2 block rounded px-3 py-2 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-indigo-800 hover:bg-indigo-100 dark:text-indigo-200 dark:hover:bg-indigo-900/40',
              ].join(' ')
            }
          >
            Accueil écrit
          </NavLink>

          <NavLink
            to="/francais/express"
            className={({ isActive }) =>
              [
                'mt-1 flex items-center gap-2 rounded px-3 py-2 text-sm font-semibold transition-colors',
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
                <p className="mt-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {familyLabels[family]}
                </p>
                <ul className="mt-1 space-y-1">
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
        </div>
      </nav>
    </aside>
  );
}
