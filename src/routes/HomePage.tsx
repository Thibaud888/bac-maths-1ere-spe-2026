import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getChapterContent, listChapters } from '@/lib/content-loader';
import { useAppStore } from '@/stores/app-store';
import { useProgressStore, type ItemProgress } from '@/stores/progress-store';

function buildSucceededBases(items: Record<string, ItemProgress>): Set<string> {
  const set = new Set<string>();
  for (const [id, item] of Object.entries(items)) {
    if (!item.succeeded) continue;
    const sep = id.indexOf('::');
    set.add(sep === -1 ? id : id.slice(0, sep));
  }
  return set;
}

export default function HomePage() {
  const chapters = useMemo(() => listChapters(), []);
  const lastVisited = useAppStore((s) => s.lastVisitedChapter);
  const items = useProgressStore((s) => s.items);
  const countSucceeded = useProgressStore((s) => s.countSucceeded);

  const succeededBases = useMemo(() => buildSucceededBases(items), [items]);

  const chapterContents = useMemo(
    () => chapters.map((ch) => ({ chapter: ch, content: getChapterContent(ch.slug) })),
    [chapters]
  );

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Bac Maths · Première Spé · 2026
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Application de révision pour l'Épreuve Anticipée de Mathématiques —{' '}
          <span className="font-medium text-slate-800">
            vendredi 12 juin 2026, 8h-10h, sans calculatrice, coefficient 2.
          </span>
        </p>
      </section>

      <section className="grid grid-cols-3 gap-4">
        <StatCard label="Automatismes réussis" value={countSucceeded('automatism')} />
        <StatCard label="Exercices classiques réussis" value={countSucceeded('classic')} />
        <StatCard label="Sujets type bac réussis" value={countSucceeded('exam')} />
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900">Chapitres</h3>
        <ul className="mt-3 space-y-2">
          {chapterContents.map(({ chapter, content }) => (
            <li key={chapter.slug}>
              <Link
                to={`/chapitre/${chapter.slug}/formulaire`}
                className="block rounded border border-slate-200 bg-white p-3 transition-colors hover:border-blue-400"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900">{chapter.title}</span>
                  <span className="text-xs text-slate-500">{chapter.domain}</span>
                </div>
                {content && (
                  <div className="mt-2 flex gap-4">
                    <ProgressPill
                      done={content.automatisms.filter((a) => succeededBases.has(a.id)).length}
                      total={content.automatisms.length}
                      label="auto"
                    />
                    <ProgressPill
                      done={content.classics.filter((e) => succeededBases.has(e.id)).length}
                      total={content.classics.length}
                      label="class."
                    />
                    <ProgressPill
                      done={content.examStyle.filter((e) => succeededBases.has(e.id)).length}
                      total={content.examStyle.length}
                      label="bac"
                    />
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
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

function ProgressPill({
  done,
  total,
  label,
}: {
  done: number;
  total: number;
  label: string;
}) {
  if (total === 0) return null;
  const complete = done === total;
  const partial = done > 0 && !complete;
  return (
    <span
      className={
        complete
          ? 'text-xs font-semibold text-green-700'
          : partial
            ? 'text-xs text-blue-600'
            : 'text-xs text-slate-400'
      }
    >
      {done}/{total} {label}
    </span>
  );
}
