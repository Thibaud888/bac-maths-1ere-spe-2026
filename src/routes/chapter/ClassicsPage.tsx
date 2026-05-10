import { useParams } from 'react-router-dom';
import { getChapterContent } from '@/lib/content-loader';
import type { ChapterSlug } from '@/lib/types';

export default function ClassicsPage() {
  const { slug } = useParams<{ slug: string }>();
  const chapter = slug ? getChapterContent(slug as ChapterSlug) : null;
  const classics = chapter?.classics ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-3 p-6">
      <p className="text-sm text-slate-600">
        {classics.length === 0
          ? 'Aucun exercice classique pour ce chapitre pour le moment.'
          : `${classics.length} exercice(s) classique(s) — runner à venir en Phase 3.`}
      </p>
    </div>
  );
}
