import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { resolveBacSources } from '@/lib/bac-content';
import type { BacSource } from '@/lib/bac-types';
import { typographie } from '@/lib/typographie';

/**
 * Sources numérotées d'une page : les affirmations portent un appel [1], [2]…
 * qui renvoie à la liste des textes officiels en bas de page (ancre `#sources`).
 *
 * La page déclare ses sources une fois, dans l'ordre voulu, avec
 * `SourcesNumerotees` ; `Refs` et `ListeSources` lisent cette numérotation.
 * Les sources sont celles de `content/bac/sources.json` : un seul registre.
 */

type Accent = 'sky' | 'amber';

type Numerotation = {
  sources: readonly BacSource[];
  numeros: ReadonlyMap<string, number>;
  accent: Accent;
};

const NumerotationContext = createContext<Numerotation | null>(null);

const TEXTE: Record<Accent, string> = {
  sky: 'text-sky-700 dark:text-sky-400',
  amber: 'text-amber-700 dark:text-amber-400',
};

const SURVOL: Record<Accent, string> = {
  sky: 'hover:text-sky-700 dark:hover:text-sky-400',
  amber: 'hover:text-amber-700 dark:hover:text-amber-400',
};

/** Identifiants dédoublonnés, dans l'ordre de première apparition. */
export function ordreDesSources(...listes: readonly (readonly string[] | undefined)[]): string[] {
  const vus = new Set<string>();
  for (const liste of listes) for (const id of liste ?? []) vus.add(id);
  return [...vus];
}

type ProviderProps = {
  /** Les sources de la page, dans l'ordre de leur numéro. */
  ids: readonly string[];
  accent: Accent;
  children: ReactNode;
};

export function SourcesNumerotees({ ids, accent, children }: ProviderProps) {
  const valeur = useMemo<Numerotation>(() => {
    const parId = new Map(resolveBacSources(ids).map((s) => [s.id, s]));
    const sources = ids.flatMap((id) => {
      const s = parId.get(id);
      return s ? [s] : [];
    });
    return {
      sources,
      numeros: new Map(sources.map((s, index) => [s.id, index + 1])),
      accent,
    };
  }, [ids, accent]);
  return (
    <NumerotationContext.Provider value={valeur}>{children}</NumerotationContext.Provider>
  );
}

/** Appels de sources : renvoient à la liste numérotée en bas de page. */
export function Refs({ ids, className = '' }: { ids: readonly string[]; className?: string }) {
  const numerotation = useContext(NumerotationContext);
  if (!numerotation) return null;
  const appels = ids.flatMap((id) => {
    const numero = numerotation.numeros.get(id);
    return numero === undefined ? [] : [{ id, numero }];
  });
  if (appels.length === 0) return null;
  return (
    <span
      className={`whitespace-nowrap text-[0.7rem] font-medium ${TEXTE[numerotation.accent]} ${className}`}
    >
      {appels.map(({ id, numero }) => (
        <a key={id} href="#sources" className="ml-0.5 hover:underline">
          [{numero}]
        </a>
      ))}
    </span>
  );
}

/** La liste numérotée des textes officiels, à placer sous l'ancre `#sources`. */
export function ListeSources() {
  const numerotation = useContext(NumerotationContext);
  if (!numerotation || numerotation.sources.length === 0) return null;
  const { sources, accent } = numerotation;
  return (
    <ol className={`gap-x-10 text-sm ${sources.length > 3 ? 'lg:columns-2' : ''}`}>
      {sources.map((s, index) => (
        <li key={s.id} className="mb-3 flex break-inside-avoid gap-2">
          <span className={`font-semibold tabular-nums ${TEXTE[accent]}`}>[{index + 1}]</span>
          <span>
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className={`font-medium text-slate-800 underline decoration-slate-300 underline-offset-2 dark:text-slate-200 dark:decoration-slate-600 ${SURVOL[accent]}`}
            >
              {typographie(s.label)}
            </a>
            <span className="text-slate-500 dark:text-slate-400"> — {s.publisher}</span>
            {s.note && (
              <span className="block text-xs text-slate-500 dark:text-slate-400">
                {typographie(s.note)}
              </span>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}
