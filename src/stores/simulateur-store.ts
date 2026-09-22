import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { clampNote } from '@/lib/simulateur';

/**
 * État du simulateur de moyenne : les notes réglées, celles qui sont figées,
 * la mention visée et la mesure affichée sur la répartition.
 *
 * Persistance sous le préfixe `btl-2027-` : le simulateur ne touche jamais aux
 * clés `bms-2026-*` (maths) ni `bfr-2026-*` (français).
 */

/** Mesure représentée par la répartition : ce que la note apporte, ou le poids brut. */
export type MesureRepartition = 'contribution' | 'coefficient';

/** Les mentions qu'on peut se fixer comme objectif. */
export const CIBLES: readonly number[] = [10, 12, 14, 16, 18] as const;

type SimulateurState = {
  /** Note par ligne. Une ligne absente vaut 10. */
  notes: Record<string, number>;
  /** Notes déjà connues, que le simulateur ne fait plus bouger. */
  figees: Record<string, boolean>;
  cible: number;
  mesure: MesureRepartition;
  setNote: (id: string, note: number) => void;
  toggleFigee: (id: string) => void;
  /** Fige ou libère d'un coup toutes les lignes passées. */
  figerLignes: (ids: readonly string[], figee: boolean) => void;
  setCible: (cible: number) => void;
  setMesure: (mesure: MesureRepartition) => void;
  reinitialiser: () => void;
};

export const useSimulateurStore = create<SimulateurState>()(
  persist(
    (set) => ({
      notes: {},
      figees: {},
      cible: 10,
      mesure: 'contribution',
      setNote: (id, note) => {
        set((s) => ({ notes: { ...s.notes, [id]: clampNote(note) } }));
      },
      toggleFigee: (id) => {
        set((s) => ({ figees: { ...s.figees, [id]: !s.figees[id] } }));
      },
      figerLignes: (ids, figee) => {
        set((s) => {
          const next = { ...s.figees };
          for (const id of ids) next[id] = figee;
          return { figees: next };
        });
      },
      setCible: (cible) => {
        set({ cible });
      },
      setMesure: (mesure) => {
        set({ mesure });
      },
      reinitialiser: () => {
        set({ notes: {}, figees: {}, cible: 10, mesure: 'contribution' });
      },
    }),
    { name: 'btl-2027-simulateur' }
  )
);
