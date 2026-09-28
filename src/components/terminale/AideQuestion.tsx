import { useState } from 'react';
import { TextWithMath } from '@/components/math/TextWithMath';
import LienRenvoi from '@/components/terminale/LienRenvoi';
import type { Resultat } from '@/lib/terminale/progression';

const BOUTON =
  'rounded-md border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40';

type Props = {
  indices?: readonly string[] | undefined;
  /** Bloc de cours à revoir (`l-…`), montré avec le premier indice et la solution. */
  revoir?: string | undefined;
  /** Absente quand la question se corrige d'elle-même (réponse vérifiable). */
  solution?: string | undefined;
  /** Type bac : ce qui rapporte les points. */
  attenduCorrecteur?: string | undefined;
  erreurFrequente?: string | undefined;
  /** Auto-évaluation proposée après la solution (réponse rédigée). */
  autoEvaluation?: boolean;
  resultat?: Resultat | undefined;
  onEvaluer?: (resultat: Resultat) => void;
};

const CHOIX: readonly { valeur: Resultat; libelle: string; style: string }[] = [
  {
    valeur: 'reussi',
    libelle: '✓ Réussi',
    style: 'border-emerald-300 text-emerald-800 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-950/40',
  },
  {
    valeur: 'moitie',
    libelle: '½ À moitié',
    style: 'border-amber-300 text-amber-800 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-950/40',
  },
  {
    valeur: 'rate',
    libelle: '✗ Raté',
    style: 'border-rose-300 text-rose-800 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-950/40',
  },
];

const LIBELLE_RESULTAT: Record<Resultat, string> = {
  reussi: 'Noté réussi.',
  moitie: 'Noté à moitié.',
  rate: 'Noté raté : à reprendre.',
};

/**
 * L'aide d'une question : indices progressifs (le premier renvoie au cours), puis la
 * solution rédigée, l'erreur fréquente, et pour une réponse rédigée l'auto-évaluation
 * (réussi, à moitié, raté — charte § 3.6).
 */
export default function AideQuestion({
  indices = [],
  revoir,
  solution,
  attenduCorrecteur,
  erreurFrequente,
  autoEvaluation = false,
  resultat,
  onEvaluer,
}: Props) {
  const [vus, setVus] = useState(0);
  const [solutionVue, setSolutionVue] = useState(false);
  const lienCours = revoir ? (
    <p className="text-sm">
      <span className="text-slate-600 dark:text-slate-400">Revoir le cours : </span>
      <LienRenvoi lien={revoir} cheminCourant="" />
    </p>
  ) : null;

  return (
    <div className="space-y-3">
      {vus > 0 && (
        <ol className="space-y-2">
          {indices.slice(0, vus).map((indice, index) => (
            <li
              key={index}
              className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-sm leading-relaxed text-slate-700 dark:border-amber-800 dark:bg-amber-950/20 dark:text-slate-300"
            >
              <span className="mr-2 font-semibold text-amber-700 dark:text-amber-400">Indice {index + 1}.</span>
              <TextWithMath text={indice} />
            </li>
          ))}
        </ol>
      )}
      {vus > 0 && !solutionVue && lienCours}

      <div className="flex flex-wrap gap-2">
        {vus < indices.length && !solutionVue && (
          <button
            type="button"
            onClick={() => {
              setVus((v) => v + 1);
            }}
            className={`${BOUTON} border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300 dark:hover:bg-amber-950/60`}
          >
            {indices.length === 1 ? 'Un indice' : `Indice ${vus + 1} sur ${indices.length}`}
          </button>
        )}
        {solution !== undefined && !solutionVue && (
          <button
            type="button"
            onClick={() => {
              setSolutionVue(true);
            }}
            className={`${BOUTON} border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700`}
          >
            {attenduCorrecteur ? 'Voir la correction' : 'Voir la solution'}
          </button>
        )}
      </div>

      {solution !== undefined && solutionVue && (
        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              Solution
            </p>
            <div className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-800 dark:text-slate-200 [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden">
              <TextWithMath text={solution} />
            </div>
          </div>
          {attenduCorrecteur && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                Ce qu’attend le correcteur
              </p>
              <div className="mt-1 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                <TextWithMath text={attenduCorrecteur} />
              </div>
            </div>
          )}
          {erreurFrequente && (
            <div className="rounded-md border border-rose-200 bg-rose-50/60 p-3 text-sm leading-relaxed text-slate-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-slate-300">
              <span className="font-semibold text-rose-700 dark:text-rose-300">Erreur fréquente : </span>
              <TextWithMath text={erreurFrequente} />
            </div>
          )}
          {lienCours}
          {autoEvaluation && (
            <div className="space-y-2 border-t border-slate-200 pt-3 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Compare avec ta réponse. Tu l’as :
              </p>
              <div className="flex flex-wrap gap-2">
                {CHOIX.map((choix) => (
                  <button
                    key={choix.valeur}
                    type="button"
                    aria-pressed={resultat === choix.valeur}
                    onClick={() => onEvaluer?.(choix.valeur)}
                    className={`${BOUTON} ${choix.style} ${resultat === choix.valeur ? 'ring-2 ring-offset-1 ring-slate-400 dark:ring-offset-slate-900' : ''}`}
                  >
                    {choix.libelle}
                  </button>
                ))}
              </div>
              {resultat && <p className="text-xs text-slate-500 dark:text-slate-400">{LIBELLE_RESULTAT[resultat]}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
