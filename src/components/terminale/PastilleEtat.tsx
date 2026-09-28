import { ETATS, LIBELLE_ETAT, type EtatNotion } from '@/lib/terminale/progression';

const TEXTE: Record<EtatNotion, string> = {
  'a-decouvrir': 'text-slate-500 dark:text-slate-400',
  decouverte: 'text-sky-700 dark:text-sky-300',
  comprise: 'text-blue-700 dark:text-blue-300',
  maitrisee: 'text-emerald-700 dark:text-emerald-300',
};

const PLEIN: Record<EtatNotion, string> = {
  'a-decouvrir': 'bg-slate-300 dark:bg-slate-600',
  decouverte: 'bg-sky-500',
  comprise: 'bg-blue-500',
  maitrisee: 'bg-emerald-500',
};

/**
 * État d'une notion pour l'élève : trois crans (découverte, comprise, maîtrisée)
 * et le mot, pour se lire sans la couleur.
 */
export default function PastilleEtat({ etat }: { etat: EtatNotion }) {
  const rang = ETATS.indexOf(etat);
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium ${TEXTE[etat]}`}>
      <span className="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3].map((cran) => (
          <span
            key={cran}
            className={`h-1.5 w-3 rounded-full ${cran <= rang ? PLEIN[etat] : 'bg-slate-200 dark:bg-slate-700'}`}
          />
        ))}
      </span>
      {LIBELLE_ETAT[etat]}
    </span>
  );
}
