import { SectionPage } from '@/components/shared/PageLongue';
import { ListeSources } from '@/components/shared/Sources';

/**
 * Bas de page du grand oral : la liste numérotée des textes officiels cités
 * par les appels [1], [2]… de la page (ancre `#sources`).
 */
export default function SectionSources({ numero }: { numero?: number }) {
  return (
    <SectionPage id="sources" numero={numero} titre="Les sources" accent="amber">
      <ListeSources />
      <p className="mt-4 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
        En cas de doute, c’est le texte officiel qui fait foi, jamais cette page.
      </p>
    </SectionPage>
  );
}
