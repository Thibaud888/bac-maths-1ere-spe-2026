import { Link } from 'react-router-dom';
import { useAppStore } from '@/stores/app-store';

export default function HomePage() {
  const lastVisitedChapter = useAppStore((state) => state.lastVisitedChapter);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Bac Maths · Première Spé · 2026</h1>
      <p className="mt-3 text-slate-600">
        Application de révision pour l'Épreuve Anticipée de Mathématiques (vendredi 12 juin 2026).
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Phase 1 — initialisation</h2>
        <p className="mt-2 text-sm text-slate-600">
          Squelette technique en place : Vite, React 18, TypeScript strict, Tailwind, KaTeX,
          React Router, Zustand. Le contenu pédagogique sera ajouté en Phase 4 et suivantes.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Navigation</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link to="/chapitre/suites" className="text-blue-600 underline">
              Chapitre stub : suites
            </Link>
          </li>
        </ul>
        {lastVisitedChapter && (
          <p className="mt-3 text-xs text-slate-500">
            Dernier chapitre visité : <code>{lastVisitedChapter}</code>
          </p>
        )}
      </section>
    </main>
  );
}
