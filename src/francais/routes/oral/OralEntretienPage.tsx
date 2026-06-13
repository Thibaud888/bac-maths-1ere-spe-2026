import { useParams } from 'react-router-dom';
import {
  getOralStudentEntretien,
  getOralStudentOeuvre,
} from '@/francais/lib/french-content-loader';
import EntretienQuestionList from '@/francais/components/oral/EntretienQuestionList';
import RevisedToggle from '@/francais/components/oral/RevisedToggle';

export default function OralEntretienPage() {
  const { eleve } = useParams<{ eleve: string }>();
  const entretien = eleve ? getOralStudentEntretien(eleve) : [];
  const oeuvre = eleve ? getOralStudentOeuvre(eleve) : null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Entretien</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Seconde partie de l’oral (8 pts). L’examinateur part de ta présentation :
        <strong>
          {' '}
          toutes les questions portent sur ton œuvre choisie
          {oeuvre ? ` (${oeuvre.oeuvre})` : ''}
        </strong>{' '}
        et sur tes lectures personnelles — jamais sur les textes du descriptif
        (ceux-ci relèvent de la 1ʳᵉ partie). Les questions sont classées par type.
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

      {entretien.length > 0 && (
        <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-4">
          <RevisedToggle checkKey={`${eleve ?? ''}::entretien`} />
        </div>
      )}
    </div>
  );
}
