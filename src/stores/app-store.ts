import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AppState = {
  lastVisitedChapter: string | null;
  setLastVisitedChapter: (slug: string) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      lastVisitedChapter: null,
      setLastVisitedChapter: (slug) => {
        set({ lastVisitedChapter: slug });
      },
    }),
    { name: 'bms-2026-app' }
  )
);
