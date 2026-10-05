import { describe, expect, it } from 'vitest';
import {
  choixMultiplesJustes,
  ecritureValeurAttendue,
  lireNombre,
  melanger,
  numeriqueJuste,
  ordreJuste,
  puissanceDeLUnite,
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

  it('lit une puissance de dix écrite comme sur une copie', () => {
    expect(lireNombre('1×10^4')).toBe(10000);
    expect(lireNombre('4,0 x 10^3')).toBe(4000);
    expect(lireNombre('2,0*10^-5')).toBeCloseTo(2e-5, 15);
    expect(lireNombre('5,0·10^(-4)')).toBeCloseTo(5e-4, 15);
    expect(lireNombre('10^4')).toBe(10000);
    expect(lireNombre('-10^2')).toBe(-100);
    expect(lireNombre('2,0×10⁻⁵')).toBeCloseTo(2e-5, 15);
    expect(lireNombre('10⁴')).toBe(10000);
  });

  it('refuse une puissance de dix mal formée', () => {
    expect(lireNombre('210^3')).toBeNull();
    expect(lireNombre('2×10^')).toBeNull();
    expect(lireNombre('2×10^3,5')).toBeNull();
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

describe('ecritureValeurAttendue', () => {
  it('garde les décimales demandées (un pH)', () => {
    expect(ecritureValeurAttendue({ valeur: 3.4, decimales: 2 })).toBe('3{,}40');
    expect(ecritureValeurAttendue({ valeur: 2.6021, decimales: 2 })).toBe('2{,}60');
    expect(ecritureValeurAttendue({ valeur: 7, decimales: 0 })).toBe('7');
  });

  it('garde les chiffres significatifs demandés', () => {
    expect(ecritureValeurAttendue({ valeur: 2, chiffresSignificatifs: 2 })).toBe('2{,}0');
    expect(ecritureValeurAttendue({ valeur: 0.0025, chiffresSignificatifs: 2 })).toBe('0{,}0025');
    expect(ecritureValeurAttendue({ valeur: 12000, chiffresSignificatifs: 2 })).toBe('1{,}2 \\times 10^{4}');
    expect(ecritureValeurAttendue({ valeur: 3.16e-8, chiffresSignificatifs: 3 })).toBe('3{,}16 \\times 10^{-8}');
  });

  it('écrit la valeur telle quelle sans précision, et garde une fraction', () => {
    expect(ecritureValeurAttendue({ valeur: 3.5 })).toBe('3{,}5');
    expect(ecritureValeurAttendue({ valeur: -120 })).toBe('-120');
    expect(ecritureValeurAttendue({ valeur: '7/2' })).toBe('7/2');
  });
});

describe('unité « × 10^n »', () => {
  const reponse = { valeur: 2.5, tolerance: 0.05, unite: '\\times 10^{-7}\\ \\mathrm{mol \\cdot L^{-1}}' };

  it('lit l’exposant de l’unité', () => {
    expect(puissanceDeLUnite(reponse.unite)).toBe(-7);
    expect(puissanceDeLUnite('\\times 10^{4}\\ \\mathrm{L}')).toBe(4);
    expect(puissanceDeLUnite('\\mathrm{mol \\cdot L^{-1}}')).toBeNull();
    expect(puissanceDeLUnite(undefined)).toBeNull();
  });

  it('accepte la mantisse seule ou la valeur entière en puissance de dix', () => {
    expect(numeriqueJuste(reponse, '2,5')).toBe(true);
    expect(numeriqueJuste(reponse, '2,5×10^-7')).toBe(true);
    expect(numeriqueJuste(reponse, '2,5e-7')).toBe(true);
    expect(numeriqueJuste(reponse, '0,00000025')).toBe(true);
    expect(numeriqueJuste(reponse, '2,5×10^-6')).toBe(false);
  });
});
