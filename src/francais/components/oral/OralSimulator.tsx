import { useMemo, useState } from 'react';
import { shuffle } from '@/lib/randomizer';
import { useFrenchAppStore } from '@/francais/stores/french-app-store';
import { useFrenchProgressStore } from '@/francais/stores/french-progress-store';
import type { EntretienQuestion, OralText } from '@/francais/lib/french-types';
import AdjustableTimer from './AdjustableTimer';
import OralTextBody from './OralTextBody';
import OralTextDetail from './OralTextDetail';
import RevealPanel from './RevealPanel';
import { EntretienQuestionCard } from './EntretienQuestionList';
import { grammairePointLabel } from './oral-labels';

type OralSimulatorProps = {
  textes: OralText[];
  entretien: EntretienQuestion[];
};

type Phase = 'setup' | 'prep' | 'grammar' | 'entretien' | 'eval' | 'done';

type EvalCriterion = { key: string; label: string; max: number };

const CRITERIA: EvalCriterion[] = [
  { key: 'lecture', label: 'Lecture à voix haute', max: 2 },
  { key: 'explication', label: 'Explication linéaire', max: 8 },
  { key: 'grammaire', label: 'Question de grammaire', max: 2 },
  { key: 'entretien', label: 'Présentation & entretien', max: 8 },
];

function pickEntretien(all: EntretienQuestion[], oeuvre: string, n: number): EntretienQuestion[] {
  const forOeuvre = all.filter((q) => q.oeuvre === oeuvre);
  const transverse = all.filter((q) => q.oeuvre.toLowerCase() === 'transverse');
  const pool = forOeuvre.length > 0 ? forOeuvre : all;
  const picked = shuffle([...pool]).slice(0, n);
  if (picked.length < n) {
    for (const q of shuffle([...transverse])) {
      if (picked.length >= n) break;
      if (!picked.includes(q)) picked.push(q);
    }
  }
  return picked;
}

