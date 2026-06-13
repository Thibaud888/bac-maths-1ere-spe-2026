import { Link, useParams } from 'react-router-dom';
import {
  getOralContent,
  getOralStudentOeuvre,
} from '@/francais/lib/french-content-loader';
import OralProgressDashboard from '@/francais/components/oral/OralProgressDashboard';

const baremeRows: ReadonlyArray<{ partie: string; item: string; points: string }> = [
  { partie: '1ʳᵉ partie (12 pts)', item: 'Lecture à voix haute', points: '2' },
  { partie: '', item: `Explication linéaire d'un texte du descriptif`, points: '8' },
  { partie: '', item: 'Question de grammaire', points: '2' },
  { partie: '2ᵈᵉ partie (8 pts)', item: `Présentation d'une œuvre + entretien`, points: '8' },
];

type AccessCard = {
  to: string;
  icon: string;
  title: string;
  subtitle: string;
  points?: string;
};

function CardLink({ base, card }: { base: string; card: AccessCard }) {
  return (
    <Link
      to={`${base}/${card.to}`}
      className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm transition-colors hover:border-emerald-400 dark:hover:border-emerald-500"
    >
      <span className="text-2xl leading-none">{card.icon}</span>
      <div className="min-w-0">
        <p className="font-semibold text-slate-900 dark:text-slate-100">
          {card.title}
          {card.points && (
            <span className="ml-2 rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              {card.points}
            </span>
          )}
        </p>
        <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
          {card.subtitle}
        </p>
      </div>
    </Link>
  );
}

function ZoneTitle({ label, badge }: { label: string; badge?: string }) {
  return (
    <div className="mt-8 flex items-center gap-2">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
        {label}
      </h2>
      {badge && (
        <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
          {badge}
        </span>
      )}
    </div>
  );
}

export default function OralHomePage() {
  const { eleve } = useParams<{ eleve: string }>();
  const { meta } = getOralContent();
  const oeuvreChoisie = eleve ? getOralStudentOeuvre(eleve) : null;
  const base = `/francais/oral/${eleve ?? ''}`;

  const partie1: AccessCard[] = [
    {
      to: 'textes',
      icon: '📖',
      title: 'Textes du descriptif',
      subtitle: 'Lecture à voix haute (2 pts) · Explication linéaire (8 pts).',
      points: '10 pts',
    },
    {
      to: 'grammaire',
      icon: '🔤',
      title: 'Question de grammaire',
      subtitle: 'Les points du programme + entraînement.',
      points: '2 pts',
    },
  ];

  const partie2: AccessCard[] = [
    {
      to: 'oeuvre',
      icon: '📚',
      title: 'Œuvre choisie',
      subtitle: oeuvreChoisie
        ? `${oeuvreChoisie.oeuvre}${oeuvreChoisie.auteur ? ` — ${oeuvreChoisie.auteur}` : ''}`
        : `Ma présentation de l'œuvre choisie (pourquoi ce choix, l'œuvre, mon avis).`,
    },
    {
      to: 'entretien',
      icon: '💬',
      title: 'Entretien',
      subtitle: `Les questions possibles de l'examinateur + mes réponses.`,
    },
  ];

  const outils: AccessCard[] = [
    {
      to: 'express',
      icon: '⚡',
      title: 'Révision express',
      subtitle: 'Flashcards qui tournent + quiz éclair pour réviser vite.',
    },
    {
      to: 'methode',
      icon: '🧭',
      title: 'Méthode',
      subtitle: `Comment faire l'explication, la lecture, l'entretien.`,
    },
    {
      to: 'epreuve',
      icon: 'ℹ️',
      title: `L'épreuve`,
      subtitle: 'Comprendre le déroulé et les attentes.',
    },
    {
      to: 'simulateur',
      icon: '🎬',
      title: 'Oral blanc',
      subtitle: 'Tirage au sort + préparation minutée.',
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        {meta?.title ?? `Préparer l'oral du bac de français`}
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {meta?.description ??
          `Épreuve anticipée de français (EAF) — oral : 20 min, après 30 min de préparation, coefficient 5. L'examinateur choisit un texte parmi ceux de ton descriptif.`}
      </p>

      {eleve && <OralProgressDashboard eleve={eleve} />}

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

      {/* Partie 1 */}
      <ZoneTitle label="Partie 1 — sur un texte tiré au sort" badge="12 pts" />
      <div className="mt-3 grid gap-3">
        {partie1.map((card, i) => (
          <CardLink key={`p1-${i}`} base={base} card={card} />
        ))}
      </div>

      {/* Partie 2 */}
      <ZoneTitle label="Partie 2 — sur une œuvre choisie" badge="8 pts" />
      <div className="mt-3 grid gap-3">
        {partie2.map((card, i) => (
          <CardLink key={`p2-${i}`} base={base} card={card} />
        ))}
      </div>

      {/* Outils */}
      <ZoneTitle label="Se préparer" />
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {outils.map((card, i) => (
          <CardLink key={`o-${i}`} base={base} card={card} />
        ))}
      </div>
    </div>
  );
}
