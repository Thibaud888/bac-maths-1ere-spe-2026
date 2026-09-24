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
import Essentiel, { Point, Points } from '@/components/shared/Essentiel';
import PageLongue, { SectionPage } from '@/components/shared/PageLongue';
import { SourcesNumerotees, ordreDesSources } from '@/components/shared/Sources';
import { typographie } from '@/lib/typographie';

/** Les trois idées à retenir, chacune tirée d'une fiche de la page. */
const ESSENTIEL = [
  {
    fiche: 'go-ent-question',
    titre: 'Anticiper les relances',
    texte:
      'Cherche les points faibles de ton exposé : ce sont presque toujours les premières questions.',
  },
  {
    fiche: 'go-ent-tenir',
    titre: 'Répondre, puis développer',
    texte: 'Écoute la question jusqu’au bout, réponds d’abord en une phrase, puis développe.',
  },
  {
    fiche: 'go-ent-piege',
    titre: 'Ne pas répondre au hasard',
    texte: 'Si tu ne sais pas, raisonne à voix haute à partir de ce que tu sais.',
  },
] as const;

export default function EntretienPage() {
  const fiches = fichesOfSection('entretien');
  const relances = listGrandOralRelances();
  const sources = ordreDesSources(...fiches.map((f) => f.sources));
  const ids = new Set(fiches.map((f) => f.id));
  const sommaire = [
    ...fiches.map((f) => ({ id: f.id, label: typographie(f.title) })),
    { id: 'relances', label: 'Les relances types' },
    ...(sources.length > 0 ? [{ id: 'sources', label: 'Les sources' }] : []),
  ];

  const entete = (
    <>
      <GrandOralIntro title="Entretien" />
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
            <FicheGrandOral key={fiche.id} fiche={fiche} numero={index + 1} appels={false} />
          ))}
        </div>

        <SectionPage
          id="relances"
          numero={fiches.length + 1}
          titre="Les relances types"
          accent="amber"
          chapeau="Réponds à voix haute avant d’ouvrir les pistes."
        >
          <div className="space-y-6">
            {RELANCE_CATEGORIE_ORDER.map((categorie) => {
              const dansCategorie = relances.filter((r) => r.categorie === categorie);
              if (dansCategorie.length === 0) return null;
              return (
                <div key={categorie}>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {typographie(RELANCE_CATEGORIE_LABEL[categorie])}
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {dansCategorie.map((r) => (
                      <RelanceCard key={r.id} relance={r} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionPage>

        {sources.length > 0 && <SectionSources numero={fiches.length + 2} />}
      </PageLongue>
    </SourcesNumerotees>
  );
}
