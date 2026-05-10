import { NavLink } from 'react-router-dom';
import { listChapters } from '@/lib/content-loader';

const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
  [
    'block rounded px-3 py-2 text-sm transition-colors',
    isActive
      ? 'bg-blue-600 text-white'
      : 'text-slate-700 hover:bg-slate-200',
  ].join(' ');

export default function Sidebar() {
  const chapters = listChapters();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Bac Maths · 1ʳᵉ Spé
        </p>
        <p className="mt-1 text-sm text-slate-600">EAM 2026</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <NavLink to="/" end className={navLinkClass}>
          Accueil
        </NavLink>

        {chapters.length > 0 && (
          <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
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
