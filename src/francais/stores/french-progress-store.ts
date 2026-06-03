import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FrenchItemKind = 'quiz' | 'exercice';

export type FrenchItemProgress = {
  attempts: number;
  succeeded: boolean;
  lastSeenAt: string;
};

type FrenchProgressState = {
  items: Record<string, FrenchItemProgress>;
  recordAttempt: (id: string, succeeded: boolean) => void;
  reset: (id?: string) => void;
  countSucceeded: (kind: FrenchItemKind) => number;
};

const idPrefix = (kind: FrenchItemKind): string => {
  switch (kind) {
    case 'quiz':
      return 'qz-';
    case 'exercice':
      return 'ex-';
  }
};

export const useFrenchProgressStore = create<FrenchProgressState>()(
  persist(
    (set, get) => ({
      items: {},
      recordAttempt: (id, succeeded) => {
        set((state) => {
          const previous = state.items[id];
          const next: FrenchItemProgress = {
            attempts: (previous?.attempts ?? 0) + 1,
            succeeded: succeeded || (previous?.succeeded ?? false),
            lastSeenAt: new Date().toISOString(),
          };
          return { items: { ...state.items, [id]: next } };
        });
      },
      reset: (id) => {
        if (!id) {
          set({ items: {} });
          return;
        }
        set((state) => {
          const next = { ...state.items };
          delete next[id];
          return { items: next };
        });
      },
      countSucceeded: (kind) => {
        const prefix = idPrefix(kind);
        const succeededBases = new Set<string>();
        for (const [id, item] of Object.entries(get().items)) {
          if (!id.startsWith(prefix) || !item.succeeded) continue;
          const sep = id.indexOf('::');
          succeededBases.add(sep === -1 ? id : id.slice(0, sep));
        }
        return succeededBases.size;
      },
    }),
    { name: 'bfr-2026-progress' }
  )
);
