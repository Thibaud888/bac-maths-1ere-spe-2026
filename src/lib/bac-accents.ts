import type { BacAccent } from '@/lib/bac-types';

/**
 * Couleurs des paliers de résultat (`accent` dans `content/bac/mentions.json`),
 * partagées par la page « Le bac, mode d'emploi » et le simulateur de moyenne.
 */

/** Carte encadrée, sur la page du mode d'emploi. */
export const MENTION_CARD: Record<BacAccent, string> = {
  rose: 'border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/40',
  amber: 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40',
  sky: 'border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/40',
  emerald:
    'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40',
  violet:
    'border-violet-300 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/40',
};

/** Texte coloré, pour annoncer la mention atteinte. */
export const MENTION_TEXTE: Record<BacAccent, string> = {
  rose: 'text-rose-700 dark:text-rose-300',
  amber: 'text-amber-700 dark:text-amber-300',
  sky: 'text-sky-700 dark:text-sky-300',
  emerald: 'text-emerald-700 dark:text-emerald-300',
  violet: 'text-violet-700 dark:text-violet-300',
};

/** Même couleur, en hexadécimal : les SVG dessinés à la main n'ont pas de classes. */
export const MENTION_HEX: Record<BacAccent, string> = {
  rose: '#e11d48',
  amber: '#d97706',
  sky: '#0284c7',
  emerald: '#059669',
  violet: '#7c3aed',
};

export const ACCENT_PAR_DEFAUT: BacAccent = 'sky';
