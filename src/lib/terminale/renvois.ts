import { chapterExists, getChapterContent } from '@/lib/content-loader';
import { chapitreDeNotion, getBloc, getChapitre, getNotion } from './content';
import { cheminNotion, cheminPremiere } from './matieres';

/** Un renvoi résolu : l'adresse de la page (avec l'ancre d'un bloc) et son libellé. */
export type Renvoi = { chemin: string; ancre?: string; libelle: string };

/**
 * Résout un renvoi du contenu (charte § 3, précisions des schémas) : `n-…` (notion),
 * `l-…` (bloc de cours) ou `1e:<slug>` (chapitre de maths de première). `undefined`
 * si la cible n'existe pas (le contrôle du contenu l'aurait refusé).
 */
export function resoudreRenvoi(lien: string): Renvoi | undefined {
  if (lien.startsWith('1e:')) {
    const slug = lien.slice(3);
    if (!chapterExists(slug)) return undefined;
    const contenu = getChapterContent(slug);
    return { chemin: cheminPremiere(slug), libelle: contenu?.meta.title ?? slug };
  }
  if (lien.startsWith('n-')) {
    const notion = getNotion(lien);
    const chapitre = chapitreDeNotion(lien);
    if (!notion || !chapitre) return undefined;
    return { chemin: cheminNotion(chapitre, notion), libelle: notion.titre };
  }
  if (lien.startsWith('l-')) {
    const trouve = getBloc(lien);
    const chapitre = trouve ? getChapitre(trouve.chapitre) : undefined;
    const notion = trouve ? getNotion(trouve.notion) : undefined;
    if (!trouve || !chapitre || !notion) return undefined;
    return {
      chemin: cheminNotion(chapitre, notion),
      ancre: trouve.bloc.id,
      libelle: trouve.bloc.titre ?? notion.titre,
    };
  }
  return undefined;
}
