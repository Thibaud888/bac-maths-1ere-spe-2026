import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import FormulaCard from '@/components/formulary/FormulaCard';
import { getChapterContent } from '@/lib/content-loader';
import type { ChapterSlug } from '@/lib/types';

export default function FormularyPage() {
  const { slug } = useParams<{ slug: string }>();
  const chapter = slug ? getChapterContent(slug as ChapterSlug) : null;

  const formulas = useMemo(() => {
    const list = chapter?.formulas ?? [];
    return [...list].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }, [chapter]);

  if (formulas.length === 0) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-sm text-slate-600">
        Aucune formule pour ce chapitre pour le moment.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-3 p-6">
      {formulas.map((formula) => (
        <FormulaCard key={formula.id} formula={formula} />
      ))}
    </div>
  );
}
