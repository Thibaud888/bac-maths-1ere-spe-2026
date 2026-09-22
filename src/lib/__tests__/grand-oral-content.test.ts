import Ajv from 'ajv';
import { describe, expect, it } from 'vitest';
import ficheSchema from '../../../schemas/grand-oral/fiche.schema.json';
import { getBacSource } from '../bac-content';
import {
  FICHE_GRILLE_ID,
  RELANCE_CATEGORIE_ORDER,
  TEMPS_ID,
  fichesOfSection,
  grandOralCoefficient,
  grandOralEpreuve,
  grandOralJalon,
  grandOralSources,
  listGrandOralCriteres,
  listGrandOralFiches,
  listGrandOralRelances,
  listGrandOralTemps,
  minutesDevantJury,
  minutesPreparation,
  tempsMinutes,
} from '../grand-oral-content';

describe('contenu du grand oral — chargement', () => {
  it('charge les trois pages de fiches, le déroulé, les critères et les relances', () => {
    expect(fichesOfSection('epreuve').length).toBeGreaterThan(0);
    expect(fichesOfSection('preparation').length).toBeGreaterThan(0);
    expect(fichesOfSection('entretien').length).toBeGreaterThan(0);
    expect(listGrandOralTemps().length).toBeGreaterThan(0);
    expect(listGrandOralCriteres().length).toBeGreaterThan(0);
    expect(listGrandOralRelances().length).toBeGreaterThan(0);
  });

  it('donne un identifiant unique à chaque entrée', () => {
    const ids = [
      ...listGrandOralFiches(),
      ...listGrandOralTemps(),
      ...listGrandOralCriteres(),
      ...listGrandOralRelances(),
    ].map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('ne laisse passer aucune fiche réglementaire sans source', () => {
    for (const fiche of listGrandOralFiches()) {
      if (fiche.nature === 'reglementaire') expect(fiche.sources.length).toBeGreaterThan(0);
    }
    for (const t of listGrandOralTemps()) expect(t.sources.length).toBeGreaterThan(0);
    for (const c of listGrandOralCriteres()) expect(c.sources.length).toBeGreaterThan(0);
  });

  it('ne cite que des sources déclarées dans content/bac/sources.json', () => {
    const cited = [
      ...listGrandOralFiches().flatMap((f) => f.sources),
      ...listGrandOralTemps().flatMap((t) => t.sources),
      ...listGrandOralCriteres().flatMap((c) => c.sources),
    ];
    for (const id of cited) expect(getBacSource(id), id).toBeDefined();
    expect(grandOralSources().map((s) => s.id)).toContain('s-grand-oral');
  });

  it('refuse, au schéma, une fiche réglementaire sans source', () => {
    const validate = new Ajv({ allErrors: true, strict: false }).compile(ficheSchema);
    const fiche = {
      id: 'go-test',
      section: 'epreuve',
      nature: 'reglementaire',
      title: 'Une règle',
      statement: 'Une règle inventée.',
      sources: [],
    };
    expect(validate(fiche)).toBe(false);
    expect(validate({ ...fiche, nature: 'methode' })).toBe(true);
    expect(validate({ ...fiche, sources: ['s-grand-oral'] })).toBe(true);
  });

  it('retrouve les étapes et la fiche que les composants traitent à part', () => {
    const tempsIds = listGrandOralTemps().map((t) => t.id);
    for (const id of Object.values(TEMPS_ID)) expect(tempsIds).toContain(id);
    expect(fichesOfSection('epreuve').map((f) => f.id)).toContain(FICHE_GRILLE_ID);
  });

  it('couvre chaque catégorie de relance', () => {
    const categories = new Set(listGrandOralRelances().map((r) => r.categorie));
    for (const c of RELANCE_CATEGORIE_ORDER) expect(categories.has(c), c).toBe(true);
  });
});

describe('grand oral — cohérence avec content/bac/', () => {
  it('lit le coefficient 2027 dans le barème, sans le recopier', () => {
    const coefficient = grandOralCoefficient();
    expect(coefficient?.id).toBe('co-grand-oral');
    expect(coefficient?.coefficient).toBe(8);
  });

  it('garde un déroulé minuté cohérent avec la durée annoncée sur « Le bac »', () => {
    const duree = grandOralEpreuve()?.duree ?? '';
    expect(duree).toContain(`${minutesDevantJury()} min`);
    expect(duree).toContain(`après ${minutesPreparation()} min de préparation`);
  });

  it('enchaîne préparation, exposé puis échange, dans cet ordre', () => {
    expect(tempsMinutes().map((t) => t.id)).toEqual([
      TEMPS_ID.preparation,
      TEMPS_ID.expose,
      TEMPS_ID.echange,
    ]);
  });

  it('ne donne qu’une période de passage tant que le jour n’est pas connu', () => {
    const jalon = grandOralJalon();
    expect(jalon).toBeDefined();
    expect(jalon?.precision).not.toBe('jour');
  });
});
