import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ItemKind = 'automatism' | 'classic' | 'exam';

export type ItemProgress = {
  attempts: number;
  succeeded: boolean;
  lastSeenAt: string;
};

type ProgressState = {
  items: Record<string, ItemProgress>;
  recordAttempt: (id: string, succeeded: boolean) => void;
  reset: (id?: string) => void;
  countSucceeded: (kind: ItemKind) => number;
};

const idPrefix = (kind: ItemKind): string => {
  switch (kind) {
    case 'automatism':
      return 'a-';
    case 'classic':
      return 'c-';
    case 'exam':
      return 'e-';
  }
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      items: {},
      recordAttempt: (id, succeeded) => {
        set((state) => {
          const previous = state.items[id];
          const next: ItemProgress = {
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
    { name: 'bms-2026-progress' }
  )
);
