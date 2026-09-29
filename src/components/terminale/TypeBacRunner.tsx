import { useState } from 'react';
import { TextWithMath } from '@/components/math/TextWithMath';
import FigureRenderer from '@/components/figures/FigureRenderer';
import Timer from '@/components/shared/Timer';
import AideQuestion from '@/components/terminale/AideQuestion';
import CodeSource from '@/components/terminale/CodeSource';
import { NotionsTravaillees, Reperes, SourceDeLExercice } from '@/components/terminale/FicheExercice';
import QuestionVerifiable from '@/components/terminale/QuestionVerifiable';
import { pointsTypeBac, resultatDePart } from '@/lib/terminale/entrainement';
import type { Resultat } from '@/lib/terminale/progression';
import type {
  Code,
  ExerciceTypeBac,
  Matiere,
  Reponse,
  ReponseVerifiable,
} from '@/lib/terminale/types';

const TEXTE =
  'text-[15px] leading-relaxed text-slate-800 dark:text-slate-200 [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden';

function points(n: number): string {
  return `${String(n).replace('.', ',')} pt${n > 1 ? 's' : ''}`;
}

/** Ce qui se corrige et se note : une question simple ou une sous-question. */
type ElementNote = {
  cle: string;
  label: string;
  enonce: string;
  code?: Code | undefined;
  points: number;
  reponse?: Reponse | undefined;
  indices?: string[] | undefined;
  revoir?: string | undefined;
  attenduCorrecteur: string;
  solution: string;
  erreurFrequente?: string | undefined;
};

function Element({
  element,
  resultat,
  onResultat,
}: {
  element: ElementNote;
  resultat: Resultat | undefined;
  onResultat: (r: Resultat) => void;
}) {
  const reponse: ReponseVerifiable | undefined =
    element.reponse && element.reponse.type !== 'redaction' ? element.reponse : undefined;
  const [demandeReponse, setDemandeReponse] = useState(0);
  return (
    <div className="flex gap-2">
      <span className="shrink-0 font-bold text-slate-900 dark:text-slate-100">{element.label}</span>
      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {reponse ? (
              <QuestionVerifiable
                graine={element.cle}
                question={{
                  enonce: element.enonce,
                  ...(element.code ? { code: element.code } : {}),
                  reponse,
                  explication: `${element.solution}\n\n**Ce qu'attend le correcteur :** ${element.attenduCorrecteur}`,
                }}
                onRepondre={(juste) => {
                  onResultat(juste ? 'reussi' : 'rate');
                }}
                boutonReponse={false}
                demandeReponse={demandeReponse}
              />
            ) : (
              <>
                <div className={TEXTE}>
                  <TextWithMath text={element.enonce} />
                </div>
                {element.code && (
                  <div className="mt-3">
                    <CodeSource code={element.code} />
                  </div>
                )}
              </>
            )}
          </div>
          <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            {points(element.points)}
          </span>
        </div>
        <AideQuestion
          indices={element.indices}
          revoir={element.revoir}
          solution={reponse ? undefined : element.solution}
          attenduCorrecteur={reponse ? undefined : element.attenduCorrecteur}
          erreurFrequente={element.erreurFrequente}
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
  );
}

type Props = {
  exercice: ExerciceTypeBac;
  matiere: Matiere;
  onTermine: (resultat: Resultat) => void;
};

/**
 * Un exercice au format de l'épreuve (charte § 7) : barème par question, chronomètre
 * facultatif, correction avec « ce qu'attend le correcteur », estimation des points.
 */
export default function TypeBacRunner({ exercice, matiere, onTermine }: Props) {
  const [resultats, setResultats] = useState<Record<string, Resultat>>({});
  const [chrono, setChrono] = useState(false);
  const bilan = pointsTypeBac(exercice, resultats);

  function noter(cle: string, resultat: Resultat): void {
    const suivants = { ...resultats, [cle]: resultat };
    setResultats(suivants);
    const b = pointsTypeBac(exercice, suivants);
    if (b.complet && b.total > 0) onTermine(resultatDePart(b.obtenus / b.total));
  }

  return (
    <article className="space-y-5 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
      <header className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
          Exercice type bac
        </p>
        <h2 className="text-lg font-bold leading-snug text-slate-900 dark:text-slate-100">
          <TextWithMath text={exercice.titre} />
        </h2>
        <Reperes duree={exercice.duree} calculatrice={exercice.calculatrice} points={exercice.points} />
        <NotionsTravaillees notions={exercice.notions} />
        {exercice.source && <SourceDeLExercice source={exercice.source} matiere={matiere} />}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {chrono ? (
            <>
              <Timer durationSeconds={exercice.duree * 60} />
              <button
                type="button"
                onClick={() => {
                  setChrono(false);
                }}
                className="text-xs text-slate-500 underline underline-offset-2 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Arrêter le chronomètre
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setChrono(true);
              }}
              className="rounded-md border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Lancer le chronomètre ({exercice.duree} min)
            </button>
          )}
        </div>
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
        {exercice.questions.map((q) => (
          <li key={q.id} className="space-y-4 border-t border-slate-200 pt-4 first:border-t-0 first:pt-0 dark:border-slate-700">
            {q.sousQuestions && q.sousQuestions.length > 0 ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-1 gap-2">
                    <span className="shrink-0 font-bold text-slate-900 dark:text-slate-100">{q.label}</span>
                    <div className={`min-w-0 flex-1 ${TEXTE}`}>
                      <TextWithMath text={q.enonce} />
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-500 dark:text-slate-400">
                    {points(q.points)}
                  </span>
                </div>
                {q.code && <CodeSource code={q.code} />}
                <div className="space-y-5 pl-4 sm:pl-6">
                  {q.sousQuestions.map((s) => (
                    <Element
                      key={s.id}
                      element={{ ...s, cle: `${q.id}.${s.id}` }}
                      resultat={resultats[`${q.id}.${s.id}`]}
                      onResultat={(r) => {
                        noter(`${q.id}.${s.id}`, r);
                      }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <Element
                element={{
                  cle: q.id,
                  label: q.label,
                  enonce: q.enonce,
                  code: q.code,
                  points: q.points,
                  reponse: q.reponse,
                  indices: q.indices,
                  revoir: q.revoir,
                  attenduCorrecteur: q.attenduCorrecteur ?? '',
                  solution: q.solution ?? '',
                  erreurFrequente: q.erreurFrequente,
                }}
                resultat={resultats[q.id]}
                onResultat={(r) => {
                  noter(q.id, r);
                }}
              />
            )}
          </li>
        ))}
      </ol>

      {Object.keys(resultats).length > 0 && (
        <p role="status" className="rounded-lg bg-slate-50 px-4 py-3 text-sm dark:bg-slate-900/50">
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            Tu estimes avoir {String(Math.round(bilan.obtenus * 100) / 100).replace('.', ',')} sur{' '}
            {String(bilan.total).replace('.', ',')} points
          </span>
          <span className="text-slate-600 dark:text-slate-400">
            {bilan.complet ? '.' : ' pour l’instant (toutes les questions ne sont pas notées).'}
          </span>
        </p>
      )}
    </article>
  );
}
