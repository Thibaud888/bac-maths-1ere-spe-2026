import { resolveBacSources } from '@/lib/bac-content';

type Props = {
  ids: readonly string[];
  className?: string | undefined;
};

/**
 * Renvoi vers le ou les textes officiels d'une affirmation. Les sources sont
 * celles de `content/bac/sources.json` : un seul registre pour tout le site.
 */
export default function SourcesCitees({ ids, className = '' }: Props) {
  const sources = resolveBacSources(ids);
  if (sources.length === 0) return null;
  return (
    <p className={`text-xs text-slate-500 dark:text-slate-400 ${className}`}>
      <span className="font-semibold">
        {sources.length > 1 ? 'Sources officielles' : 'Source officielle'} :
      </span>{' '}
      {sources.map((s, i) => (
        <span key={s.id}>
          {i > 0 && ' · '}
          <a
            href={s.url}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-slate-300 underline-offset-2 hover:text-amber-700 dark:decoration-slate-600 dark:hover:text-amber-400"
          >
            {s.label}
          </a>{' '}
          ({s.publisher})
        </span>
      ))}
    </p>
  );
}
