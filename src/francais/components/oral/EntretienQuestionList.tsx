import { useParams } from 'react-router-dom';
import { LiteraryText } from '@/francais/components/text/LiteraryText';
import { useFrenchAppStore } from '@/francais/stores/french-app-store';
import { useFrenchProgressStore } from '@/francais/stores/french-progress-store';
import type { EntretienCategory, EntretienQuestion } from '@/francais/lib/french-types';
import RevealPanel from './RevealPanel';
import { entretienCategoryLabel } from './oral-labels';

/** Deux boutons de statut (À retravailler / Maîtrisée) pour une question. */
function EntretienStatusControl({ statusKey }: { statusKey: string }) {
  const status = useFrenchProgressStore((s) => s.oralStatus[statusKey]);
  const setStatus = useFrenchProgressStore((s) => s.setOralStatus);
  return (
    <div className="mt-3 flex items-center gap-2">
      <button
        type="button"
        aria-pressed={status === 'review'}
        onClick={() => setStatus(statusKey, 'review')}
        className={[
          'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
          status === 'review'
            ? 'border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-500 dark:bg-amber-900/30 dark:text-amber-300'
            : 'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-amber-400',
        ].join(' ')}
      >
        ↻ À retravailler
      </button>
      <button
        type="button"
        aria-pressed={status === 'done'}
        onClick={() => setStatus(statusKey, 'done')}
        className={[
          'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
          status === 'done'
            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-300'
            : 'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-emerald-400',
        ].join(' ')}
      >
        ✓ Maîtrisée
      </button>
    </div>
  );
}

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
  const { eleve } = useParams<{ eleve: string }>();
  const oralViewMode = useFrenchAppStore((s) => s.oralViewMode);
  const statusKey = `${eleve ?? ''}::eq::${question.id}`;
  const status = useFrenchProgressStore((s) => s.oralStatus[statusKey]);

  const hasEssentiel = !!question.reponseEssentielle;
  const hasPistes = !!question.pistes && question.pistes.length > 0;
  // En mode Essentiel on privilégie la réponse-modèle ; sinon les pistes.
  // Repli croisé si le champ du mode actif est absent.
  const showEssentiel = oralViewMode === 'essentiel' && hasEssentiel;
  const showPistes = !showEssentiel && hasPistes;

  const ring =
    status === 'done'
      ? 'border-emerald-300 dark:border-emerald-700'
      : status === 'review'
        ? 'border-amber-300 dark:border-amber-700'
        : 'border-slate-200 dark:border-slate-700';

  return (
    <div className={`rounded-lg border ${ring} bg-white dark:bg-slate-800 p-4`}>
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
      <EntretienStatusControl statusKey={statusKey} />
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
