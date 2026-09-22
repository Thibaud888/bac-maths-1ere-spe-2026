import { useEffect } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import {
  frenchModuleExists,
  getFrenchModuleContent,
} from '@/francais/lib/french-content-loader';
import { useFrenchAppStore } from '@/francais/stores/french-app-store';
import SectionTabs from '@/components/layout/SectionTabs';
import type { FrenchModuleSlug } from '@/francais/lib/french-types';

const BASE_TABS: ReadonlyArray<{ to: string; label: string }> = [
  { to: 'fiches', label: 'Fiches' },
  { to: 'quiz', label: 'Quiz' },
  { to: 'exercices', label: 'Exercices' },
];

export default function FrenchModuleLayout() {
  const { slug } = useParams<{ slug: string }>();
  const setLastVisitedModule = useFrenchAppStore((s) => s.setLastVisitedModule);
  const isValid = !!slug && frenchModuleExists(slug);

  useEffect(() => {
    if (isValid && slug) {
      setLastVisitedModule(slug);
    }
  }, [isValid, slug, setLastVisitedModule]);

  if (!isValid || !slug) {
    return <Navigate to="/premiere/francais" replace />;
  }

  const content = getFrenchModuleContent(slug as FrenchModuleSlug);
  const tabs =
    content && content.sujets.length > 0
      ? [...BASE_TABS, { to: 'sujets', label: 'Sujets' }]
      : BASE_TABS;

  return (
    <>
      <SectionTabs
        accent="indigo"
        label="Modes de travail"
        items={tabs.map((tab) => ({
          to: `/premiere/francais/module/${slug}/${tab.to}`,
          label: tab.label,
        }))}
      />
      <Outlet />
    </>
  );
}
