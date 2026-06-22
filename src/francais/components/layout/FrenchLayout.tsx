import { Outlet, useLocation } from 'react-router-dom';
import {
  getFrenchModuleContent,
  getOralStudent,
} from '@/francais/lib/french-content-loader';
import { useAppStore } from '@/stores/app-store';
import type { FrenchModuleSlug } from '@/francais/lib/french-types';
import TopBar, { type Crumb } from '@/components/layout/TopBar';
import FrenchSidebar, { familyLabels } from './FrenchSidebar';

function useFrenchCrumbs(): Crumb[] {
  const { pathname } = useLocation();

  const moduleMatch = pathname.match(/^\/francais\/module\/([^/]+)/);
  if (moduleMatch) {
    const content = getFrenchModuleContent(moduleMatch[1] as FrenchModuleSlug);
    if (content) {
      return [
        { label: familyLabels[content.meta.family], muted: true },
        { label: content.meta.title },
      ];
    }
  }

  const oralMatch = pathname.match(/^\/francais\/oral\/([^/]+)/);
  if (oralMatch) {
    const student = getOralStudent(oralMatch[1]!);
    return [
      { label: 'Oral', muted: true },
      { label: student?.nom ?? oralMatch[1]! },
    ];
  }

  if (pathname === '/francais/oral') return [{ label: 'Oral' }];
  if (pathname.startsWith('/francais/ecrit')) return [{ label: 'Écrit' }];
  if (pathname.startsWith('/francais/express')) {
    return [{ label: 'Révision express' }];
  }
  return [];
}

export default function FrenchLayout() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const crumbs = useFrenchCrumbs();

  return (
    <div className="flex min-h-screen">
      {!collapsed && <FrenchSidebar />}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar subject="francais" crumbs={crumbs} />
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
