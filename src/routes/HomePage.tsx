import { Link } from 'react-router-dom';
import {
  SITE_NAME,
  SPACES,
  TOOLS,
  YEARS,
  type Space,
  type SpaceAccent,
} from '@/lib/spaces';

const TILE: Record<SpaceAccent, string> = {
  blue: 'border-blue-200 hover:border-blue-400 dark:border-blue-800 dark:hover:border-blue-600',
  violet:
    'border-violet-200 hover:border-violet-400 dark:border-violet-800 dark:hover:border-violet-600',
  amber:
    'border-amber-200 hover:border-amber-400 dark:border-amber-800 dark:hover:border-amber-600',
  sky: 'border-sky-200 hover:border-sky-400 dark:border-sky-800 dark:hover:border-sky-600',
  indigo:
    'border-indigo-200 hover:border-indigo-400 dark:border-indigo-800 dark:hover:border-indigo-600',
};

const DOT: Record<SpaceAccent, string> = {
  blue: 'bg-blue-500',
  violet: 'bg-violet-500',
  amber: 'bg-amber-500',
  sky: 'bg-sky-500',
  indigo: 'bg-indigo-500',
};

function SpaceTile({ space }: { space: Space }) {
  return (
    <li>
      <Link
        to={space.path}
        className={`flex h-full flex-col rounded-xl border-2 bg-white p-5 transition-colors dark:bg-slate-800 ${TILE[space.accent]}`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${DOT[space.accent]}`}
            aria-hidden="true"
          />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {space.title}
          </h3>
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {space.tagline}
        </p>
        {space.status === 'soon' && (
          <span className="mt-3 self-start rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-700 dark:text-slate-300">
            contenu à venir
          </span>
        )}
      </Link>
    </li>
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {SITE_NAME}
        </h1>
      </header>

      {YEARS.map((year) => {
        const spaces = SPACES.filter((s) => s.year === year.id);
        if (spaces.length === 0) return null;
        return (
          <section key={year.id}>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              {year.label}
            </h2>
            <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {spaces.map((space) => (
                <SpaceTile key={space.id} space={space} />
              ))}
            </ul>
          </section>
        );
      })}

      <section>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
          Outils
        </h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <li key={tool.to}>
              <Link
                to={tool.to}
                className="block rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-500"
              >
                {tool.label} →
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
