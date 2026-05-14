import { useMemo, useState } from 'react';
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

  const [showHidden, setShowHidden] = useState(false);

  const formulas = useMemo(() => {
    const list = chapter?.formulas ?? [];
    return [...list].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }, [chapter]);

  const visibleFormulas = useMemo(() => {
    let list = formulas;
    if (viewMode === 'simplified') {
      list = list.filter((f) => f.level !== 'approfondissement');
    }
    if (!showHidden) {
      list = list.filter((f) => !hiddenIds.includes(f.id));
    }
    return list;
  }, [formulas, viewMode, showHidden, hiddenIds]);

  const hiddenCountInScope = useMemo(() => {
    const scope =
      viewMode === 'simplified'
        ? formulas.filter((f) => f.level !== 'approfondissement')
        : formulas;
    return scope.filter((f) => hiddenIds.includes(f.id)).length;
  }, [formulas, viewMode, hiddenIds]);

  if (formulas.length === 0) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-sm text-slate-600">
        Aucune formule pour ce chapitre pour le moment.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          {hiddenCountInScope > 0 ? (
            <button
              type="button"
              onClick={() => setShowHidden((v) => !v)}
              className="rounded border border-slate-200 bg-white px-2 py-1 text-slate-600 hover:border-slate-300 hover:text-slate-800"
            >
              {showHidden
                ? `Masquer à nouveau (${hiddenCountInScope})`
                : `Afficher les formules masquées (${hiddenCountInScope})`}
            </button>
          ) : (
            <span className="opacity-0">·</span>
          )}
        </div>
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
