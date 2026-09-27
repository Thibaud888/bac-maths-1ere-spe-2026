import { indexerTerminale, type FichierBrut } from './indexer';
import type {
  Annales,
  Bloc,
  Chapitre,
  LigneProgramme,
  Matiere,
  Notion,
  Priorite,
} from './types';

/**
 * Chargeur des chapitres de terminale : lit `content/terminale/<matiere>/`, valide
 * chaque fichier contre `schemas/terminale/`, et expose des accesseurs.
 *
 * Chapitre-témoin : en développement seulement (`VITE_TEMOIN=1 npm run dev`), les
 * fichiers de `tests/fixtures/terminale/` s'ajoutent au contenu, pour que les pages
 * aient de quoi s'afficher avant le premier vrai chapitre. En production, la condition
 * vaut `false` à la compilation et le témoin n'entre pas dans le site.
 */

const contenu = import.meta.glob<unknown>(
  ['/content/terminale/maths/**/*.json', '/content/terminale/physique-chimie/**/*.json'],
  { eager: true, import: 'default' }
);

const temoin: Record<string, unknown> =
  import.meta.env.DEV && import.meta.env.VITE_TEMOIN === '1'
    ? import.meta.glob<unknown>(
        [
          '/tests/fixtures/terminale/maths/**/*.json',
          '/tests/fixtures/terminale/physique-chimie/**/*.json',
        ],
        { eager: true, import: 'default' }
      )
    : {};

const isDev = import.meta.env.DEV;

function signaler(message: string, element?: unknown): void {
  if (isDev) throw new Error(`terminale : ${message}`);
  console.warn(`terminale : ${message}`, element);
}

const fichiers: FichierBrut[] = [
  ...Object.entries(contenu).map(([chemin, donnees]) => ({ chemin, donnees, temoin: false })),
  ...Object.entries(temoin).map(([chemin, donnees]) => ({ chemin, donnees, temoin: true })),
];

const index = indexerTerminale(fichiers, signaler);

/** Chapitres ordinaires d'une matière, dans l'ordre de l'année (le transverse à part). */
export function listerChapitres(matiere: Matiere): Chapitre[] {
  return [...index.chapitres.values()]
    .filter((c) => c.meta.matiere === matiere && !c.meta.transverse)
    .sort((a, b) => a.meta.ordre - b.meta.ordre);
}

/** Le chapitre transverse « Méthodes » d'une matière (le vrai avant celui du témoin). */
export function chapitreMethodes(matiere: Matiere): Chapitre | undefined {
  const transverses = [...index.chapitres.values()].filter(
    (c) => c.meta.matiere === matiere && c.meta.transverse
  );
  return transverses.find((c) => !c.temoin) ?? transverses[0];
}

/** Un chapitre par son slug (unique entre les matières). */
export function getChapitre(slug: string): Chapitre | undefined {
  return index.chapitres.get(slug);
}

export function getNotion(id: string): Notion | undefined {
  return index.notions.get(id)?.notion;
}

/** Le chapitre qui porte une notion. */
export function chapitreDeNotion(id: string): Chapitre | undefined {
  const trouve = index.notions.get(id);
  return trouve ? index.chapitres.get(trouve.chapitre) : undefined;
}

/** Un bloc de cours (cible de `revoir`, `de`, `exemple`, `lien`), avec sa notion et son chapitre. */
export function getBloc(id: string): { bloc: Bloc; notion: string; chapitre: string } | undefined {
  return index.blocs.get(id);
}

export function getLigneProgramme(id: string): (LigneProgramme & { matiere: Matiere }) | undefined {
  return index.programme.get(id);
}

/** Les lignes du programme d'une matière, dans l'ordre du fichier. */
export function lignesProgramme(matiere: Matiere): LigneProgramme[] {
  return [...index.programme.values()].filter((l) => l.matiere === matiere);
}

export function getAnnales(matiere: Matiere): Annales | undefined {
  return index.annales.get(matiere);
}

/**
 * Segment d'adresse d'une notion : la fin de son identifiant `n-<chapitre>-<notion>`
 * (`/terminale/<matiere>/<chapitre>/cours/<notion>`, charte § 11).
 */
export function segmentNotion(notion: Pick<Notion, 'id' | 'chapitre'>): string {
  const prefixe = `n-${notion.chapitre}-`;
  return notion.id.startsWith(prefixe) ? notion.id.slice(prefixe.length) : notion.id;
}

export function notionParSegment(chapitre: Chapitre, segment: string): Notion | undefined {
  return chapitre.notions.find((n) => segmentNotion(n) === segment);
}

/** Priorité d'une notion (1 si inconnue : ce qui n'est pas rattaché ne passe pas devant). */
export function prioriteDe(notionId: string | undefined): Priorite {
  return (notionId ? getNotion(notionId)?.priorite : undefined) ?? 1;
}

/**
 * Tri de toute liste de la terminale (marche, mémo, parcours) : priorité décroissante,
 * puis `ordre` croissant, puis ordre du fichier (charte § 5.2). Le cours, lui, garde
 * l'ordre logique des notions.
 */
export function trierParPriorite<T extends { ordre?: number }>(
  items: readonly T[],
  priorite: (item: T) => Priorite
): T[] {
  return items
    .map((item, rang) => ({ item, rang, p: priorite(item) }))
    .sort((a, b) => b.p - a.p || (a.item.ordre ?? 0) - (b.item.ordre ?? 0) || a.rang - b.rang)
    .map(({ item }) => item);
}
