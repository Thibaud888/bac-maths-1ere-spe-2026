import { describe, expect, it } from 'vitest';
import {
  PROGRESSION_VIDE,
  aRevoir,
  bilanNotion,
  etatNotion,
  etatsChapitre,
  maitriseChapitre,
  type Progression,
} from '../progression';
import type { Chapitre, Exercice, Notion } from '../types';

function notion(id: string, priorite: 1 | 2 | 3): Notion {
  return {
    id,
    chapitre: 'essai',
    titre: id,
    resume: '',
    ordre: 10,
    priorite,
    priorisation: 'estimation',
    pourquoi: '',
    capacites: [],
    prerequis: [],
    attendusBac: [],
  };
}

function exercice(id: string, niveau: 1 | 2 | 3, notions: string[]): Exercice {
  return {
    id,
    chapitre: 'essai',
    niveau,
    notions,
    capacites: [],
    titre: id,
    duree: 5,
    calculatrice: false,
    ordre: 10,
    questions: [],
  };
}

/** Deux notions : A (incontournable, riche) et B (plus rare, sans exercice). */
const chapitre: Chapitre = {
  meta: {
    slug: 'essai',
    matiere: 'maths',
    titre: 'Essai',
    titreCourt: 'Essai',
    domaine: 'analyse',
    ordre: 10,
    transverse: false,
    description: '',
    essentiel: [
      { titre: 'a', texte: 'a' },
      { titre: 'b', texte: 'b' },
      { titre: 'c', texte: 'c' },
    ],
  },
  notions: [notion('n-a', 3), notion('n-b', 1)],
  cours: {
    chapitre: 'essai',
    sections: [
      {
        notion: 'n-a',
        blocs: [
          { id: 'l-1', type: 'idee', texte: '' },
          {
            id: 'l-2',
            type: 'verifie',
            question: { enonce: '', reponse: { type: 'vrai-faux', valeur: true, justification: '' }, explication: '' },
          },
        ],
      },
      { notion: 'n-b', blocs: [{ id: 'l-3', type: 'idee', texte: '' }] },
    ],
  },
  memo: [],
  exercices: [
    exercice('x-1', 1, ['n-a']),
    exercice('x-2', 1, ['n-a']),
    exercice('x-3', 1, ['n-a']),
    exercice('x-4', 1, ['n-a']),
    exercice('x-5', 2, ['n-a']),
    exercice('x-6', 2, ['n-a']),
    exercice('x-7', 3, ['n-b', 'n-a']),
  ],
  flash: [
    {
      id: 'fl-1',
      chapitre: 'essai',
      notion: 'n-a',
      capacites: [],
      enonce: '',
      reponse: { type: 'vrai-faux', valeur: true, justification: '' },
      explication: '',
      duree: 20,
    },
  ],
  typeBac: [],
  temoin: false,
};

function avec(partiel: Partial<Progression>): Progression {
  return { ...PROGRESSION_VIDE, ...partiel };
}

describe('état d’une notion', () => {
  it('reste « à découvrir » tant que la page n’est pas lue ou qu’un « vérifie » manque', () => {
    expect(etatNotion(bilanNotion(chapitre, 'n-a', PROGRESSION_VIDE))).toBe('a-decouvrir');
    expect(etatNotion(bilanNotion(chapitre, 'n-a', avec({ lus: { 'n-a': true } })))).toBe('a-decouvrir');
  });

  it('devient « découverte » quand la page est lue et tous les « vérifie » répondus, justes ou non', () => {
    const p = avec({ lus: { 'n-a': true }, verifies: { 'l-2': false } });
    expect(etatNotion(bilanNotion(chapitre, 'n-a', p))).toBe('decouverte');
  });

  it('devient « comprise » à 75 % des exercices « Comprendre » réussis (à moitié = un demi)', () => {
    const base = { lus: { 'n-a': true }, verifies: { 'l-2': true } };
    const deux = avec({ ...base, resultats: { 'x-1': 'reussi', 'x-2': 'reussi' } });
    expect(etatNotion(bilanNotion(chapitre, 'n-a', deux))).toBe('decouverte');
    const trois = avec({ ...base, resultats: { 'x-1': 'reussi', 'x-2': 'reussi', 'x-3': 'reussi' } });
    expect(etatNotion(bilanNotion(chapitre, 'n-a', trois))).toBe('comprise');
    const moities = avec({
      ...base,
      resultats: { 'x-1': 'reussi', 'x-2': 'reussi', 'x-3': 'moitie', 'x-4': 'moitie' },
    });
    expect(etatNotion(bilanNotion(chapitre, 'n-a', moities))).toBe('comprise');
  });

  it('devient « maîtrisée » avec l’entraînement, l’approfondissement et les questions éclair', () => {
    const comprise = {
      lus: { 'n-a': true },
      verifies: { 'l-2': true },
      resultats: { 'x-1': 'reussi', 'x-2': 'reussi', 'x-3': 'reussi', 'x-5': 'reussi' } as const,
    };
    const sansApprofondir = avec({ ...comprise, flash: { 'fl-1': { essais: 1, justes: 1 } } });
    expect(etatNotion(bilanNotion(chapitre, 'n-a', sansApprofondir))).toBe('comprise');

    const complet = avec({
      ...comprise,
      resultats: { ...comprise.resultats, 'x-7': 'reussi' },
      flash: { 'fl-1': { essais: 1, justes: 1 } },
    });
    expect(etatNotion(bilanNotion(chapitre, 'n-a', complet))).toBe('maitrisee');

    const eclairRate = avec({ ...complet, flash: { 'fl-1': { essais: 2, justes: 1 } } });
    expect(etatNotion(bilanNotion(chapitre, 'n-a', eclairRate))).toBe('comprise');
  });

  it('ne passe jamais « comprise » sans exercice « Comprendre »', () => {
    const p = avec({ lus: { 'n-b': true } });
    expect(etatNotion(bilanNotion(chapitre, 'n-b', p))).toBe('decouverte');
  });

  it('suit des seuils réglables', () => {
    const p = avec({ lus: { 'n-a': true }, verifies: { 'l-2': true }, resultats: { 'x-1': 'reussi' } });
    const bilan = bilanNotion(chapitre, 'n-a', p);
    expect(etatNotion(bilan)).toBe('decouverte');
    expect(etatNotion(bilan, { comprendre: 0.25, entrainer: 0.5, approfondir: 1, eclair: 0.8 })).toBe('comprise');
  });
});

describe('maîtrise d’un chapitre et notions à revoir', () => {
  it('pèse chaque notion par sa priorité', () => {
    const etats = new Map([
      ['n-a', 'maitrisee' as const],
      ['n-b', 'a-decouvrir' as const],
    ]);
    expect(maitriseChapitre(chapitre.notions, etats)).toBeCloseTo(3 / 4);
    const inverse = new Map([
      ['n-a', 'a-decouvrir' as const],
      ['n-b', 'maitrisee' as const],
    ]);
    expect(maitriseChapitre(chapitre.notions, inverse)).toBeCloseTo(1 / 4);
    expect(maitriseChapitre([], new Map())).toBe(0);
  });

  it('liste les incontournables commencés et pas maîtrisés', () => {
    expect(aRevoir([chapitre], PROGRESSION_VIDE)).toEqual([]);
    const p = avec({ lus: { 'n-a': true, 'n-b': true } });
    const liste = aRevoir([chapitre], p);
    expect(liste.map((x) => x.notion.id)).toEqual(['n-a']);
    expect(liste[0]?.etat).toBe('a-decouvrir');
    expect(etatsChapitre(chapitre, p).get('n-b')).toBe('decouverte');
  });
});
