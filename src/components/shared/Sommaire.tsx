import { useEffect, useId, useState } from 'react';

export type SommaireEntree = { id: string; label: string };

export type Accent = 'sky' | 'amber';

type Props = {
  entries: readonly SommaireEntree[];
  /** Couleur des numéros et du survol : celle de la page. */
  accent: Accent;
  /**
   * `encadre` : un encadré en tête de page (téléphone, écran moyen).
   * `cote` : une colonne collée à droite sur grand écran, qui suit la lecture.
   */
  variante?: 'encadre' | 'cote';
};

const NUMERO: Record<Accent, string> = {
  sky: 'text-sky-700 dark:text-sky-400',
  amber: 'text-amber-700 dark:text-amber-400',
};

const SURVOL: Record<Accent, string> = {
  sky: 'group-hover:text-sky-700 dark:group-hover:text-sky-400',
  amber: 'group-hover:text-amber-700 dark:group-hover:text-amber-400',
};

const ACTIF: Record<Accent, string> = {
  sky: 'border-sky-600 font-semibold text-sky-800 dark:border-sky-400 dark:text-sky-300',
  amber: 'border-amber-500 font-semibold text-amber-800 dark:border-amber-400 dark:text-amber-300',
};

/** Distance au haut de la fenêtre (px) à partir de laquelle une section est « en lecture ». */
const SEUIL_LECTURE = 120;

/**
 * La section en cours de lecture : la dernière dont le titre est passé sous le
 * bandeau du haut. En bas de page, c'est la dernière section.
 */
function useSectionCourante(ids: readonly string[], actif: boolean): string | undefined {
  const cle = ids.join('|');
  const [courante, setCourante] = useState<string | undefined>(ids[0]);

  useEffect(() => {
    if (!actif) return;
    const liste = cle.split('|');
    let image = 0;
    const calculer = () => {
      image = 0;
      let trouvee = liste[0];
      for (const id of liste) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= SEUIL_LECTURE) trouvee = id;
      }
      const enBas =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (enBas && window.scrollY > 0) trouvee = liste[liste.length - 1];
      setCourante(trouvee);
    };
    const auDefilement = () => {
      if (!image) image = window.requestAnimationFrame(calculer);
    };
    calculer();
    window.addEventListener('scroll', auDefilement, { passive: true });
    window.addEventListener('resize', auDefilement);
    return () => {
      window.removeEventListener('scroll', auDefilement);
      window.removeEventListener('resize', auDefilement);
      if (image) window.cancelAnimationFrame(image);
    };
  }, [cle, actif]);

  return courante;
}

/**
 * Sommaire d'une longue page : une liste numérotée de liens vers les sections.
 * Partagé par « Le bac, mode d'emploi » et le grand oral.
 */
export default function Sommaire({ entries, accent, variante = 'encadre' }: Props) {
  const titre = useId();
  const cote = variante === 'cote';
  const courante = useSectionCourante(
    entries.map((e) => e.id),
    cote
  );

  if (cote) {
    return (
      <nav aria-labelledby={titre} className="text-sm">
        <p
          id={titre}
          className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400"
        >
          Sur cette page
        </p>
        <ol className="mt-3 border-l border-slate-200 dark:border-slate-700">
          {entries.map((entry, index) => {
            const actif = entry.id === courante;
            return (
              <li key={entry.id}>
                <a
                  href={`#${entry.id}`}
                  aria-current={actif ? 'location' : undefined}
                  className={`-ml-px flex gap-2 border-l-2 py-1 pl-3 leading-snug transition-colors ${
                    actif
                      ? ACTIF[accent]
                      : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:text-slate-200'
                  }`}
                >
                  <span className="w-4 shrink-0 text-right tabular-nums">{index + 1}.</span>
                  <span>{entry.label}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

  return (
    <nav
      aria-labelledby={titre}
      className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
    >
      <p
        id={titre}
        className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400"
      >
        Sommaire
      </p>
      <ol className="mt-2 gap-x-6 sm:columns-2">
        {entries.map((entry, index) => (
          <li key={entry.id} className="break-inside-avoid">
            <a href={`#${entry.id}`} className="group flex gap-2 py-0.5 text-sm">
              <span className={`w-5 shrink-0 text-right font-semibold tabular-nums ${NUMERO[accent]}`}>
                {index + 1}.
              </span>
              <span
                className={`text-slate-700 underline-offset-2 group-hover:underline dark:text-slate-300 ${SURVOL[accent]}`}
              >
                {entry.label}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
