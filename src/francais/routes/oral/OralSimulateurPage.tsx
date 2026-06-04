import { useMemo } from 'react';
import { getOralContent } from '@/francais/lib/french-content-loader';
import OralSimulator from '@/francais/components/oral/OralSimulator';

export default function OralSimulateurPage() {
  const { textes, entretien } = useMemo(() => getOralContent(), []);

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Oral blanc
      </h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Simule l’épreuve dans les conditions réelles : tirage au sort, préparation
        minutée (ajustable), question de grammaire, entretien et auto-évaluation
        sur 20.
      </p>
      <div className="mt-6">
        <OralSimulator textes={textes} entretien={entretien} />
      </div>
    </div>
  );
}
