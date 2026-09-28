import type { Code } from '@/lib/terminale/types';

const NOM: Record<Code['langage'], string> = { python: 'Python' };

/**
 * Un programme, en chasse fixe : jamais passé par le rendu du texte (un `**` Python
 * reste du code), défilement horizontal dans son propre cadre (charte § 11).
 */
export default function CodeSource({ code }: { code: Code }) {
  return (
    <figure className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
      <figcaption className="border-b border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:border-slate-700 dark:text-slate-400">
        {NOM[code.langage]}
      </figcaption>
      <pre className="overflow-x-auto p-3 text-[13px] leading-relaxed text-slate-800 dark:text-slate-200">
        <code className="font-mono">{code.source}</code>
      </pre>
    </figure>
  );
}
