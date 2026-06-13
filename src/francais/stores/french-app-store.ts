import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FrenchModuleSlug } from '@/francais/lib/french-types';

export type FicheViewMode = 'detailed' | 'simplified';

/** Mode d'affichage de l'oral : l'essentiel rédigé vs le détail complet. */
export type OralViewMode = 'essentiel' | 'detaille';

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
  /** Mode global de l'oral (s'applique à toutes les pages oral). */
  oralViewMode: OralViewMode;
  setOralViewMode: (mode: OralViewMode) => void;
  hiddenFiches: Partial<Record<FrenchModuleSlug, string[]>>;
  toggleFicheHidden: (slug: FrenchModuleSlug, ficheId: string) => void;
  // --- Oral ---
  /** Durée par défaut (minutes) de la préparation dans le simulateur d'oral. */
  simulateurDefaultMinutes: number;
  setSimulateurDefaultMinutes: (minutes: number) => void;
  /**
   * Textes collés pour les œuvres hors domaine public, par clé composite
   * `${eleve}:${textId}` (isolation entre élèves sur un même navigateur).
   */
  pastedOralTexts: Record<string, string>;
  setPastedOralText: (key: string, value: string) => void;
  /** Dernier élève ouvert dans l'espace oral (mémorisation de confort). */
  lastOralStudent: string | null;
  setLastOralStudent: (eleve: string) => void;
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
      oralViewMode: 'essentiel',
      setOralViewMode: (mode) => {
        set({ oralViewMode: mode });
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
      simulateurDefaultMinutes: 30,
      setSimulateurDefaultMinutes: (minutes) => {
        set({ simulateurDefaultMinutes: minutes });
      },
      pastedOralTexts: {},
      setPastedOralText: (key, value) => {
        set((s) => ({
          pastedOralTexts: { ...s.pastedOralTexts, [key]: value },
        }));
      },
      lastOralStudent: null,
      setLastOralStudent: (eleve) => {
        set({ lastOralStudent: eleve });
      },
    }),
    {
      name: 'bfr-2026-app',
      version: 4,
      migrate: (stored: unknown, fromVersion: number) => {
        const s = stored as Partial<FrenchAppState>;
        let next = { ...s };
        if (fromVersion < 1) {
          // v0 → v1 : quizFilterSucceeded default changed to true
          next = { ...next, quizFilterSucceeded: true };
        }
        if (fromVersion < 2) {
          // v1 → v2 : ajout des réglages oral (simulateur + textes collés)
          next = {
            ...next,
            simulateurDefaultMinutes: next.simulateurDefaultMinutes ?? 30,
            pastedOralTexts: next.pastedOralTexts ?? {},
          };
        }
        if (fromVersion < 3) {
          // v2 → v3 : oral multi-élèves. Les textes collés existants
          // appartiennent à l'élève J → on préfixe leur clé par `j:`.
          const old = next.pastedOralTexts ?? {};
          const remapped: Record<string, string> = {};
          for (const [k, v] of Object.entries(old)) {
            remapped[k.includes(':') ? k : `j:${k}`] = v;
          }
          next = {
            ...next,
            pastedOralTexts: remapped,
            lastOralStudent: next.lastOralStudent ?? null,
          };
        }
        if (fromVersion < 4) {
          // v3 → v4 : ajout du mode global de l'oral (défaut : essentiel).
          next = { ...next, oralViewMode: next.oralViewMode ?? 'essentiel' };
        }
        return next;
      },
    }
  )
);

// Le thème (clair/sombre) reste géré par le store maths partagé afin de
// conserver une préférence unique pour toute l'application.
