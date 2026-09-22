import { act } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  GRAND_ORAL_STORAGE_KEY,
  NB_QUESTIONS,
  estFormulee,
  lignes,
  questionVide,
  useGrandOralStore,
  type OralBlancBilan,
} from '../grand-oral-store';

function bilan(n: number): OralBlancBilan {
  return {
    id: `ob-${n}`,
    date: new Date(2026, 9, 1).toISOString(),
    question: `Question ${n}`,
    questionIndex: 0,
    durees: {},
    auto: {},
    note: '',
  };
}

beforeEach(() => {
  localStorage.clear();
  act(() => {
    useGrandOralStore.setState({
      questions: Array.from({ length: NB_QUESTIONS }, questionVide),
      historique: [],
    });
  });
});

describe('état du grand oral', () => {
  it('ne persiste que sous le préfixe bgo-2027-', () => {
    act(() => {
      useGrandOralStore.getState().modifierQuestion(0, { formulation: 'Peut-on… ?' });
      useGrandOralStore.getState().ajouterBilan(bilan(1));
    });
    expect(GRAND_ORAL_STORAGE_KEY.startsWith('bgo-2027-')).toBe(true);
    const keys = Object.keys(localStorage);
    expect(keys).toContain(GRAND_ORAL_STORAGE_KEY);
    for (const key of keys) {
      expect(key.startsWith('bgo-2027-'), key).toBe(true);
    }
    const saved = JSON.parse(localStorage.getItem(GRAND_ORAL_STORAGE_KEY) ?? '{}');
    expect(saved.state.questions[0].formulation).toBe('Peut-on… ?');
  });

  it('garde exactement deux emplacements de question', () => {
    act(() => {
      useGrandOralStore.getState().modifierQuestion(5, { formulation: 'hors limite' });
      useGrandOralStore.getState().modifierQuestion(-1, { formulation: 'hors limite' });
    });
    const { questions } = useGrandOralStore.getState();
    expect(questions).toHaveLength(NB_QUESTIONS);
    expect(questions.every((q) => q.formulation === '')).toBe(true);
  });

  it('efface une question sans toucher à l’autre', () => {
    act(() => {
      useGrandOralStore.getState().modifierQuestion(0, { formulation: 'Q1', plan: 'A\nB' });
      useGrandOralStore.getState().modifierQuestion(1, { formulation: 'Q2' });
      useGrandOralStore.getState().effacerQuestion(0);
    });
    const { questions } = useGrandOralStore.getState();
    expect(questions[0]).toEqual(questionVide());
    expect(questions[1]?.formulation).toBe('Q2');
  });

  it('borne l’historique aux oraux les plus récents', () => {
    act(() => {
      for (let n = 1; n <= 25; n++) useGrandOralStore.getState().ajouterBilan(bilan(n));
    });
    const { historique } = useGrandOralStore.getState();
    expect(historique).toHaveLength(20);
    expect(historique[0]?.id).toBe('ob-25');
  });

  it('retrouve ses deux emplacements en relisant un état incomplet', async () => {
    localStorage.setItem(
      GRAND_ORAL_STORAGE_KEY,
      JSON.stringify({ state: { questions: [{ formulation: 'Seule' }] }, version: 1 })
    );
    await act(async () => {
      await useGrandOralStore.persist.rehydrate();
    });
    const { questions, historique } = useGrandOralStore.getState();
    expect(questions).toHaveLength(NB_QUESTIONS);
    expect(questions[0]?.formulation).toBe('Seule');
    expect(questions[0]?.specialites).toEqual([]);
    expect(questions[1]).toEqual(questionVide());
    expect(historique).toEqual([]);
  });
});

describe('outils des questions', () => {
  it('ne compte une question que si elle est formulée', () => {
    expect(estFormulee(questionVide())).toBe(false);
    expect(estFormulee({ ...questionVide(), formulation: '   ' })).toBe(false);
    expect(estFormulee({ ...questionVide(), formulation: 'Peut-on… ?' })).toBe(true);
  });

  it('découpe un champ « une par ligne » sans lignes vides', () => {
    expect(lignes('  Intro \n\n Partie 1\nPartie 2  \n')).toEqual([
      'Intro',
      'Partie 1',
      'Partie 2',
    ]);
  });
});
