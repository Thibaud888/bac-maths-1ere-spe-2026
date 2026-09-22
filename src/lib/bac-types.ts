/**
 * Types du mode d'emploi du bac (session 2027).
 *
 * Le contenu vit en JSON sous `content/bac/`, validé par les schémas
 * `schemas/bac/`. C'est la source unique des coefficients du site : la page
 * `/le-bac` et, plus tard, le simulateur de moyenne lisent ces fichiers.
 */

export type BacPublisher = 'education.gouv.fr' | 'éduscol' | 'Bulletin officiel';

/** Référence officielle citée par une donnée. */
export type BacSource = {
  id: string;
  label: string;
  publisher: BacPublisher;
  url: string;
  /** Date de consultation, AAAA-MM-JJ. */
  consultedOn: string;
  note?: string;
};

/** Bloc du barème : épreuve anticipée, épreuve de terminale, bulletins, option. */
export type BacBloc = 'anticipee' | 'terminale' | 'continu' | 'option';

export type BacAnnee = 'premiere' | 'terminale';

/** Part du coefficient jouée sur une année donnée. */
export type BacPart = { annee: BacAnnee; part: number };

/** `commun` vaut pour tout élève de la voie générale ; `profil` dépend de ses choix. */
export type BacPortee = 'commun' | 'profil';

/** Une ligne du barème. */
export type BacCoefficient = {
  id: string;
  label: string;
  bloc: BacBloc;
  coefficient: number;
  repartition?: BacPart[];
  quand: string;
  portee: BacPortee;
  profilNote?: string;
  comment?: string;
  order?: number;
  sources: string[];
};

export type BacForme = 'ecrit' | 'oral' | 'pratique' | 'ecrit-et-pratique';

/** Le format d'une épreuve. Son coefficient est repris de `coefficientId`. */
export type BacEpreuve = {
  id: string;
  coefficientId: string;
  titre: string;
  forme: BacForme;
  duree?: string;
  quand?: string;
  resume: string;
  detail?: string;
  statut?: 'passee' | 'a-venir';
  order?: number;
  sources: string[];
};

/** Ce qu'on sait vraiment d'une date : au jour près, ou seulement la période. */
export type BacPrecision = 'jour' | 'periode' | 'mois' | 'inconnue';

/** Un jalon du calendrier. */
export type BacJalon = {
  id: string;
  titre: string;
  quand: string;
  precision: BacPrecision;
  detail?: string;
  phase?: 'premiere' | 'terminale' | 'apres';
  order?: number;
  sources: string[];
};

export type BacAccent = 'rose' | 'amber' | 'sky' | 'emerald' | 'violet';

/** Un palier de la moyenne finale. */
export type BacMention = {
  id: string;
  seuil: number;
  plafond?: number;
  label: string;
  resume: string;
  /** `false` quand le palier relève du jury et non d'un seuil réglementaire. */
  reglementaire?: boolean;
  accent?: BacAccent;
  order?: number;
  sources: string[];
};
