import { FigureRenderer } from '@/components/figures';
import { TextWithMath } from '@/components/math/TextWithMath';
import HintSystem from '@/components/shared/HintSystem';
import type { ExamExercise, ExamQuestion, ExamSubquestion } from '@/lib/types';
import { useProgressStore } from '@/stores/progress-store';

type ExamRunnerProps = {
  exercise: ExamExercise;
  onClose?: () => void;
};

export default function ExamRunner({ exercise, onClose }: ExamRunnerProps) {
  const recordAttempt = useProgressStore((s) => s.recordAttempt);

  return (
    <article className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Type bac · {exercise.totalMarks} pts · ~{exercise.estimatedMinutes} min
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
            <TextWithMath text={exercise.title} />
          </h2>
          {exercise.inspiredBy && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              D'après : {exercise.inspiredBy}
            </p>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          >
            Fermer
          </button>
        )}
      </header>

      {exercise.preamble && (
        <div className="mt-4 rounded bg-slate-50 dark:bg-slate-700 p-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <TextWithMath text={exercise.preamble} />
        </div>
      )}
      {exercise.figure && <FigureRenderer figure={exercise.figure} />}

      <ol className="mt-6 space-y-6">
        {exercise.questions.map((question) => (
          <li key={question.id}>
            <QuestionBlock
              exerciseId={exercise.id}
              question={question}
              onAssess={(succeeded) => {
                recordAttempt(`${exercise.id}::${question.id}`, succeeded);
              }}
            />
            {question.subquestions && question.subquestions.length > 0 && (
              <ol className="mt-4 ml-6 space-y-4 border-l-2 border-slate-200 dark:border-slate-600 pl-4">
                {question.subquestions.map((sub) => (
                  <li key={sub.id}>
                    <SubQuestionBlock
                      exerciseId={exercise.id}
                      question={question}
                      sub={sub}
                      onAssess={(succeeded) => {
                        recordAttempt(
                          `${exercise.id}::${sub.id}`,
                          succeeded
                        );
                      }}
                    />
                  </li>
                ))}
              </ol>
            )}
          </li>
        ))}
      </ol>
    </article>
  );
}

function QuestionBlock({
  exerciseId,
  question,
  onAssess,
}: {
  exerciseId: string;
  question: ExamQuestion;
  onAssess: (succeeded: boolean) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Question {question.label}
        </p>
        <span className="text-xs text-slate-500 dark:text-slate-400">{question.marks} pts</span>
      </div>
      <div className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <TextWithMath text={question.statement} />
      </div>
      {question.figure && <FigureRenderer figure={question.figure} />}
      {(!question.subquestions || question.subquestions.length === 0) && (
        <div className="mt-3">
          <HintSystem
            hints={question.hints}
            solution={question.solution}
            {...(question.expectedAnswer
              ? { expectedAnswer: question.expectedAnswer }
              : {})}
            resetKey={`${exerciseId}-${question.id}`}
            onSelfAssess={onAssess}
          />
        </div>
      )}
    </div>
  );
}

function SubQuestionBlock({
  exerciseId,
  question,
  sub,
  onAssess,
}: {
  exerciseId: string;
  question: ExamQuestion;
  sub: ExamSubquestion;
  onAssess: (succeeded: boolean) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{sub.label}</p>
        {sub.marks !== undefined && (
          <span className="text-xs text-slate-500 dark:text-slate-400">{sub.marks} pts</span>
        )}
      </div>
      <div className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <TextWithMath text={sub.statement} />
      </div>
      {sub.figure && <FigureRenderer figure={sub.figure} />}
      <div className="mt-3">
        <HintSystem
          hints={sub.hints}
          solution={sub.solution}
          {...(sub.expectedAnswer ? { expectedAnswer: sub.expectedAnswer } : {})}
          resetKey={`${exerciseId}-${question.id}-${sub.id}`}
          onSelfAssess={onAssess}
        />
      </div>
    </div>
  );
}
