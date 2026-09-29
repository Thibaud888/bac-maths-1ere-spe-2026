import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TextWithMath } from '@/components/math/TextWithMath';
import Essentiel from '@/components/shared/Essentiel';
import AnneauProgression from '@/components/terminale/AnneauProgression';
import EtiquettePriorite from '@/components/terminale/EtiquettePriorite';
import LienRenvoi from '@/components/terminale/LienRenvoi';
import PastilleEtat from '@/components/terminale/PastilleEtat';
import { getAnnales, notionParSegment } from '@/lib/terminale/content';
import { cheminChapitre, cheminNotion } from '@/lib/terminale/matieres';
import { etatsChapitre, maitriseChapitre, type EtatNotion } from '@/lib/terminale/progression';
import type { Notion } from '@/lib/terminale/types';
import { storeProgression, useProgression } from '@/stores/terminale-progression-store';
import { useChapitre } from './ChapitreLayout';

const BOUTON_PLEIN = {
  blue: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-slate-950',
  violet: 'bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400 dark:text-slate-950',
} as const;

const CHIFFRE = {
  blue: 'text-blue-700 dark:text-blue-400',
  violet: 'text-violet-700 dark:text-violet-400',
} as const;

/** Pastille numérotée d'une étape du parcours : sa couleur suit l'état de la notion. */
const ETAPE: Record<'blue' | 'violet', Record<EtatNotion, string>> = {
  blue: {
    'a-decouvrir': 'border-slate-300 bg-white text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300',
    decouverte: 'border-blue-500 bg-white text-blue-700 dark:border-blue-400 dark:bg-slate-800 dark:text-blue-300',
    comprise: 'border-blue-600 bg-blue-600 text-white dark:border-blue-400 dark:bg-blue-400 dark:text-slate-950',
    maitrisee: 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950',
  },
  violet: {
    'a-decouvrir': 'border-slate-300 bg-white text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300',
    decouverte: 'border-violet-500 bg-white text-violet-700 dark:border-violet-400 dark:bg-slate-800 dark:text-violet-300',
    comprise: 'border-violet-600 bg-violet-600 text-white dark:border-violet-400 dark:bg-violet-400 dark:text-slate-950',
    maitrisee: 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950',
  },
};

function pluriel(n: number, mot: string): string {
  return `${n} ${mot}${n > 1 ? 's' : ''}`;
}

const TITRE_SECTION = 'text-lg font-bold text-slate-900 dark:text-slate-100';
const PETIT_TITRE =
  'text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400';

/** La formulation de bac la plus courte : un exemple lisible d'un coup d'œil. */
function exempleBac(notion: Notion): string | undefined {
  return [...notion.attendusBac].sort((a, b) => a.length - b.length)[0];
}

/**
 * Aperçu d'un chapitre (charte § 11, plan § 4.3) : l'essentiel en trois idées titrées,
 * où en est l'élève, puis le parcours des notions dans l'ordre du cours (ce que chacune
 * apprend à faire, sa priorité au bac, un exemple de question), et les rappels utiles.
 * Retours de Thibaud du 2026-09-29 : pas de chiffre de fréquence par notion.
 */
export default function ApercuPage() {
  const { chapitre, matiere } = useChapitre();
  const progression = useProgression(matiere.id);
  const derniere = storeProgression(matiere.id)((s) => s.derniereNotion[chapitre.meta.slug]);
  const etats = useMemo(() => etatsChapitre(chapitre, progression), [chapitre, progression]);
  const maitrise = maitriseChapitre(chapitre.notions, etats);

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

        <Essentiel accent={matiere.accent} titre="L’essentiel : le chapitre en trois idées">
          <ol className="grid gap-5 sm:grid-cols-3 sm:gap-6">
            {chapitre.meta.essentiel.map((idee, index) => (
              <li key={idee.titre} className="flex gap-3 sm:block">
                <p className={`text-2xl font-bold tabular-nums ${CHIFFRE[matiere.accent]}`}>{index + 1}</p>
                <div className="space-y-1 sm:mt-1">
                  <p className="font-semibold leading-snug text-slate-900 dark:text-slate-100">
                    <TextWithMath text={idee.titre} />
                  </p>
                  <div className="text-sm leading-snug text-slate-700 dark:text-slate-300 [&_.katex-display]:overflow-x-auto">
                    <TextWithMath text={idee.texte} />
                  </div>
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

      <section aria-labelledby="notions" className="space-y-4">
        <div className="space-y-1">
          <h2 id="notions" className={TITRE_SECTION}>
            Les {chapitre.notions.length} notions, dans l’ordre du cours
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Les étoiles disent ce qui compte le plus au bac
            {estimee
              ? ' (priorités estimées, en attente du décompte des sujets de bac).'
              : ` (mesuré sur les sujets de bac depuis ${getAnnales(matiere.id)?.depuis ?? 2021}).`}
          </p>
        </div>
        <ol>
          {chapitre.notions.map((notion, index) => {
            const etat = etats.get(notion.id) ?? 'a-decouvrir';
            const exemple = exempleBac(notion);
            const fin = index === chapitre.notions.length - 1;
            return (
              <li key={notion.id} className="flex gap-3 sm:gap-4">
                <div className="flex flex-col items-center" aria-hidden="true">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold tabular-nums ${ETAPE[matiere.accent][etat]}`}
                  >
                    {index + 1}
                  </span>
                  {!fin && <span className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700" />}
                </div>
                <Link
                  to={cheminNotion(chapitre, notion)}
                  className={`min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-500 ${
                    fin ? '' : 'mb-3'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                    <p className="min-w-0 font-semibold leading-snug text-slate-900 dark:text-slate-100">
                      <span className="sr-only">Notion {index + 1} : </span>
                      <TextWithMath text={notion.titre} />
                    </p>
                    <span className="flex flex-wrap items-center gap-2">
                      <EtiquettePriorite priorite={notion.priorite} estimee={notion.priorisation === 'estimation'} />
                      {etat !== 'a-decouvrir' && <PastilleEtat etat={etat} />}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    <TextWithMath text={notion.resume} />
                  </p>
                  {exemple && (
                    <p className="mt-2 border-t border-slate-100 pt-2 text-sm leading-snug text-slate-600 dark:border-slate-700 dark:text-slate-400">
                      <span className="font-semibold not-italic">Au bac, par exemple : </span>
                      <span className="italic">
                        « <TextWithMath text={exemple} /> »
                      </span>
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {(rappelsPremiere.length > 0 || autresChapitres.length > 0) && (
        <section aria-labelledby="rappels" className="space-y-3">
          <h2 id="rappels" className={PETIT_TITRE}>
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
