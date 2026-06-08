import { useParams } from 'react-router-dom';
import { getOralStudentEntretien } from '@/francais/lib/french-content-loader';
import EntretienQuestionList from '@/francais/components/oral/EntretienQuestionList';

export default function OralEntretienPage() {
  const { eleve } = useParams<{ eleve: string }>();
  const entretien = eleve ? getOralStudentEntretien(eleve) : [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Entretien</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Seconde partie de l’oral (8 pts) : tu présentes une œuvre que tu as
        choisie, puis tu échanges avec l’examinateur. Entraîne-toi aux questions
        possibles.
      </p>

      <div className="mt-6">
        {entretien.length > 0 ? (
          <EntretienQuestionList questions={entretien} />
        ) : (
          <p className="rounded border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-300">
            La banque de questions d’entretien arrive bientôt.
          </p>
        )}
      </div>
    </div>
  );
}
