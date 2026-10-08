import { useState } from 'react';
import QuestionVerifiable from '@/components/terminale/QuestionVerifiable';
import type { QuestionEclair } from '@/lib/terminale/types';

type Props = {
  questions: readonly QuestionEclair[];
  /** Appelé au premier essai de chaque question (c'est lui qui compte). */
  onRepondre: (id: string, juste: boolean) => void;
  /**
   * « Recommencer » en fin de série : la page reforme la série (sans les questions
   * réussies entre-temps). Sans lui, la même série reprend du début.
   */
  onRecommencer?: () => void;
};

/**
 * « Teste-toi » : les questions éclair une par une (charte § 8), les plus importantes
 * d'abord ; seul le premier essai compte pour la progression.
 */
export default function SerieEclair({ questions, onRepondre, onRecommencer }: Props) {
  const [rang, setRang] = useState(0);
  const [premiers, setPremiers] = useState<Record<string, boolean>>({});
  const [tour, setTour] = useState(0);
  const question = questions[rang];
  const justes = Object.values(premiers).filter(Boolean).length;
  const fini = rang >= questions.length;

  if (questions.length === 0) return null;

  if (fini || !question) {
    return (
      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
        <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
          {justes} sur {questions.length} du premier coup
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {onRecommencer
            ? justes === questions.length
              ? 'Ces questions sont réussies : elles ne reviendront plus dans la série.'
              : 'Les questions réussies ne reviendront plus ; les autres t’attendent à la prochaine série.'
            : 'Les questions ratées reviendront vite : refais la série dans quelques jours.'}
        </p>
        <button
          type="button"
          onClick={() => {
            if (onRecommencer) {
              onRecommencer();
              return;
            }
            setRang(0);
            setPremiers({});
            setTour((t) => t + 1);
          }}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
        >
          Recommencer
        </button>
      </div>
    );
  }

  const repondue = question.id in premiers;
  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold">
          Question {rang + 1} sur {questions.length}
        </span>
        <span>≈ {question.duree} s</span>
      </div>
      <QuestionVerifiable
        key={`${question.id}-${tour}`}
        graine={question.id}
        question={question}
        onRepondre={(juste) => {
          if (question.id in premiers) return;
          setPremiers((p) => ({ ...p, [question.id]: juste }));
          onRepondre(question.id, juste);
        }}
      />
      {repondue && (
        <button
          type="button"
          onClick={() => {
            setRang((r) => r + 1);
          }}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
        >
          {rang + 1 < questions.length ? 'Question suivante →' : 'Voir le bilan'}
        </button>
      )}
    </div>
  );
}
