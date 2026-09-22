import type { Space, SpaceId } from '@/lib/spaces';
import {
  lignes,
  useGrandOralStore,
  type QuestionPerso,
} from '@/stores/grand-oral-store';

type Props = {
  index: number;
  question: QuestionPerso;
  /** Les spécialités de terminale, lues dans le registre des espaces. */
  specialites: readonly Space[];
};

const CHAMP =
  'mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500';

/** Rubriques comptées dans l'avancement d'une question. */
function rubriquesRemplies(q: QuestionPerso): number {
  return [
    q.specialites.length > 0,
    q.formulation.trim().length > 0,
    q.pourquoi.trim().length > 0,
    lignes(q.plan).length > 0,
    lignes(q.sources).length > 0,
  ].filter(Boolean).length;
}

const NB_RUBRIQUES = 5;

/** Cadre à remplir pour une des deux questions. Tout est enregistré à la frappe. */
export default function QuestionForm({ index, question, specialites }: Props) {
  const modifier = useGrandOralStore((s) => s.modifierQuestion);
  const effacer = useGrandOralStore((s) => s.effacerQuestion);
  const prefixe = `question-${index + 1}`;
  const remplies = rubriquesRemplies(question);

  function basculer(id: SpaceId) {
    const deja = question.specialites.includes(id);
    modifier(index, {
      specialites: deja
        ? question.specialites.filter((s) => s !== id)
        : [...question.specialites, id],
    });
  }

  function toutEffacer() {
    if (window.confirm(`Effacer tout le contenu de la question ${index + 1} ?`)) {
      effacer(index);
    }
  }

  const transversale = question.specialites.length > 1;

  return (
    <section
      id={prefixe}
      aria-labelledby={`${prefixe}-titre`}
      className="scroll-mt-20 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id={`${prefixe}-titre`}
          className="text-lg font-bold text-slate-900 dark:text-slate-100"
        >
          Question {index + 1}
        </h2>
        <span className="text-xs font-medium tabular-nums text-slate-500 dark:text-slate-400">
          {remplies} rubrique{remplies > 1 ? 's' : ''} sur {NB_RUBRIQUES}
        </span>
      </div>

      <fieldset className="mt-4">
        <legend className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Adossée à
        </legend>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {specialites.map((s) => {
            const actif = question.specialites.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={actif}
                onClick={() => {
                  basculer(s.id);
                }}
                className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                  actif
                    ? 'border-amber-500 bg-amber-500 text-white dark:border-amber-600 dark:bg-amber-600'
                    : 'border-slate-300 text-slate-600 hover:border-amber-400 dark:border-slate-600 dark:text-slate-300'
                }`}
              >
                {s.label}
              </button>
            );
          })}
          {transversale && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              question transversale
            </span>
          )}
        </div>
      </fieldset>

      <label className="mt-4 block text-sm" htmlFor={`${prefixe}-formulation`}>
        <span className="font-medium text-slate-700 dark:text-slate-300">Formulation</span>
        <textarea
          id={`${prefixe}-formulation`}
          rows={2}
          value={question.formulation}
          placeholder="Comment… ? Pourquoi… ? En quoi… ? Peut-on… ?"
          onChange={(e) => {
            modifier(index, { formulation: e.target.value });
          }}
          className={CHAMP}
        />
      </label>

      <label className="mt-4 block text-sm" htmlFor={`${prefixe}-pourquoi`}>
        <span className="font-medium text-slate-700 dark:text-slate-300">
          Pourquoi cette question
        </span>
        <span className="block text-xs text-slate-500 dark:text-slate-400">
          C’est par là que commence l’exposé : d’où elle vient, ce qu’elle t’apporte, le lien
          avec ton projet après le bac.
        </span>
        <textarea
          id={`${prefixe}-pourquoi`}
          rows={3}
          value={question.pourquoi}
          onChange={(e) => {
            modifier(index, { pourquoi: e.target.value });
          }}
          className={CHAMP}
        />
      </label>

      <label className="mt-4 block text-sm" htmlFor={`${prefixe}-plan`}>
        <span className="font-medium text-slate-700 dark:text-slate-300">Plan</span>
        <span className="block text-xs text-slate-500 dark:text-slate-400">
          Une partie par ligne.
        </span>
        <textarea
          id={`${prefixe}-plan`}
          rows={4}
          value={question.plan}
          onChange={(e) => {
            modifier(index, { plan: e.target.value });
          }}
          className={CHAMP}
        />
      </label>

      <label className="mt-4 block text-sm" htmlFor={`${prefixe}-sources`}>
        <span className="font-medium text-slate-700 dark:text-slate-300">Sources</span>
        <span className="block text-xs text-slate-500 dark:text-slate-400">
          Une par ligne : chapitre du cours, manuel, article, site d’un organisme scientifique.
        </span>
        <textarea
          id={`${prefixe}-sources`}
          rows={3}
          value={question.sources}
          onChange={(e) => {
            modifier(index, { sources: e.target.value });
          }}
          className={CHAMP}
        />
      </label>

      {remplies > 0 && (
        <div className="mt-4 text-right">
          <button
            type="button"
            onClick={toutEffacer}
            className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-red-400"
          >
            Effacer cette question
          </button>
        </div>
      )}
    </section>
  );
}
