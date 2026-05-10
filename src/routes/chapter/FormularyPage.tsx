import { useParams } from 'react-router-dom';
import { getChapterContent } from '@/lib/content-loader';
import { TextWithMath } from '@/components/math/TextWithMath';
import type { ChapterSlug } from '@/lib/types';

export default function FormularyPage() {
  const { slug } = useParams<{ slug: string }>();
  const chapter = slug ? getChapterContent(slug as ChapterSlug) : null;
  const formulas = chapter?.formulas ?? [];

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
        <article
          key={formula.id}
          className="rounded border border-slate-200 bg-white p-4"
        >
          <h3 className="text-sm font-semibold text-slate-900">{formula.title}</h3>
          <div className="mt-2 text-sm leading-relaxed text-slate-700">
            <TextWithMath text={formula.statement} />
          </div>
          {formula.conditions && (
            <p className="mt-1 text-xs text-slate-500">
              <TextWithMath text={formula.conditions} />
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
