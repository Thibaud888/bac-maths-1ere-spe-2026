import { NavLink, useLocation } from 'react-router-dom';
import {
  TOOLS,
  YEARS,
  findSpaceByPath,
  spacesOfYear,
  type NavLeaf,
  type Space,
  type SpaceAccent,
} from '@/lib/spaces';
import OralStudentSidebar from '@/francais/components/oral/OralStudentSidebar';
import SidebarShell from './SidebarShell';

/** Fond et texte de l'espace ouvert, par couleur d'accent. */
const ACTIVE_SPACE: Record<SpaceAccent, string> = {
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  violet: 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  sky: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
  indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
};

/** Texte du lien courant à l'intérieur d'un espace ouvert. */
const ACTIVE_LEAF: Record<SpaceAccent, string> = {
  blue: 'bg-blue-50 font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  violet:
    'bg-violet-50 font-semibold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
  amber:
    'bg-amber-50 font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  sky: 'bg-sky-50 font-semibold text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
  indigo:
    'bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
};

/** Filet vertical qui rattache les liens dépliés à leur espace. */
const RAIL: Record<SpaceAccent, string> = {
  blue: 'border-blue-200 dark:border-blue-900',
  violet: 'border-violet-200 dark:border-violet-900',
  amber: 'border-amber-200 dark:border-amber-900',
  sky: 'border-sky-200 dark:border-sky-900',
  indigo: 'border-indigo-200 dark:border-indigo-900',
};

/** Pastille de couleur de l'espace. */
const DOT: Record<SpaceAccent, string> = {
  blue: 'bg-blue-500',
  violet: 'bg-violet-500',
  amber: 'bg-amber-500',
  sky: 'bg-sky-500',
  indigo: 'bg-indigo-500',
};

function toolLinkClass({ isActive }: { isActive: boolean }): string {
  return [
    'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
  ].join(' ');
}

type LeafProps = { item: NavLeaf; accent: SpaceAccent };

function Leaf({ item, accent }: LeafProps) {
  return (
    <li>
      <NavLink
        to={item.to}
        end={item.end ?? false}
        className={({ isActive }) =>
          [
            'block rounded-md px-3 py-1.5 text-sm transition-colors',
            isActive
              ? ACTIVE_LEAF[accent]
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-slate-100',
          ].join(' ')
        }
      >
        {item.label}
      </NavLink>
    </li>
  );
}

type SpaceItemProps = { space: Space; open: boolean };

/**
 * Une matière dans la colonne. Ouverte, elle déplie ses chapitres ou ses
 * sections juste en dessous ; fermée, elle tient sur une ligne.
 */
function SpaceItem({ space, open }: SpaceItemProps) {
  const sections = open ? space.sections() : [];
  const isEmpty = open && sections.length === 0;

  return (
    <li>
      <NavLink
        to={space.path}
        className={[
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
          open
            ? `font-semibold ${ACTIVE_SPACE[space.accent]}`
            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-slate-100',
        ].join(' ')}
      >
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT[space.accent]}`}
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1 truncate">{space.label}</span>
        <ChevronIcon open={open} />
      </NavLink>

      {open && (
        <div
          className={`ml-4 mt-1 border-l pl-2 ${RAIL[space.accent]}`}
        >
          {isEmpty && (
            <p className="px-3 py-1.5 text-xs italic text-slate-400 dark:text-slate-500">
              {space.emptyLabel}
            </p>
          )}
          {sections.map((section, index) => (
            <section key={section.label ?? `section-${index}`} className="pb-1">
              {section.label && (
                <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  {section.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <Leaf key={item.to} item={item} accent={space.accent} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </li>
  );
}

type Props = {
  /** Replie la colonne ; le bandeau supérieur offre ensuite de la rouvrir. */
  onCollapse: () => void;
};

/**
 * Colonne de navigation unique du site : les outils transverses en haut,
 * puis une section par année, chacune listant ses matières. Seule la matière
 * ouverte déplie son contenu.
 */
export default function MainSidebar({ onCollapse }: Props) {
  const { pathname } = useLocation();

  // Espace oral d'un élève : la colonne bascule sur le descriptif de l'élève.
  const oralMatch = pathname.match(/^\/premiere\/francais\/oral\/([^/]+)/);
  if (oralMatch?.[1]) {
    return <OralStudentSidebar eleve={oralMatch[1]} onCollapse={onCollapse} />;
  }

  const currentSpace = findSpaceByPath(pathname);

  return (
    <SidebarShell onCollapse={onCollapse}>
      <div className="shrink-0 space-y-0.5 border-b border-slate-200 px-3 pb-3 dark:border-slate-700/60">
        <NavLink to="/" end className={toolLinkClass}>
          Accueil
        </NavLink>
        {TOOLS.map((tool) => (
          <NavLink key={tool.to} to={tool.to} className={toolLinkClass}>
            {tool.label}
          </NavLink>
        ))}
      </div>

      <nav
        aria-label="Matières"
        className="flex-1 overflow-y-auto px-3 pb-6 pt-1"
      >
        {YEARS.map((year, index) => (
          <section
            key={year.id}
            className={
              index === 0
                ? 'pt-3'
                : 'mt-4 border-t border-slate-200 pt-4 dark:border-slate-700/60'
            }
          >
            <header className="mb-1.5 px-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                {year.label}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {year.hint}
              </p>
            </header>
            <ul className="space-y-0.5">
              {spacesOfYear(year.id).map((space) => (
                <SpaceItem
                  key={space.id}
                  space={space}
                  open={space.id === currentSpace?.id}
                />
              ))}
            </ul>
          </section>
        ))}
      </nav>
    </SidebarShell>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-3 w-3 shrink-0 ${open ? '' : 'text-slate-400 dark:text-slate-500'}`}
      aria-hidden="true"
    >
      {open ? (
        <polyline points="6 9 12 15 18 9" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  );
}
