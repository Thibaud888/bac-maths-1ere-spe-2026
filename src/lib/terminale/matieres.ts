import type { SpaceAccent, SpaceId } from '@/lib/spaces';
import { segmentNotion } from './content';
import type {
  Chapitre,
  DomaineMaths,
  DomainePhysiqueChimie,
  Matiere,
  Notion,
} from './types';

/**
 * Les matières de terminale servies par les mêmes pages (charte § 11) : ajouter une
 * matière = une entrée ici, un dossier de contenu et une entrée dans `SPACES`.
 */
export type InfoMatiere = {
  id: Matiere;
  espace: SpaceId;
  /** Nom court (fil d'Ariane, titres). */
  nom: string;
  chemin: string;
  accent: Extract<SpaceAccent, 'blue' | 'violet'>;
  /** Préfixe du stockage local, jamais croisé avec une autre matière. */
  stockage: string;
  /** Grands domaines, dans l'ordre d'affichage. */
  domaines: readonly { id: DomaineMaths | DomainePhysiqueChimie; label: string }[];
};

export const MATIERES: Record<Matiere, InfoMatiere> = {
  maths: {
    id: 'maths',
    espace: 'tle-maths',
    nom: 'Maths',
    chemin: '/terminale/maths',
    accent: 'blue',
    stockage: 'btm-2027-',
    domaines: [
      { id: 'analyse', label: 'Analyse' },
      { id: 'geometrie', label: 'Géométrie' },
      { id: 'combinatoire', label: 'Combinatoire' },
      { id: 'probabilites', label: 'Probabilités' },
    ],
  },
  'physique-chimie': {
    id: 'physique-chimie',
    espace: 'tle-physique-chimie',
    nom: 'Physique-chimie',
    chemin: '/terminale/physique-chimie',
    accent: 'violet',
    stockage: 'bpc-2027-',
    domaines: [
      { id: 'matiere', label: 'Matière et transformations' },
      { id: 'mouvement', label: 'Mouvement et interactions' },
      { id: 'energie', label: 'Énergie' },
      { id: 'ondes', label: 'Ondes et signaux' },
    ],
  },
};

/** Libellé d'une matière dans un renvoi « Et en … ? ». */
export const ET_EN: Record<Matiere, string> = {
  maths: 'Et en maths ?',
  'physique-chimie': 'Et en physique-chimie ?',
};

/** Adresse d'un chapitre : le transverse « Méthodes » a la sienne (charte § 2.1). */
export function cheminChapitre(meta: Pick<Chapitre['meta'], 'matiere' | 'slug' | 'transverse'>): string {
  const base = MATIERES[meta.matiere].chemin;
  return meta.transverse ? `${base}/methodes` : `${base}/${meta.slug}`;
}

/** Page de cours d'une notion. */
export function cheminNotion(chapitre: Chapitre, notion: Pick<Notion, 'id' | 'chapitre'>): string {
  return `${cheminChapitre(chapitre.meta)}/cours/${segmentNotion(notion)}`;
}

/** Adresse d'un chapitre de maths de première, cible des renvois `1e:<slug>`. */
export function cheminPremiere(slug: string): string {
  return `/premiere/maths/${slug}`;
}
