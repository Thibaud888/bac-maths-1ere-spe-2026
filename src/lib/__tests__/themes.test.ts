import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { DEFAULT_THEME, THEMES, applyTheme, themeMeta } from '@/lib/themes';

const css = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8');
const blocsCss = [...css.matchAll(/data-theme='([a-z-]+)'/g)].map((m) => m[1]);

afterEach(() => {
  document.documentElement.className = '';
  delete document.documentElement.dataset.theme;
});

describe('registre des thèmes', () => {
  it('donne un identifiant et un nom uniques à chaque thème', () => {
    expect(new Set(THEMES.map((t) => t.id)).size).toBe(THEMES.length);
    expect(new Set(THEMES.map((t) => t.label)).size).toBe(THEMES.length);
  });

  it('garde les thèmes clair et sombre d’origine, le clair par défaut', () => {
    expect(DEFAULT_THEME).toBe('light');
    expect(themeMeta('light').dark).toBe(false);
    expect(themeMeta('dark').dark).toBe(true);
  });

  it('déclare dans index.css les couleurs de chaque thème ajouté, et d’aucun autre', () => {
    const ajoutes = THEMES.filter((t) => t.id !== 'light' && t.id !== 'dark').map((t) => t.id);
    expect(ajoutes.length).toBeGreaterThan(0);
    expect([...new Set(blocsCss)].sort()).toEqual([...ajoutes].sort());
  });
});

describe('applyTheme', () => {
  it('pose data-theme et la classe dark selon le thème', () => {
    for (const theme of THEMES) {
      applyTheme(theme.id);
      const root = document.documentElement;
      expect(root.dataset.theme).toBe(theme.id);
      expect(root.classList.contains('dark')).toBe(theme.dark);
    }
  });

  it('retombe sur le thème clair pour une valeur inconnue', () => {
    applyTheme('dark');
    applyTheme('arc-en-ciel');
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
