import { act } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { cleStockage, eclairReussie, questionsDe, storeProgression } from '../terminale-progression-store';

beforeEach(() => {
  localStorage.clear();
});

describe('progression de terminale', () => {
  it('range chaque matière sous son propre préfixe', () => {
    expect(cleStockage('maths')).toBe('btm-2027-progression');
    expect(cleStockage('physique-chimie')).toBe('bpc-2027-progression');
  });

  it('écrit dans la clé de la matière et jamais dans celles de la première', () => {
    act(() => {
      storeProgression('maths').getState().marquerLu('n-essai-a');
      storeProgression('maths').getState().repondreVerifie('l-essai-001', true);
      storeProgression('maths').getState().noterEclair('fl-essai-a', false);
      storeProgression('maths').getState().noterEclair('fl-essai-a', true);
    });
    const cles = Object.keys(localStorage);
    expect(cles).toContain('btm-2027-progression');
    expect(cles.some((c) => c.startsWith('bms-2026-') || c.startsWith('bpc-2027-'))).toBe(false);

    const etat = storeProgression('maths').getState();
    expect(etat.lus['n-essai-a']).toBe(true);
    expect(etat.verifies['l-essai-001']).toBe(true);
    expect(etat.flash['fl-essai-a']).toEqual({ essais: 2, justes: 1 });
    expect(storeProgression('physique-chimie').getState().lus['n-essai-a']).toBeUndefined();
  });

  it('ouvre le mémo en simplifié, puis garde le dernier affichage choisi', () => {
    expect(storeProgression('maths').getState().modeMemo).toBe('simplifie');
    act(() => {
      storeProgression('maths').getState().choisirModeMemo('detaille');
    });
    expect(storeProgression('maths').getState().modeMemo).toBe('detaille');
    expect(localStorage.getItem('btm-2027-progression')).toContain('"modeMemo":"detaille"');
  });

  it('retient le dernier chapitre et la dernière notion lue', () => {
    act(() => {
      storeProgression('physique-chimie').getState().ouvrirChapitre('essai');
      storeProgression('physique-chimie').getState().lireNotion('essai', 'beta');
      storeProgression('physique-chimie').getState().noterResultat('x-essai-001', 'moitie');
    });
    const etat = storeProgression('physique-chimie').getState();
    expect(etat.dernierChapitre).toBe('essai');
    expect(etat.derniereNotion.essai).toBe('beta');
    expect(etat.resultats['x-essai-001']).toBe('moitie');
    expect(Object.keys(localStorage)).toContain('bpc-2027-progression');
  });

  it('garde chaque question d’un exercice, même laissé en cours', () => {
    act(() => {
      storeProgression('maths').getState().noterQuestion('x-essai-001', 'q1', 'reussi');
      storeProgression('maths').getState().noterQuestion('x-essai-001', 'q2', 'rate');
      storeProgression('maths').getState().noterQuestion('tb-essai-001', 'q1.a', 'moitie');
    });
    const { questions } = storeProgression('maths').getState();
    expect(questionsDe(questions, 'x-essai-001')).toEqual({ q1: 'reussi', q2: 'rate' });
    expect(questionsDe(questions, 'tb-essai-001')).toEqual({ 'q1.a': 'moitie' });
    expect(questionsDe(questions, 'x-essai-00')).toEqual({});
    expect(localStorage.getItem('btm-2027-progression')).toContain('"x-essai-001::q1":"reussi"');
  });

  it('tient une question éclair pour réussie dès un essai juste', () => {
    expect(eclairReussie({}, 'fl-a')).toBe(false);
    expect(eclairReussie({ 'fl-a': { essais: 2, justes: 0 } }, 'fl-a')).toBe(false);
    expect(eclairReussie({ 'fl-a': { essais: 2, justes: 1 } }, 'fl-a')).toBe(true);
  });
});
