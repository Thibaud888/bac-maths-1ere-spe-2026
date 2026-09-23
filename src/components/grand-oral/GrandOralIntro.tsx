import type { ReactNode } from 'react';

type Props = {
  title: string;
  /** Une phrase utile à la lecture de la page, s'il y en a une. */
  lead?: ReactNode;
  children?: ReactNode;
};

/** En-tête commun aux pages du grand oral. */
export default function GrandOralIntro({ title, lead, children }: Props) {
  return (
    <header>
      <span className="inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
        Grand oral
      </span>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        {title}
      </h1>
      {lead && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{lead}</p>}
      {children}
    </header>
  );
}
