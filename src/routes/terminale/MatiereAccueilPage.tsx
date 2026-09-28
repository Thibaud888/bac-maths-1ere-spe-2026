import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TextWithMath } from '@/components/math/TextWithMath';
import AnneauProgression from '@/components/terminale/AnneauProgression';
import { LIBELLE_PRIORITE } from '@/components/terminale/EtiquettePriorite';
import PastilleEtat from '@/components/terminale/PastilleEtat';
import { chapitreMethodes, getChapitre, listerChapitres } from '@/lib/terminale/content';
import { MATIERES, cheminChapitre, cheminNotion } from '@/lib/terminale/matieres';
import {
  aRevoir,
  chapitreCommence,
  etatsChapitre,
  maitriseChapitre,
} from '@/lib/terminale/progression';
import type { Chapitre, Matiere, Priorite } from '@/lib/terminale/types';
import { storeProgression, useProgression } from '@/stores/terminale-progression-store';
import PhysiqueChimiePage from './PhysiqueChimiePage';
import TerminaleMathsPage from './TerminaleMathsPage';

const TITRE_SECTION =
  'text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400';

const SURVOL = {
  blue: 'hover:border-blue-400 dark:hover:border-blue-500',
  violet: 'hover:border-violet-400 dark:hover:border-violet-500',
} as const;

/** « 2 incontournables · 1 fréquente » : le poids d'un chapitre au bac. */
function poidsAuBac(chapitre: Chapitre): string {
  const parties: string[] = [];
  for (const priorite of [3, 2, 1] as Priorite[]) {
    const n = chapitre.notions.filter((x) => x.priorite === priorite).length;
    if (n > 0) parties.push(`${n} ${LIBELLE_PRIORITE[priorite].toLowerCase()}${n > 1 ? 's' : ''}`);
  }
  return parties.join(' · ');
}

/**
 * Accueil d'une matière de terminale (plan § 4.2) : reprendre là où on s'est arrêté,
 * les incontournables à revoir, puis les chapitres dans l'ordre de l'année, groupés
 * par grand domaine. Tant qu'aucun chapitre n'est écrit, la page annonce ce qui vient.
 */
export default function MatiereAccueilPage({ matiere }: { matiere: Matiere }) {
  const info = MATIERES[matiere];
  const chapitres = useMemo(() => listerChapitres(matiere), [matiere]);
  const methodes = useMemo(() => chapitreMethodes(matiere), [matiere]);
  const progression = useProgression(matiere);
  const dernier = storeProgression(matiere)((s) => s.dernierChapitre);

  const maitrises = useMemo(
    () =>
      new Map(
        chapitres.map((c) => [c.meta.slug, maitriseChapitre(c.notions, etatsChapitre(c, progression))])
      ),
    [chapitres, progression]
  );
  const revoir = useMemo(() => aRevoir(chapitres, progression).slice(0, 5), [chapitres, progression]);

  if (chapitres.length === 0 && !methodes) {
    return matiere === 'maths' ? <TerminaleMathsPage /> : <PhysiqueChimiePage />;
  }

  const reprise = dernier ? getChapitre(dernier) : undefined;
  const repriseValide = reprise && reprise.meta.matiere === matiere ? reprise : undefined;

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-6 sm:px-8 sm:py-8">
      <header>
        <p
          className={`text-xs font-semibold uppercase tracking-wider ${
            info.accent === 'blue' ? 'text-blue-600 dark:text-blue-400' : 'text-violet-600 dark:text-violet-400'
          }`}
        >
          Terminale · spécialité
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{info.nom}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Chaque chapitre se suit de bout en bout : apprendre le cours notion par notion, s’entraîner, puis
          préparer l’épreuve. Les notions qui tombent le plus souvent au bac passent devant.
        </p>
      </header>

      {(repriseValide || revoir.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {repriseValide && (
            <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
              <h2 className={TITRE_SECTION}>Reprendre</h2>
              <Link
                to={cheminChapitre(repriseValide.meta)}
                className={`mt-3 flex items-center gap-4 rounded-lg border border-slate-200 p-3 transition-colors dark:border-slate-700 ${SURVOL[info.accent]}`}
              >
                <AnneauProgression part={maitrises.get(repriseValide.meta.slug) ?? 0} accent={info.accent} />
                <span className="font-semibold text-slate-900 dark:text-slate-100">{repriseValide.meta.titre}</span>
              </Link>
            </section>
          )}
          {revoir.length > 0 && (
            <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
              <h2 className={TITRE_SECTION}>À revoir en priorité</h2>
              <ul className="mt-3 space-y-2">
                {revoir.map(({ chapitre, notion, etat }) => (
                  <li key={notion.id}>
                    <Link
                      to={cheminNotion(chapitre, notion)}
                      className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm hover:underline"
                    >
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        <TextWithMath text={notion.titre} />
                      </span>
                      <PastilleEtat etat={etat} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {methodes && (
        <Link
          to={cheminChapitre(methodes.meta)}
          className={`block rounded-xl border border-slate-200 bg-white px-5 py-4 transition-colors dark:border-slate-700 dark:bg-slate-800 ${SURVOL[info.accent]}`}
        >
          <p className="font-semibold text-slate-900 dark:text-slate-100">Méthodes →</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            <TextWithMath text={methodes.meta.description} />
          </p>
        </Link>
      )}

      {info.domaines.map((domaine) => {
        const liste = chapitres.filter((c) => c.meta.domaine === domaine.id);
        if (liste.length === 0) return null;
        return (
          <section key={domaine.id} aria-label={domaine.label}>
            <h2 className={TITRE_SECTION}>{domaine.label}</h2>
            <ul className="mt-3 grid gap-3 md:grid-cols-2">
              {liste.map((chapitre) => {
                const commence = chapitreCommence(chapitre, progression);
                return (
                  <li key={chapitre.meta.slug}>
                    <Link
                      to={cheminChapitre(chapitre.meta)}
                      className={`flex h-full items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-colors dark:border-slate-700 dark:bg-slate-800 ${SURVOL[info.accent]}`}
                    >
                      <AnneauProgression part={maitrises.get(chapitre.meta.slug) ?? 0} accent={info.accent} />
                      <span className="min-w-0 flex-1 space-y-1">
                        <span className="block font-semibold leading-snug text-slate-900 dark:text-slate-100">
                          {chapitre.meta.titre}
                        </span>
                        <span className="block text-sm leading-snug text-slate-600 dark:text-slate-400">
                          {poidsAuBac(chapitre)}
                          {chapitre.notions.some((n) => n.priorisation === 'estimation') ? ' (estimé)' : ''}
                        </span>
                        {!commence && (
                          <span className="block text-xs text-slate-500 dark:text-slate-400">Pas encore commencé</span>
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
