import { useMemo } from 'react';
import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { persist } from 'zustand/middleware';
import { MATIERES } from '@/lib/terminale/matieres';
import { PROGRESSION_VIDE, type Progression, type Resultat } from '@/lib/terminale/progression';
import type { Matiere } from '@/lib/terminale/types';

/**
 * Ce que l'élève a fait en terminale, une mémoire par matière : `btm-2027-progression`
 * (maths) et `bpc-2027-progression` (physique-chimie). Ces clés ne croisent jamais
 * celles de la première (`bms-2026-*`, `bfr-2026-*`), du simulateur (`btl-2027-*`) ni
 * du grand oral (`bgo-2027-*`).
 */

export type ModeMemo = 'simplifie' | 'detaille';

export type EtatProgressionTerminale = Progression & {
  /** Dernier chapitre ouvert (« Reprendre » sur l'accueil de la matière). */
  dernierChapitre: string | null;
  /** Dernière notion lue, par chapitre (`/cours` seul y ramène). */
  derniereNotion: Record<string, string>;
  /**
   * Résultat de chaque question d'exercice ou de type bac, sous `<exercice>::<question>` :
   * un exercice laissé en cours retrouve ses réponses, et la liste dit « En cours ».
   */
  questions: Record<string, Resultat>;
  /** Affichage des cartes du mémo : simplifié à la première visite, puis le dernier choisi. */
  modeMemo: ModeMemo;
  choisirModeMemo: (mode: ModeMemo) => void;
  marquerLu: (notionId: string) => void;
  repondreVerifie: (blocId: string, juste: boolean) => void;
  noterResultat: (itemId: string, resultat: Resultat) => void;
  noterQuestion: (itemId: string, questionId: string, resultat: Resultat) => void;
  noterEclair: (questionId: string, juste: boolean) => void;
  ouvrirChapitre: (slug: string) => void;
  lireNotion: (chapitre: string, segment: string) => void;
};

/** Les questions déjà notées d'un exercice, par identifiant de question. */
export function questionsDe(
  questions: Readonly<Record<string, Resultat>>,
  itemId: string
): Record<string, Resultat> {
  const prefixe = `${itemId}::`;
  const trouvees: Record<string, Resultat> = {};
  for (const [cle, resultat] of Object.entries(questions)) {
    if (cle.startsWith(prefixe)) trouvees[cle.slice(prefixe.length)] = resultat;
  }
  return trouvees;
}

/** Une question éclair est réussie dès qu'un premier essai a été juste. */
export function eclairReussie(flash: Progression['flash'], questionId: string): boolean {
  return (flash[questionId]?.justes ?? 0) > 0;
}

export function cleStockage(matiere: Matiere): string {
  return `${MATIERES[matiere].stockage}progression`;
}

function creerStore(matiere: Matiere) {
  return create<EtatProgressionTerminale>()(
    persist(
      (set) => ({
        ...PROGRESSION_VIDE,
        dernierChapitre: null,
        derniereNotion: {},
        questions: {},
        modeMemo: 'simplifie',
        choisirModeMemo: (mode) => {
          set({ modeMemo: mode });
        },
        marquerLu: (notionId) => {
          set((s) => (s.lus[notionId] ? s : { lus: { ...s.lus, [notionId]: true } }));
        },
        repondreVerifie: (blocId, juste) => {
          set((s) => ({ verifies: { ...s.verifies, [blocId]: juste } }));
        },
        noterResultat: (itemId, resultat) => {
          set((s) => ({ resultats: { ...s.resultats, [itemId]: resultat } }));
        },
        noterQuestion: (itemId, questionId, resultat) => {
          set((s) => ({ questions: { ...s.questions, [`${itemId}::${questionId}`]: resultat } }));
        },
        noterEclair: (questionId, juste) => {
          set((s) => {
            const avant = s.flash[questionId] ?? { essais: 0, justes: 0 };
            return {
              flash: {
                ...s.flash,
                [questionId]: { essais: avant.essais + 1, justes: avant.justes + (juste ? 1 : 0) },
              },
            };
          });
        },
        ouvrirChapitre: (slug) => {
          set((s) => (s.dernierChapitre === slug ? s : { dernierChapitre: slug }));
        },
        lireNotion: (chapitre, segment) => {
          set((s) =>
            s.derniereNotion[chapitre] === segment
              ? s
              : { derniereNotion: { ...s.derniereNotion, [chapitre]: segment } }
          );
        },
      }),
      { name: cleStockage(matiere) }
    )
  );
}

const STORES: Record<Matiere, UseBoundStore<StoreApi<EtatProgressionTerminale>>> = {
  maths: creerStore('maths'),
  'physique-chimie': creerStore('physique-chimie'),
};

/** Le store de progression d'une matière de terminale. */
export function storeProgression(matiere: Matiere): UseBoundStore<StoreApi<EtatProgressionTerminale>> {
  return STORES[matiere];
}

/** La progression d'une matière, sans les actions : ce que lit la logique pure. */
export function useProgression(matiere: Matiere): Progression {
  const store = STORES[matiere];
  const lus = store((s) => s.lus);
  const verifies = store((s) => s.verifies);
  const resultats = store((s) => s.resultats);
  const flash = store((s) => s.flash);
  return useMemo(() => ({ lus, verifies, resultats, flash }), [lus, verifies, resultats, flash]);
}
