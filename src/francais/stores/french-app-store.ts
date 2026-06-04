import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FrenchModuleSlug } from '@/francais/lib/french-types';

export type FicheViewMode = 'detailed' | 'simplified';

type FrenchAppState = {
  lastVisitedModule: string | null;
  setLastVisitedModule: (slug: string) => void;
  quizTimerEnabled: boolean;
  setQuizTimerEnabled: (enabled: boolean) => void;
  quizTimerSeconds: number;
  setQuizTimerSeconds: (seconds: number) => void;
  quizFilterSucceeded: boolean;
  setQuizFilterSucceeded: (v: boolean) => void;
  ficheViewMode: Partial<Record<FrenchModuleSlug, FicheViewMode>>;
  setFicheViewMode: (slug: FrenchModuleSlug, mode: FicheViewMode) => void;
  hiddenFiches: Partial<Record<FrenchModuleSlug, string[]>>;
  toggleFicheHidden: (slug: FrenchModuleSlug, ficheId: string) => void;
};

export const useFrenchAppStore = create<FrenchAppState>()(
  persist(
    (set) => ({
      lastVisitedModule: null,
      setLastVisitedModule: (slug) => {
        set({ lastVisitedModule: slug });
      },
      quizTimerEnabled: false,
      setQuizTimerEnabled: (enabled) => {
        set({ quizTimerEnabled: enabled });
      },
      quizTimerSeconds: 60,
      setQuizTimerSeconds: (seconds) => {
        set({ quizTimerSeconds: seconds });
      },
      quizFilterSucceeded: true,
      setQuizFilterSucceeded: (v) => {
        set({ quizFilterSucceeded: v });
      },
      ficheViewMode: {},
      setFicheViewMode: (slug, mode) => {
        set((s) => ({ ficheViewMode: { ...s.ficheViewMode, [slug]: mode } }));
      },
      hiddenFiches: {},
      toggleFicheHidden: (slug, ficheId) => {
        set((s) => {
          const current = s.hiddenFiches[slug] ?? [];
          const next = current.includes(ficheId)
            ? current.filter((id) => id !== ficheId)
            : [...current, ficheId];
          return { hiddenFiches: { ...s.hiddenFiches, [slug]: next } };
        });
      },
    }),
    {
      name: 'bfr-2026-app',
      version: 1,
      migrate: (stored: unknown, fromVersion: number) => {
        const s = stored as Partial<FrenchAppState>;
        if (fromVersion < 1) {
          // v0 → v1 : quizFilterSucceeded default changed to true
          return { ...s, quizFilterSucceeded: true };
        }
        return s;
      },
    }
  )
);

// Le thème (clair/sombre) reste géré par le store maths partagé afin de
// conserver une préférence unique pour toute l'application.
