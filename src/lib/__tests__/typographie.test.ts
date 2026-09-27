import { describe, expect, it } from 'vitest';
import { typographie } from '@/lib/typographie';

const NBSP = ' ';

describe('typographie', () => {
  it("remplace l'apostrophe droite par l'apostrophe courbe", () => {
    expect(typographie("L'exposé d'abord")).toBe('L’exposé d’abord');
  });

  it('rend insécable l’espace avant la ponctuation haute', () => {
    expect(typographie('Quand : demain ; vraiment ? oui !')).toBe(
      `Quand${NBSP}: demain${NBSP}; vraiment${NBSP}? oui${NBSP}!`
    );
  });

  it('garde les guillemets collés à leur contenu', () => {
    expect(typographie('« de secours »')).toBe(`«${NBSP}de secours${NBSP}»`);
  });

  it('ne sépare pas un nombre de ce qui le suit', () => {
    expect(typographie('20 min, le 14 juin, 3 h 30')).toBe(
      `20${NBSP}min, le 14${NBSP}juin, 3${NBSP}h 30`
    );
  });

  it('ne touche ni au gras ni aux listes', () => {
    const texte = '- **deux questions** ;\n1. **Accroche** — 0,8 fois l’écrit';
    expect(typographie(texte)).toBe(
      `- **deux questions**${NBSP};\n1. **Accroche** — 0,8${NBSP}fois l’écrit`
    );
  });

  it('laisse un texte déjà typographié tel quel', () => {
    const propre = typographie("Aujourd'hui : « 20 min »");
    expect(typographie(propre)).toBe(propre);
  });
});
