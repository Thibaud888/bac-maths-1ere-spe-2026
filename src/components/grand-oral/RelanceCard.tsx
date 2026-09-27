import RevealPanel from '@/francais/components/oral/RevealPanel';
import type { GrandOralRelance } from '@/lib/grand-oral-types';
import { typographie } from '@/lib/typographie';

/** Une relance de jury, avec ses pistes de réponse cachées jusqu'à la demande. */
export default function RelanceCard({ relance }: { relance: GrandOralRelance }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <p className="font-medium leading-snug text-slate-900 dark:text-slate-100">
        {typographie(`« ${relance.question} »`)}
      </p>
      <div className="mt-auto pt-3">
        <RevealPanel label="Pistes de réponse" hideLabel="Masquer les pistes">
          <ul className="ml-5 list-disc space-y-1">
            {relance.pistes.map((piste) => (
              <li key={piste}>{typographie(piste)}</li>
            ))}
          </ul>
        </RevealPanel>
      </div>
    </article>
  );
}
