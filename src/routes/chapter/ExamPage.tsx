import { useParams } from 'react-router-dom';
import { getChapterContent } from '@/lib/content-loader';
import type { ChapterSlug } from '@/lib/types';

export default function ExamPage() {
  const { slug } = useParams<{ slug: string }>();
  const chapter = slug ? getChapterContent(slug as ChapterSlug) : null;
  const exams = chapter?.examStyle ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-3 p-6">
      <p className="text-sm text-slate-600">
        {exams.length === 0
          ? 'Aucun exercice type bac pour ce chapitre pour le moment.'
          : `${exams.length} exercice(s) type bac — runner à venir en Phase 3.`}
      </p>
    </div>
  );
}
