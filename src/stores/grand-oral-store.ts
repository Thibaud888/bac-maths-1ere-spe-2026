import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SpaceId } from '@/lib/spaces';

/**
 * État personnel du grand oral : les deux questions de l'élève, telles qu'il
 * les écrit, et l'historique de ses oraux blancs.
 *
 * Persistance sous le préfixe `bgo-2027-` : le grand oral ne touche jamais aux
 * clés `bms-2026-*` (maths), `bfr-2026-*` (français) ni `btl-2027-*`
 * (simulateur de moyenne).
 */

export const GRAND_ORAL_STORAGE_KEY = 'bgo-2027-grand-oral';

/** Le texte officiel prévoit deux questions (fiche `go-epreuve-questions`). */
export const NB_QUESTIONS = 2;

/** Nombre d'oraux blancs gardés dans l'historique. */
const HISTORIQUE_MAX = 20;

export type QuestionPerso = {
  /** Espaces de spécialité de terminale auxquels la question est adossée. */
  specialites: SpaceId[];
  formulation: string;
  /** Pourquoi cette question : le lien avec le parcours et le projet. */
  pourquoi: string;
  /** Une partie par ligne. */
  plan: string;
  /** Une source par ligne. */
  sources: string;
};

/** Auto-évaluation, sans points : le texte officiel ne répartit pas la note. */
export type NiveauAuto = 'a-retravailler' | 'correct' | 'solide';

export type OralBlancBilan = {
  id: string;
  /** Date ISO de fin de l'oral blanc. */
  date: string;
  /** Question travaillée, telle qu'elle était formulée ce jour-là. */
  question: string;
  /** 0 ou 1 pour une des deux questions, `null` pour une question libre. */
  questionIndex: number | null;
  /** Secondes réellement passées, par identifiant de temps (`gt-…`). */
  durees: Record<string, number>;
  /** Niveau ressenti, par identifiant de critère (`gc-…`). */
  auto: Record<string, NiveauAuto>;
  note: string;
};

export function questionVide(): QuestionPerso {
  return { specialites: [], formulation: '', pourquoi: '', plan: '', sources: '' };
}

/** Une question est utilisable à l'oral blanc dès qu'elle est formulée. */
export function estFormulee(question: QuestionPerso | undefined): question is QuestionPerso {
  return question !== undefined && question.formulation.trim().length > 0;
}

/** Les lignes non vides d'un champ « une par ligne ». */
export function lignes(texte: string): string[] {
  return texte
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

type GrandOralState = {
  questions: QuestionPerso[];
  historique: OralBlancBilan[];
  modifierQuestion: (index: number, patch: Partial<QuestionPerso>) => void;
  effacerQuestion: (index: number) => void;
  ajouterBilan: (bilan: OralBlancBilan) => void;
  effacerHistorique: () => void;
};

function questionsInitiales(): QuestionPerso[] {
  return Array.from({ length: NB_QUESTIONS }, questionVide);
}

export const useGrandOralStore = create<GrandOralState>()(
  persist(
    (set) => ({
      questions: questionsInitiales(),
      historique: [],
      modifierQuestion: (index, patch) => {
        if (index < 0 || index >= NB_QUESTIONS) return;
        set((s) => {
          const questions = [...s.questions];
          questions[index] = { ...(questions[index] ?? questionVide()), ...patch };
          return { questions };
        });
      },
      effacerQuestion: (index) => {
        if (index < 0 || index >= NB_QUESTIONS) return;
        set((s) => {
          const questions = [...s.questions];
          questions[index] = questionVide();
          return { questions };
        });
      },
      ajouterBilan: (bilan) => {
        set((s) => ({ historique: [bilan, ...s.historique].slice(0, HISTORIQUE_MAX) }));
      },
      effacerHistorique: () => {
        set({ historique: [] });
      },
    }),
    {
      name: GRAND_ORAL_STORAGE_KEY,
      version: 1,
      // Un état relu d'une version antérieure garde toujours ses deux emplacements.
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<GrandOralState>;
        const questions = questionsInitiales().map((vide, i) => ({
          ...vide,
          ...(saved.questions?.[i] ?? {}),
        }));
        return {
          ...current,
          questions,
          historique: Array.isArray(saved.historique) ? saved.historique : [],
        };
      },
    }
  )
);
