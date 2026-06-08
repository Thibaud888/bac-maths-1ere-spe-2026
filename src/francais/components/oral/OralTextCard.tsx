import { Link } from 'react-router-dom';
import type { OralText } from '@/francais/lib/french-types';
import { grammairePointLabel } from './oral-labels';

type OralTextCardProps = {
  text: OralText;
  eleve: string;
};

export default function OralTextCard({ text, eleve }: OralTextCardProps) {
  return (
    <Link
      to={`/francais/oral/${eleve}/textes/${text.id}`}
      className="block rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm transition-colors hover:border-emerald-400 dark:hover:border-emerald-500"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          {text.titre}
        </h3>
        {!text.domainePublic && (
          <span className="shrink-0 rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            © texte à coller
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {text.auteur}, <span className="italic">{text.oeuvre}</span>
        {text.dateOeuvre ? ` (${text.dateOeuvre})` : ''}
      </p>
      {text.parcours && (
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-500">
          Parcours : {text.parcours}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
          {text.mouvements.length} mouvement{text.mouvements.length > 1 ? 's' : ''}
        </span>
        <span className="rounded bg-violet-100 px-2 py-0.5 text-xs text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
          Gram. : {grammairePointLabel[text.questionGrammaire.point]}
        </span>
      </div>
    </Link>
  );
}
