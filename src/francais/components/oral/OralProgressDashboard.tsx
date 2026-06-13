import { Link } from 'react-router-dom';
import { useFrenchProgressStore } from '@/francais/stores/french-progress-store';
import {
  getOralContent,
  getOralStudentEntretien,
  getOralStudentOeuvre,
  getOralStudentTextes,
} from '@/francais/lib/french-content-loader';
import { buildGrammarQuizDeck, buildOralExpressDecks } from '@/francais/lib/oral-express';

type ChecklistItem = {
  key: string;
  label: string;
  sub?: string;
  to: string;
};

type ChecklistSection = {
  title: string;
  badge?: string;
  to: string;
  items: ChecklistItem[];
};

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="shrink-0 font-mono text-xs text-slate-500 dark:text-slate-400">
        {done}/{total}
      </span>
    </div>
  );
}

/**
 * Tableau de bord d'avancement de l'oral (accueil élève). En LECTURE SEULE :
 * il reflète l'état coché depuis les fiches (textes, grammaire, œuvre choisie)
 * et les statuts de questions d'entretien. On coche depuis les fiches, pas ici.
 */
export default function OralProgressDashboard({ eleve }: { eleve: string }) {
  const checks = useFrenchProgressStore((s) => s.oralChecks);
  const statusMap = useFrenchProgressStore((s) => s.oralStatus);
  const decisions = useFrenchProgressStore((s) => s.flashcardDecisions);

  const base = `/francais/oral/${eleve}`;
  const textes = getOralStudentTextes(eleve);
  const entretien = getOralStudentEntretien(eleve);
  const oeuvre = getOralStudentOeuvre(eleve);
  const { grammaireFiches } = getOralContent();

  const checklistSections: ChecklistSection[] = [
    {
      title: 'Textes du descriptif',
      badge: 'P1',
      to: `${base}/textes`,
      items: textes.map((t) => ({
        key: `${eleve}::text::${t.id}`,
        label: t.titre,
        sub: t.oeuvre,
        to: `${base}/textes/${t.id}`,
      })),
    },
    {
      title: 'Points de grammaire',
      badge: 'P1',
      to: `${base}/grammaire`,
      items: grammaireFiches.map((f) => ({
        key: `${eleve}::gram::${f.id}`,
        label: f.title,
        to: `${base}/grammaire`,
      })),
    },
    {
      title: 'Œuvre choisie',
      badge: 'P2',
      to: `${base}/oeuvre`,
      items: oeuvre
        ? [
            { key: `${eleve}::oeuvre::pourquoi`, label: 'Pourquoi ce choix', to: `${base}/oeuvre` },
            { key: `${eleve}::oeuvre::presentation`, label: `Présentation de l'œuvre`, to: `${base}/oeuvre` },
            { key: `${eleve}::oeuvre::jugement`, label: 'Jugement personnel', to: `${base}/oeuvre` },
          ]
        : [],
    },
  ].filter((s) => s.items.length > 0);

  // Entretien : suivi par statut (maîtrisée / à retravailler), affiché en synthèse.
  const eqKeys = entretien.map((q) => `${eleve}::eq::${q.id}`);
  const eqDone = eqKeys.filter((k) => statusMap[k] === 'done').length;
  const eqReview = eqKeys.filter((k) => statusMap[k] === 'review').length;
  const eqTotal = entretien.length;

  const checklistItems = checklistSections.flatMap((s) => s.items);
  const checklistDone = checklistItems.filter((i) => checks[i.key]).length;
  const totalDone = checklistDone + eqDone;
  const totalItems = checklistItems.length + eqTotal;
  const allDone = totalItems > 0 && totalDone === totalItems;

  // Révision express : nombre de cartes « Je savais » (validées).
  const flashCards = buildOralExpressDecks(eleve).flatMap((d) => d.cards);
  const quizCards = buildGrammarQuizDeck(eleve)?.cards ?? [];
  const flashKnown = flashCards.filter((c) => decisions[c.id] === 'known').length;
  const quizKnown = quizCards.filter((c) => decisions[c.id] === 'known').length;
  const hasExpress = flashCards.length > 0 || quizCards.length > 0;

  return (
    <section className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Mon avancement</h2>
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
          {totalItems === 0 ? '—' : `${Math.round((totalDone / totalItems) * 100)} %`}
        </span>
      </div>
      <div className="mt-2">
        <ProgressBar done={totalDone} total={totalItems} />
      </div>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        {allDone
          ? '🎉 Tout est révisé — bravo, tu es prêt(e) !'
          : 'On coche l’avancée directement depuis chaque fiche ; ce tableau s’actualise tout seul.'}
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {checklistSections.map((section) => {
          const done = section.items.filter((i) => checks[i.key]).length;
          return (
            <div
              key={section.title}
              className="rounded-lg border border-slate-100 dark:border-slate-700/60 p-3"
            >
              <div className="flex items-center gap-2">
                {section.badge && (
                  <span className="rounded bg-emerald-100 px-1 py-0.5 text-[10px] font-bold leading-none text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    {section.badge}
                  </span>
                )}
                <Link
                  to={section.to}
                  className="text-sm font-semibold text-slate-800 hover:text-emerald-700 dark:text-slate-200 dark:hover:text-emerald-400"
                >
                  {section.title}
                </Link>
              </div>
              <div className="mt-2">
                <ProgressBar done={done} total={section.items.length} />
              </div>
              <ul className="mt-2 space-y-1.5">
                {section.items.map((item) => {
                  const checked = !!checks[item.key];
                  return (
                    <li key={item.key} className="flex items-center gap-2">
                      <span
                        aria-hidden
                        className={[
                          'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px]',
                          checked
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-slate-300 dark:border-slate-600 text-transparent',
                        ].join(' ')}
                      >
                        ✓
                      </span>
                      <Link
                        to={item.to}
                        className={[
                          'min-w-0 truncate text-sm transition-colors',
                          checked
                            ? 'text-slate-400 line-through dark:text-slate-500'
                            : 'text-slate-700 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400',
                        ].join(' ')}
                      >
                        {item.label}
                        {item.sub && (
                          <span className="ml-1 text-xs text-slate-400 dark:text-slate-500">
                            · {item.sub}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        {eqTotal > 0 && (
          <div className="rounded-lg border border-slate-100 dark:border-slate-700/60 p-3">
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-100 px-1 py-0.5 text-[10px] font-bold leading-none text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                P2
              </span>
              <Link
                to={`${base}/entretien`}
                className="text-sm font-semibold text-slate-800 hover:text-emerald-700 dark:text-slate-200 dark:hover:text-emerald-400"
              >
                Entretien
              </Link>
            </div>
            <div className="mt-2">
              <ProgressBar done={eqDone} total={eqTotal} />
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                ✓ {eqDone} maîtrisée{eqDone > 1 ? 's' : ''}
              </span>
              {eqReview > 0 && (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                  ↻ {eqReview} à retravailler
                </span>
              )}
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                {eqTotal} au total
              </span>
            </div>
          </div>
        )}

        {hasExpress && (
          <div className="rounded-lg border border-slate-100 dark:border-slate-700/60 p-3">
            <div className="flex items-center gap-2">
              <span aria-hidden className="text-base leading-none">⚡</span>
              <Link
                to={`${base}/express`}
                className="text-sm font-semibold text-slate-800 hover:text-emerald-700 dark:text-slate-200 dark:hover:text-emerald-400"
              >
                Révision express
              </Link>
            </div>
            <div className="mt-2 space-y-2">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Flashcards validées
                </p>
                <ProgressBar done={flashKnown} total={flashCards.length} />
              </div>
              {quizCards.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Quiz éclair validé
                  </p>
                  <ProgressBar done={quizKnown} total={quizCards.length} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
