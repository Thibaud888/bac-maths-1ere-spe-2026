import { act } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { LARGEUR_PANNEAU, bornerLargeur, useSimulateurStore } from '../simulateur-store';

beforeEach(() => {
  localStorage.clear();
  act(() => {
    useSimulateurStore.setState({ largeurPanneau: LARGEUR_PANNEAU.defaut, notes: {} });
  });
});

describe('largeur de la colonne du camembert', () => {
  it('part de la moitié de l’écran', () => {
    expect(LARGEUR_PANNEAU.defaut).toBe(50);
    expect(useSimulateurStore.getState().largeurPanneau).toBe(50);
  });

  it('reste entre ses bornes, quoi qu’on glisse', () => {
    expect(bornerLargeur(5)).toBe(LARGEUR_PANNEAU.min);
    expect(bornerLargeur(95)).toBe(LARGEUR_PANNEAU.max);
    expect(bornerLargeur(42)).toBe(42);
    expect(bornerLargeur(Number.NaN)).toBe(LARGEUR_PANNEAU.defaut);
  });

  it('survit à la remise à zéro des notes', () => {
    act(() => {
      useSimulateurStore.getState().setLargeurPanneau(62);
      useSimulateurStore.getState().setNote('co-philosophie', 15);
      useSimulateurStore.getState().reinitialiser();
    });
    expect(useSimulateurStore.getState().largeurPanneau).toBe(62);
    expect(useSimulateurStore.getState().notes).toEqual({});
  });

  it('s’enregistre sous la clé du simulateur, sans toucher aux autres volets', () => {
    act(() => {
      useSimulateurStore.getState().setLargeurPanneau(40);
    });
    const cles = Object.keys(localStorage);
    expect(cles).toContain('btl-2027-simulateur');
    expect(cles.every((c) => c.startsWith('btl-2027-'))).toBe(true);
  });
});
