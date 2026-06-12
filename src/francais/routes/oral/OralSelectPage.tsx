import { Link } from 'react-router-dom';
import { listOralStudents } from '@/francais/lib/french-content-loader';

export default function OralSelectPage() {
  const students = listOralStudents();

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Préparer l’oral du bac de français
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Épreuve anticipée de français (EAF) — oral : 20 min, après 30 min de
        préparation, coefficient 5. Chaque élève dispose de son propre descriptif
        (ses textes et son entretien). Choisis ton espace pour commencer.
      </p>

      {students.length === 0 ? (
        <p className="mt-8 rounded border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-300">
          Aucun élève pour l’instant. Ajoute un dossier{' '}
          <code>content/francais/oral/eleves/&lt;id&gt;/</code> avec son profil et
          son descriptif.
        </p>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {students.map((student) => (
            <Link
              key={student.id}
              to={`/francais/oral/${student.id}`}
              className="block rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm transition-colors hover:border-emerald-400 dark:hover:border-emerald-500"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎓</span>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
                    {student.nom}
                  </p>
                  {(student.parcours ?? student.contexte) && (
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {student.parcours ?? student.contexte}
                    </p>
                  )}
                </div>
                <span className="ml-auto text-emerald-400">→</span>
              </div>
              {student.oeuvres && student.oeuvres.length > 0 && (
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  {student.oeuvres.map((o) => o.oeuvre).join(' · ')}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
