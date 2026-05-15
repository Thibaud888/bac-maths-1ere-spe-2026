import { useParams } from 'react-router-dom';
import { getChapterContent } from '@/lib/content-loader';
import type { ChapterSlug } from '@/lib/types';

export default function Header() {
  const { slug } = useParams<{ slug: string }>();
  const chapter = slug ? getChapterContent(slug as ChapterSlug) : null;

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
      <h1 className="text-lg font-semibold text-slate-900">
        {chapter?.meta.title ?? 'Bac Maths · Première Spé · 2026'}
      </h1>
    </header>
  );
}
