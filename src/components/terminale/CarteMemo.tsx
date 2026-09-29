import { TextWithMath } from '@/components/math/TextWithMath';
import EtiquettePriorite from '@/components/terminale/EtiquettePriorite';
import type { CarteMemo as Carte, Notion } from '@/lib/terminale/types';

const GENRE: Record<Carte['genre'], string> = {
  definition: 'Définition',
  propriete: 'Propriété',
  formule: 'Formule',
  methode: 'Méthode',
};

/** Une couleur par genre de carte : on repère d'un coup d'œil une formule, une méthode… */
const COULEUR: Record<Carte['genre'], { carte: string; puce: string; coeur: string }> = {
  definition: {
    carte: 'border-sky-200 border-t-sky-500 from-sky-100 dark:border-sky-900 dark:border-t-sky-400 dark:from-sky-950/50',
    puce: 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200',
    coeur: 'ring-sky-200 dark:ring-sky-800',
  },
  propriete: {
    carte:
      'border-emerald-200 border-t-emerald-500 from-emerald-100 dark:border-emerald-900 dark:border-t-emerald-400 dark:from-emerald-950/50',
    puce: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200',
    coeur: 'ring-emerald-200 dark:ring-emerald-800',
  },
  formule: {
    carte:
      'border-violet-200 border-t-violet-500 from-violet-100 dark:border-violet-900 dark:border-t-violet-400 dark:from-violet-950/50',
    puce: 'bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-200',
    coeur: 'ring-violet-200 dark:ring-violet-800',
  },
  methode: {
    carte:
      'border-amber-200 border-t-amber-500 from-amber-100 dark:border-amber-900 dark:border-t-amber-400 dark:from-amber-950/50',
    puce: 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200',
    coeur: 'ring-amber-200 dark:ring-amber-800',
  },
};

type Props = {
  carte: Carte;
  notion: Notion | undefined;
  /** `simplifie` : le cœur de la carte, son moyen mnémotechnique et son image mentale (texte). */
  mode: 'detaille' | 'simplifie';
};

/** Une carte du mémo (charte § 8) : la règle nue, ses conditions, un exemple. */
export default function CarteMemo({ carte, notion, mode }: Props) {
  const image = carte.simplifie.image;
  const couleur = COULEUR[carte.genre];
  return (
    <article
      className={`flex h-full flex-col gap-3 rounded-xl border border-t-4 bg-gradient-to-br to-white p-4 shadow-sm dark:to-slate-800 ${couleur.carte}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] ${couleur.puce}`}
        >
          {GENRE[carte.genre]}
        </span>
        {notion && (
          <EtiquettePriorite priorite={notion.priorite} estimee={notion.priorisation === 'estimation'} forme="courte" />
        )}
      </div>
      <h3 className="font-bold leading-snug text-slate-900 dark:text-slate-100">
        <TextWithMath text={carte.titre} />
      </h3>

      {mode === 'simplifie' ? (
        <div className="space-y-3">
          <div
            className={`rounded-lg bg-white/80 px-3 py-3 text-center text-[15px] font-medium text-slate-900 ring-1 dark:bg-slate-900/60 dark:text-slate-100 [&_.katex-display]:overflow-x-auto ${couleur.coeur}`}
          >
            <TextWithMath text={carte.simplifie.coeur} />
          </div>
          {carte.simplifie.moyenMemo && (
            <p className="text-sm italic leading-snug text-slate-600 dark:text-slate-400">
              <TextWithMath text={carte.simplifie.moyenMemo} />
            </p>
          )}
          {image && (
            <p className="rounded-lg border border-dashed border-slate-300 bg-white/60 px-3 py-2 text-sm leading-snug text-slate-700 dark:border-slate-600 dark:bg-slate-900/30 dark:text-slate-300">
              <span className="font-semibold">Image : </span>
              <TextWithMath text={image} />
            </p>
          )}
          {carte.simplifie.motCle && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mot-clé : <span className="font-semibold">{carte.simplifie.motCle}</span>
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2 text-sm leading-relaxed text-slate-800 dark:text-slate-200 [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden">
          <TextWithMath text={carte.enonce} />
          {carte.conditions && (
            <p className="text-slate-600 dark:text-slate-400">
              <span className="font-semibold">Conditions : </span>
              <TextWithMath text={carte.conditions} />
            </p>
          )}
          {carte.exemple && (
            <p className="text-slate-600 dark:text-slate-400">
              <span className="font-semibold">Exemple : </span>
              <TextWithMath text={carte.exemple} />
            </p>
          )}
        </div>
      )}
    </article>
  );
}
