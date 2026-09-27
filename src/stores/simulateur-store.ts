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

/** Part de la colonne du camembert, en % de la largeur (grand écran), et ses bornes. */
export const LARGEUR_PANNEAU = { min: 30, defaut: 50, max: 70 } as const;

export function bornerLargeur(pourcentage: number): number {
  if (!Number.isFinite(pourcentage)) return LARGEUR_PANNEAU.defaut;
  return Math.min(LARGEUR_PANNEAU.max, Math.max(LARGEUR_PANNEAU.min, pourcentage));
}

/** Les mentions qu'on peut se fixer comme objectif. */
export const CIBLES: readonly number[] = [10, 12, 14, 16, 18] as const;

type SimulateurState = {
  /** Note par ligne. Une ligne absente vaut 10. */
  notes: Record<string, number>;
  /** Notes déjà connues, que le simulateur ne fait plus bouger. */
  figees: Record<string, boolean>;
  cible: number;
  mesure: MesureRepartition;
  /** Largeur de la colonne du camembert, réglée en glissant la séparation. */
  largeurPanneau: number;
  setNote: (id: string, note: number) => void;
  toggleFigee: (id: string) => void;
  /** Fige ou libère d'un coup toutes les lignes passées. */
  figerLignes: (ids: readonly string[], figee: boolean) => void;
  setCible: (cible: number) => void;
  setMesure: (mesure: MesureRepartition) => void;
  setLargeurPanneau: (pourcentage: number) => void;
  /** Remet les notes à zéro ; la disposition de l'écran, elle, reste. */
  reinitialiser: () => void;
};

export const useSimulateurStore = create<SimulateurState>()(
  persist(
    (set) => ({
      notes: {},
      figees: {},
      cible: 10,
      mesure: 'contribution',
      largeurPanneau: LARGEUR_PANNEAU.defaut,
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
      setLargeurPanneau: (pourcentage) => {
        set({ largeurPanneau: bornerLargeur(pourcentage) });
      },
      reinitialiser: () => {
        set({ notes: {}, figees: {}, cible: 10, mesure: 'contribution' });
      },
    }),
    { name: 'btl-2027-simulateur' }
  )
);
