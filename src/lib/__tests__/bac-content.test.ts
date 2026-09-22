import { describe, expect, it } from 'vitest';
import {
  BLOC_ORDER,
  coefficientsOfBloc,
  getBacCoefficient,
  getBacSource,
  listBacCoefficients,
  listBacEpreuves,
  listBacJalons,
  listBacMentions,
  listBacSources,
  totalCoefficients,
  totalEpreuves,
  totalOfBloc,
} from '../bac-content';

describe('barème du bac — session 2027', () => {
  it('totalise 104 coefficients, options comprises', () => {
    expect(totalCoefficients()).toBe(104);
  });

  it('répartit 60 coefficients sur les épreuves et 40 sur les bulletins', () => {
    expect(totalEpreuves()).toBe(60);
    expect(totalOfBloc('continu')).toBe(40);
    expect(totalOfBloc('option')).toBe(4);
  });

  it('place chaque ligne dans un bloc connu', () => {
    const blocs = new Set(BLOC_ORDER);
    for (const c of listBacCoefficients()) {
      expect(blocs.has(c.bloc)).toBe(true);
    }
    const parBloc = BLOC_ORDER.reduce(
      (sum, bloc) => sum + coefficientsOfBloc(bloc).length,
      0
    );
    expect(parBloc).toBe(listBacCoefficients().length);
  });

  it('découpe les coefficients partagés sans rien perdre', () => {
    for (const c of listBacCoefficients()) {
      if (!c.repartition) continue;
      const somme = c.repartition.reduce((sum, p) => sum + p.part, 0);
      expect(somme, `répartition de ${c.id}`).toBe(c.coefficient);
    }
  });

  it('n’a aucun identifiant en double', () => {
    const ids = listBacCoefficients().map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('sources officielles', () => {
  it('résout chaque source citée', () => {
    const cites = [
      ...listBacCoefficients(),
      ...listBacEpreuves(),
      ...listBacJalons(),
      ...listBacMentions(),
    ];
    for (const item of cites) {
      expect(item.sources.length, `${item.id} sans source`).toBeGreaterThan(0);
      for (const id of item.sources) {
        expect(getBacSource(id), `source ${id} citée par ${item.id}`).toBeDefined();
      }
    }
  });

  it('ne pointe que des adresses officielles', () => {
    for (const source of listBacSources()) {
      expect(source.url).toMatch(/^https:\/\/(www\.|)(education|eduscol)\./);
    }
  });
});

describe('épreuves et calendrier', () => {
  it('rattache chaque épreuve à une ligne du barème', () => {
    for (const e of listBacEpreuves()) {
      expect(getBacCoefficient(e.coefficientId), e.id).toBeDefined();
    }
  });

  it('n’annonce une date au jour près que si elle est publiée', () => {
    // `jour` et `periode` reprennent des dates du Bulletin officiel ; `mois` et
    // `inconnue` disent qu'on ne les a pas — aucun jour ne doit y apparaître.
    for (const j of listBacJalons()) {
      if (j.precision === 'jour' || j.precision === 'periode') continue;
      expect(j.quand, `${j.id} annonce un jour sans date officielle`).not.toMatch(
        /\b(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\b/
      );
    }
  });
});

describe('paliers de résultat', () => {
  const reglementaires = listBacMentions().filter((m) => m.reglementaire !== false);

  it('couvre la note de 0 à 20 sans trou ni chevauchement', () => {
    expect(reglementaires[0]?.seuil).toBe(0);
    for (let i = 1; i < reglementaires.length; i += 1) {
      const precedent = reglementaires[i - 1];
      const courant = reglementaires[i];
      expect(precedent?.plafond, `palier ${courant?.id}`).toBe(courant?.seuil);
    }
    expect(reglementaires[reglementaires.length - 1]?.plafond).toBeUndefined();
  });

  it('fixe l’admission à 10 et le rattrapage à 8', () => {
    const admis = listBacMentions().find((m) => m.id === 'me-admis');
    const rattrapage = listBacMentions().find((m) => m.id === 'me-rattrapage');
    expect(admis?.seuil).toBe(10);
    expect(rattrapage?.seuil).toBe(8);
    expect(rattrapage?.plafond).toBe(10);
  });
});
