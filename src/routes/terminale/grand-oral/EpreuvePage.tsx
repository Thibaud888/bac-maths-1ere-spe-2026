import type { ReactNode } from 'react';
import { totalCoefficients } from '@/lib/bac-content';
import {
  FICHE_GRILLE_ID,
  fichesOfSection,
  grandOralCoefficient,
  grandOralJalon,
  listGrandOralCriteres,
  listGrandOralTemps,
  minutesDevantJury,
  minutesPreparation,
} from '@/lib/grand-oral-content';
import DerouleFrise from '@/components/grand-oral/DerouleFrise';
import FicheGrandOral from '@/components/grand-oral/FicheGrandOral';
import GrandOralIntro from '@/components/grand-oral/GrandOralIntro';
import SectionSources from '@/components/grand-oral/SectionSources';
import Sommaire from '@/components/shared/Sommaire';
import { Refs, SourcesNumerotees, ordreDesSources } from '@/components/shared/Sources';

function Stat({
  value,
  label,
  sources,
}: {
  value: string;
  label: string;
  sources?: readonly string[];
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 text-center dark:border-slate-700 dark:bg-slate-800 sm:p-4">
      <p className="text-xl font-bold text-amber-700 dark:text-amber-400 sm:text-2xl">{value}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {label}
        {sources && <Refs ids={sources} />}
      </p>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 space-y-4">
      <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** « Du lundi… » → « du lundi… », après les deux-points. */
function minuscule(texte: string): string {
  return texte.charAt(0).toLowerCase() + texte.slice(1);
}

function CriteresJury() {
  return (
    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
      {listGrandOralCriteres().map((c) => (
        <li
          key={c.id}
          className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200"
        >
          {c.label}
        </li>
      ))}
    </ul>
  );
}

export default function EpreuvePage() {
  const coefficient = grandOralCoefficient();
  const jalon = grandOralJalon();
  const temps = listGrandOralTemps();
  const fiches = fichesOfSection('epreuve');
  // Numérotées dans l'ordre où la page les cite.
  const sources = ordreDesSources(
    coefficient?.sources,
    jalon?.sources,
    ...temps.map((t) => t.sources),
    ...fiches.map((f) => f.sources)
  );

  return (
    <SourcesNumerotees ids={sources} accent="amber">
      <div className="mx-auto max-w-3xl space-y-10 p-4 sm:p-8">
        <GrandOralIntro title="L’épreuve" />

        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {coefficient && (
              <Stat
                value={String(coefficient.coefficient)}
                label={`coefficient, sur ${totalCoefficients()}`}
                sources={coefficient.sources}
              />
            )}
            <Stat value={`${minutesDevantJury()} min`} label="face au jury" />
            <Stat value={`${minutesPreparation()} min`} label="de préparation" />
          </div>
          {jalon && (
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-semibold">Quand :</span> {minuscule(jalon.quand)} ; la
              date exacte est donnée par le lycée.
              <Refs ids={jalon.sources} />
            </p>
          )}
        </div>

        <Sommaire
          accent="amber"
          entries={[
            { id: 'deroule', label: 'Le déroulé' },
            ...fiches.map((f) => ({ id: f.id, label: f.title })),
            { id: 'sources', label: 'Les sources' },
          ]}
        />

        <Section id="deroule" title="Le déroulé">
          <DerouleFrise temps={temps} />
        </Section>

        <Section id="regles" title="Ce que dit le texte">
          <div className="space-y-4">
            {fiches.map((fiche) => (
              <FicheGrandOral key={fiche.id} fiche={fiche}>
                {fiche.id === FICHE_GRILLE_ID && <CriteresJury />}
              </FicheGrandOral>
            ))}
          </div>
        </Section>

        <SectionSources />
      </div>
    </SourcesNumerotees>
  );
}
