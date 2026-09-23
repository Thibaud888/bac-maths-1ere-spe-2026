import { listChapters } from '@/lib/content-loader';
import type { Domain } from '@/lib/types';
import { listFrenchModules } from '@/francais/lib/french-content-loader';
import type { FrenchFamily } from '@/francais/lib/french-types';

/**
 * Registre des espaces du site : une entrée par couple (année, matière).
 * C'est LA source de vérité de la navigation — ajouter une matière se fait
 * ici, la barre latérale et l'accueil s'adaptent seuls.
 */

export type YearId = 'terminale' | 'premiere';

export type SpaceId =
  | 'tle-maths'
  | 'tle-physique-chimie'
  | 'tle-grand-oral'
  | '1e-maths'
  | '1e-francais';

/** Couleur d'accent de l'espace (état actif, pastilles, tuiles d'accueil). */
export type SpaceAccent = 'blue' | 'violet' | 'amber' | 'sky' | 'indigo';

/** Lien terminal de la barre latérale (chapitre, section, outil). */
export type NavLeaf = { to: string; label: string; end?: boolean };

/** Bloc de liens d'un espace, éventuellement coiffé d'un en-tête. */
export type NavSection = { label?: string; items: NavLeaf[] };

export type Space = {
  id: SpaceId;
  year: YearId;
  /** Nom court affiché dans la barre latérale. */
  label: string;
  /** Nom complet affiché sur l'accueil et dans le fil d'Ariane. */
  title: string;
  path: string;
  accent: SpaceAccent;
  /** Résumé d'une ligne pour l'accueil. */
  tagline: string;
  /** `soon` tant que l'espace n'a pas encore de contenu. */
  status: 'ready' | 'soon';
  /** Sections dépliées quand l'espace est ouvert. */
  sections: () => NavSection[];
  /** Message affiché quand `sections()` ne renvoie encore rien. */
  emptyLabel: string;
};

export type Year = {
  id: YearId;
  label: string;
  /** Sous-titre de la section (épreuves concernées). */
  hint: string;
};

export const YEARS: readonly Year[] = [
  {
    id: 'terminale',
    label: 'Terminale',
    hint: 'Spécialités et grand oral',
  },
  {
    id: 'premiere',
    label: 'Première',
    hint: 'Épreuves anticipées',
  },
] as const;

export const DOMAIN_LABEL: Record<Domain, string> = {
  algebre: 'Algèbre',
  analyse: 'Analyse',
  geometrie: 'Géométrie',
  probabilites: 'Probabilités',
};

const DOMAIN_ORDER: readonly Domain[] = [
  'algebre',
  'analyse',
  'geometrie',
  'probabilites',
];

export const FAMILY_LABEL: Record<FrenchFamily, string> = {
  methode: 'Méthode',
  reperes: 'Repères',
  'objet-etude': 'Objets d’étude',
};

const FAMILY_ORDER: readonly FrenchFamily[] = ['methode', 'reperes', 'objet-etude'];

/** Sections du chapitre de maths de première, groupées par domaine. */
function premiereMathsSections(): NavSection[] {
  const chapters = listChapters();
  const sections: NavSection[] = [
    { items: [{ to: '/premiere/maths/bac-blanc', label: 'Bac blanc' }] },
  ];
  for (const domain of DOMAIN_ORDER) {
    const inDomain = chapters.filter((c) => c.domain === domain);
    if (inDomain.length > 0) {
      sections.push({
        label: DOMAIN_LABEL[domain],
        items: inDomain.map((chapter) => ({
          to: `/premiere/maths/${chapter.slug}`,
          label: chapter.shortTitle ?? chapter.title,
        })),
      });
    }
  }
  return sections;
}

/** Sections du français de première : les deux épreuves, puis les modules. */
function premiereFrancaisSections(): NavSection[] {
  const sections: NavSection[] = [
    {
      items: [
        { to: '/premiere/francais/oral', label: 'Oral' },
        { to: '/premiere/francais/ecrit', label: 'Écrit', end: true },
        { to: '/premiere/francais/express', label: 'Révision express' },
      ],
    },
  ];
  const modules = listFrenchModules();
  for (const family of FAMILY_ORDER) {
    const inFamily = modules.filter((m) => m.family === family);
    if (inFamily.length > 0) {
      sections.push({
        label: FAMILY_LABEL[family],
        items: inFamily.map((m) => ({
          to: `/premiere/francais/module/${m.slug}`,
          label: m.shortTitle ?? m.title,
        })),
      });
    }
  }
  return sections;
}

