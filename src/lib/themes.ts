/**
 * Registre des thèmes d'affichage.
 *
 * Tout le site est dessiné avec une seule palette de gris (`slate`) et le blanc.
 * Un thème ne touche pas aux composants : il redéfinit ces couleurs (et la
 * police, et l'arrondi des coins) par des variables CSS, déclarées dans
 * `src/index.css` sous `:root[data-theme='<id>']`. Les classes `dark:` restent
 * celles du mode sombre : un thème sombre pose aussi la classe `dark`.
 *
 * Ajouter un thème = une entrée ici + son bloc de variables dans `index.css`.
 */

export type ThemeId = 'light' | 'dark' | 'papier' | 'tableau' | 'lavande';

export type ThemeMeta = {
  id: ThemeId;
  label: string;
  /** Le thème s'appuie sur les classes `dark:` (fond sombre, texte clair). */
  dark: boolean;
  /** Aperçu dans le sélecteur : fond de page, carte, texte, famille de police. */
  apercu: { fond: string; carte: string; texte: string; police: string };
};

export const THEMES: readonly ThemeMeta[] = [
  {
    id: 'light',
    label: 'Clair',
    dark: false,
    apercu: { fond: '#f8fafc', carte: '#ffffff', texte: '#0f172a', police: 'system-ui, sans-serif' },
  },
  {
    id: 'dark',
    label: 'Sombre',
    dark: true,
    apercu: { fond: '#0f172a', carte: '#1e293b', texte: '#f1f5f9', police: 'system-ui, sans-serif' },
  },
  {
    id: 'papier',
    label: 'Papier',
    dark: false,
    apercu: { fond: '#f7f1e6', carte: '#fffcf5', texte: '#2a2016', police: 'Charter, Georgia, serif' },
  },
  {
    id: 'tableau',
    label: 'Tableau',
    dark: true,
    apercu: { fond: '#17231e', carte: '#20302a', texte: '#e9f0ec', police: 'system-ui, sans-serif' },
  },
  {
    id: 'lavande',
    label: 'Lavande',
    dark: false,
    apercu: { fond: '#f6f4fc', carte: '#ffffff', texte: '#1f1a33', police: 'ui-rounded, system-ui, sans-serif' },
  },
];

export const DEFAULT_THEME: ThemeId = 'light';

/** Retrouve un thème ; une valeur inconnue (stockage ancien ou abîmé) retombe sur le thème clair. */
export function themeMeta(id: string | null | undefined): ThemeMeta {
  return THEMES.find((t) => t.id === id) ?? (THEMES[0] as ThemeMeta);
}

/** Pose le thème sur `<html>` : attribut `data-theme` et classe `dark`. */
export function applyTheme(id: string | null | undefined, root: HTMLElement = document.documentElement): void {
  const meta = themeMeta(id);
  root.classList.toggle('dark', meta.dark);
  root.dataset.theme = meta.id;
}
