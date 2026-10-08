import { useState } from 'react';
import { TextWithMath } from '@/components/math/TextWithMath';
import FigureRenderer from '@/components/figures/FigureRenderer';
import AideQuestion from '@/components/terminale/AideQuestion';
import CodeSource from '@/components/terminale/CodeSource';
import { DejaRepondue, NotionsTravaillees, Reperes, SourceDeLExercice } from '@/components/terminale/FicheExercice';
import QuestionVerifiable from '@/components/terminale/QuestionVerifiable';
import { nomMarche, resultatExercice } from '@/lib/terminale/entrainement';
import type { Resultat } from '@/lib/terminale/progression';
import type { Exercice, Matiere, QuestionExercice, ReponseVerifiable } from '@/lib/terminale/types';

const TEXTE =
  'text-[15px] leading-relaxed text-slate-800 dark:text-slate-200 [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden';

function verifiable(question: QuestionExercice): ReponseVerifiable | undefined {
  return question.reponse && question.reponse.type !== 'redaction' ? question.reponse : undefined;
}

function Question({
  exercice,
  question,
  resultat,
  onResultat,
}: {
  exercice: Exercice;
  question: QuestionExercice;
  resultat: Resultat | undefined;
  onResultat: (resultat: Resultat) => void;
}) {
  const reponse = verifiable(question);
  const [demandeReponse, setDemandeReponse] = useState(0);
  // Réponse d'une visite précédente : le champ est vide, on dit seulement ce qui a été fait.
  const [precedent, setPrecedent] = useState(reponse ? resultat : undefined);
  return (
    <li className="space-y-3 border-t border-slate-200 pt-4 first:border-t-0 first:pt-0 dark:border-slate-700">
      <div className="flex gap-2">
        <span className="shrink-0 font-bold text-slate-900 dark:text-slate-100">{question.label}</span>
        <div className="min-w-0 flex-1 space-y-3">
          {precedent && <DejaRepondue resultat={precedent} />}
          {reponse ? (
            <QuestionVerifiable
              graine={`${exercice.id}-${question.id}`}
              question={{
                enonce: question.enonce,
                ...(question.code ? { code: question.code } : {}),
                reponse,
                explication: question.erreurFrequente
                  ? `${question.solution}\n\n**Erreur fréquente :** ${question.erreurFrequente}`
                  : question.solution,
              }}
              onRepondre={(juste) => {
                setPrecedent(undefined);
                onResultat(juste ? 'reussi' : 'rate');
              }}
              boutonReponse={false}
              demandeReponse={demandeReponse}
            />
          ) : (
            <>
              <div className={TEXTE}>
                <TextWithMath text={question.enonce} />
              </div>
              {question.code && <CodeSource code={question.code} />}
            </>
          )}
          <AideQuestion
            indices={question.indices}
            revoir={question.revoir}
            solution={reponse ? undefined : question.solution}
            erreurFrequente={reponse ? undefined : question.erreurFrequente}
            autoEvaluation={!reponse}
            resultat={resultat}
            onEvaluer={onResultat}
            {...(reponse
              ? {
                  onVoirReponse: () => {
                    setDemandeReponse((n) => n + 1);
                  },
                }
              : {})}
          />
        </div>
      </div>
    </li>
  );
}

type Props = {
  exercice: Exercice;
  matiere: Matiere;
  /** Questions déjà notées lors d'une visite précédente. */
  dejaNotees?: Readonly<Record<string, Resultat>>;
  /** Appelé à chaque question notée : c'est ce qui garde un exercice laissé en cours. */
  onQuestion?: (questionId: string, resultat: Resultat) => void;
  /** Appelé quand toutes les questions ont un résultat (et à chaque changement ensuite). */
  onTermine: (resultat: Resultat) => void;
};

/**
 * Un exercice des trois marches (charte § 6) : énoncé, questions, réponses vérifiées
 * tout de suite quand c'est possible, indices progressifs, solution rédigée et
 * auto-évaluation. Le résultat de l'exercice est la moyenne de ses questions.
 */
export default function ExerciceRunner({ exercice, matiere, dejaNotees, onQuestion, onTermine }: Props) {
  const [resultats, setResultats] = useState<Record<string, Resultat>>(() => ({ ...dejaNotees }));
  const bilan = resultatExercice(
    exercice.questions.map((q) => q.id),
    resultats
  );

  function noter(questionId: string, resultat: Resultat): void {
    const suivants = { ...resultats, [questionId]: resultat };
    setResultats(suivants);
    onQuestion?.(questionId, resultat);
    const final = resultatExercice(
      exercice.questions.map((q) => q.id),
      suivants
    );
    if (final) onTermine(final);
  }

  return (
    <article className="space-y-5 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
      <header className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
          {nomMarche(exercice.niveau)}
        </p>
        <h2 className="text-lg font-bold leading-snug text-slate-900 dark:text-slate-100">
          <TextWithMath text={exercice.titre} />
        </h2>
        <Reperes duree={exercice.duree} calculatrice={exercice.calculatrice} />
        <NotionsTravaillees notions={exercice.notions} />
        {exercice.source && <SourceDeLExercice source={exercice.source} matiere={matiere} />}
      </header>

      {exercice.preambule && (
        <div className={`rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50 ${TEXTE}`}>
          <TextWithMath text={exercice.preambule} />
        </div>
      )}
      {exercice.code && <CodeSource code={exercice.code} />}
      {exercice.figure && (
        <div className="overflow-x-auto">
          <FigureRenderer figure={exercice.figure} />
        </div>
      )}

      <ol className="space-y-5">
        {exercice.questions.map((question) => (
          <Question
            key={question.id}
            exercice={exercice}
            question={question}
            resultat={resultats[question.id]}
            onResultat={(r) => {
              noter(question.id, r);
            }}
          />
        ))}
      </ol>

      {bilan && (
        <p
          role="status"
          className="rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 dark:bg-slate-900/50 dark:text-slate-200"
        >
          {bilan === 'reussi'
            ? 'Exercice réussi : il compte pour ta progression.'
            : bilan === 'moitie'
              ? 'Exercice réussi à moitié : reprends les questions ratées avec les indices.'
              : 'Exercice à reprendre : relis le cours de la notion, puis réessaie.'}
        </p>
      )}
    </article>
  );
}
