import { useParams } from 'react-router-dom';
import { getChapterContent } from '@/lib/content-loader';
import type { ChapterSlug } from '@/lib/types';

export default function AutomatismsPage() {
  const { slug } = useParams<{ slug: string }>();
  const chapter = slug ? getChapterContent(slug as ChapterSlug) : null;
  const automatisms = chapter?.automatisms ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-3 p-6">
      <p className="text-sm text-slate-600">
        {automatisms.length === 0
          ? 'Aucun automatisme pour ce chapitre pour le moment.'
          : `${automatisms.length} automatisme(s) — runner à venir en Phase 3.`}
      </p>
    </div>
  );
}
