import { fichesOfSection } from '@/lib/grand-oral-content';
import FicheGrandOral from '@/components/grand-oral/FicheGrandOral';
import GrandOralIntro from '@/components/grand-oral/GrandOralIntro';
import SectionSources from '@/components/grand-oral/SectionSources';
import Essentiel, { Point, Points } from '@/components/shared/Essentiel';
import PageLongue from '@/components/shared/PageLongue';
import { SourcesNumerotees, ordreDesSources } from '@/components/shared/Sources';
import { typographie } from '@/lib/typographie';

/** Les trois idées à retenir, chacune tirée d'une fiche de la page. */
const ESSENTIEL = [
  {
    fiche: 'go-prep-angle',
    titre: 'Une question, pas un thème',
    texte: 'Elle appelle une vraie réponse, porte un enjeu et tient en 10 minutes.',
  },
  {
    fiche: 'go-prep-plan',
    titre: 'Commencer par ton choix',
    texte: 'Explique d’abord pourquoi tu as choisi la question, puis développe-la et réponds-y.',
  },
  {
    fiche: 'go-prep-entrainement',
    titre: 'S’entraîner à voix haute',
    texte: 'Chronomètre-toi, et présente devant quelqu’un qui n’est pas scientifique.',
  },
] as const;

export default function PreparationPage() {
  const fiches = fichesOfSection('preparation');
  const sources = ordreDesSources(...fiches.map((f) => f.sources));
  const ids = new Set(fiches.map((f) => f.id));
  const sommaire = [
    ...fiches.map((f) => ({ id: f.id, label: typographie(f.title) })),
    ...(sources.length > 0 ? [{ id: 'sources', label: 'Les sources' }] : []),
  ];

  const entete = (
    <>
      <GrandOralIntro title="Préparation" />
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
        <div className="space-y-5">
          {fiches.map((fiche, index) => (
            <FicheGrandOral key={fiche.id} fiche={fiche} numero={index + 1} />
          ))}
        </div>
        {sources.length > 0 && <SectionSources numero={fiches.length + 1} />}
      </PageLongue>
    </SourcesNumerotees>
  );
}
