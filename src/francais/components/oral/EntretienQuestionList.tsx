import { LiteraryText } from '@/francais/components/text/LiteraryText';
import { useFrenchAppStore } from '@/francais/stores/french-app-store';
import type { EntretienCategory, EntretienQuestion } from '@/francais/lib/french-types';
import RevealPanel from './RevealPanel';
import { entretienCategoryLabel } from './oral-labels';

/** Ordre pédagogique d'affichage des catégories d'entretien. */
const CATEGORY_ORDER: EntretienCategory[] = [
  'choix-oeuvre',
  'comprehension',
  'interpretation',
  'gout-personnel',
  'culture',
  'ouverture',
];

type EntretienQuestionListProps = {
  questions: EntretienQuestion[];
};

export function EntretienQuestionCard({ question }: { question: EntretienQuestion }) {
  const oralViewMode = useFrenchAppStore((s) => s.oralViewMode);

  const hasEssentiel = !!question.reponseEssentielle;
  const hasPistes = !!question.pistes && question.pistes.length > 0;
  // En mode Essentiel on privilégie la réponse-modèle ; sinon les pistes.
  // Repli croisé si le champ du mode actif est absent.
  const showEssentiel = oralViewMode === 'essentiel' && hasEssentiel;
  const showPistes = !showEssentiel && hasPistes;

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
      <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
        {entretienCategoryLabel[question.category]}
      </span>
      <p className="mt-2 font-medium text-slate-900 dark:text-slate-100">
        <LiteraryText text={question.question} />
      </p>
      {showEssentiel && (
        <div className="mt-3">
          <RevealPanel label="Ma réponse">
            <LiteraryText text={question.reponseEssentielle!} />
          </RevealPanel>
        </div>
      )}
      {showPistes && (
        <div className="mt-3">
          <RevealPanel label="Pistes de réponse">
            <ul className="ml-4 list-disc space-y-1">
              {question.pistes!.map((p, i) => (
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
  // L'entretien P2 portant sur la seule œuvre choisie, on regroupe les questions
  // par catégorie (choix, compréhension, interprétation, goût, culture, ouverture)
  // pour une navigation thématique plus utile.
  const byCategory = new Map<EntretienCategory, EntretienQuestion[]>();
  for (const q of questions) {
    const list = byCategory.get(q.category) ?? [];
    list.push(q);
    byCategory.set(q.category, list);
  }

  const orderedCategories = [
    ...CATEGORY_ORDER.filter((c) => byCategory.has(c)),
    ...[...byCategory.keys()].filter((c) => !CATEGORY_ORDER.includes(c)),
  ];

  return (
    <div className="space-y-8">
      {orderedCategories.map((category) => (
        <section key={category}>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {entretienCategoryLabel[category] ?? category}
          </h2>
          <div className="mt-3 space-y-3">
            {byCategory.get(category)!.map((q) => (
              <EntretienQuestionCard key={q.id} question={q} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
