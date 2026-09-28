import { Link, Navigate, useParams } from 'react-router-dom';
import { TextWithMath } from '@/components/math/TextWithMath';
import { NotionsTravaillees, Reperes, SourceDeLExercice } from '@/components/terminale/FicheExercice';
import TypeBacRunner from '@/components/terminale/TypeBacRunner';
import { segmentExercice } from '@/lib/terminale/entrainement';
import { cheminChapitre } from '@/lib/terminale/matieres';
import { storeProgression } from '@/stores/terminale-progression-store';
import { useChapitre } from './ChapitreLayout';
import { EtatExercice } from './ExercicesPage';

/** Onglet « Type bac » : les exercices au format de l'épreuve (charte § 7). */
export default function TypeBacPage() {
  const { chapitre, matiere } = useChapitre();
  const resultats = storeProgression(matiere.id)((s) => s.resultats);
  const base = `${cheminChapitre(chapitre.meta)}/type-bac`;
  const liste = [...chapitre.typeBac].sort((a, b) => a.ordre - b.ordre);

  if (liste.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
          Les exercices type bac de ce chapitre ne sont pas encore écrits.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-8 sm:py-8">
      <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        Chaque exercice a le format d’un exercice de l’épreuve : un barème par question, des
        résultats intermédiaires donnés pour ne pas rester bloqué, et une correction qui dit ce
        qui rapporte les points.
      </p>
      <ul className="grid gap-3 md:grid-cols-2">
        {liste.map((x) => (
          <li key={x.id}>
            <Link
              to={`${base}/${segmentExercice(x.id, chapitre.meta.slug)}`}
              className="flex h-full flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-500"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="font-semibold leading-snug text-slate-900 dark:text-slate-100">
                  <TextWithMath text={x.titre} />
                </span>
                <EtatExercice resultat={resultats[x.id]} />
              </span>
              <Reperes duree={x.duree} calculatrice={x.calculatrice} points={x.points} />
              <NotionsTravaillees notions={x.notions} />
              {x.source && <SourceDeLExercice source={x.source} matiere={matiere.id} />}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Un exercice type bac seul (`/type-bac/<num>`). */
export function TypeBacExercicePage() {
  const { chapitre, matiere } = useChapitre();
  const { exercice: segment = '' } = useParams<{ exercice: string }>();
  const noterResultat = storeProgression(matiere.id)((s) => s.noterResultat);
  const base = `${cheminChapitre(chapitre.meta)}/type-bac`;
  const liste = [...chapitre.typeBac].sort((a, b) => a.ordre - b.ordre);
  const rang = liste.findIndex((x) => segmentExercice(x.id, chapitre.meta.slug) === segment);
  const exercice = liste[rang];
  if (!exercice) return <Navigate to={base} replace />;
  const suivant = liste[rang + 1];

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-4 py-6 sm:px-8 sm:py-8">
      <Link
        to={base}
        className="inline-block text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        ← Tous les exercices type bac
      </Link>
      <TypeBacRunner
        key={exercice.id}
        exercice={exercice}
        matiere={matiere.id}
        onTermine={(r) => {
          noterResultat(exercice.id, r);
        }}
      />
      {suivant && (
        <Link
          to={`${base}/${segmentExercice(suivant.id, chapitre.meta.slug)}`}
          className="flex flex-col rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm transition-colors hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-500 sm:items-end sm:text-right"
        >
          <span className="text-xs text-slate-500 dark:text-slate-400">Exercice suivant →</span>
          <span className="mt-0.5 font-semibold text-slate-900 dark:text-slate-100">
            <TextWithMath text={suivant.titre} />
          </span>
        </Link>
      )}
    </div>
  );
}
