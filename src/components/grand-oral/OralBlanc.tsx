import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import RevealPanel from '@/francais/components/oral/RevealPanel';
import {
  TEMPS_ID,
  listGrandOralCriteres,
  listGrandOralRelances,
  tempsMinutes,
} from '@/lib/grand-oral-content';
import type { GrandOralRelance } from '@/lib/grand-oral-types';
import {
  basculerPause,
  enMarche,
  formatDuree,
  nouvelleSeance,
  phaseSuivante,
  restantSecondes,
  seanceFinie,
  type Seance,
} from '@/lib/oral-blanc';
import { shuffle } from '@/lib/randomizer';
import {
  estFormulee,
  lignes,
  useGrandOralStore,
  type NiveauAuto,
} from '@/stores/grand-oral-store';
import Minuteur from './Minuteur';
import RelanceCard from './RelanceCard';
import { Refs } from '@/components/shared/Sources';

/** Relances proposées d'emblée pendant l'échange (on peut en tirer d'autres). */
export const NB_RELANCES = 3;

export const NIVEAUX: readonly { id: NiveauAuto; label: string }[] = [
  { id: 'a-retravailler', label: 'À retravailler' },
  { id: 'correct', label: 'Correct' },
  { id: 'solide', label: 'Solide' },
] as const;

type Etape = 'choix' | 'seance' | 'bilan' | 'fini';

/** La question travaillée : une des deux (index) ou une question libre (`null`). */
type Tirage = { index: number | null; texte: string };

const BOUTON =
  'rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-600 dark:hover:bg-amber-500';
const BOUTON_SECONDAIRE =
  'rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700';

/** Relances de départ : on mêle les catégories plutôt que d'en tirer trois pareilles. */
function tirerRelances(toutes: readonly GrandOralRelance[], n: number): GrandOralRelance[] {
  const parCategorie = new Map<string, GrandOralRelance[]>();
  for (const r of shuffle(toutes)) {
    parCategorie.set(r.categorie, [...(parCategorie.get(r.categorie) ?? []), r]);
  }
  const tirees: GrandOralRelance[] = [];
  const files = shuffle([...parCategorie.values()]);
  while (tirees.length < n && files.some((f) => f.length > 0)) {
    for (const file of files) {
      const r = file.shift();
      if (r && tirees.length < n) tirees.push(r);
    }
  }
  return tirees;
}

/**
 * Oral blanc du grand oral : tirage d'une des deux questions, puis les temps
 * officiels minutés (préparation, exposé, échange), des relances de jury, et
 * une auto-évaluation sur les critères du texte officiel.
 */
