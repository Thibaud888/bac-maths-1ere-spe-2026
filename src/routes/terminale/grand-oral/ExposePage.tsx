import { Link } from 'react-router-dom';
import { TEMPS_ID, fichesOfSection, listGrandOralTemps } from '@/lib/grand-oral-content';
import FicheGrandOral from '@/components/grand-oral/FicheGrandOral';
import GrandOralIntro from '@/components/grand-oral/GrandOralIntro';
import SectionSources from '@/components/grand-oral/SectionSources';
import Essentiel, { Point, Points } from '@/components/shared/Essentiel';
import PageLongue, { SectionPage } from '@/components/shared/PageLongue';
import { Refs, SourcesNumerotees, ordreDesSources } from '@/components/shared/Sources';
import type { GrandOralTemps } from '@/lib/grand-oral-types';
import { typographie } from '@/lib/typographie';

/** Les trois idées à retenir, chacune tirée d'une fiche de la page. */
const ESSENTIEL = [
  {
    fiche: 'go-exp-ouverture',
    titre: 'Démarrer sur ton choix',
    texte: 'Explique pourquoi tu as choisi la question, puis pose-la et annonce ton plan.',
  },
  {
    fiche: 'go-exp-fil',
    titre: 'Garder le fil',
    texte: 'Annonce chaque partie et relie-la à la question : c’est ton argumentation qui est évaluée.',
  },
  {
    fiche: 'go-exp-temps',
    titre: 'Tenir le temps',
    texte: 'Un repère à mi-parcours, une partie qu’on peut raccourcir, une conclusion jamais sacrifiée.',
  },
] as const;

/** Ce qui se prépare ailleurs et sert pendant l'exposé : on y renvoie plutôt que de le répéter. */
const A_RELIRE = [
  { vers: '/terminale/grand-oral/preparation#go-prep-plan', label: 'Construire le plan' },
  { vers: '/terminale/grand-oral/preparation#go-prep-support', label: 'Le support' },
  { vers: '/terminale/grand-oral/preparation#go-prep-voix', label: 'La voix et le corps' },
  { vers: '/terminale/grand-oral/oral-blanc', label: 'Oral blanc : s’entraîner en temps réel' },
] as const;

/** L'étape « exposé » du déroulé officiel : sa durée et ses règles, lues dans `deroule.json`. */
function TempsOfficiel({ temps }: { temps: GrandOralTemps }) {
  return (
    <div className="grid gap-4 rounded-xl border border-l-4 border-slate-200 border-l-amber-400 bg-white p-5 shadow-sm dark:border-slate-700 dark:border-l-amber-500 dark:bg-slate-800 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-6 sm:p-6">
      <div className="sm:text-right">
        <p className="text-3xl font-bold tabular-nums tracking-tight text-amber-700 dark:text-amber-400">
          {temps.minutes !== undefined ? `${temps.minutes} min` : '—'}
        </p>
        {temps.devantJury && (
          <p className="text-[0.65rem] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            face au jury
          </p>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {typographie(temps.titre)}
          <Refs ids={temps.sources} className="ml-1 align-super" />
        </h3>
        <p className="mt-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
          Texte officiel
        </p>
        <p className="mt-3 max-w-prose text-[0.95rem] leading-relaxed text-slate-700 dark:text-slate-300">
          {typographie(temps.resume)}
        </p>
      </div>
    </div>
  );
}

export default function ExposePage() {
  const temps = listGrandOralTemps().find((t) => t.id === TEMPS_ID.expose);
  const fiches = fichesOfSection('expose');
  const regles = fiches.filter((f) => f.nature === 'reglementaire');
  const methode = fiches.filter((f) => f.nature !== 'reglementaire');
  const sources = ordreDesSources(temps?.sources, ...fiches.map((f) => f.sources));
  const ids = new Set(fiches.map((f) => f.id));
  const sommaire = [
    { id: 'texte', label: 'Ce que dit le texte' },
    ...methode.map((f) => ({ id: f.id, label: typographie(f.title) })),
    { id: 'a-relire', label: 'À relire dans les autres onglets' },
    ...(sources.length > 0 ? [{ id: 'sources', label: 'Les sources' }] : []),
  ];

  const entete = (
    <>
      <GrandOralIntro title="Exposé" />
      <Essentiel accent="amber">
        <Points>
          {ESSENTIEL.filter((p) => ids.has(p.fiche)).map((p, index) => (
            <Point key={p.fiche} numero={index + 1} titre={p.titre} vers={p.fiche} accent="amber">
              {typographie(p.texte)}
            </Point>
          ))}
        </Points>
      </Essentiel>
    </>
  );

  return (
    <SourcesNumerotees ids={sources} accent="amber">
      <PageLongue accent="amber" sommaire={sommaire} entete={entete}>
        <SectionPage
          id="texte"
          numero={1}
          titre="Ce que dit le texte"
          accent="amber"
          chapeau="La durée, la position et ce qu’on attend de toi : les règles de l’exposé."
        >
          <div className="space-y-5">
            {temps && <TempsOfficiel temps={temps} />}
            {regles.map((fiche) => (
              <FicheGrandOral key={fiche.id} fiche={fiche} />
            ))}
          </div>
        </SectionPage>

        <div className="space-y-5">
          {methode.map((fiche, index) => (
            <FicheGrandOral key={fiche.id} fiche={fiche} numero={index + 2} />
          ))}
        </div>

        <SectionPage
          id="a-relire"
          numero={methode.length + 2}
          titre="À relire dans les autres onglets"
          accent="amber"
          chapeau="Ce qui se prépare avant le jour J et sert pendant l’exposé."
        >
          <ul className="grid gap-3 sm:grid-cols-2">
            {A_RELIRE.map((lien) => (
              <li key={lien.vers}>
                <Link
                  to={lien.vers}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 transition-colors hover:border-amber-400 hover:text-amber-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-amber-500 dark:hover:text-amber-300"
                >
                  {typographie(lien.label)}
                  <span aria-hidden="true" className="text-amber-600 dark:text-amber-400">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </SectionPage>

        {sources.length > 0 && <SectionSources numero={methode.length + 3} />}
      </PageLongue>
    </SourcesNumerotees>
  );
}
