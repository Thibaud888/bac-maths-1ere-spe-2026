import { LiteraryText } from '@/francais/components/text/LiteraryText';
import { useFrenchAppStore } from '@/francais/stores/french-app-store';
import type { OralText } from '@/francais/lib/french-types';

type OralTextBodyProps = {
  text: OralText;
};

/**
 * Affiche le corps du texte étudié.
 * - Domaine public AVEC texte intégré : on l'affiche.
 * - Sinon (texte non intégré, ou œuvre sous droits) : aucun texte n'est stocké
 *   dans le dépôt — l'élève lit le texte dans son descriptif et peut le coller
 *   ici pour réviser l'analyse à côté (persisté en `bfr-2026-*`).
 */
export default function OralTextBody({ text }: OralTextBodyProps) {
  const pasted = useFrenchAppStore((s) => s.pastedOralTexts[text.id] ?? '');
  const setPasted = useFrenchAppStore((s) => s.setPastedOralText);

  if (text.domainePublic && text.text) {
    return (
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-4">
        <LiteraryText text={text.text} preserveLineBreaks />
        {text.textSource && (
          <p className="mt-3 text-right text-xs italic text-slate-500 dark:text-slate-400">
            {text.textSource}
          </p>
        )}
      </div>
    );
  }

  const sousDroits = !text.domainePublic;

  return (
    <div className="rounded-lg border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4">
      <p className="text-xs text-amber-800 dark:text-amber-300">
        {sousDroits
          ? "Œuvre encore sous droits d'auteur : le texte ne peut pas être reproduit ici."
          : 'Texte au programme : lis-le dans ton descriptif (récapitulatif CNED).'}{' '}
        Tu peux le coller ci-dessous pour réviser l'analyse à côté — il reste
        enregistré sur cet appareil uniquement.
        {text.textSource ? ` (${text.textSource})` : ''}
      </p>
      <textarea
        value={pasted}
        onChange={(e) => { setPasted(text.id, e.target.value); }}
        rows={8}
        placeholder="Colle ici le texte de l'extrait…"
        className="mt-3 w-full rounded border border-amber-300 dark:border-amber-600 bg-white dark:bg-slate-800 p-3 font-serif text-sm leading-relaxed text-slate-800 dark:text-slate-200 focus:border-amber-500 focus:outline-none"
      />
      {pasted.trim().length > 0 && (
        <div className="mt-3 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
          <LiteraryText text={pasted} preserveLineBreaks />
        </div>
      )}
    </div>
  );
}
