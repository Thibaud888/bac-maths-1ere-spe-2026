import { useEffect } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { chapterExists } from '@/lib/content-loader';
import { useAppStore } from '@/stores/app-store';
import SectionTabs from './SectionTabs';

const TABS: ReadonlyArray<{ to: string; label: string }> = [
  { to: 'formulaire', label: 'Formulaire' },
  { to: 'automatismes', label: 'Automatismes' },
  { to: 'classiques', label: 'Classiques' },
  { to: 'examen', label: 'Type bac' },
];

export default function ChapterLayout() {
  const { slug } = useParams<{ slug: string }>();
  const setLastVisitedChapter = useAppStore((s) => s.setLastVisitedChapter);
  const isValid = !!slug && chapterExists(slug);

  useEffect(() => {
    if (isValid && slug) {
      setLastVisitedChapter(slug);
    }
  }, [isValid, slug, setLastVisitedChapter]);

  if (!isValid) {
    return <Navigate to="/premiere/maths" replace />;
  }

  return (
    <>
      <SectionTabs
        accent="sky"
        label="Modes de travail"
        items={TABS.map((tab) => ({
          to: `/premiere/maths/${slug}/${tab.to}`,
          label: tab.label,
        }))}
      />
      <Outlet />
    </>
  );
}
