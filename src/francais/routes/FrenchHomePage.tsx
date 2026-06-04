import { Link } from 'react-router-dom';
import {
  getExpressDecks,
  getOralContent,
  listFrenchModules,
} from '@/francais/lib/french-content-loader';
import type { FrenchFamily } from '@/francais/lib/french-types';

const familyLabels: Record<FrenchFamily, string> = {
  methode: 'Méthode',
  reperes: 'Repères',
  'objet-etude': 'Objets d’étude',
};

const familyOrder: FrenchFamily[] = ['methode', 'reperes', 'objet-etude'];

export default function FrenchHomePage() {
  const modules = listFrenchModules();
  const expressDecks = getExpressDecks();
  const totalExpressCards = expressDecks.reduce((n, d) => n + d.cards.length, 0);
  const oralTextesCount = getOralContent().textes.length;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Préparer le bac de français
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Épreuve anticipée de français (EAF) : <strong>écrit</strong> (4 h, coef. 5
        — commentaire ou dissertation) et <strong>oral</strong> (20 min, coef. 5).
        Révise la méthode et les repères, puis entraîne-toi avec les quiz, les
        exercices et l’oral blanc.
      </p>

      {/* Oral banner */}
      <Link
        to="/francais/oral"
        className="mt-6 flex items-center gap-4 rounded-xl border border-emerald-300 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 p-4 shadow-sm transition-colors hover:border-emerald-400 dark:hover:border-emerald-500"
      >
        <span className="text-3xl">🎙️</span>
        <div>
          <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
            Préparer l’oral
          </p>
          <p className="text-xs text-emerald-700 dark:text-emerald-300">
            {oralTextesCount > 0
              ? `${oralTextesCount} texte${oralTextesCount > 1 ? 's' : ''} du descriptif, méthode, grammaire et oral blanc minuté`
              : `Explication linéaire, grammaire, entretien et oral blanc minuté`}
          </p>
        </div>
        <span className="ml-auto text-emerald-400">→</span>
      </Link>

      {/* Révision express banner */}
      <Link
        to="/francais/express"
        className="mt-6 flex items-center gap-4 rounded-xl border border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20 p-4 shadow-sm transition-colors hover:border-amber-400 dark:hover:border-amber-500"
      >
        <span className="text-3xl">⚡</span>
        <div>
          <p className="text-sm font-bold text-amber-800 dark:text-amber-200">
            Révision express
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-300">
            {totalExpressCards > 0
              ? `${totalExpressCards} flashcards — l’essentiel à retenir en quelques jours`
              : `Flashcards — l’essentiel à retenir en quelques jours`}
          </p>
        </div>
        <span className="ml-auto text-amber-400">→</span>
      </Link>

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
