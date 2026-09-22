import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import LigneNote from '@/components/simulateur/LigneNote';
import Repartition from '@/components/simulateur/Repartition';
import { ACCENT_PAR_DEFAUT, MENTION_CARD, MENTION_TEXTE } from '@/lib/bac-accents';
import { BLOC_LABEL, BLOC_ORDER } from '@/lib/bac-content';
import {
  ANNEE_LABEL,
  fmt,
  gainParPoint,
  leviers,
  listSimulateurLignes,
  mentionPour,
  moyenne as calculeMoyenne,
  noteDe,
  potentiel,
  prochainPalier,
  totalSimulateur,
} from '@/lib/simulateur';
import { CIBLES, useSimulateurStore } from '@/stores/simulateur-store';

/**
 * Simulateur de moyenne au bac, session 2027.
 *
 * Porté du dépôt `notes-bac-visualisateur`, mais branché sur
 * `content/bac/coefficients.json` : aucun coefficient n'est réécrit ici.
 */

const lignes = listSimulateurLignes();
const lignesDePremiere = lignes.filter((l) => l.annee === 'premiere').map((l) => l.id);

function Segment<T extends string | number>({
  valeur,
  options,
  onChange,
  label,
}: {
  valeur: T;
  options: readonly { valeur: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex rounded-lg border border-slate-200 p-0.5 dark:border-slate-700"
    >
      {options.map((o) => (
        <button
          key={String(o.valeur)}
          type="button"
          onClick={() => onChange(o.valeur)}
          aria-pressed={o.valeur === valeur}
          className={`rounded-md px-3 py-1 text-xs font-semibold ${
            o.valeur === valeur
              ? 'bg-sky-600 text-white'
              : 'text-slate-600 hover:text-sky-700 dark:text-slate-300 dark:hover:text-sky-400'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function SimulateurPage() {
  const notes = useSimulateurStore((s) => s.notes);
  const figees = useSimulateurStore((s) => s.figees);
  const cible = useSimulateurStore((s) => s.cible);
  const mesure = useSimulateurStore((s) => s.mesure);
  const setNote = useSimulateurStore((s) => s.setNote);
  const toggleFigee = useSimulateurStore((s) => s.toggleFigee);
  const figerLignes = useSimulateurStore((s) => s.figerLignes);
  const setCible = useSimulateurStore((s) => s.setCible);
  const setMesure = useSimulateurStore((s) => s.setMesure);
  const reinitialiser = useSimulateurStore((s) => s.reinitialiser);

  const moyenne = useMemo(() => calculeMoyenne(notes), [notes]);
  const mention = mentionPour(moyenne);
  const suivant = prochainPalier(moyenne);
  const troisLeviers = useMemo(() => leviers(notes, figees, 3), [notes, figees]);
  const total = totalSimulateur();
  const figeesCount = lignes.filter((l) => figees[l.id]).length;
  const accent = mention?.accent ?? ACCENT_PAR_DEFAUT;
  const premiereToutesFigees = lignesDePremiere.every((id) => figees[id]);

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <header>
        <span className="inline-block rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
          Session 2027
        </span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Simulateur de moyenne
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Règle chaque note et regarde la moyenne bouger. Les {total} coefficients
          viennent du barème officiel, celui de{' '}
          <Link to="/le-bac" className="font-medium text-sky-700 hover:underline dark:text-sky-400">
            « Le bac, mode d’emploi »
          </Link>
          . Rien n’est envoyé nulle part : tes notes restent dans ce navigateur.
        </p>
      </header>

      {/* Résultat */}
      <section
        aria-label="Résultat"
        className={`rounded-xl border p-5 ${MENTION_CARD[accent]}`}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Moyenne finale
            </p>
            <p className={`text-4xl font-bold tabular-nums ${MENTION_TEXTE[accent]}`}>
              {fmt(moyenne)}
              <span className="text-lg font-semibold text-slate-500 dark:text-slate-400">
                {' '}
                / 20
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className={`text-lg font-bold ${MENTION_TEXTE[accent]}`}>
              {mention?.label ?? '—'}
            </p>
            {mention?.reglementaire === false && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Distinction du jury, pas un seuil fixé par les textes.
              </p>
            )}
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
          {suivant
            ? `Il manque ${fmt(suivant.seuil - moyenne)} de moyenne pour « ${suivant.label} ».`
            : 'Le palier le plus haut est atteint.'}
        </p>
        {mention?.resume && (
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {mention.resume}
          </p>
        )}
      </section>

      {/* Répartition */}
      <section aria-labelledby="repartition" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2
            id="repartition"
            className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
          >
            Où est le poids
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <Segment
              label="Mesure de la répartition"
              valeur={mesure}
              onChange={setMesure}
              options={[
                { valeur: 'contribution' as const, label: 'Ce que ça rapporte' },
                { valeur: 'coefficient' as const, label: 'Le coefficient' },
              ]}
            />
            <label className="text-xs text-slate-600 dark:text-slate-400">
              Objectif{' '}
              <select
                value={cible}
                onChange={(e) => setCible(Number(e.target.value))}
                className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              >
                {CIBLES.map((c) => (
                  <option key={c} value={c}>
                    {c}/20
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <Repartition
          lignes={lignes}
          notes={notes}
          figees={figees}
          mesure={mesure}
          cible={cible}
          moyenne={moyenne}
        />
      </section>

      {/* Leviers */}
      <section aria-labelledby="leviers" className="space-y-3">
        <h2
          id="leviers"
          className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
        >
          Ce qui rapporte le plus
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Parmi les notes non figées, celles où il reste le plus à gagner : le
          coefficient compte, mais une note déjà haute ne peut plus beaucoup monter.
        </p>
        {troisLeviers.length === 0 ? (
          <p className="rounded-lg border border-slate-200 p-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
            Plus rien à régler : toutes les notes sont figées ou déjà à 20.
          </p>
        ) : (
          <ol className="grid gap-2 sm:grid-cols-3">
            {troisLeviers.map((ligne) => (
              <li
                key={ligne.id}
                className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {ligne.label}
                  {ligne.partagee && (
                    <span className="font-normal text-slate-500 dark:text-slate-400">
                      {' '}
                      — {ANNEE_LABEL[ligne.annee]}
                    </span>
                  )}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  coef {ligne.coefficient} · +{fmt(gainParPoint(ligne))} de moyenne par
                  point gagné
                </p>
                <p className="mt-1 text-xs font-medium text-sky-700 dark:text-sky-400">
                  jusqu’à +{fmt(potentiel(ligne, noteDe(notes, ligne.id)))} si la note
                  montait à 20
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Réglages */}
      <section aria-labelledby="notes" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2
            id="notes"
            className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
          >
            Tes notes
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => figerLignes(lignesDePremiere, !premiereToutesFigees)}
              className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-sky-700 dark:hover:text-sky-400"
            >
              {premiereToutesFigees
                ? 'Libérer la première'
                : 'Figer toute la première'}
            </button>
            <button
              type="button"
              onClick={reinitialiser}
              className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-rose-300 hover:text-rose-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-rose-700 dark:hover:text-rose-400"
            >
              Tout remettre à zéro
            </button>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Le cadenas 🔒 sert aux notes déjà connues : elles comptent dans la moyenne,
          mais le simulateur ne propose plus de les faire bouger.{' '}
          {figeesCount > 0
            ? `${figeesCount} note${figeesCount > 1 ? 's' : ''} figée${figeesCount > 1 ? 's' : ''} sur ${lignes.length}.`
            : `Aucune note figée pour l’instant, sur ${lignes.length}.`}
        </p>

        {BLOC_ORDER.map((bloc) => {
          const dedans = lignes.filter((l) => l.bloc === bloc);
          if (dedans.length === 0) return null;
          const somme = dedans.reduce((s, l) => s + l.coefficient, 0);
          return (
            <div key={bloc} className="space-y-2">
              <div className="flex items-baseline justify-between gap-2 border-b border-slate-200 pb-1 dark:border-slate-700">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {BLOC_LABEL[bloc]}
                </h3>
                <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                  coef {somme}
                </span>
              </div>
              <div className="grid gap-2">
                {dedans.map((ligne) => (
                  <LigneNote
                    key={ligne.id}
                    ligne={ligne}
                    note={noteDe(notes, ligne.id)}
                    figee={Boolean(figees[ligne.id])}
                    onNote={(v) => setNote(ligne.id, v)}
                    onFigee={() => toggleFigee(ligne.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <p className="border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
        Les {total} coefficients et les paliers de mention viennent de{' '}
        <code>content/bac/coefficients.json</code> et <code>content/bac/mentions.json</code>,
        chacun rattaché à son texte officiel sur la page{' '}
        <Link to="/le-bac" className="font-medium text-sky-700 hover:underline dark:text-sky-400">
          « Le bac, mode d’emploi »
        </Link>
        .
      </p>
    </div>
  );
}
