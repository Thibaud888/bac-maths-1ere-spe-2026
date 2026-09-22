import { describe, expect, it } from 'vitest';
import {
  SPACES,
  TOOLS,
  YEARS,
  findSpaceByPath,
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

  it('place les outils hors des espaces', () => {
    for (const tool of TOOLS) {
      expect(findSpaceByPath(tool.to)).toBeUndefined();
    }
  });
});
