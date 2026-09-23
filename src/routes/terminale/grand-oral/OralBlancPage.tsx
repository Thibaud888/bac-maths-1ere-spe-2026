import { listGrandOralCriteres, listGrandOralTemps } from '@/lib/grand-oral-content';
import GrandOralIntro from '@/components/grand-oral/GrandOralIntro';
import Historique from '@/components/grand-oral/Historique';
import OralBlanc from '@/components/grand-oral/OralBlanc';
import SectionSources from '@/components/grand-oral/SectionSources';
import { SourcesNumerotees, ordreDesSources } from '@/components/shared/Sources';

/** Les temps de l'épreuve, puis la grille d'auto-évaluation : ce que l'oral blanc cite. */
const SOURCES = ordreDesSources(
  ...listGrandOralTemps().map((t) => t.sources),
  listGrandOralCriteres()[0]?.sources
);

export default function OralBlancPage() {
  return (
    <SourcesNumerotees ids={SOURCES} accent="amber">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
        {/* Même bord gauche que les autres onglets ; l'outil garde une largeur de lecture. */}
        <div className="max-w-3xl space-y-8">
          <GrandOralIntro title="Oral blanc" />
          <OralBlanc />
          <Historique />
          <SectionSources />
        </div>
      </div>
    </SourcesNumerotees>
  );
}
