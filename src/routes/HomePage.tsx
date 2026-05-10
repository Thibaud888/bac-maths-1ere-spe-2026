import { Link } from 'react-router-dom';
import { listChapters } from '@/lib/content-loader';
import { daysUntilExam } from '@/lib/exam-date';
import { useAppStore } from '@/stores/app-store';
import { useProgressStore } from '@/stores/progress-store';

export default function HomePage() {
  const chapters = listChapters();
  const lastVisited = useAppStore((s) => s.lastVisitedChapter);
  const automatismsDone = useProgressStore((s) => s.countSucceeded('automatism'));
  const classicsDone = useProgressStore((s) => s.countSucceeded('classic'));
  const examsDone = useProgressStore((s) => s.countSucceeded('exam'));
  const days = daysUntilExam();

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Bac Maths · Première Spé · 2026
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Application de révision pour l'Épreuve Anticipée de Mathématiques —
          {' '}
          <span className="font-medium text-slate-800">
            vendredi 12 juin 2026, 8h-10h, sans calculatrice, coefficient 2.
          </span>
        </p>
        <p className="mt-1 text-sm text-blue-700">
          {days > 0 ? `Il reste ${days} jour${days > 1 ? 's' : ''} avant l'épreuve.` : "C'est aujourd'hui !"}
        </p>
      </section>

      <section className="grid grid-cols-3 gap-4">
        <StatCard label="Automatismes réussis" value={automatismsDone} />
        <StatCard label="Classiques réussis" value={classicsDone} />
        <StatCard label="Type bac réussis" value={examsDone} />
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900">Chapitres</h3>
        {chapters.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">
            Aucun chapitre n'est encore disponible. Le premier (Suites) sera ajouté en Phase 4.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {chapters.map((chapter) => (
              <li key={chapter.slug}>
                <Link
                  to={`/chapitre/${chapter.slug}/formulaire`}
                  className="block rounded border border-slate-200 bg-white p-3 hover:border-blue-400"
                >
                  <span className="text-sm font-medium text-slate-900">{chapter.title}</span>
                  <span className="ml-2 text-xs text-slate-500">{chapter.domain}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {lastVisited && (
        <p className="text-xs text-slate-500">
          Dernier chapitre visité : <code>{lastVisited}</code>
        </p>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-4">
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}
