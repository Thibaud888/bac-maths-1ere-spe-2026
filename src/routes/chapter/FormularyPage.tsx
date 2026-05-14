import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import FormulaCard from '@/components/formulary/FormulaCard';
import SimplifiedFormulaCard from '@/components/formulary/SimplifiedFormulaCard';
import ViewModeToggle from '@/components/formulary/ViewModeToggle';
import { getChapterContent } from '@/lib/content-loader';
import { useAppStore } from '@/stores/app-store';
import type { ChapterSlug } from '@/lib/types';

export default function FormularyPage() {
  const { slug } = useParams<{ slug: string }>();
  const chapterSlug = (slug ?? '') as ChapterSlug;
  const chapter = slug ? getChapterContent(chapterSlug) : null;

  const viewMode = useAppStore((s) => s.formularyViewMode[chapterSlug] ?? 'detailed');
  const setViewMode = useAppStore((s) => s.setFormularyViewMode);
  const hiddenIds = useAppStore((s) => s.hiddenFormulas[chapterSlug] ?? []);
  const toggleHidden = useAppStore((s) => s.toggleFormulaHidden);

  const formulas = useMemo(() => {
    const list = chapter?.formulas ?? [];
    return [...list].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }, [chapter]);

  const visibleFormulas = useMemo(() => {
    if (viewMode === 'simplified') {
      return formulas.filter((f) => f.level !== 'approfondissement');
    }
    return formulas;
  }, [formulas, viewMode]);

  if (formulas.length === 0) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-sm text-slate-600">
        Aucune formule pour ce chapitre pour le moment.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-4 flex items-center justify-end">
        <ViewModeToggle
          value={viewMode}
          onChange={(mode) => setViewMode(chapterSlug, mode)}
        />
      </div>
      <div className="space-y-3">
        {visibleFormulas.map((formula, idx) => {
          const hidden = hiddenIds.includes(formula.id);
          const onToggleHidden = () => toggleHidden(chapterSlug, formula.id);
          return viewMode === 'simplified' ? (
            <SimplifiedFormulaCard
              key={formula.id}
              formula={formula}
              index={idx + 1}
              hidden={hidden}
              onToggleHidden={onToggleHidden}
            />
          ) : (
            <FormulaCard
              key={formula.id}
              formula={formula}
              index={idx + 1}
              hidden={hidden}
              onToggleHidden={onToggleHidden}
            />
          );
        })}
      </div>
    </div>
  );
}
