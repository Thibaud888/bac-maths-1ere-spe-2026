import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { resoudreRenvoi } from '@/lib/terminale/renvois';

const STYLE =
  'font-medium text-blue-700 underline underline-offset-2 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300';

type Props = {
  /** `n-…`, `l-…` ou `1e:<slug>`. */
  lien: string;
  /** Adresse de la page ouverte : un renvoi vers elle devient une ancre. */
  cheminCourant: string;
  /** Texte du lien (par défaut, le titre de la cible). */
  children?: ReactNode;
};

/** Lien vers une notion, un bloc de cours ou un chapitre de première. */
export default function LienRenvoi({ lien, cheminCourant, children }: Props) {
  const renvoi = resoudreRenvoi(lien);
  if (!renvoi) return null;
  const texte = children ?? renvoi.libelle;
  if (renvoi.ancre && renvoi.chemin === cheminCourant) {
    return (
      <a href={`#${renvoi.ancre}`} className={STYLE}>
        {texte}
      </a>
    );
  }
  const cible = renvoi.ancre ? `${renvoi.chemin}#${renvoi.ancre}` : renvoi.chemin;
  return (
    <Link to={cible} className={STYLE}>
      {texte}
    </Link>
  );
}
