import { NavLink } from 'react-router-dom';
import { listChapters } from '@/lib/content-loader';
import type { ChapterMeta, Domain } from '@/lib/types';
import SubjectSwitcher from '@/francais/components/layout/SubjectSwitcher';

const DOMAIN_LABEL: Record<Domain, string> = {
  algebre: 'Algèbre',
  analyse: 'Analyse',
  geometrie: 'Géométrie',
  probabilites: 'Probabilités',
};

const DOMAIN_DOT: Record<Domain, string> = {
  algebre: 'bg-violet-500',
  analyse: 'bg-blue-500',
  geometrie: 'bg-emerald-500',
  probabilites: 'bg-amber-500',
};

const DOMAIN_ORDER: Domain[] = ['algebre', 'analyse', 'geometrie', 'probabilites'];

function mainLinkClass({ isActive }: { isActive: boolean }): string {
  return [
    'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100',
  ].join(' ');
}

function chapterLinkClass({ isActive }: { isActive: boolean }): string {
  return [
    'block rounded px-3 py-1.5 text-sm transition-colors',
    isActive
      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-200',
  ].join(' ');
}

export default function Sidebar() {
  const chapters = listChapters();

  const byDomain = DOMAIN_ORDER.reduce<Partial<Record<Domain, ChapterMeta[]>>>((acc, domain) => {
    const list = chapters.filter((c) => c.domain === domain);
    if (list.length > 0) acc[domain] = list;
    return acc;
  }, {});

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900">

      {/* Branding */}
      <div className="shrink-0 px-5 pt-6 pb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
          Première Spé · 2025–2026
        </p>
        <p className="mt-1 text-[17px] font-bold leading-tight text-slate-900 dark:text-white">
          Bac Maths
        </p>
        <p className="mt-1.5 text-[11px] leading-snug text-slate-400 dark:text-slate-500">
          EAM · 12 juin 2026<br />sans calculatrice · coeff. 2
        </p>
      </div>

      <SubjectSwitcher current="maths" />

      <div className="mx-4 shrink-0 border-t border-slate-100 dark:border-slate-800" />

      {/* Navigation principale */}
      <div className="shrink-0 px-3 py-3 space-y-0.5">
        <NavLink to="/" end className={mainLinkClass}>
          Accueil
        </NavLink>
        <NavLink to="/bac-blanc" className={mainLinkClass}>
          Bac blanc
        </NavLink>
      </div>

      <div className="mx-4 shrink-0 border-t border-slate-100 dark:border-slate-800" />

      {/* Chapitres groupés par domaine */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {DOMAIN_ORDER.map((domain) => {
          const list = byDomain[domain];
          if (!list) return null;
          return (
            <section key={domain}>
              <header className="mb-1.5 flex items-center gap-2 px-3">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOMAIN_DOT[domain]}`}
                  aria-hidden="true"
                />
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                  {DOMAIN_LABEL[domain]}
                </span>
              </header>
              <ul className="space-y-0.5">
                {list.map((chapter) => (
                  <li key={chapter.slug}>
                    <NavLink
                      to={`/chapitre/${chapter.slug}`}
                      className={chapterLinkClass}
                    >
                      {chapter.shortTitle ?? chapter.title}
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
