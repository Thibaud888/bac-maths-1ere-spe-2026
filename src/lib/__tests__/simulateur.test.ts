import { describe, expect, it } from 'vitest';
import { getBacCoefficient, listBacCoefficients, totalCoefficients } from '../bac-content';
import {
  clampNote,
  contribution,
  couleurLigne,
  gainParPoint,
  leviers,
  listSimulateurLignes,
  mentionPour,
  moyenne,
  nomLigne,
  noteDe,
  potentiel,
  prochainPalier,
  totalSimulateur,
} from '../simulateur';

const lignes = listSimulateurLignes();
const TOTAL = totalCoefficients();

/** Toutes les notes à la même valeur : sert de base aux cas de calcul. */
function toutesA(note: number): Record<string, number> {
  return Object.fromEntries(lignes.map((l) => [l.id, note]));
}

describe('découpage du barème en notes réglables', () => {
  it('ne perd ni ne crée de coefficient', () => {
    const somme = lignes.reduce((s, l) => s + l.coefficient, 0);
    expect(somme).toBe(TOTAL);
    expect(totalSimulateur()).toBe(TOTAL);
  });

  it('donne une note par part de répartition', () => {
    for (const c of listBacCoefficients()) {
      const siennes = lignes.filter((l) => l.coefficientId === c.id);
      expect(siennes.length, c.id).toBe(c.repartition?.length ?? 1);
      expect(
        siennes.reduce((s, l) => s + l.coefficient, 0),
        c.id
      ).toBe(c.coefficient);
    }
  });

  it('sépare la première et la terminale des matières évaluées sur deux ans', () => {
    const hg = lignes.filter((l) => l.coefficientId === 'co-histoire-geographie');
    expect(hg.map((l) => l.annee).sort()).toEqual(['premiere', 'terminale']);
    expect(hg.every((l) => l.partagee)).toBe(true);
    expect(hg.map((l) => l.coefficient)).toEqual([3, 3]);
  });

  it('nomme la moyenne annuelle dont vient chaque note partagée', () => {
    const hg = lignes.filter((l) => l.coefficientId === 'co-histoire-geographie');
    expect(hg.map(nomLigne).sort()).toEqual([
      'Histoire-géographie — moyenne de première',
      'Histoire-géographie — moyenne de terminale',
    ]);
    const philo = lignes.find((l) => l.coefficientId === 'co-philosophie');
    expect(philo && nomLigne(philo)).toBe('Philosophie');
  });

  it('laisse une seule note aux épreuves et aux matières d’une seule année', () => {
    const philo = lignes.filter((l) => l.coefficientId === 'co-philosophie');
    expect(philo).toHaveLength(1);
    expect(philo[0]?.id).toBe('co-philosophie');
    expect(philo[0]?.annee).toBe('terminale');
    expect(philo[0]?.partagee).toBe(false);

    const eps = lignes.filter((l) => l.coefficientId === 'co-eps');
    expect(eps).toHaveLength(1);
    expect(eps[0]?.coefficient).toBe(6);
  });

  it('n’a aucun identifiant en double et rattache chaque note au barème', () => {
    const ids = lignes.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const l of lignes) {
      expect(getBacCoefficient(l.coefficientId), l.id).toBeDefined();
      expect(couleurLigne(l.id), l.id).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});

describe('note saisie', () => {
  it('reste entre 0 et 20, au quart de point', () => {
    expect(clampNote(-3)).toBe(0);
    expect(clampNote(42)).toBe(20);
    expect(clampNote(13.6)).toBe(13.5);
    expect(clampNote(13.63)).toBe(13.75);
    expect(clampNote(Number.NaN)).toBe(10);
  });

  it('vaut 10 tant que rien n’a été saisi', () => {
    expect(noteDe({}, 'co-philosophie')).toBe(10);
    expect(noteDe({ 'co-philosophie': 17 }, 'co-philosophie')).toBe(17);
    expect(noteDe({ 'co-philosophie': 99 }, 'co-philosophie')).toBe(20);
  });
});

describe('moyenne pondérée', () => {
  it('vaut la note commune quand toutes les notes sont identiques', () => {
    expect(moyenne({})).toBe(10);
    expect(moyenne(toutesA(0))).toBe(0);
    expect(moyenne(toutesA(20))).toBe(20);
    expect(moyenne(toutesA(13.5))).toBeCloseTo(13.5, 10);
  });

  it('pèse chaque note par son coefficient', () => {
    // Tout à 0 sauf la philosophie (coefficient 8) à 20 : 20 × 8 ÷ 104.
    const philo = { ...toutesA(0), 'co-philosophie': 20 };
    expect(moyenne(philo)).toBeCloseTo((20 * 8) / TOTAL, 10);

    // Tout à 10 et la spécialité maths (coefficient 16) à 20 : +10 × 16 ÷ 104.
    const spe = { ...toutesA(10), 'co-specialite-maths': 20 };
    expect(moyenne(spe)).toBeCloseTo(10 + (10 * 16) / TOTAL, 10);
  });

  it('additionne bien les deux moitiés d’une matière partagée', () => {
    const base = toutesA(10);
    const unSeulAn = {
      ...base,
      'co-histoire-geographie--premiere': 20,
    };
    const lesDeux = {
      ...unSeulAn,
      'co-histoire-geographie--terminale': 20,
    };
    expect(moyenne(unSeulAn)).toBeCloseTo(10 + (10 * 3) / TOTAL, 10);
    expect(moyenne(lesDeux)).toBeCloseTo(10 + (10 * 6) / TOTAL, 10);
  });

  it('arrondit les notes avant de les compter', () => {
    // 13,6 est ramené à 13,5 : la moyenne suit.
    expect(moyenne(toutesA(13.6))).toBeCloseTo(13.5, 10);
  });
});

describe('mention atteinte', () => {
  const cas: readonly [number, string][] = [
    [0, 'me-non-admis'],
    [7.99, 'me-non-admis'],
    [8, 'me-rattrapage'],
    [9.99, 'me-rattrapage'],
    [10, 'me-admis'],
    [11.99, 'me-admis'],
    [12, 'me-assez-bien'],
    [13.99, 'me-assez-bien'],
    [14, 'me-bien'],
    [15.99, 'me-bien'],
    [16, 'me-tres-bien'],
    [17.99, 'me-tres-bien'],
    [18, 'me-felicitations'],
    [20, 'me-felicitations'],
  ];

  it.each(cas)('à %s de moyenne, le palier est %s', (note, attendu) => {
    expect(mentionPour(note)?.id).toBe(attendu);
  });

  it('fixe l’admission à 10 pile, pas à 9,99', () => {
    expect(mentionPour(9.99)?.seuil).toBe(8);
    expect(mentionPour(10)?.seuil).toBe(10);
  });

  it('annonce le palier suivant tant qu’il en reste un', () => {
    expect(prochainPalier(5)?.id).toBe('me-rattrapage');
    expect(prochainPalier(9.5)?.id).toBe('me-admis');
    expect(prochainPalier(10)?.id).toBe('me-assez-bien');
    expect(prochainPalier(13)?.id).toBe('me-bien');
    expect(prochainPalier(17.5)?.id).toBe('me-felicitations');
    expect(prochainPalier(18)).toBeUndefined();
    expect(prochainPalier(20)).toBeUndefined();
  });
});

describe('leviers', () => {
  const parId = (id: string) => {
    const ligne = lignes.find((l) => l.id === id);
    if (!ligne) throw new Error(`ligne inconnue : ${id}`);
    return ligne;
  };

  it('mesure ce qu’un point de plus rapporte', () => {
    expect(gainParPoint(parId('co-specialite-maths'))).toBeCloseTo(16 / TOTAL, 10);
    expect(contribution(parId('co-specialite-maths'), 20)).toBeCloseTo(
      (20 * 16) / TOTAL,
      10
    );
    expect(potentiel(parId('co-specialite-maths'), 12)).toBeCloseTo((8 * 16) / TOTAL, 10);
  });

  it('met en tête les grosses matières encore réglables', () => {
    const top = leviers({}, {}, 3).map((l) => l.id);
    expect(top).toContain('co-specialite-maths');
    expect(top).toContain('co-specialite-physique-chimie');
    expect(top).toHaveLength(3);
  });

  it('écarte les notes figées', () => {
    const top = leviers({}, { 'co-specialite-maths': true }, 3).map((l) => l.id);
    expect(top).not.toContain('co-specialite-maths');
    expect(top).toContain('co-specialite-physique-chimie');
  });

  it('écarte les notes déjà à 20, même à gros coefficient', () => {
    const notes = { 'co-specialite-maths': 20, 'co-specialite-physique-chimie': 20 };
    const top = leviers(notes, {}, 3).map((l) => l.id);
    expect(top).not.toContain('co-specialite-maths');
    expect(top).not.toContain('co-specialite-physique-chimie');
  });

  it('préfère une note basse à gros coefficient à une note déjà haute', () => {
    // Philosophie (coef 8) à 2 laisse plus à prendre que le grand oral (coef 8) à 18.
    const notes = { ...toutesA(19.5), 'co-philosophie': 2, 'co-grand-oral': 18 };
    const top = leviers(notes, {}, 2).map((l) => l.id);
    expect(top[0]).toBe('co-philosophie');
  });

  it('ne rend rien quand tout est figé', () => {
    const figees = Object.fromEntries(lignes.map((l) => [l.id, true]));
    expect(leviers({}, figees, 3)).toHaveLength(0);
  });
});
