import { describe, expect, it } from 'vitest';
import {
  GRAND_ORAL_SECTIONS,
  SITE_NAME,
  SPACES,
  TOOLS,
  YEARS,
  findSpaceByPath,
  pageTitle,
  spacesOfYear,
} from '@/lib/spaces';

describe('registre des espaces', () => {
  it('donne un identifiant et un chemin uniques à chaque espace', () => {
    const ids = SPACES.map((s) => s.id);
    const paths = SPACES.map((s) => s.path);
    expect(new Set(ids).size).toBe(SPACES.length);
    expect(new Set(paths).size).toBe(SPACES.length);
  });

  it('range chaque espace sous le préfixe de son année', () => {
    for (const space of SPACES) {
      expect(space.path.startsWith(`/${space.year}/`)).toBe(true);
    }
  });

  it('rattache chaque espace à une année déclarée', () => {
    const years = YEARS.map((y) => y.id);
    for (const space of SPACES) {
      expect(years).toContain(space.year);
    }
    for (const year of YEARS) {
      expect(spacesOfYear(year.id).length).toBeGreaterThan(0);
    }
  });

  it('garde les liens de chaque espace à l’intérieur de cet espace', () => {
    for (const space of SPACES) {
      for (const section of space.sections()) {
        for (const item of section.items) {
          expect(item.to.startsWith(`${space.path}/`)).toBe(true);
        }
      }
    }
  });

  it('retrouve l’espace d’une adresse, et seulement celui-là', () => {
    expect(findSpaceByPath('/premiere/maths/suites/formulaire')?.id).toBe('1e-maths');
    expect(findSpaceByPath('/premiere/maths')?.id).toBe('1e-maths');
    expect(findSpaceByPath('/premiere/francais/oral/j')?.id).toBe('1e-francais');
    expect(findSpaceByPath('/terminale/grand-oral/epreuve')?.id).toBe('tle-grand-oral');
    expect(findSpaceByPath('/')).toBeUndefined();
    expect(findSpaceByPath('/simulateur')).toBeUndefined();
  });

  it('range l’onglet « Exposé » du grand oral entre la préparation et l’entretien', () => {
    const chemins = GRAND_ORAL_SECTIONS.map((s) => s.to.split('/').pop());
    expect(chemins.indexOf('expose')).toBe(chemins.indexOf('preparation') + 1);
    expect(chemins.indexOf('entretien')).toBe(chemins.indexOf('expose') + 1);
  });

  it('place les outils hors des espaces', () => {
    for (const tool of TOOLS) {
      expect(findSpaceByPath(tool.to)).toBeUndefined();
    }
  });

  it('nomme l’onglet d’après la page ouverte, puis le site', () => {
    expect(pageTitle([])).toBe(SITE_NAME);
    expect(pageTitle(['Simulateur de moyenne'])).toBe(
      `Simulateur de moyenne — ${SITE_NAME}`
    );
    expect(pageTitle(['Première', 'Maths', 'Suites'])).toBe(
      `Suites · Maths · Première — ${SITE_NAME}`
    );
  });

  it('ne date pas les années : le site vaut pour n’importe quelle session', () => {
    for (const year of YEARS) {
      expect(year.label).not.toMatch(/\d{4}/);
    }
    expect(SITE_NAME).not.toMatch(/\d{4}/);
  });
});
