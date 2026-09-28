import type { InfoMatiere } from '@/lib/terminale/matieres';

const TRAIT: Record<InfoMatiere['accent'], string> = {
  blue: 'stroke-blue-500 dark:stroke-blue-400',
  violet: 'stroke-violet-500 dark:stroke-violet-400',
};

type Props = {
  /** Entre 0 et 1. */
  part: number;
  accent: InfoMatiere['accent'];
  taille?: number;
};

/** Anneau de maîtrise d'un chapitre, pourcentage au centre. */
export default function AnneauProgression({ part, accent, taille = 44 }: Props) {
  const pourcent = Math.round(Math.max(0, Math.min(1, part)) * 100);
  const rayon = 16;
  const tour = 2 * Math.PI * rayon;
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: taille, height: taille }}
      role="img"
      aria-label={`Maîtrisé à ${pourcent} %`}
    >
      <svg viewBox="0 0 40 40" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="20" cy="20" r={rayon} fill="none" strokeWidth="4" className="stroke-slate-200 dark:stroke-slate-700" />
        <circle
          cx="20"
          cy="20"
          r={rayon}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={tour}
          strokeDashoffset={tour * (1 - pourcent / 100)}
          className={pourcent === 0 ? 'stroke-transparent' : TRAIT[accent]}
        />
      </svg>
      <span className="absolute text-[10px] font-semibold tabular-nums text-slate-700 dark:text-slate-300" aria-hidden="true">
        {pourcent} %
      </span>
    </span>
  );
}
