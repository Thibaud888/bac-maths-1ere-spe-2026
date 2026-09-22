import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { getChapterContent } from '@/lib/content-loader';
import {
  getFrenchModuleContent,
  getOralStudent,
} from '@/francais/lib/french-content-loader';
import { useAppStore } from '@/stores/app-store';
import { useIsCompact } from '@/lib/use-is-compact';
import {
  GRAND_ORAL_SECTIONS,
  TOOLS,
  YEARS,
  findSpaceByPath,
} from '@/lib/spaces';
import type { ChapterSlug } from '@/lib/types';
import type { FrenchModuleSlug } from '@/francais/lib/french-types';
import MainSidebar from './MainSidebar';
import TopBar, { type Crumb } from './TopBar';

/** Dernier niveau du fil d'Ariane, propre à la page ouverte. */
function pageCrumb(pathname: string): string | null {
  const chapter = pathname.match(/^\/premiere\/maths\/([^/]+)/);
  if (chapter?.[1]) {
    if (chapter[1] === 'bac-blanc') return 'Bac blanc';
    const content = getChapterContent(chapter[1] as ChapterSlug);
    if (content) return content.meta.title;
  }

  const module = pathname.match(/^\/premiere\/francais\/module\/([^/]+)/);
  if (module?.[1]) {
    const content = getFrenchModuleContent(module[1] as FrenchModuleSlug);
    if (content) return content.meta.title;
  }

  const oral = pathname.match(/^\/premiere\/francais\/oral\/([^/]+)/);
  if (oral?.[1]) {
    const student = getOralStudent(oral[1]);
    return `Oral · ${student?.nom ?? oral[1]}`;
  }
  if (pathname.startsWith('/premiere/francais/oral')) return 'Oral';
  if (pathname.startsWith('/premiere/francais/ecrit')) return 'Écrit';
  if (pathname.startsWith('/premiere/francais/express')) return 'Révision express';

  const section = GRAND_ORAL_SECTIONS.find((s) => pathname.startsWith(s.to));
  if (section) return section.label;

  return null;
}

function useCrumbs(): Crumb[] {
  const { pathname } = useLocation();

  const tool = TOOLS.find((t) => pathname.startsWith(t.to));
  if (tool) return [{ label: tool.label }];

  const space = findSpaceByPath(pathname);
  if (!space) return [];

  const year = YEARS.find((y) => y.id === space.year);
  const page = pageCrumb(pathname);

  const crumbs: Crumb[] = [];
  if (year) crumbs.push({ label: year.short, muted: true });
  crumbs.push({ label: space.label, muted: page !== null });
  if (page) crumbs.push({ label: page });
  return crumbs;
}

/**
 * Cadre unique du site : la colonne de navigation, le bandeau supérieur et la
 * page courante. Sur écran étroit, la colonne s'ouvre en tiroir par-dessus la
 * page ; sur grand écran, elle se replie pour laisser la place au contenu.
 */
export default function AppLayout() {
  const { pathname } = useLocation();
  const crumbs = useCrumbs();
  const compact = useIsCompact();
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Sur téléphone, ouvrir un lien referme le tiroir.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const navOpen = compact ? drawerOpen : !collapsed;
  const toggleNav = () => {
    if (compact) {
      setDrawerOpen((open) => !open);
    } else {
      toggleSidebar();
    }
  };

  return (
    <div className="flex min-h-screen">
      {navOpen && compact && (
        <button
          type="button"
          onClick={toggleNav}
          aria-label="Fermer le menu"
          className="fixed inset-0 z-30 bg-slate-900/40"
        />
      )}

      {navOpen && (
        <div
          className={
            compact
              ? 'fixed inset-y-0 left-0 z-40 shadow-xl'
              : 'sticky top-0 h-screen shrink-0'
          }
        >
          <MainSidebar onCollapse={toggleNav} />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar navOpen={navOpen} onToggleNav={toggleNav} crumbs={crumbs} />
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
