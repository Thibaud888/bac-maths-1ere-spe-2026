import { NavLink, useLocation } from 'react-router-dom';
import { listFrenchModules } from '@/francais/lib/french-content-loader';
import type { FrenchFamily } from '@/francais/lib/french-types';

const familyLabels: Record<FrenchFamily, string> = {
  methode: 'Méthode',
  reperes: 'Repères',
  'objet-etude': 'Objets d’étude',
};

const familyDot: Record<FrenchFamily, string> = {
  methode: 'bg-blue-500',
  reperes: 'bg-amber-500',
  'objet-etude': 'bg-emerald-500',
};

const familyOrder: FrenchFamily[] = ['methode', 'reperes', 'objet-etude'];

function mainLinkClass({ isActive }: { isActive: boolean }): string {
  return [
    'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100',
  ].join(' ');
}

function oralLinkClass({ isActive }: { isActive: boolean }): string {
  return [
    'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-emerald-600 text-white'
      : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40',
  ].join(' ');
}

function moduleLinkClass({ isActive }: { isActive: boolean }): string {
  return [
    'block rounded px-3 py-1.5 text-sm transition-colors',
    isActive
      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-200',
  ].join(' ');
}

export default function FrenchSidebar() {
  const location = useLocation();

  // L'espace oral d'un élève n'a pas de barre latérale :
  // toute la navigation est déjà assurée par les onglets en haut.
  if (/^\/francais\/oral\/[^/]+/.test(location.pathname)) {
    return null;
  }

  const modules = listFrenchModules();

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900">

      {/* Branding */}
      <div className="shrink-0 px-5 pt-6 pb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
          Première · 2025–2026
        </p>
        <p className="mt-1 text-[17px] font-bold leading-tight text-slate-900 dark:text-white">
          Bac Français
        </p>
        <p className="mt-1.5 text-[11px] leading-snug text-slate-400 dark:text-slate-500">
          EAF · écrit &amp; oral
        </p>
      </div>

      <div className="mx-4 shrink-0 border-t border-slate-100 dark:border-slate-800" />

      {/* Navigation principale */}
      <div className="shrink-0 px-3 py-3 space-y-0.5">
        <NavLink to="/francais" end className={mainLinkClass}>
          Accueil
        </NavLink>
        <NavLink to="/francais/oral" className={oralLinkClass}>
          Préparer l’oral
        </NavLink>
        <NavLink to="/francais/express" className={mainLinkClass}>
          Révision express
        </NavLink>
      </div>

      <div className="mx-4 shrink-0 border-t border-slate-100 dark:border-slate-800" />

      {/* Modules de l'écrit, groupés par famille */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        <NavLink to="/francais/ecrit" end className={mainLinkClass}>
          Accueil écrit
        </NavLink>

        {familyOrder.map((family) => {
          const inFamily = modules.filter((m) => m.family === family);
          if (inFamily.length === 0) return null;
          return (
            <section key={family}>
              <header className="mb-1.5 flex items-center gap-2 px-3">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${familyDot[family]}`}
                  aria-hidden="true"
                />
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                  {familyLabels[family]}
                </span>
              </header>
              <ul className="space-y-0.5">
                {inFamily.map((m) => (
                  <li key={m.slug}>
                    <NavLink to={`/francais/module/${m.slug}`} className={moduleLinkClass}>
                      {m.shortTitle ?? m.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </nav>
    </aside>
  );
}
