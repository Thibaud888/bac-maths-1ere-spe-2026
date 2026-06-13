import { Link } from 'react-router-dom';
import { useFrenchProgressStore } from '@/francais/stores/french-progress-store';
import {
  getOralContent,
  getOralStudentEntretien,
  getOralStudentOeuvre,
  getOralStudentTextes,
} from '@/francais/lib/french-content-loader';

type DashboardItem = {
  key: string;
  label: string;
  sub?: string;
  to: string;
};

type DashboardSection = {
  title: string;
  badge?: string;
  to: string;
  items: DashboardItem[];
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
 * Tableau de bord d'avancement de l'oral, affiché en tête de l'accueil élève.
 * Chaque élément (texte, point de grammaire, œuvre choisie, entretien) peut être
 * coché manuellement ; il se barre et la barre de progression se remplit.
 */
export default function OralProgressDashboard({ eleve }: { eleve: string }) {
  const checks = useFrenchProgressStore((s) => s.oralChecks);
  const toggle = useFrenchProgressStore((s) => s.toggleOralCheck);

  const base = `/francais/oral/${eleve}`;
  const textes = getOralStudentTextes(eleve);
  const entretien = getOralStudentEntretien(eleve);
  const oeuvre = getOralStudentOeuvre(eleve);
  const { grammaireFiches } = getOralContent();

  const sections: DashboardSection[] = [
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
            {
              key: `${eleve}::oeuvre`,
              label: oeuvre.oeuvre,
              sub: oeuvre.auteur,
              to: `${base}/oeuvre`,
            },
          ]
        : [],
    },
    {
      title: 'Entretien',
      badge: 'P2',
      to: `${base}/entretien`,
      items:
        entretien.length > 0
          ? [
              {
                key: `${eleve}::entretien`,
                label: `Mes réponses d'entretien`,
                sub: `${entretien.length} questions`,
                to: `${base}/entretien`,
              },
            ]
          : [],
    },
  ].filter((s) => s.items.length > 0);

  const allItems = sections.flatMap((s) => s.items);
  const totalDone = allItems.filter((i) => checks[i.key]).length;
  const totalItems = allItems.length;
  const allDone = totalItems > 0 && totalDone === totalItems;

  return (
    <section className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Mon avancement
        </h2>
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
          {totalItems === 0 ? '—' : `${Math.round((totalDone / totalItems) * 100)} %`}
        </span>
      </div>
      <div className="mt-2">
        <ProgressBar done={totalDone} total={totalItems} />
      </div>
      {allDone && (
        <p className="mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          🎉 Tout est révisé — bravo, tu es prêt(e) !
        </p>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {sections.map((section) => {
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
                      <button
                        type="button"
                        aria-pressed={checked}
                        onClick={() => toggle(item.key)}
                        title={checked ? 'Révisé — cliquer pour décocher' : 'Marquer comme révisé'}
                        className={[
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] transition-colors',
                          checked
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-slate-300 dark:border-slate-600 text-transparent hover:border-emerald-400',
                        ].join(' ')}
                      >
                        ✓
                      </button>
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
      </div>
    </section>
  );
}