export default function OralBlanc() {
  const questions = useGrandOralStore((s) => s.questions);
  const ajouterBilan = useGrandOralStore((s) => s.ajouterBilan);
  const phases = useMemo(() => tempsMinutes(), []);
  const criteres = useMemo(() => listGrandOralCriteres(), []);
  const relances = useMemo(() => listGrandOralRelances(), []);

  const formulees = questions
    .map((q, index) => ({ q, index }))
    .filter(({ q }) => estFormulee(q));

  const [etape, setEtape] = useState<Etape>('choix');
  const [tirage, setTirage] = useState<Tirage | null>(null);
  const [libre, setLibre] = useState('');
  const [seance, setSeance] = useState<Seance | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [relancesTirees, setRelancesTirees] = useState<GrandOralRelance[]>([]);
  const [auto, setAuto] = useState<Record<string, NiveauAuto>>({});
  const [note, setNote] = useState('');

  const tourne = etape === 'seance' && seance !== null && enMarche(seance.chrono);
  useEffect(() => {
    if (!tourne) return;
    const id = window.setInterval(() => {
      setNow(Date.now());
    }, 250);
    return () => {
      window.clearInterval(id);
    };
  }, [tourne]);

  function tirerAuSort() {
    const choisie = shuffle(formulees)[0];
    if (choisie) setTirage({ index: choisie.index, texte: choisie.q.formulation.trim() });
  }

  function demarrer() {
    const question = tirage ?? (libre.trim() ? { index: null, texte: libre.trim() } : null);
    if (!question || phases.length === 0) return;
    const t = Date.now();
    setTirage(question);
    setSeance(nouvelleSeance(t));
    setNow(t);
    setRelancesTirees(tirerRelances(relances, NB_RELANCES));
    setAuto({});
    setNote('');
    setEtape('seance');
  }

  function suivante() {
    if (!seance) return;
    const t = Date.now();
    const next = phaseSuivante(seance, phases.length, t);
    setSeance(next);
    setNow(t);
    if (seanceFinie(next, phases.length)) setEtape('bilan');
  }

  function autreRelance() {
    const deja = new Set(relancesTirees.map((r) => r.id));
    const reste = relances.filter((r) => !deja.has(r.id));
    const r = shuffle(reste)[0];
    if (r) setRelancesTirees((list) => [...list, r]);
  }

  function enregistrer() {
    if (!seance || !tirage) return;
    const durees: Record<string, number> = {};
    phases.forEach((p, i) => {
      const s = seance.realise[i];
      if (s !== undefined) durees[p.id] = s;
    });
    ajouterBilan({
      id: `ob-${Date.now()}`,
      date: new Date().toISOString(),
      question: tirage.texte,
      questionIndex: tirage.index,
      durees,
      auto,
      note: note.trim(),
    });
    setEtape('fini');
  }

  function recommencer() {
    setEtape('choix');
    setTirage(null);
    setSeance(null);
    setLibre('');
  }

  // --- CHOIX DE LA QUESTION ---
  if (etape === 'choix') {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            1. La question
          </h2>
          {formulees.length === 0 && (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Tes deux questions ne sont pas encore écrites.{' '}
              <Link
                to="/terminale/grand-oral/questions"
                className="font-medium text-amber-700 underline underline-offset-2 dark:text-amber-400"
              >
                Remplis « Mes 2 questions »
              </Link>{' '}
              pour que l’oral blanc tire l’une d’elles au sort.
            </p>
          )}
          {formulees.length === 1 && (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Une seule question est formulée : c’est elle qui sera travaillée.
            </p>
          )}

          {formulees.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {formulees.length > 1 ? (
                <button type="button" onClick={tirerAuSort} className={BOUTON_SECONDAIRE}>
                  {tirage ? 'Tirer à nouveau' : 'Tirer au sort'}
                </button>
              ) : (
                formulees.map(({ q, index }) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setTirage({ index, texte: q.formulation.trim() });
                    }}
                    className={BOUTON_SECONDAIRE}
                  >
                    Choisir la question {index + 1}
                  </button>
                ))
              )}
            </div>
          )}

          {tirage && (
            <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/40">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
                Question {tirage.index !== null ? tirage.index + 1 : 'libre'}
              </p>
              <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                {tirage.texte}
              </p>
            </div>
          )}

          {!tirage && (
            <label className="mt-4 block text-sm" htmlFor="oral-blanc-libre">
              <span className="text-slate-700 dark:text-slate-300">
                {formulees.length === 0 ? 'Ou écris' : 'Ou bien écris'} une question pour cette
                fois :
              </span>
              <input
                id="oral-blanc-libre"
                type="text"
                value={libre}
                onChange={(e) => {
                  setLibre(e.target.value);
                }}
                className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
              />
            </label>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            2. Les temps officiels
          </h2>
          <ol className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            {phases.map((p, i) => (
              <li key={p.id} className="flex items-center gap-2">
                {i > 0 && (
                  <span className="text-slate-400" aria-hidden="true">
                    →
                  </span>
                )}
                <span className="rounded bg-slate-100 px-2 py-1 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                  {p.titre} · <span className="font-semibold tabular-nums">{p.minutes} min</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Le minuteur ne te coupe pas : une fois le temps écoulé, il compte le dépassement.
          </p>
          <button
            type="button"
            onClick={demarrer}
            disabled={!tirage && libre.trim().length === 0}
            className={`mt-4 ${BOUTON}`}
          >
            Démarrer la préparation
          </button>
        </div>
      </div>
    );
  }

  // --- SÉANCE MINUTÉE ---
  if (etape === 'seance' && seance && tirage) {
    const phase = phases[seance.index];
    if (!phase) return null;
    const dureeSecondes = phase.minutes * 60;
    const restant = restantSecondes(dureeSecondes, seance.chrono, now);
    const derniere = seance.index === phases.length - 1;
    const question = tirage.index !== null ? questions[tirage.index] : undefined;
    const plan = question ? lignes(question.plan) : [];

    return (
      <div className="space-y-4">
        <ol className="flex flex-wrap gap-2 text-xs" aria-label="Étapes de l’oral blanc">
          {phases.map((p, i) => (
            <li
              key={p.id}
              aria-current={i === seance.index ? 'step' : undefined}
              className={`rounded-full px-3 py-1 font-medium ${
                i === seance.index
                  ? 'bg-amber-600 text-white'
                  : i < seance.index
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
              }`}
            >
              {p.titre}
            </li>
          ))}
        </ol>

        <Minuteur
          titre={phase.titre}
          dureeSecondes={dureeSecondes}
          restant={restant}
          enPause={!enMarche(seance.chrono)}
        />

        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              const t = Date.now();
              setSeance(basculerPause(seance, t));
              setNow(t);
            }}
            className={BOUTON_SECONDAIRE}
          >
            {enMarche(seance.chrono) ? 'Pause' : 'Reprendre'}
          </button>
          <button type="button" onClick={suivante} className={BOUTON}>
            {derniere ? 'Terminer l’oral' : `Passer à : ${phases[seance.index + 1]?.titre ?? ''}`}
          </button>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
            Question {tirage.index !== null ? tirage.index + 1 : 'libre'}
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {tirage.texte}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {phase.resume}
            <Refs ids={phase.sources} />
          </p>
        </div>

        {phase.id === TEMPS_ID.preparation && plan.length > 0 && (
          <RevealPanel label="Revoir mon plan" hideLabel="Cacher mon plan">
            <ol className="ml-5 list-decimal space-y-1">
              {plan.map((partie) => (
                <li key={partie}>{partie}</li>
              ))}
            </ol>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Le jour J, tu refais ce plan de mémoire : essaie d’abord sans regarder.
            </p>
          </RevealPanel>
        )}

        {phase.id === TEMPS_ID.echange && (
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Relances du jury
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Lis une relance à voix haute (ou fais-la lire par quelqu’un), réponds, puis
              compare avec les pistes.
            </p>
            {relancesTirees.map((r) => (
              <RelanceCard key={r.id} relance={r} />
            ))}
            {relancesTirees.length < relances.length && (
              <button type="button" onClick={autreRelance} className={BOUTON_SECONDAIRE}>
                Une autre relance
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // --- BILAN ---
  if (etape === 'bilan' && seance && tirage) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Le temps
          </h2>
          <table className="mt-2 w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                <th className="py-1.5 pr-2 font-semibold">Temps</th>
                <th className="py-1.5 pr-2 text-right font-semibold">Prévu</th>
                <th className="py-1.5 text-right font-semibold">Réalisé</th>
              </tr>
            </thead>
            <tbody>
              {phases.map((p, i) => {
                const realise = seance.realise[i] ?? 0;
                const prevu = p.minutes * 60;
                return (
                  <tr key={p.id} className="border-b border-slate-100 dark:border-slate-700/60">
                    <td className="py-1.5 pr-2 text-slate-800 dark:text-slate-200">{p.titre}</td>
                    <td className="py-1.5 pr-2 text-right tabular-nums text-slate-600 dark:text-slate-400">
                      {formatDuree(prevu)}
                    </td>
                    <td
                      className={`py-1.5 text-right font-semibold tabular-nums ${
                        realise > prevu
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {formatDuree(realise)}
                      {realise > prevu && (
                        <span className="block text-xs font-normal">
                          dépassé de {formatDuree(realise - prevu)}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Auto-évaluation
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Les critères que le texte officiel dit valoriser, sans points.
            <Refs ids={criteres[0]?.sources ?? []} />
          </p>
          <ul className="mt-3 space-y-4">
            {criteres.map((c) => (
              <li key={c.id}>
                <fieldset>
                  <legend className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {c.label}
                  </legend>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{c.aide}</p>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {NIVEAUX.map((n) => {
                      const actif = auto[c.id] === n.id;
                      return (
                        <button
                          key={n.id}
                          type="button"
                          aria-pressed={actif}
                          onClick={() => {
                            setAuto((a) => ({ ...a, [c.id]: n.id }));
                          }}
                          className={`rounded-full border px-3 py-1 text-xs font-medium ${
                            actif
                              ? 'border-amber-500 bg-amber-500 text-white dark:border-amber-600 dark:bg-amber-600'
                              : 'border-slate-300 text-slate-600 hover:border-amber-400 dark:border-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {n.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              </li>
            ))}
          </ul>

          <label className="mt-4 block text-sm" htmlFor="oral-blanc-note">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Ce qui a tenu, ce qui a lâché
            </span>
            <textarea
              id="oral-blanc-note"
              rows={3}
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
              }}
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={enregistrer} className={BOUTON}>
            Enregistrer le bilan
          </button>
          <button type="button" onClick={recommencer} className={BOUTON_SECONDAIRE}>
            Recommencer sans enregistrer
          </button>
        </div>
      </div>
    );
  }

  // --- FINI ---
  return (
    <div className="space-y-4 rounded-lg border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-800 dark:bg-amber-950/40">
      <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
        Oral blanc enregistré.
      </p>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Il apparaît dans l’historique ci-dessous.
      </p>
      <button type="button" onClick={recommencer} className={BOUTON}>
        Nouvel oral blanc
      </button>
    </div>
  );
}
