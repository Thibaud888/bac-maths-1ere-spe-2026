import {
  FICHE_GRILLE_ID,
  fichesOfSection,
  grandOralJalon,
  listGrandOralCriteres,
  listGrandOralTemps,
  minutesDevantJury,
  minutesPreparation,
} from '@/lib/grand-oral-content';
import BarreDuTemps from '@/components/grand-oral/BarreDuTemps';
import DerouleFrise from '@/components/grand-oral/DerouleFrise';
import FicheGrandOral from '@/components/grand-oral/FicheGrandOral';
import GrandOralIntro from '@/components/grand-oral/GrandOralIntro';
import SectionSources from '@/components/grand-oral/SectionSources';
import Essentiel, { Chiffre, Chiffres } from '@/components/shared/Essentiel';
import PageLongue, { SectionPage } from '@/components/shared/PageLongue';
import { SourcesNumerotees, ordreDesSources } from '@/components/shared/Sources';
import { typographie } from '@/lib/typographie';

/** « Du lundi… » → « du lundi… », après les deux-points. */
function minuscule(texte: string): string {
  return texte.charAt(0).toLowerCase() + texte.slice(1);
}

function CriteresJury() {
  return (
    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
      {listGrandOralCriteres().map((c, index) => (
        <li
          key={c.id}
          className="flex items-center gap-2.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200"
        >
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[0.65rem] font-bold tabular-nums text-amber-800 dark:bg-amber-950/70 dark:text-amber-300"
            aria-hidden="true"
          >
            {index + 1}
          </span>
          {typographie(c.label)}
        </li>
      ))}
    </ul>
  );
}

export default function EpreuvePage() {
  const jalon = grandOralJalon();
  const temps = listGrandOralTemps();
  const fiches = fichesOfSection('epreuve');
  const faceAuJury = temps.filter((t) => t.devantJury && t.minutes !== undefined);
  // Les textes sur lesquels s'appuie la page, listés en bas seulement : ici,
  // pas d'appels [n] dans le corps (ils renvoyaient presque tous au même texte).
  const sources = ordreDesSources(
    jalon?.sources,
    ...temps.map((t) => t.sources),
    ...fiches.map((f) => f.sources)
  );
  const sommaire = [
    { id: 'deroule', label: 'Le déroulé' },
    ...fiches.map((f) => ({ id: f.id, label: typographie(f.title) })),
    { id: 'sources', label: 'Les sources' },
  ];

  const entete = (
    <>
      <GrandOralIntro title="L’épreuve" />
      <Essentiel accent="amber">
        <Chiffres>
          <Chiffre accent="amber" valeur="2">
            questions préparées dans l’année&nbsp;; le jury en choisit une.
          </Chiffre>
          <Chiffre accent="amber" valeur={`${minutesPreparation()} min`}>
            de préparation, pour mettre tes idées en ordre.
          </Chiffre>
          <Chiffre accent="amber" valeur={`${minutesDevantJury()} min`}>
            face au jury&nbsp;:{' '}
            {faceAuJury
              .map((t) => typographie(`${minuscule(t.titre)} (${t.minutes} min)`))
              .join(', puis ')}
            .
          </Chiffre>
        </Chiffres>
        <BarreDuTemps temps={temps} />
        {jalon && (
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-semibold">Quand&nbsp;:</span> {typographie(minuscule(jalon.quand))}
            &nbsp;; la date exacte est donnée par le lycée.
          </p>
        )}
      </Essentiel>
    </>
  );

  return (
    <SourcesNumerotees ids={sources} accent="amber">
      <PageLongue accent="amber" sommaire={sommaire} entete={entete}>
        <SectionPage
          id="deroule"
          numero={1}
          titre="Le déroulé"
          accent="amber"
          chapeau="Étape par étape, de ton arrivée à la fin de l’échange."
        >
          <DerouleFrise temps={temps} />
        </SectionPage>

        <section aria-labelledby="regles" className="space-y-4">
          <h2
            id="regles"
            className="border-b border-slate-200 pb-3 text-xl font-bold tracking-tight text-slate-900 dark:border-slate-700 dark:text-slate-100"
          >
            Ce que dit le texte
          </h2>
          {fiches.map((fiche, index) => (
            <FicheGrandOral key={fiche.id} fiche={fiche} numero={index + 2} appels={false}>
              {fiche.id === FICHE_GRILLE_ID && <CriteresJury />}
            </FicheGrandOral>
          ))}
        </section>

        <SectionSources numero={fiches.length + 2} />
      </PageLongue>
    </SourcesNumerotees>
  );
}
