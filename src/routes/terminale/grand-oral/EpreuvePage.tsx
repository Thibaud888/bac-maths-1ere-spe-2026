import type { ReactNode } from 'react';
import { PRECISION_LABEL, totalCoefficients } from '@/lib/bac-content';
import {
  FICHE_GRILLE_ID,
  fichesOfSection,
  grandOralCoefficient,
  grandOralJalon,
  grandOralSources,
  listGrandOralCriteres,
  listGrandOralTemps,
  minutesDevantJury,
  minutesPreparation,
} from '@/lib/grand-oral-content';
import DerouleFrise from '@/components/grand-oral/DerouleFrise';
import FicheGrandOral from '@/components/grand-oral/FicheGrandOral';
import GrandOralIntro from '@/components/grand-oral/GrandOralIntro';
import Sommaire from '@/components/grand-oral/Sommaire';
import SourcesCitees from '@/components/grand-oral/SourcesCitees';

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 text-center dark:border-slate-700 dark:bg-slate-800 sm:p-4">
      <p className="text-xl font-bold text-amber-700 dark:text-amber-400 sm:text-2xl">{value}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 space-y-4">
      <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        {title}
      </h2>
      {children}
    </section>
  );
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
  const sources = grandOralSources();

  return (
    <div className="mx-auto max-w-3xl space-y-10 p-4 sm:p-8">
      <GrandOralIntro
        title="L’épreuve"
        lead="Ce qui se passe le jour J : le déroulé temps par temps, le jury, ce qui est autorisé et la façon dont la note est construite. Ce qui est marqué « Texte officiel » vient du Bulletin officiel ; les conseils sont signalés à part."
      />

      <div className="grid grid-cols-3 gap-3">
        {coefficient && (
          <Stat
            value={String(coefficient.coefficient)}
            label={`coefficient, sur ${totalCoefficients()}`}
          />
        )}
        <Stat value={`${minutesDevantJury()} min`} label="face au jury" />
        <Stat value={`${minutesPreparation()} min`} label="de préparation" />
      </div>

      {(coefficient || jalon) && (
        <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-slate-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-slate-300">
          {jalon && (
            <p>
              <span className="font-semibold">Quand.</span> {jalon.quand}.{' '}
              <span className="rounded bg-white/70 px-1.5 py-0.5 text-[0.65rem] uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                {PRECISION_LABEL[jalon.precision]}
              </span>{' '}
              {jalon.detail}
              <SourcesCitees ids={jalon.sources} className="mt-1" />
            </p>
          )}
          {coefficient && (
            <p>
              <span className="font-semibold">Combien.</span> {coefficient.coefficient}{' '}
              coefficients sur {totalCoefficients()}.{' '}
              {coefficient.comment}
              <SourcesCitees ids={coefficient.sources} className="mt-1" />
            </p>
          )}
        </div>
      )}

      <Sommaire
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

      <Section id="sources" title="Les sources">
        <ol className="space-y-2 text-sm">
          {sources.map((s) => (
            <li key={s.id}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-slate-800 underline decoration-slate-300 underline-offset-2 hover:text-amber-700 dark:text-slate-200 dark:decoration-slate-600 dark:hover:text-amber-400"
              >
                {s.label}
              </a>
              <span className="text-slate-500 dark:text-slate-400"> — {s.publisher}</span>
              {s.note && (
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  {s.note}
                </span>
              )}
            </li>
          ))}
        </ol>
        <p className="border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
          En cas de doute, c’est le texte officiel qui fait foi, jamais cette page.
        </p>
      </Section>
    </div>
  );
}
