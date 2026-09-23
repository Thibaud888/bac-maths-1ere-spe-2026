import { ListeSources } from '@/components/shared/Sources';

/**
 * Bas de page du grand oral : la liste numérotée des textes officiels cités
 * par les appels [1], [2]… de la page (ancre `#sources`).
 */
export default function SectionSources() {
  return (
    <section id="sources" className="scroll-mt-20 space-y-4">
      <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Les sources
      </h2>
      <ListeSources />
      <p className="border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
        En cas de doute, c’est le texte officiel qui fait foi, jamais cette page.
      </p>
    </section>
  );
}
