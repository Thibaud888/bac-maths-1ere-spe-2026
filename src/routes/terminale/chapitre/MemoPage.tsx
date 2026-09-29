import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import CarteMemo from '@/components/terminale/CarteMemo';
import { getNotion, prioriteDe, trierParPriorite } from '@/lib/terminale/content';
import { cheminChapitre } from '@/lib/terminale/matieres';
import { storeProgression, type ModeMemo } from '@/stores/terminale-progression-store';
import { useChapitre } from './ChapitreLayout';

const TITRE_SECTION = 'text-lg font-bold text-slate-900 dark:text-slate-100';

/**
 * Onglet « Mémo » (charte § 8), juste après le cours : les cartes rangées par priorité,
 * simplifiées à la première visite (puis le dernier affichage choisi), et le lien vers
 * les questions éclair de l'onglet Exercices.
 */
export default function MemoPage() {
  const { chapitre, matiere } = useChapitre();
  const store = storeProgression(matiere.id);
  const mode = store((s) => s.modeMemo);
  const setMode = store((s) => s.choisirModeMemo);
  const cartes = useMemo(
    () =>
      trierParPriorite(
        chapitre.memo.map((c) => ({ ...c, ordre: getNotion(c.notion)?.ordre ?? 0 })),
        (c) => prioriteDe(c.notion)
      ),
    [chapitre]
  );
  const bouton = (valeur: ModeMemo, libelle: string) => (
    <button
      type="button"
      aria-pressed={mode === valeur}
      onClick={() => {
        setMode(valeur);
      }}
      className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
        mode === valeur
          ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-600 dark:text-slate-100'
          : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100'
      }`}
    >
      {libelle}
    </button>
  );

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-6 sm:px-8 sm:py-8">
      <section aria-labelledby="cartes" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="cartes" className={TITRE_SECTION}>
            L’essentiel à retenir
          </h2>
          {cartes.length > 0 && (
            <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800" role="group" aria-label="Affichage des cartes">
              {bouton('simplifie', 'Simplifié')}
              {bouton('detaille', 'Détaillé')}
            </div>
          )}
        </div>
        {cartes.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Le mémo de ce chapitre n’est pas encore écrit.</p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {cartes.map((carte) => (
              <li key={carte.id}>
                <CarteMemo carte={carte} notion={getNotion(carte.notion)} mode={mode} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {chapitre.flash.length > 0 && (
        <Link
          to={`${cheminChapitre(chapitre.meta)}/exercices/eclair`}
          className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-500 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>
            <span className="block font-semibold text-slate-900 dark:text-slate-100">Retenu ? Teste-toi</span>
            <span className="block text-sm text-slate-600 dark:text-slate-400">
              {chapitre.flash.length} questions éclair, moins d’une minute chacune.
            </span>
          </span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Commencer →</span>
        </Link>
      )}
    </div>
  );
}
