import { useEffect } from 'react';
import { Navigate, Outlet, useOutletContext, useParams } from 'react-router-dom';
import SectionTabs from '@/components/layout/SectionTabs';
import { chapitreMethodes, getChapitre } from '@/lib/terminale/content';
import { MATIERES, cheminChapitre, type InfoMatiere } from '@/lib/terminale/matieres';
import type { Chapitre, Matiere } from '@/lib/terminale/types';
import { storeProgression } from '@/stores/terminale-progression-store';

export type ContexteChapitre = { chapitre: Chapitre; matiere: InfoMatiere };

/** Le chapitre ouvert, pour les pages placées sous `ChapitreLayout`. */
export function useChapitre(): ContexteChapitre {
  return useOutletContext<ContexteChapitre>();
}

/** Onglets d'un chapitre, dans l'ordre de la charte (§ 11). */
export function ongletsChapitre(chapitre: Chapitre): { to: string; label: string; end?: boolean }[] {
  const base = cheminChapitre(chapitre.meta);
  return [
    { to: base, label: 'Aperçu', end: true },
    { to: `${base}/cours`, label: 'Cours' },
    // Le mémo suit le cours : on relit l'essentiel avant de s'entraîner (Thibaud, 2026-09-29).
    { to: `${base}/memo`, label: 'Mémo' },
    { to: `${base}/exercices`, label: 'Exercices' },
    // Le chapitre « Méthodes » n'a pas de type bac (charte § 2.1).
    ...(chapitre.meta.transverse ? [] : [{ to: `${base}/type-bac`, label: 'Type bac' }]),
  ];
}

type Props = {
  matiere: Matiere;
  /** Le chapitre transverse « Méthodes » (`/terminale/<matiere>/methodes`). */
  transverse?: boolean;
};

/**
 * Cadre d'un chapitre de terminale : titre, onglets, puis la page ouverte. Sert aux
 * deux matières et au chapitre « Méthodes ».
 */
export default function ChapitreLayout({ matiere, transverse = false }: Props) {
  const { slug } = useParams<{ slug: string }>();
  const info = MATIERES[matiere];
  const trouve = transverse ? chapitreMethodes(matiere) : slug ? getChapitre(slug) : undefined;
  const chapitre = trouve && trouve.meta.matiere === matiere ? trouve : undefined;
  const ouvrirChapitre = storeProgression(matiere)((s) => s.ouvrirChapitre);

  useEffect(() => {
    if (chapitre && !chapitre.meta.transverse) ouvrirChapitre(chapitre.meta.slug);
  }, [chapitre, ouvrirChapitre]);

  if (!chapitre) return <Navigate to={info.chemin} replace />;
  // Le transverse n'a qu'une adresse : `/methodes`.
  if (!transverse && chapitre.meta.transverse) return <Navigate to={cheminChapitre(chapitre.meta)} replace />;

  const domaine = info.domaines.find((d) => d.id === chapitre.meta.domaine)?.label;
  const contexte: ContexteChapitre = { chapitre, matiere: info };

  return (
    <>
      <header className="bg-white px-4 pb-2 pt-5 dark:bg-slate-800 sm:px-6">
        <p
          className={`text-xs font-semibold uppercase tracking-wider ${
            info.accent === 'blue' ? 'text-blue-600 dark:text-blue-400' : 'text-violet-600 dark:text-violet-400'
          }`}
        >
          {chapitre.meta.transverse ? `${info.nom} · pour tous les chapitres` : `${info.nom} · ${domaine ?? ''}`}
        </p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
          {chapitre.meta.titre}
        </h1>
      </header>
      <SectionTabs accent={info.accent} label="Parties du chapitre" items={ongletsChapitre(chapitre)} />
      <Outlet context={contexte} />
    </>
  );
}
