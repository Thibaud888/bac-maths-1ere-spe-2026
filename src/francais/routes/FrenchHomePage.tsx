import { Link } from 'react-router-dom';
import { listFrenchModules } from '@/francais/lib/french-content-loader';
import type { FrenchFamily } from '@/francais/lib/french-types';

const familyLabels: Record<FrenchFamily, string> = {
  methode: 'Méthode',
  reperes: 'Repères',
  'objet-etude': 'Objets d’étude',
};

const familyOrder: FrenchFamily[] = ['methode', 'reperes', 'objet-etude'];

export default function FrenchHomePage() {
  const modules = listFrenchModules();

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Préparer l’écrit du bac de français
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Épreuve anticipée de français (EAF) — écrit : 4 h, coefficient 5. Au
        choix le jour de l’épreuve : <strong>commentaire de texte</strong> ou{' '}
        <strong>dissertation sur une œuvre</strong>. Révise la méthode et les
        repères, puis entraîne-toi avec les quiz et les exercices.
      </p>

      {modules.length === 0 && (
        <p className="mt-8 rounded border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-300">
          Aucun module pour l’instant. Le contenu arrive bientôt.
        </p>
      )}

      {familyOrder.map((family) => {
        const inFamily = modules.filter((m) => m.family === family);
        if (inFamily.length === 0) return null;
        return (
          <section key={family} className="mt-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {familyLabels[family]}
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {inFamily.map((m) => (
                <Link
                  key={m.slug}
                  to={`/francais/module/${m.slug}`}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm transition-colors hover:border-indigo-400 dark:hover:border-indigo-500"
                >
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {m.title}
                  </h3>
                  {m.description && (
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {m.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
