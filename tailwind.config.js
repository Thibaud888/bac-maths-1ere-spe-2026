/**
 * Les gris (`slate`), le blanc, la police et l'arrondi des coins passent par
 * des variables CSS : chaque thème (`src/lib/themes.ts`) les redéfinit dans
 * `src/index.css`, sans toucher aux classes des composants.
 */
const canal = (nom) => `rgb(var(--${nom}) / <alpha-value>)`;
const nuances = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const arrondi = (rem) => `calc(${rem}rem * var(--arrondi, 1))`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        white: canal('blanc'),
        slate: Object.fromEntries(nuances.map((n) => [n, canal(`gris-${n}`)])),
      },
      fontFamily: {
        sans: 'var(--police)',
      },
      borderRadius: {
        sm: arrondi(0.125),
        DEFAULT: arrondi(0.25),
        md: arrondi(0.375),
        lg: arrondi(0.5),
        xl: arrondi(0.75),
        '2xl': arrondi(1),
        '3xl': arrondi(1.5),
      },
    },
  },
  plugins: [],
};
