import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChapterSlug } from '@/lib/types';

export type FormularyViewMode = 'detailed' | 'simplified';

type AppState = {
  lastVisitedChapter: string | null;
  setLastVisitedChapter: (slug: string) => void;
  automatismTimerEnabled: boolean;
  setAutomatismTimerEnabled: (enabled: boolean) => void;
  automatismTimerSeconds: number;
  setAutomatismTimerSeconds: (seconds: number) => void;
  formularyViewMode: Partial<Record<ChapterSlug, FormularyViewMode>>;
  setFormularyViewMode: (slug: ChapterSlug, mode: FormularyViewMode) => void;
  hiddenFormulas: Partial<Record<ChapterSlug, string[]>>;
  toggleFormulaHidden: (slug: ChapterSlug, formulaId: string) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      lastVisitedChapter: null,
      setLastVisitedChapter: (slug) => {
        set({ lastVisitedChapter: slug });
      },
      automatismTimerEnabled: true,
      setAutomatismTimerEnabled: (enabled) => {
        set({ automatismTimerEnabled: enabled });
      },
      automatismTimerSeconds: 120,
      setAutomatismTimerSeconds: (seconds) => {
        set({ automatismTimerSeconds: seconds });
      },
      formularyViewMode: {},
      setFormularyViewMode: (slug, mode) => {
        set((s) => ({ formularyViewMode: { ...s.formularyViewMode, [slug]: mode } }));
      },
      hiddenFormulas: {},
      toggleFormulaHidden: (slug, formulaId) => {
        set((s) => {
          const current = s.hiddenFormulas[slug] ?? [];
          const next = current.includes(formulaId)
            ? current.filter((id) => id !== formulaId)
            : [...current, formulaId];
          return { hiddenFormulas: { ...s.hiddenFormulas, [slug]: next } };
        });
      },
    }),
    { name: 'bms-2026-app' }
  )
);
