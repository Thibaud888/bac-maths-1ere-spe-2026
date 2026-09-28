import { TextWithMath } from '@/components/math/TextWithMath';
import EtiquettePriorite from '@/components/terminale/EtiquettePriorite';
import type { CarteMemo as Carte, Notion } from '@/lib/terminale/types';

const GENRE: Record<Carte['genre'], string> = {
  definition: 'Définition',
  propriete: 'Propriété',
  formule: 'Formule',
  methode: 'Méthode',
};

type Props = {
  carte: Carte;
  notion: Notion | undefined;
  /** `simplifie` : le cœur de la carte seul, comme le mode simplifié de la première. */
  mode: 'detaille' | 'simplifie';
};

/** Une carte du mémo (charte § 8) : la règle nue, ses conditions, un exemple. */
export default function CarteMemo({ carte, notion, mode }: Props) {
  const image = carte.simplifie.image;
  return (
    <article className="flex h-full flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
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
          <div className="rounded-lg bg-slate-50 px-3 py-3 text-center text-[15px] font-medium text-slate-900 dark:bg-slate-900/50 dark:text-slate-100 [&_.katex-display]:overflow-x-auto">
            <TextWithMath text={carte.simplifie.coeur} />
          </div>
          {carte.simplifie.moyenMemo && (
            <p className="text-sm italic leading-snug text-slate-600 dark:text-slate-400">
              <TextWithMath text={carte.simplifie.moyenMemo} />
            </p>
          )}
          {image && (
            <img
              src={`${import.meta.env.BASE_URL}figures/${image}`}
              alt=""
              className="mx-auto max-h-40 max-w-full dark:[filter:invert(1)_hue-rotate(180deg)]"
            />
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
