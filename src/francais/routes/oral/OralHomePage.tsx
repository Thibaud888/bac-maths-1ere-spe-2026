import { Link, useParams } from 'react-router-dom';
import {
  getOralContent,
  getOralStudent,
  getOralStudentOeuvre,
} from '@/francais/lib/french-content-loader';
import FicheCard from '@/francais/components/fiches/FicheCard';

const baremeRows: ReadonlyArray<{ partie: string; item: string; points: string }> = [
  { partie: '1ʳᵉ partie (12 pts)', item: 'Lecture à voix haute', points: '2' },
  { partie: '', item: 'Explication linéaire d’un texte du descriptif', points: '8' },
  { partie: '', item: 'Question de grammaire', points: '2' },
  { partie: '2ᵈᵉ partie (8 pts)', item: 'Présentation d’une œuvre + entretien', points: '8' },
];

export default function OralHomePage() {
  const { eleve } = useParams<{ eleve: string }>();
  const { meta, epreuve } = getOralContent();
  const student = eleve ? getOralStudent(eleve) : null;
  const oeuvreChoisie = eleve ? getOralStudentOeuvre(eleve) : null;
  const base = `/francais/oral/${eleve ?? ''}`;

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        {meta?.title ?? 'Préparer l’oral du bac de français'}
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {meta?.description ??
          'Épreuve anticipée de français (EAF) — oral : 20 min, après 30 min de préparation, coefficient 5. L’examinateur choisit un texte parmi ceux de ton descriptif.'}
      </p>

      {student && student.oeuvres && student.oeuvres.length > 0 && (
        <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Œuvres au programme
          </p>
          <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
            {student.oeuvres.map((o) => (
              <li key={o.oeuvre}>
                <span className="italic">{o.oeuvre}</span>
                {o.auteur ? ` — ${o.auteur}` : ''}
                {o.parcours ? (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {' '}
                    · {o.parcours}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Barème */}
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-emerald-50 dark:bg-emerald-900/20 text-left">
              <th className="px-4 py-2 font-semibold text-emerald-800 dark:text-emerald-300">Partie</th>
              <th className="px-4 py-2 font-semibold text-emerald-800 dark:text-emerald-300">Épreuve</th>
              <th className="px-4 py-2 text-right font-semibold text-emerald-800 dark:text-emerald-300">Points</th>
            </tr>
          </thead>
          <tbody>
            {baremeRows.map((row, i) => (
              <tr key={i} className="border-t border-slate-100 dark:border-slate-700">
                <td className="px-4 py-2 font-medium text-slate-700 dark:text-slate-300">{row.partie}</td>
                <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{row.item}</td>
                <td className="px-4 py-2 text-right font-mono text-slate-900 dark:text-slate-100">{row.points}</td>
              </tr>
            ))}
            <tr className="border-t border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/40">
              <td className="px-4 py-2 font-semibold text-slate-900 dark:text-slate-100" colSpan={2}>Total</td>
              <td className="px-4 py-2 text-right font-mono font-bold text-slate-900 dark:text-slate-100">20</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Œuvre choisie (2ᵈᵉ partie) */}
      {oeuvreChoisie && (
        <Link
          to={`${base}/oeuvre`}
          className="mt-6 block rounded-xl border border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20 p-4 shadow-sm transition-colors hover:border-amber-400"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            🎯 Mon œuvre choisie · 2ᵈᵉ partie (8 pts)
          </p>
          <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
            <span className="italic">{oeuvreChoisie.oeuvre}</span>
            {oeuvreChoisie.auteur ? ` — ${oeuvreChoisie.auteur}` : ''}
          </p>
          <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
            Présentation en 3 temps + entretien à préparer.
          </p>
        </Link>
      )}

      {/* Accès rapides */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link
          to={`${base}/textes`}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm transition-colors hover:border-emerald-400"
        >
          <p className="font-semibold text-slate-900 dark:text-slate-100">📑 Mes textes</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Les analyses linéaires du descriptif.
          </p>
        </Link>
        <Link
          to={`${base}/simulateur`}
          className="rounded-lg border border-emerald-300 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 p-4 shadow-sm transition-colors hover:border-emerald-400"
        >
          <p className="font-semibold text-emerald-800 dark:text-emerald-200">🎙️ Oral blanc</p>
          <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
            Tirage au sort + préparation minutée.
          </p>
        </Link>
      </div>

      {/* Fiches sur l'épreuve */}
      {epreuve.length > 0 ? (
        <div className="mt-8 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Bien connaître l’épreuve
          </h2>
          {epreuve.map((fiche) => (
            <FicheCard key={fiche.id} fiche={fiche} />
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-300">
          Les fiches de présentation de l’épreuve arrivent bientôt.
        </p>
      )}
    </div>
  );
}
