import { Link } from 'react-router-dom';
import { fichesOfSection } from '@/lib/grand-oral-content';
import FicheGrandOral from '@/components/grand-oral/FicheGrandOral';
import GrandOralIntro from '@/components/grand-oral/GrandOralIntro';
import Sommaire from '@/components/grand-oral/Sommaire';

export default function PreparationPage() {
  const fiches = fichesOfSection('preparation');

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-4 sm:p-8">
      <GrandOralIntro
        title="Préparation"
        lead="Comment construire l’exposé : trouver l’angle, bâtir le plan, préparer le support, et travailler la prise de parole. Ce sont des conseils de méthode ; quand une fiche s’appuie sur une règle, elle cite le texte officiel."
      />

      <Sommaire entries={fiches.map((f) => ({ id: f.id, label: f.title }))} />

      <div className="space-y-4">
        {fiches.map((fiche) => (
          <FicheGrandOral key={fiche.id} fiche={fiche} />
        ))}
      </div>

      <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
        Prêt à essayer ?{' '}
        <Link
          to="/terminale/grand-oral/questions"
          className="font-medium text-amber-700 underline underline-offset-2 dark:text-amber-400"
        >
          Écris tes deux questions
        </Link>{' '}
        puis lance un{' '}
        <Link
          to="/terminale/grand-oral/oral-blanc"
          className="font-medium text-amber-700 underline underline-offset-2 dark:text-amber-400"
        >
          oral blanc minuté
        </Link>
        .
      </p>
    </div>
  );
}
