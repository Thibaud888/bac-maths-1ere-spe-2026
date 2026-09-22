type Props = { entries: readonly { id: string; label: string }[] };

/** Pastilles d'ancres en haut de page, comme sur « Le bac, mode d'emploi ». */
export default function Sommaire({ entries }: Props) {
  return (
    <nav aria-label="Sommaire" className="flex flex-wrap gap-2">
      {entries.map((entry) => (
        <a
          key={entry.id}
          href={`#${entry.id}`}
          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:border-amber-300 hover:text-amber-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-amber-700 dark:hover:text-amber-400"
        >
          {entry.label}
        </a>
      ))}
    </nav>
  );
}
