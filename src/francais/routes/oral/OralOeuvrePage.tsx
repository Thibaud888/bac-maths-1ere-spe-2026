import { Link, useParams } from 'react-router-dom';
import {
  getOralStudentEntretien,
  getOralStudentOeuvre,
} from '@/francais/lib/french-content-loader';
import OralOeuvreView from '@/francais/components/oral/OralOeuvreView';
import { EntretienQuestionCard } from '@/francais/components/oral/EntretienQuestionList';
import RevisedToggle from '@/francais/components/oral/RevisedToggle';

export default function OralOeuvrePage() {
  const { eleve } = useParams<{ eleve: string }>();
  const oeuvre = eleve ? getOralStudentOeuvre(eleve) : null;
  const entretien = eleve ? getOralStudentEntretien(eleve) : [];

  if (!oeuvre) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Œuvre choisie
        </h1>
        <p className="mt-4 rounded border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-300">
          L’œuvre choisie pour la seconde partie de l’oral n’a pas encore été
          préparée.
        </p>
      </div>
    );
  }

  // Questions d'entretien rattachées à l'œuvre choisie (présentation → entretien).
  const liees = entretien.filter(
    (q) => q.oeuvre.toLowerCase() === oeuvre.oeuvre.toLowerCase()
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <OralOeuvreView oeuvre={oeuvre} />

      <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-4">
        <RevisedToggle checkKey={`${eleve ?? ''}::oeuvre`} />
      </div>

      {liees.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            L’entretien qui suit
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Questions probables sur {oeuvre.oeuvre}. Retrouve-les aussi dans
            l’onglet{' '}
            <Link
              to={`/francais/oral/${eleve ?? ''}/entretien`}
              className="text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              Entretien
            </Link>
            .
          </p>
          <div className="mt-3 space-y-3">
            {liees.map((q) => (
              <EntretienQuestionCard key={q.id} question={q} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
