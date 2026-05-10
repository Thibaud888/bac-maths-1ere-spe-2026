import { TextWithMath } from '@/components/math/TextWithMath';
import HintSystem from '@/components/shared/HintSystem';
import Timer from '@/components/shared/Timer';
import type { ExamExercise, ExamQuestion, ExamSubquestion } from '@/lib/types';
import { useProgressStore } from '@/stores/progress-store';

type ExamRunnerProps = {
  exercise: ExamExercise;
  onClose?: () => void;
};

export default function ExamRunner({ exercise, onClose }: ExamRunnerProps) {
  const recordAttempt = useProgressStore((s) => s.recordAttempt);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Type bac · {exercise.totalMarks} pts · ~{exercise.estimatedMinutes} min
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            {exercise.title}
          </h2>
          {exercise.inspiredBy && (
            <p className="mt-1 text-xs text-slate-500">
              D'après : {exercise.inspiredBy}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <Timer
            durationSeconds={exercise.estimatedMinutes * 60}
            resetKey={exercise.id}
          />
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-slate-500 hover:text-slate-800"
            >
              Fermer
            </button>
          )}
        </div>
      </header>

      {exercise.preamble && (
        <div className="mt-4 rounded bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
          <TextWithMath text={exercise.preamble} />
        </div>
      )}

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
              <ol className="mt-4 ml-6 space-y-4 border-l-2 border-slate-200 pl-4">
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
        <p className="text-sm font-semibold text-slate-900">
          Question {question.label}
        </p>
        <span className="text-xs text-slate-500">{question.marks} pts</span>
      </div>
      <div className="mt-1 text-sm leading-relaxed text-slate-700">
        <TextWithMath text={question.statement} />
      </div>
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
        <p className="text-sm font-medium text-slate-800">{sub.label}</p>
        {sub.marks !== undefined && (
          <span className="text-xs text-slate-500">{sub.marks} pts</span>
        )}
      </div>
      <div className="mt-1 text-sm leading-relaxed text-slate-700">
        <TextWithMath text={sub.statement} />
      </div>
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
