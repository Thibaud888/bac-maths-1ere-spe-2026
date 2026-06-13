import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FrenchItemKind =
  | 'quiz'
  | 'exercice'
  | 'sujet'
  | 'flashcard'
  | 'oral-grammaire'
  | 'oral-sim';

export type FrenchItemProgress = {
  attempts: number;
  succeeded: boolean;
  lastSeenAt: string;
};

export type FlashcardDecision = 'known' | 'skip';

/** Statut de révision d'une question d'entretien (cochage depuis la fiche). */
export type OralStatus = 'review' | 'done';

type FrenchProgressState = {
  items: Record<string, FrenchItemProgress>;
  flashcardDecisions: Record<string, FlashcardDecision>;
  /**
   * Cases « révisé » cochées manuellement par l'élève (suivi d'avancement de
   * l'oral). Clés namespacées : `${eleve}::text::${id}`, `${eleve}::gram::${id}`,
   * `${eleve}::oeuvre::pourquoi|presentation|jugement`.
   */
  oralChecks: Record<string, boolean>;
  /**
   * Statut tri-état des questions d'entretien (`review` = à retravailler,
   * `done` = maîtrisée). Clé : `${eleve}::eq::${questionId}`.
   */
  oralStatus: Record<string, OralStatus>;
  recordAttempt: (id: string, succeeded: boolean) => void;
  setFlashcardDecision: (id: string, decision: FlashcardDecision) => void;
  clearFlashcardDecisions: (ids: string[]) => void;
  toggleOralCheck: (key: string) => void;
  setOralStatus: (key: string, status: OralStatus) => void;
  reset: (id?: string) => void;
  countSucceeded: (kind: FrenchItemKind) => number;
};

const idPrefix = (kind: FrenchItemKind): string => {
  switch (kind) {
    case 'quiz':
      return 'qz-';
    case 'exercice':
      return 'ex-';
    case 'sujet':
      return 'su-';
    case 'flashcard':
      return 'fl-';
    case 'oral-grammaire':
      return 'oq-';
    case 'oral-sim':
      return 'os-';
  }
};

export const useFrenchProgressStore = create<FrenchProgressState>()(
  persist(
    (set, get) => ({
      items: {},
      flashcardDecisions: {},
      oralChecks: {},
      oralStatus: {},
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
      setFlashcardDecision: (id, decision) => {
        set((state) => ({
          flashcardDecisions: { ...state.flashcardDecisions, [id]: decision },
        }));
      },
      clearFlashcardDecisions: (ids) => {
        set((state) => {
          const next = { ...state.flashcardDecisions };
          for (const id of ids) delete next[id];
          return { flashcardDecisions: next };
        });
      },
      toggleOralCheck: (key) => {
        set((state) => {
          const next = { ...state.oralChecks };
          if (next[key]) delete next[key];
          else next[key] = true;
          return { oralChecks: next };
        });
      },
      setOralStatus: (key, status) => {
        set((state) => {
          const next = { ...state.oralStatus };
          // Re-cliquer sur le statut actif l'annule (retour à « non vu »).
          if (next[key] === status) delete next[key];
          else next[key] = status;
          return { oralStatus: next };
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
