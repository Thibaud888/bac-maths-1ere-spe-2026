import {
  RELANCE_CATEGORIE_LABEL,
  RELANCE_CATEGORIE_ORDER,
  fichesOfSection,
  listGrandOralRelances,
} from '@/lib/grand-oral-content';
import FicheGrandOral from '@/components/grand-oral/FicheGrandOral';
import GrandOralIntro from '@/components/grand-oral/GrandOralIntro';
import { NB_RELANCES } from '@/components/grand-oral/OralBlanc';
import RelanceCard from '@/components/grand-oral/RelanceCard';
import Sommaire from '@/components/grand-oral/Sommaire';

export default function EntretienPage() {
  const fiches = fichesOfSection('entretien');
  const relances = listGrandOralRelances();

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-4 sm:p-8">
      <GrandOralIntro
        title="Entretien"
        lead="L’échange avec le jury : les questions qui reviennent, celles qui piègent, et de quoi préparer ses réponses à l’avance."
      />

      <Sommaire
        entries={[
          ...fiches.map((f) => ({ id: f.id, label: f.title })),
          { id: 'relances', label: 'Les relances types' },
        ]}
      />

      <div className="space-y-4">
        {fiches.map((fiche) => (
          <FicheGrandOral key={fiche.id} fiche={fiche} />
        ))}
      </div>

      <section id="relances" className="scroll-mt-6 space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Les relances types
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Des questions que le jury peut poser, quelle que soit ta question. Réponds à voix
            haute avant d’ouvrir les pistes. L’oral blanc en tire {NB_RELANCES} au hasard
            pendant l’échange.
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
    </div>
  );
}
