import { NavLink } from 'react-router-dom';
import { listChapters } from '@/lib/content-loader';
import SubjectSwitcher from '@/francais/components/layout/SubjectSwitcher';

const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
  [
    'block rounded px-3 py-2 text-sm transition-colors',
    isActive
      ? 'bg-blue-600 text-white'
      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',
  ].join(' ');

export default function Sidebar() {
  const chapters = listChapters();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Bac 1ʳᵉ · 2026
        </p>
      </div>

      <SubjectSwitcher current="maths" />

      <nav className="flex-1 overflow-y-auto p-3">
        <NavLink to="/" end className={navLinkClass}>
          Accueil
        </NavLink>

        <NavLink to="/bac-blanc" className={navLinkClass}>
          Bac blanc
        </NavLink>

        {chapters.length > 0 && (
          <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Chapitres
          </p>
        )}

        <ul className="mt-2 space-y-1">
          {chapters.map((chapter) => (
            <li key={chapter.slug}>
              <NavLink to={`/chapitre/${chapter.slug}`} className={navLinkClass}>
                {chapter.shortTitle ?? chapter.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
