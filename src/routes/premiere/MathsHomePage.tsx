import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { listChapters } from '@/lib/content-loader';
import { DOMAIN_LABEL } from '@/lib/spaces';
import type { Domain } from '@/lib/types';
import { useProgressStore } from '@/stores/progress-store';

const DOMAIN_ORDER: readonly Domain[] = [
  'algebre',
  'analyse',
  'geometrie',
  'probabilites',
];

/** Accueil de l'espace maths de première : les chapitres et le bac blanc. */
export default function MathsHomePage() {
  const chapters = useMemo(() => listChapters(), []);
  const countSucceeded = useProgressStore((s) => s.countSucceeded);

  const automatisms = countSucceeded('automatism');
  const classics = countSucceeded('classic');
  const exams = countSucceeded('exam');
  const total = automatisms + classics + exams;

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
          Première · spécialité
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Maths
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Épreuve anticipée de mathématiques : 2 h, sans calculatrice, coefficient 2.
          Chaque chapitre propose quatre modes de travail.
        </p>
        {total > 0 && (
          <p className="mt-3 text-xs text-sky-700 dark:text-sky-300">
            {automatisms} automatismes · {classics} classiques · {exams} type bac réussis
          </p>
        )}
      </header>

      <section>
        <Link
          to="/premiere/maths/bac-blanc"
          className="block rounded-lg border border-sky-300 bg-white px-4 py-3 text-sm font-semibold text-sky-700 transition-colors hover:border-sky-500 dark:border-sky-700 dark:bg-slate-800 dark:text-sky-300 dark:hover:border-sky-500"
        >
          Bac blanc — sujets complets chronométrés →
        </Link>
      </section>

      {DOMAIN_ORDER.map((domain) => {
        const inDomain = chapters.filter((c) => c.domain === domain);
        if (inDomain.length === 0) return null;
        return (
          <section key={domain}>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              {DOMAIN_LABEL[domain]}
            </h2>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {inDomain.map((chapter) => (
                <li key={chapter.slug}>
                  <Link
                    to={`/premiere/maths/${chapter.slug}/formulaire`}
                    className="block rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 transition-colors hover:border-sky-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-sky-500"
                  >
                    {chapter.shortTitle ?? chapter.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
