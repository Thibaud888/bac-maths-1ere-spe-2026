import type { ReactNode } from 'react';
import Sommaire, { type Accent, type SommaireEntree } from '@/components/shared/Sommaire';

type PageProps = {
  accent: Accent;
  sommaire: readonly SommaireEntree[];
  /** Titre de la page et « L'essentiel » : ce qui se lit avant le sommaire. */
  entete: ReactNode;
  children: ReactNode;
};

/**
 * Gabarit des longues pages de lecture (« Le bac, mode d'emploi », grand oral).
 *
 * Sur grand écran, le sommaire quitte le haut de la page pour une colonne collée
 * à droite, qui reste visible et montre la section en cours de lecture. En
 * dessous, il reste un encadré après l'en-tête.
 */
export default function PageLongue({ accent, sommaire, entete, children }: PageProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_12.5rem] xl:gap-12">
        <div className="min-w-0 space-y-12">
          <div className="space-y-6">
            {entete}
            <div className="xl:hidden">
              <Sommaire entries={sommaire} accent={accent} />
            </div>
          </div>
          {children}
        </div>
        <aside className="hidden xl:block">
          <div className="sticky top-20 pt-2">
            <Sommaire entries={sommaire} accent={accent} variante="cote" />
          </div>
        </aside>
      </div>
    </div>
  );
}

const PASTILLE: Record<Accent, string> = {
  sky: 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300',
};

type SectionProps = {
  id: string;
  /** Numéro de la section dans le sommaire. */
  numero?: number | undefined;
  titre: string;
  /** Une phrase sous le titre, qui dit ce que la section apprend. */
  chapeau?: ReactNode;
  accent: Accent;
  children: ReactNode;
};

/** Une section numérotée comme dans le sommaire. */
export function SectionPage({ id, numero, titre, chapeau, accent, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-5 flex items-start gap-3 border-b border-slate-200 pb-3 dark:border-slate-700">
        {numero !== undefined && (
          <span
            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm font-bold tabular-nums ${PASTILLE[accent]}`}
            aria-hidden="true"
          >
            {numero}
          </span>
        )}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {titre}
          </h2>
          {chapeau && (
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {chapeau}
            </p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}
