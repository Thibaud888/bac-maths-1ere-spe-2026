import { useMemo, useState } from 'react';
import CarteMemo from '@/components/terminale/CarteMemo';
import SerieEclair from '@/components/terminale/SerieEclair';
import { getNotion, prioriteDe, trierParPriorite } from '@/lib/terminale/content';
import { serieEclair } from '@/lib/terminale/entrainement';
import { storeProgression } from '@/stores/terminale-progression-store';
import { useChapitre } from './ChapitreLayout';

const TITRE_SECTION = 'text-lg font-bold text-slate-900 dark:text-slate-100';

/**
 * Onglet « Mémo » (charte § 8) : les cartes rangées par priorité, en mode détaillé ou
 * simplifié, puis « Teste-toi » avec les questions éclair du chapitre.
 */
export default function MemoPage() {
  const { chapitre, matiere } = useChapitre();
  const [mode, setMode] = useState<'detaille' | 'simplifie'>('detaille');
  const noterEclair = storeProgression(matiere.id)((s) => s.noterEclair);
  const cartes = useMemo(
    () =>
      trierParPriorite(
        chapitre.memo.map((c) => ({ ...c, ordre: getNotion(c.notion)?.ordre ?? 0 })),
        (c) => prioriteDe(c.notion)
      ),
    [chapitre]
  );
  const questions = useMemo(() => serieEclair(chapitre.flash, (n) => prioriteDe(n)), [chapitre]);

  const bouton = (valeur: 'detaille' | 'simplifie', libelle: string) => (
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
              {bouton('detaille', 'Détaillé')}
              {bouton('simplifie', 'Simplifié')}
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

      {questions.length > 0 && (
        <section aria-labelledby="eclair" className="space-y-4">
          <div>
            <h2 id="eclair" className={TITRE_SECTION}>
              Teste-toi
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {questions.length} questions éclair, moins d’une minute chacune, les plus importantes d’abord.
            </p>
          </div>
          <SerieEclair questions={questions} onRepondre={noterEclair} />
        </section>
      )}
    </div>
  );
}
