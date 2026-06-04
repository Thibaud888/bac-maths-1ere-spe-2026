import { LiteraryText } from '@/francais/components/text/LiteraryText';
import type { EntretienQuestion } from '@/francais/lib/french-types';
import RevealPanel from './RevealPanel';
import { entretienCategoryLabel } from './oral-labels';

type EntretienQuestionListProps = {
  questions: EntretienQuestion[];
};

export function EntretienQuestionCard({ question }: { question: EntretienQuestion }) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
      <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
        {entretienCategoryLabel[question.category]}
      </span>
      <p className="mt-2 font-medium text-slate-900 dark:text-slate-100">
        <LiteraryText text={question.question} />
      </p>
      {question.pistes && question.pistes.length > 0 && (
        <div className="mt-3">
          <RevealPanel label="Pistes de réponse">
            <ul className="ml-4 list-disc space-y-1">
              {question.pistes.map((p, i) => (
                <li key={i}>
                  <LiteraryText text={p} />
                </li>
              ))}
            </ul>
          </RevealPanel>
        </div>
      )}
    </div>
  );
}

export default function EntretienQuestionList({ questions }: EntretienQuestionListProps) {
  const byOeuvre = new Map<string, EntretienQuestion[]>();
  for (const q of questions) {
    const list = byOeuvre.get(q.oeuvre) ?? [];
    list.push(q);
    byOeuvre.set(q.oeuvre, list);
  }

  return (
    <div className="space-y-8">
      {[...byOeuvre.entries()].map(([oeuvre, qs]) => (
        <section key={oeuvre}>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {oeuvre}
          </h2>
          <div className="mt-3 space-y-3">
            {qs.map((q) => (
              <EntretienQuestionCard key={q.id} question={q} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
