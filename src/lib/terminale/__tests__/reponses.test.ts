import { describe, expect, it } from 'vitest';
import {
  choixMultiplesJustes,
  lireNombre,
  melanger,
  numeriqueJuste,
  ordreJuste,
  valeurAttendue,
} from '../reponses';

describe('lireNombre', () => {
  it('lit la virgule, le point, les espaces et le signe moins typographique', () => {
    expect(lireNombre('3,5')).toBe(3.5);
    expect(lireNombre(' 3.5 ')).toBe(3.5);
    expect(lireNombre('1 000')).toBe(1000);
    expect(lireNombre('−2')).toBe(-2);
    expect(lireNombre('2e-3')).toBe(0.002);
  });

  it('lit une fraction a/b', () => {
    expect(lireNombre('7/2')).toBe(3.5);
    expect(lireNombre('-1/4')).toBe(-0.25);
    expect(lireNombre('1/0')).toBeNull();
  });

  it('refuse ce qui n’est pas un nombre', () => {
    expect(lireNombre('')).toBeNull();
    expect(lireNombre('abc')).toBeNull();
    expect(lireNombre('3,5,1')).toBeNull();
    expect(lireNombre('2x')).toBeNull();
  });
});

describe('numeriqueJuste', () => {
  it('compare à la tolérance absolue', () => {
    expect(numeriqueJuste({ valeur: 5, tolerance: 0 }, '5')).toBe(true);
    expect(numeriqueJuste({ valeur: 5, tolerance: 0 }, '10/2')).toBe(true);
    expect(numeriqueJuste({ valeur: 5, tolerance: 0 }, '5,01')).toBe(false);
    expect(numeriqueJuste({ valeur: 0.333, tolerance: 0.001 }, '1/3')).toBe(true);
  });

  it('compare à la tolérance relative', () => {
    expect(numeriqueJuste({ valeur: 200, toleranceRelative: 0.01 }, '201')).toBe(true);
    expect(numeriqueJuste({ valeur: 200, toleranceRelative: 0.01 }, '203')).toBe(false);
  });

  it('accepte une valeur attendue écrite en fraction', () => {
    expect(valeurAttendue({ valeur: '3/4' })).toBe(0.75);
    expect(numeriqueJuste({ valeur: '3/4', tolerance: 0 }, '0,75')).toBe(true);
  });

  it('refuse une saisie illisible', () => {
    expect(numeriqueJuste({ valeur: 5, tolerance: 1 }, 'cinq')).toBe(false);
  });
});

describe('choix multiples et remise en ordre', () => {
  it('exige exactement les bonnes réponses', () => {
    expect(choixMultiplesJustes([0, 2], [2, 0])).toBe(true);
    expect(choixMultiplesJustes([0, 2], [0])).toBe(false);
    expect(choixMultiplesJustes([0, 2], [0, 1, 2])).toBe(false);
  });

  it('exige l’ordre du contenu', () => {
    expect(ordreJuste(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(true);
    expect(ordreJuste(['a', 'b', 'c'], ['b', 'a', 'c'])).toBe(false);
  });

  it('mélange de façon stable, jamais dans l’ordre juste', () => {
    const elements = ['a', 'b', 'c', 'd'];
    const un = melanger(elements, 'q1');
    expect(melanger(elements, 'q1')).toEqual(un);
    expect([...un].sort()).toEqual(elements);
    for (const graine of ['x', 'y', 'z', 'l-001', 'l-002', 'fl-a']) {
      expect(melanger(elements, graine)).not.toEqual(elements);
      expect(melanger(['a', 'b'], graine)).toEqual(['b', 'a']);
    }
  });
});
