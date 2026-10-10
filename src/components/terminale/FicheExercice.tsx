import { TextWithMath } from '@/components/math/TextWithMath';
import EtiquettePriorite from '@/components/terminale/EtiquettePriorite';
import { getAnnales, getNotion } from '@/lib/terminale/content';
import type { Matiere, SourceExercice } from '@/lib/terminale/types';

/** Durée, calculatrice : ce que l'élève doit savoir avant de commencer. */
export function Reperes({ duree, calculatrice, points }: { duree: number; calculatrice: boolean; points?: number }) {
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
      {points !== undefined && (
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {String(points).replace('.', ',')} points
        </span>
      )}
      <span>≈ {duree} min</span>
      <span>{calculatrice ? 'Calculatrice utile' : 'Sans calculatrice'}</span>
    </span>
  );
}

/** Les notions travaillées, avec leur étiquette de priorité. */
export function NotionsTravaillees({ notions }: { notions: readonly string[] }) {
  return (
    <span className="flex flex-wrap items-center gap-2">
      {notions.map((id) => {
        const notion = getNotion(id);
        if (!notion) return null;
        return (
          <span key={id} className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <EtiquettePriorite priorite={notion.priorite} estimee={notion.priorisation === 'estimation'} forme="courte" />
            <TextWithMath text={notion.titre} />
          </span>
        );
      })}
    </span>
  );
}

/** « D'après : … » quand l'exercice adapte un vrai sujet (charte § 3.7). */
export function SourceDeLExercice({ source, matiere }: { source: SourceExercice; matiere: Matiere }) {
  const sujet = source.annale ? getAnnales(matiere)?.sujets.find((s) => s.id === source.annale) : undefined;
  const url = sujet?.url ?? source.url;
  const libelle = sujet ? `${sujet.lieu}, ${sujet.annee}` : 'un sujet de bac';
  return (
    <p className="text-xs text-slate-500 dark:text-slate-400">
      D’après{' '}
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-slate-700 dark:hover:text-slate-200">
          {libelle}
        </a>
      ) : (
        libelle
      )}{' '}
      (<TextWithMath text={source.adaptation} />)
    </p>
  );
}

const DEJA = {
  reussi: { libelle: 'Déjà réussie', style: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300' },
  moitie: { libelle: 'Déjà faite à moitié', style: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300' },
  rate: { libelle: 'Déjà tentée', style: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
} as const;

/** Une question à réponse vérifiée, déjà répondue lors d'une visite précédente. */
export function DejaRepondue({ resultat }: { resultat: 'reussi' | 'moitie' | 'rate' }) {
  const { libelle, style } = DEJA[resultat];
  return (
    <p>
      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${style}`}>{libelle}</span>
    </p>
  );
}
