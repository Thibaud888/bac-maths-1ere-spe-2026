import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TextWithMath } from '@/components/math/TextWithMath';
import Essentiel from '@/components/shared/Essentiel';
import AnneauProgression from '@/components/terminale/AnneauProgression';
import EtiquettePriorite from '@/components/terminale/EtiquettePriorite';
import LienRenvoi from '@/components/terminale/LienRenvoi';
import PastilleEtat from '@/components/terminale/PastilleEtat';
import { getAnnales, notionParSegment, trierParPriorite } from '@/lib/terminale/content';
import { cheminChapitre, cheminNotion } from '@/lib/terminale/matieres';
import { etatsChapitre, maitriseChapitre } from '@/lib/terminale/progression';
import { storeProgression, useProgression } from '@/stores/terminale-progression-store';
import { useChapitre } from './ChapitreLayout';

const BOUTON_PLEIN = {
  blue: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-slate-950',
  violet: 'bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400 dark:text-slate-950',
} as const;

function pluriel(n: number, mot: string): string {
  return `${n} ${mot}${n > 1 ? 's' : ''}`;
}

const TITRE_SECTION =
  'text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400';

/**
 * Aperçu d'un chapitre (charte § 11, plan § 4.3) : l'essentiel en trois idées, où en
 * est l'élève, la carte des notions (les plus importantes pour le bac en tête), les
 * rappels utiles et les deux entrées « apprendre » et « réviser l'essentiel ».
 */
export default function ApercuPage() {
  const { chapitre, matiere } = useChapitre();
  const progression = useProgression(matiere.id);
  const derniere = storeProgression(matiere.id)((s) => s.derniereNotion[chapitre.meta.slug]);
  const etats = useMemo(() => etatsChapitre(chapitre, progression), [chapitre, progression]);
  const maitrise = maitriseChapitre(chapitre.notions, etats);

  const carte = trierParPriorite(chapitre.notions, (n) => n.priorite);
  const estimee = chapitre.notions.some((n) => n.priorisation === 'estimation');
  const reprise = derniere ? notionParSegment(chapitre, derniere) : undefined;
  const premiere = chapitre.notions[0];

  // Prérequis : chapitres de première, puis notions d'autres chapitres de terminale.
  const prerequis = [...new Set(chapitre.notions.flatMap((n) => n.prerequis))];
  const rappelsPremiere = prerequis.filter((p) => p.startsWith('1e:'));
  const autresChapitres = prerequis.filter(
    (p) => p.startsWith('n-') && !chapitre.notions.some((n) => n.id === p)
  );

  const nombre = (etat: string) => chapitre.notions.filter((n) => etats.get(n.id) === etat).length;
  const commence = chapitre.notions.some((n) => progression.lus[n.id]);

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-6 sm:px-8 sm:py-8">
      <div className="space-y-6">
        <p className="max-w-3xl text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
          <TextWithMath text={chapitre.meta.description} />
        </p>

        <Essentiel accent={matiere.accent}>
          <ol className="grid gap-4 sm:grid-cols-3 sm:gap-6">
            {chapitre.meta.essentiel.map((idee, index) => (
              <li key={index} className="flex gap-3 sm:block">
                <p
                  className={`text-2xl font-bold tabular-nums ${
                    matiere.accent === 'blue' ? 'text-blue-700 dark:text-blue-400' : 'text-violet-700 dark:text-violet-400'
                  }`}
                >
                  {index + 1}
                </p>
                <div className="text-sm leading-snug text-slate-800 dark:text-slate-200 sm:mt-1">
                  <TextWithMath text={idee} />
                </div>
              </li>
            ))}
          </ol>
        </Essentiel>

        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <AnneauProgression part={maitrise} accent={matiere.accent} taille={56} />
            <div className="text-sm">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {commence ? 'Où tu en es' : 'Pas encore commencé'}
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                {[
                  `${chapitre.notions.length} notions`,
                  pluriel(nombre('maitrisee'), 'maîtrisée'),
                  pluriel(nombre('comprise'), 'comprise'),
                  pluriel(nombre('decouverte'), 'découverte'),
                ].join(' · ')}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:ml-auto">
            {premiere && (
              <Link
                to={cheminNotion(chapitre, reprise ?? premiere)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${BOUTON_PLEIN[matiere.accent]}`}
              >
                {reprise ? 'Reprendre le cours' : 'Apprendre le chapitre'}
              </Link>
            )}
            <Link
              to={`${cheminChapitre(chapitre.meta)}/memo`}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Réviser l’essentiel
            </Link>
          </div>
        </div>
      </div>

      <section aria-labelledby="notions" className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="notions" className={TITRE_SECTION}>
            Les notions, les plus importantes au bac d’abord
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {estimee
              ? 'Priorités estimées, en attente du décompte des sujets de bac.'
              : `Priorités mesurées sur les sujets de bac depuis ${getAnnales(matiere.id)?.depuis ?? 2021}.`}
          </p>
        </div>
        <ul className="grid gap-3 md:grid-cols-2">
          {carte.map((notion) => {
            const numero = chapitre.notions.findIndex((n) => n.id === notion.id) + 1;
            return (
              <li key={notion.id}>
                <Link
                  to={cheminNotion(chapitre, notion)}
                  className="flex h-full flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-500"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <EtiquettePriorite priorite={notion.priorite} estimee={notion.priorisation === 'estimation'} />
                    <PastilleEtat etat={etats.get(notion.id) ?? 'a-decouvrir'} />
                  </div>
                  <p className="font-semibold leading-snug text-slate-900 dark:text-slate-100">
                    <span className="mr-1 text-slate-400 dark:text-slate-500">{numero}.</span>
                    <TextWithMath text={notion.titre} />
                  </p>
                  {notion.attendusBac.length > 0 && (
                    <div className="mt-auto border-t border-slate-100 pt-2 dark:border-slate-700">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
                        Ce que le bac demande
                      </p>
                      <ul className="mt-1 space-y-1">
                        {notion.attendusBac.slice(0, 2).map((formulation) => (
                          <li key={formulation} className="text-sm italic leading-snug text-slate-700 dark:text-slate-300">
                            « <TextWithMath text={formulation} /> »
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {(rappelsPremiere.length > 0 || autresChapitres.length > 0) && (
        <section aria-labelledby="rappels" className="space-y-3">
          <h2 id="rappels" className={TITRE_SECTION}>
            Ce qu’il faut savoir avant
          </h2>
          <ul className="space-y-1.5 text-sm">
            {rappelsPremiere.map((lien) => (
              <li key={lien} className="text-slate-700 dark:text-slate-300">
                Première :{' '}
                <LienRenvoi lien={lien} cheminCourant={cheminChapitre(chapitre.meta)} />
              </li>
            ))}
            {autresChapitres.map((lien) => (
              <li key={lien} className="text-slate-700 dark:text-slate-300">
                Terminale : <LienRenvoi lien={lien} cheminCourant={cheminChapitre(chapitre.meta)} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
