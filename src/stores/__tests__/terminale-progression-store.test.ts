import { act } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { cleStockage, storeProgression } from '../terminale-progression-store';

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
});
