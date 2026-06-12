import { Link } from 'react-router-dom';
import {
  getExpressDecks,
  listFrenchModules,
  listOralStudents,
} from '@/francais/lib/french-content-loader';

export default function FrenchHubPage() {
  const modulesCount = listFrenchModules().length;
  const oralStudentsCount = listOralStudents().length;
  const expressDecks = getExpressDecks();
  const totalExpressCards = expressDecks.reduce((n, d) => n + d.cards.length, 0);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Bac de français — Première
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Deux épreuves anticipées (EAF), chacune coef. 5. Choisis l’espace de
        révision : l’<strong>oral</strong> (à venir) ou l’<strong>écrit</strong>.
      </p>

      {/* Deux espaces équivalents */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* Oral */}
        <Link
          to="/francais/oral"
          className="group flex flex-col rounded-xl border-2 border-emerald-300 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 p-6 shadow-sm transition-colors hover:border-emerald-500 dark:hover:border-emerald-400"
        >
          <span className="text-4xl">🎙️</span>
          <h2 className="mt-3 text-lg font-bold text-emerald-800 dark:text-emerald-200">
            Oral
          </h2>
          <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
            20 min, après 30 min de préparation. Explication linéaire, grammaire,
            entretien et oral blanc minuté.
          </p>
          <span className="mt-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            {oralStudentsCount > 0
              ? 'Ouvrir mon descriptif →'
              : 'Préparer l’oral →'}
          </span>
        </Link>

        {/* Écrit */}
        <Link
          to="/francais/ecrit"
          className="group flex flex-col rounded-xl border-2 border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 p-6 shadow-sm transition-colors hover:border-indigo-500 dark:hover:border-indigo-400"
        >
          <span className="text-4xl">✍️</span>
          <h2 className="mt-3 text-lg font-bold text-indigo-800 dark:text-indigo-200">
            Écrit
          </h2>
          <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-300">
            4 h : commentaire ou dissertation. Méthode, repères, objets d’étude,
            quiz et sujets.
          </p>
          <span className="mt-3 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
            {modulesCount > 0
              ? `${modulesCount} modules →`
              : 'Réviser l’écrit →'}
          </span>
        </Link>
      </div>

      {/* Révision express (transverse) */}
      <Link
        to="/francais/express"
        className="mt-4 flex items-center gap-4 rounded-xl border border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20 p-4 shadow-sm transition-colors hover:border-amber-400 dark:hover:border-amber-500"
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
    </div>
  );
}
