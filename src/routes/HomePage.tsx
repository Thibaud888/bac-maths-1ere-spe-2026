import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { listChapters } from '@/lib/content-loader';
import { useProgressStore } from '@/stores/progress-store';
import { listFrenchModules, listOralStudents } from '@/francais/lib/french-content-loader';

export default function HomePage() {
  const chapters = useMemo(() => listChapters(), []);
  const countSucceeded = useProgressStore((s) => s.countSucceeded);
  const modulesCount = useMemo(() => listFrenchModules().length, []);
  const studentsCount = useMemo(() => listOralStudents().length, []);

  const autoSucceeded = countSucceeded('automatism');
  const classicSucceeded = countSucceeded('classic');
  const examSucceeded = countSucceeded('exam');
  const mathsProgress = autoSucceeded + classicSucceeded + examSucceeded;

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-8">
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Bac 2026 — Révisions
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Choisissez une matière pour commencer.
        </p>
      </section>

      <section className="grid gap-5 sm:grid-cols-2">
        {/* Maths */}
        <div className="flex flex-col rounded-xl border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 p-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">∑</span>
            <div>
              <h2 className="text-lg font-bold text-blue-800 dark:text-blue-200">Maths</h2>
              <p className="text-xs text-blue-600 dark:text-blue-400">EAM · 12 juin 2026 · 2h · coef. 2</p>
            </div>
          </div>

          {mathsProgress > 0 && (
            <p className="mt-3 text-xs text-blue-700 dark:text-blue-300">
              {autoSucceeded} automatismes · {classicSucceeded} classiques · {examSucceeded} type bac réussis
            </p>
          )}

          <ul className="mt-4 space-y-1.5">
            {chapters.map((ch) => (
              <li key={ch.slug}>
                <Link
                  to={`/chapitre/${ch.slug}/formulaire`}
                  className="block rounded border border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-medium text-blue-900 dark:text-blue-100 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                >
                  {ch.shortTitle ?? ch.title}
                </Link>
              </li>
            ))}
          </ul>

          {chapters.length > 0 && (
            <Link
              to="/bac-blanc"
              className="mt-3 block rounded border border-blue-300 dark:border-blue-600 px-3 py-2 text-center text-sm font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors"
            >
              Bac blanc →
            </Link>
          )}
        </div>

        {/* Français */}
        <Link
          to="/francais"
          className="group flex flex-col rounded-xl border-2 border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 p-5 shadow-sm transition-colors hover:border-indigo-400 dark:hover:border-indigo-500"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">A</span>
            <div>
              <h2 className="text-lg font-bold text-indigo-800 dark:text-indigo-200">Français</h2>
              <p className="text-xs text-indigo-600 dark:text-indigo-400">EAF · écrit 4h coef. 5 · oral coef. 5</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="rounded border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2">
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">🎙️ Oral</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                {studentsCount > 0
                  ? `${studentsCount} descriptif${studentsCount > 1 ? 's' : ''} · explication linéaire, grammaire, entretien`
                  : 'Explication linéaire, grammaire, entretien'}
              </p>
            </div>
            <div className="rounded border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-800 px-3 py-2">
              <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-200">✍️ Écrit</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400">
                {modulesCount > 0
                  ? `${modulesCount} modules · commentaire, dissertation, révision express`
                  : 'Commentaire, dissertation, méthode, révision express'}
              </p>
            </div>
          </div>

          <span className="mt-auto pt-4 text-sm font-semibold text-indigo-700 dark:text-indigo-300 group-hover:underline">
            Réviser →
          </span>
        </Link>
      </section>
    </div>
  );
}
