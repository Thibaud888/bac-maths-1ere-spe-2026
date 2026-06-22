import { Outlet, useLocation } from 'react-router-dom';
import { getChapterContent } from '@/lib/content-loader';
import { useAppStore } from '@/stores/app-store';
import type { ChapterSlug } from '@/lib/types';
import Sidebar, { DOMAIN_LABEL } from './Sidebar';
import TopBar, { type Crumb } from './TopBar';

function useMathsCrumbs(): Crumb[] {
  const { pathname } = useLocation();

  const chapterMatch = pathname.match(/^\/chapitre\/([^/]+)/);
  if (chapterMatch) {
    const content = getChapterContent(chapterMatch[1] as ChapterSlug);
    if (content) {
      return [
        { label: DOMAIN_LABEL[content.meta.domain], muted: true },
        { label: content.meta.title },
      ];
    }
  }
  if (pathname.startsWith('/bac-blanc')) {
    return [{ label: 'Bac blanc' }];
  }
  return [];
}

export default function AppLayout() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const crumbs = useMathsCrumbs();

  return (
    <div className="flex min-h-screen">
      {!collapsed && <Sidebar />}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar subject="maths" crumbs={crumbs} />
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
