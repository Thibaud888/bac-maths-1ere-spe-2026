import { useState, type ReactNode } from 'react';

type RevealPanelProps = {
  /** Libellé du bouton fermé. */
  label: string;
  /** Libellé du bouton ouvert (par défaut « Masquer »). */
  hideLabel?: string;
  children: ReactNode;
};

/**
 * Panneau « voir / masquer » sans dépendance KaTeX (contrairement à
 * `HintSystem`), adapté au contenu français de l'oral.
 */
export default function RevealPanel({ label, hideLabel = 'Masquer', children }: RevealPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => { setOpen((v) => !v); }}
        className="rounded border border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40"
      >
        {open ? hideLabel : label}
      </button>
      {open && (
        <div className="mt-2 rounded border border-blue-200 dark:border-blue-700 bg-blue-50/40 dark:bg-blue-900/20 p-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {children}
        </div>
      )}
    </div>
  );
}
