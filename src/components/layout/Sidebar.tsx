import { listChapters } from '@/lib/content-loader';
import type { Domain } from '@/lib/types';
import NavSidebar, { type NavGroup } from './NavSidebar';

export const DOMAIN_LABEL: Record<Domain, string> = {
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

export default function Sidebar() {
  const chapters = listChapters();

  const groups: NavGroup[] = DOMAIN_ORDER.reduce<NavGroup[]>((acc, domain) => {
    const list = chapters.filter((c) => c.domain === domain);
    if (list.length > 0) {
      acc.push({
        label: DOMAIN_LABEL[domain],
        dot: DOMAIN_DOT[domain],
        items: list.map((chapter) => ({
          to: `/chapitre/${chapter.slug}`,
          label: chapter.shortTitle ?? chapter.title,
        })),
      });
    }
    return acc;
  }, []);

  return (
    <NavSidebar
      accent="blue"
      brand={
        <div className="px-5 pt-6 pb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
            Première Spé · 2025–2026
          </p>
          <p className="mt-1 text-[17px] font-bold leading-tight text-slate-900 dark:text-white">
            Bac Maths
          </p>
          <p className="mt-1.5 text-[11px] leading-snug text-slate-400 dark:text-slate-500">
            EAM · 12 juin 2026
            <br />
            sans calculatrice · coeff. 2
          </p>
        </div>
      }
      primary={[
        { to: '/', label: 'Accueil', end: true },
        { to: '/bac-blanc', label: 'Bac blanc' },
      ]}
      groups={groups}
    />
  );
}
