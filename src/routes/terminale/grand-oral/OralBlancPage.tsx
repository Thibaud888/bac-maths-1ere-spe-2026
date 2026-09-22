import GrandOralIntro from '@/components/grand-oral/GrandOralIntro';
import Historique from '@/components/grand-oral/Historique';
import OralBlanc from '@/components/grand-oral/OralBlanc';

export default function OralBlancPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 p-4 sm:p-8">
      <GrandOralIntro
        title="Oral blanc"
        lead="S’entraîner dans les conditions de l’épreuve : une de tes deux questions tirée au sort, les temps officiels au minuteur, des relances de jury, et une auto-évaluation à la fin."
      />
      <OralBlanc />
      <Historique />
    </div>
  );
}
