import {
  RELANCE_CATEGORIE_LABEL,
  RELANCE_CATEGORIE_ORDER,
  fichesOfSection,
  listGrandOralRelances,
} from '@/lib/grand-oral-content';
import FicheGrandOral from '@/components/grand-oral/FicheGrandOral';
import GrandOralIntro from '@/components/grand-oral/GrandOralIntro';
import RelanceCard from '@/components/grand-oral/RelanceCard';
import SectionSources from '@/components/grand-oral/SectionSources';
import Sommaire from '@/components/shared/Sommaire';
import { SourcesNumerotees, ordreDesSources } from '@/components/shared/Sources';

export default function EntretienPage() {
  const fiches = fichesOfSection('entretien');
  const relances = listGrandOralRelances();
  const sources = ordreDesSources(...fiches.map((f) => f.sources));

  return (
    <SourcesNumerotees ids={sources} accent="amber">
      <div className="mx-auto max-w-3xl space-y-8 p-4 sm:p-8">
        <GrandOralIntro title="Entretien" />

        <Sommaire
          accent="amber"
          entries={[
            ...fiches.map((f) => ({ id: f.id, label: f.title })),
            { id: 'relances', label: 'Les relances types' },
            ...(sources.length > 0 ? [{ id: 'sources', label: 'Les sources' }] : []),
          ]}
        />

        <div className="space-y-4">
          {fiches.map((fiche) => (
            <FicheGrandOral key={fiche.id} fiche={fiche} />
          ))}
        </div>

        <section id="relances" className="scroll-mt-20 space-y-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Les relances types
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Réponds à voix haute avant d’ouvrir les pistes.
            </p>
          </div>
          {RELANCE_CATEGORIE_ORDER.map((categorie) => {
            const dansCategorie = relances.filter((r) => r.categorie === categorie);
            if (dansCategorie.length === 0) return null;
            return (
              <div key={categorie} className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {RELANCE_CATEGORIE_LABEL[categorie]}
                </h3>
                <div className="space-y-2">
                  {dansCategorie.map((r) => (
                    <RelanceCard key={r.id} relance={r} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {sources.length > 0 && <SectionSources />}
      </div>
    </SourcesNumerotees>
  );
}
