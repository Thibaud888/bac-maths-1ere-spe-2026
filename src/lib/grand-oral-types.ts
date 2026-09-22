/**
 * Types du grand oral (session 2027).
 *
 * Le contenu vit en JSON sous `content/terminale/grand-oral/`, validé par les
 * schémas `schemas/grand-oral/`. Les sources citées sont celles de
 * `content/bac/sources.json` : le registre des sources officielles reste unique.
 */

export type GrandOralSection = 'epreuve' | 'preparation' | 'entretien';

/** `reglementaire` : ce que dit le texte officiel ; `methode` : un conseil. */
export type GrandOralNature = 'reglementaire' | 'methode';

/** Fiche d'une page du grand oral (jumelle de `OralFiche`, avec ses sources). */
export type GrandOralFiche = {
  id: string;
  section: GrandOralSection;
  nature: GrandOralNature;
  title: string;
  statement: string;
  conseil?: string;
  order?: number;
  sources: string[];
};

/** Une étape du déroulé officiel. `minutes` absent : étape non minutée. */
export type GrandOralTemps = {
  id: string;
  titre: string;
  minutes?: number;
  devantJury: boolean;
  resume: string;
  order?: number;
  sources: string[];
};

/** Ce que le jury valorise, d'après le texte officiel (sans points). */
export type GrandOralCritere = {
  id: string;
  label: string;
  aide: string;
  order?: number;
  sources: string[];
};

export type RelanceCategorie =
  | 'question'
  | 'cours'
  | 'demarche'
  | 'orientation'
  | 'piege';

/** Question type du jury pendant l'échange. */
export type GrandOralRelance = {
  id: string;
  categorie: RelanceCategorie;
  question: string;
  pistes: string[];
  order?: number;
};
