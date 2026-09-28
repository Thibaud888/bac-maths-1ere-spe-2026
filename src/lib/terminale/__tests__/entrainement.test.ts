import { describe, expect, it } from 'vitest';
import {
  elementsNotes,
  filtrerExercices,
  pointsTypeBac,
  resultatDePart,
  resultatExercice,
  segmentExercice,
  serieEclair,
  trierExercices,
} from '../entrainement';
import type { Exercice, QuestionEclair, QuestionTypeBac } from '../types';

function exercice(id: string, niveau: 1 | 2 | 3, notions: string[], ordre = 10, duree = 5): Exercice {
  return { id, chapitre: 'essai', niveau, notions, capacites: [], titre: id, duree, calculatrice: false, ordre, questions: [] };
}

const PRIORITES: Record<string, 1 | 2 | 3> = { 'n-a': 3, 'n-b': 2, 'n-c': 1 };
const priorite = (n: string | undefined) => (n ? PRIORITES[n] ?? 1 : 1);

describe('résultat d’un exercice', () => {
  it('attend que chaque question ait un résultat', () => {
    expect(resultatExercice(['q1', 'q2'], { q1: 'reussi' })).toBeUndefined();
    expect(resultatExercice([], {})).toBeUndefined();
  });

  it('fait la moyenne : réussi dès 80 %, à moitié dès 40 %', () => {
    expect(resultatExercice(['q1', 'q2'], { q1: 'reussi', q2: 'reussi' })).toBe('reussi');
    expect(resultatExercice(['q1', 'q2'], { q1: 'reussi', q2: 'moitie' })).toBe('moitie');
    expect(resultatExercice(['q1', 'q2', 'q3', 'q4', 'q5'], { q1: 'reussi', q2: 'reussi', q3: 'reussi', q4: 'reussi', q5: 'rate' })).toBe('reussi');
    expect(resultatExercice(['q1', 'q2'], { q1: 'rate', q2: 'moitie' })).toBe('rate');
    expect(resultatDePart(0.4)).toBe('moitie');
    expect(resultatDePart(0.39)).toBe('rate');
  });
});

describe('type bac', () => {
  const questions: QuestionTypeBac[] = [
    { id: 'q1', label: '1.', enonce: '', points: 1, attenduCorrecteur: '', solution: '' },
    {
      id: 'q2',
      label: '2.',
      enonce: '',
      points: 4,
      sousQuestions: [
        { id: 'a', label: 'a)', enonce: '', points: 1.5, attenduCorrecteur: '', solution: '' },
        { id: 'b', label: 'b)', enonce: '', points: 2.5, attenduCorrecteur: '', solution: '' },
      ],
    },
  ];

  it('note les sous-questions à la place de leur question', () => {
    expect(elementsNotes(questions).map((e) => e.id)).toEqual(['q1', 'q2.a', 'q2.b']);
  });

  it('estime les points obtenus', () => {
    expect(pointsTypeBac({ questions }, { q1: 'reussi', 'q2.a': 'moitie' })).toEqual({
      obtenus: 1.75,
      total: 5,
      complet: false,
    });
    expect(pointsTypeBac({ questions }, { q1: 'reussi', 'q2.a': 'reussi', 'q2.b': 'rate' }).complet).toBe(true);
  });
});

describe('listes d’exercices', () => {
  const liste = [
    exercice('x-3', 1, ['n-c']),
    exercice('x-2', 1, ['n-b'], 10, 8),
    exercice('x-1', 1, ['n-a'], 20),
    exercice('x-4', 1, ['n-b'], 10, 4),
    exercice('x-5', 3, ['n-c', 'n-a']),
  ];

  it('filtre par marche et par notion citée', () => {
    expect(filtrerExercices(liste, { niveau: 3 }).map((x) => x.id)).toEqual(['x-5']);
    expect(filtrerExercices(liste, { notion: 'n-a' }).map((x) => x.id)).toEqual(['x-1', 'x-5']);
    expect(filtrerExercices(liste, {})).toHaveLength(5);
  });

  it('met les notions importantes d’abord, puis l’ordre, puis la durée', () => {
    const tries = trierExercices(filtrerExercices(liste, { niveau: 1 }), priorite);
    expect(tries.map((x) => x.id)).toEqual(['x-1', 'x-4', 'x-2', 'x-3']);
  });

  it('range les questions éclair par priorité, sans perdre l’ordre du fichier', () => {
    const q = (id: string, notion: string) => ({ id, notion }) as QuestionEclair;
    const serie = serieEclair([q('f1', 'n-c'), q('f2', 'n-a'), q('f3', 'n-c'), q('f4', 'n-a')], (n) => priorite(n));
    expect(serie.map((x) => x.id)).toEqual(['f2', 'f4', 'f1', 'f3']);
  });

  it('tire l’adresse d’un exercice de son identifiant', () => {
    expect(segmentExercice('x-limites-suites-007', 'limites-suites')).toBe('007');
    expect(segmentExercice('tb-limites-suites-002', 'limites-suites')).toBe('002');
  });
});
