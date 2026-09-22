import RevealPanel from '@/francais/components/oral/RevealPanel';
import type { GrandOralRelance } from '@/lib/grand-oral-types';

/** Une relance de jury, avec ses pistes de réponse cachées jusqu'à la demande. */
export default function RelanceCard({ relance }: { relance: GrandOralRelance }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <p className="font-medium text-slate-900 dark:text-slate-100">« {relance.question} »</p>
      <div className="mt-3">
        <RevealPanel label="Pistes de réponse" hideLabel="Masquer les pistes">
          <ul className="ml-5 list-disc space-y-1">
            {relance.pistes.map((piste) => (
              <li key={piste}>{piste}</li>
            ))}
          </ul>
        </RevealPanel>
      </div>
    </article>
  );
}