export default function OralSimulator({ textes, entretien }: OralSimulatorProps) {
  const defaultMinutes = useFrenchAppStore((s) => s.simulateurDefaultMinutes);
  const setDefaultMinutes = useFrenchAppStore((s) => s.setSimulateurDefaultMinutes);
  const recordAttempt = useFrenchProgressStore((s) => s.recordAttempt);

  const oeuvres = useMemo(
    () => [...new Set(textes.map((t) => t.oeuvre))],
    [textes]
  );

  const [phase, setPhase] = useState<Phase>('setup');
  const [scope, setScope] = useState<string>('all');
  const [drawn, setDrawn] = useState<OralText | null>(null);
  const [runId, setRunId] = useState(0);
  const [questions, setQuestions] = useState<EntretienQuestion[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});

  const total = CRITERIA.reduce((sum, c) => sum + (scores[c.key] ?? 0), 0);

  function handleDraw() {
    const pool = scope === 'all' ? textes : textes.filter((t) => t.oeuvre === scope);
    if (pool.length === 0) return;
    const picked = shuffle([...pool])[0] ?? null;
    setDrawn(picked);
    setRunId((n) => n + 1);
    setScores({});
    if (picked) {
      setQuestions(pickEntretien(entretien, picked.oeuvre, 3));
    }
    setPhase('prep');
  }

  function handleSaveEval() {
    if (drawn) {
      recordAttempt(`os-${drawn.id}::run${runId}`, total >= 10);
    }
    setPhase('done');
  }

  function reset() {
    setPhase('setup');
    setDrawn(null);
    setQuestions([]);
    setScores({});
  }

  if (textes.length === 0) {
    return (
      <p className="rounded border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-300">
        Le simulateur sera disponible dès que des textes seront ajoutés au
        descriptif.
      </p>
    );
  }

  // --- SETUP ---
  if (phase === 'setup') {
    return (
      <div className="space-y-5">
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Conditions réelles
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Un texte est tiré au sort dans ton descriptif. Tu disposes du temps de
            préparation (ajustable), puis tu réponds à la question de grammaire,
            aux questions d'entretien, et tu t'auto-évalues sur 20.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="text-slate-700 dark:text-slate-300">Tirage parmi</span>
              <select
                value={scope}
                onChange={(e) => { setScope(e.target.value); }}
                className="mt-1 block w-full rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-800 dark:text-slate-200"
              >
                <option value="all">Tout le descriptif ({textes.length})</option>
                {oeuvres.map((o) => (
                  <option key={o} value={o}>
                    {o} ({textes.filter((t) => t.oeuvre === o).length})
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="text-slate-700 dark:text-slate-300">
                Préparation (minutes)
              </span>
              <input
                type="number"
                min={5}
                max={60}
                value={defaultMinutes}
                onChange={(e) => { setDefaultMinutes(Number(e.target.value) || 30); }}
                className="mt-1 block w-full rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-800 dark:text-slate-200"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={handleDraw}
            className="mt-5 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700"
          >
            Tirer un texte et démarrer
          </button>
        </div>
      </div>
    );
  }

  if (!drawn) return null;

  // --- PREP ---
  if (phase === 'prep') {
    return (
      <div className="space-y-5">
        <AdjustableTimer
          key={runId}
          initialSeconds={defaultMinutes * 60}
          onTimeout={() => undefined}
        />
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Texte tiré au sort
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
            {drawn.titre}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {drawn.auteur}, <span className="italic">{drawn.oeuvre}</span>
          </p>
        </div>
        <OralTextBody text={drawn} />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Prépare ton introduction (projet de lecture), le découpage en mouvements
          et la lecture à voix haute. Le corrigé reste caché jusqu'à
          l'auto-évaluation.
        </p>
        <button
          type="button"
          onClick={() => { setPhase('grammar'); }}
          className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700"
        >
          Terminer la préparation →
        </button>
      </div>
    );
  }

  // --- GRAMMAR ---
  if (phase === 'grammar') {
    return (
      <div className="space-y-5">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Question de grammaire surprise
        </h2>
        <div className="rounded-lg border border-violet-200 dark:border-violet-700 bg-violet-50/50 dark:bg-violet-900/20 p-4">
          <span className="inline-block rounded bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
            {grammairePointLabel[drawn.questionGrammaire.point]}
          </span>
          <p className="mt-2 font-medium text-slate-900 dark:text-slate-100">
            {drawn.questionGrammaire.enonce}
          </p>
          <div className="mt-3">
            <RevealPanel label="Voir le corrigé">
              {drawn.questionGrammaire.corrige}
            </RevealPanel>
          </div>
        </div>
        <button
          type="button"
          onClick={() => { setPhase('entretien'); }}
          className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700"
        >
          Passer à l'entretien →
        </button>
      </div>
    );
  }

  // --- ENTRETIEN ---
  if (phase === 'entretien') {
    return (
      <div className="space-y-5">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Entretien — questions possibles
        </h2>
        {questions.length === 0 ? (
          <p className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-sm text-slate-600 dark:text-slate-400">
            Aucune question d'entretien disponible pour cette œuvre pour le moment.
          </p>
        ) : (
          <div className="space-y-3">
            {questions.map((q) => (
              <EntretienQuestionCard key={q.id} question={q} />
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => { setPhase('eval'); }}
          className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700"
        >
          Passer à l'auto-évaluation →
        </button>
      </div>
    );
  }

  // --- EVAL ---
  if (phase === 'eval') {
    return (
      <div className="space-y-5">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Auto-évaluation (barème /20)
        </h2>
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
          <div className="space-y-4">
            {CRITERIA.map((c) => (
              <div key={c.key} className="flex items-center gap-3">
                <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">
                  {c.label}
                </span>
                <input
                  type="range"
                  min={0}
                  max={c.max}
                  step={0.5}
                  value={scores[c.key] ?? 0}
                  onChange={(e) =>
                    { setScores((s) => ({ ...s, [c.key]: Number(e.target.value) })); }
                  }
                  className="w-40 accent-emerald-600"
                />
                <span className="w-12 text-right text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100">
                  {(scores[c.key] ?? 0).toFixed(1)}/{c.max}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-4">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Total
            </span>
            <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {total.toFixed(1)} / 20
            </span>
          </div>
        </div>

        <RevealPanel label="Comparer avec la fiche d'analyse linéaire" hideLabel="Masquer la fiche">
          <OralTextDetail text={drawn} hideBody />
        </RevealPanel>

        <button
          type="button"
          onClick={handleSaveEval}
          className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700"
        >
          Enregistrer et terminer
        </button>
      </div>
    );
  }

  // --- DONE ---
  return (
    <div className="space-y-5 text-center">
      <div className="rounded-lg border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 p-8">
        <p className="text-sm text-emerald-800 dark:text-emerald-300">Oral blanc terminé</p>
        <p className="mt-2 text-4xl font-bold text-emerald-700 dark:text-emerald-400">
          {total.toFixed(1)} / 20
        </p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {drawn.titre} — {drawn.auteur}
        </p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700"
      >
        Recommencer un oral blanc
      </button>
    </div>
  );
}
