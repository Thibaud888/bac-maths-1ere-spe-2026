import { fichesOfSection } from '@/lib/grand-oral-content';
import FicheGrandOral from '@/components/grand-oral/FicheGrandOral';
import GrandOralIntro from '@/components/grand-oral/GrandOralIntro';
import SectionSources from '@/components/grand-oral/SectionSources';
import Sommaire from '@/components/shared/Sommaire';
import { SourcesNumerotees, ordreDesSources } from '@/components/shared/Sources';

export default function PreparationPage() {
  const fiches = fichesOfSection('preparation');
  const sources = ordreDesSources(...fiches.map((f) => f.sources));

  return (
    <SourcesNumerotees ids={sources} accent="amber">
      <div className="mx-auto max-w-3xl space-y-8 p-4 sm:p-8">
        <GrandOralIntro title="Préparation" />

        <Sommaire
          accent="amber"
          entries={[
            ...fiches.map((f) => ({ id: f.id, label: f.title })),
            ...(sources.length > 0 ? [{ id: 'sources', label: 'Les sources' }] : []),
          ]}
        />

        <div className="space-y-4">
          {fiches.map((fiche) => (
            <FicheGrandOral key={fiche.id} fiche={fiche} />
          ))}
        </div>

        {sources.length > 0 && <SectionSources />}
      </div>
    </SourcesNumerotees>
  );
}