/** Sections fixes du grand oral (pas de découpage par chapitre). */
export const GRAND_ORAL_SECTIONS: readonly NavLeaf[] = [
  { to: '/terminale/grand-oral/epreuve', label: 'L’épreuve' },
  { to: '/terminale/grand-oral/questions', label: 'Mes 2 questions' },
  { to: '/terminale/grand-oral/preparation', label: 'Préparation' },
  { to: '/terminale/grand-oral/entretien', label: 'Entretien' },
  { to: '/terminale/grand-oral/oral-blanc', label: 'Oral blanc' },
] as const;

export const SPACES: readonly Space[] = [
  {
    id: 'tle-maths',
    status: 'soon' as const,
    year: 'terminale',
    label: 'Maths',
    title: 'Maths — spécialité',
    path: '/terminale/maths',
    accent: 'blue',
    tagline: 'Formulaire, automatismes, exercices classiques et sujets type bac.',
    sections: () => [],
    emptyLabel: 'Chapitres à venir',
  },
  {
    id: 'tle-physique-chimie',
    status: 'soon' as const,
    year: 'terminale',
    label: 'Physique-chimie',
    title: 'Physique-chimie — spécialité',
    path: '/terminale/physique-chimie',
    accent: 'violet',
    tagline: 'Formulaire, méthodes-types, exercices et sujets type bac.',
    sections: () => [],
    emptyLabel: 'Chapitres à venir',
  },
  {
    id: 'tle-grand-oral',
    status: 'ready' as const,
    year: 'terminale',
    label: 'Grand oral',
    title: 'Grand oral',
    path: '/terminale/grand-oral',
    accent: 'amber',
    tagline: 'Les deux questions, la préparation, l’entretien et l’oral blanc minuté.',
    sections: () => [{ items: [...GRAND_ORAL_SECTIONS] }],
    emptyLabel: 'Sections à venir',
  },
  {
    id: '1e-maths',
    status: 'ready' as const,
    year: 'premiere',
    label: 'Maths',
    title: 'Maths — spécialité',
    path: '/premiere/maths',
    accent: 'sky',
    tagline: 'Neuf chapitres, quatre modes de travail et trois bacs blancs.',
    sections: premiereMathsSections,
    emptyLabel: 'Chapitres à venir',
  },
  {
    id: '1e-francais',
    status: 'ready' as const,
    year: 'premiere',
    label: 'Français',
    title: 'Français',
    path: '/premiere/francais',
    accent: 'indigo',
    tagline: 'L’écrit (méthode, repères, objets d’étude) et l’oral par élève.',
    sections: premiereFrancaisSections,
    emptyLabel: 'Modules à venir',
  },
] as const;

/** Nom du site : bandeau de la barre latérale, accueil et titre de l'onglet. */
export const SITE_NAME = 'Révisions du bac';

/**
 * Titre de l'onglet : le fil d'Ariane lu du plus précis au plus général, puis
 * le nom du site — « Suites · Maths · Première — Révisions du bac ».
 */
export function pageTitle(crumbs: readonly string[]): string {
  if (crumbs.length === 0) return SITE_NAME;
  return `${[...crumbs].reverse().join(' · ')} — ${SITE_NAME}`;
}

/** Liens valables quelle que soit l'année. */
export const TOOLS: readonly NavLeaf[] = [
  { to: '/le-bac', label: 'Le bac, mode d’emploi' },
  { to: '/simulateur', label: 'Simulateur de moyenne' },
] as const;

export function spacesOfYear(year: YearId): Space[] {
  return SPACES.filter((s) => s.year === year);
}

export function getSpace(id: SpaceId): Space | undefined {
  return SPACES.find((s) => s.id === id);
}

/** L'espace auquel appartient une adresse, s'il y en a un. */
export function findSpaceByPath(pathname: string): Space | undefined {
  return SPACES.find(
    (s) => pathname === s.path || pathname.startsWith(`${s.path}/`)
  );
}
