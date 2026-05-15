import { useEffect } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { chapterExists } from '@/lib/content-loader';
import { useAppStore } from '@/stores/app-store';
import ChapterTabs from './ChapterTabs';

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
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <ChapterTabs />
      <Outlet />
    </>
  );
}
