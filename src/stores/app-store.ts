import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AppState = {
  lastVisitedChapter: string | null;
  setLastVisitedChapter: (slug: string) => void;
  automatismTimerEnabled: boolean;
  setAutomatismTimerEnabled: (enabled: boolean) => void;
  automatismTimerSeconds: number;
  setAutomatismTimerSeconds: (seconds: number) => void;
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
    }),
    { name: 'bms-2026-app' }
  )
);
