import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getOralStudentTextes } from '@/francais/lib/french-content-loader';
import OralTextCard from '@/francais/components/oral/OralTextCard';

export default function OralTextesPage() {
  const { eleve } = useParams<{ eleve: string }>();
  const textes = useMemo(
    () => (eleve ? getOralStudentTextes(eleve) : []),
    [eleve]
  );

  const byOeuvre = useMemo(() => {
    const map = new Map<string, typeof textes>();
    for (const t of textes) {
      const list = map.get(t.oeuvre) ?? [];
      list.push(t);
      map.set(t.oeuvre, list);
    }
    return map;
  }, [textes]);

  if (textes.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mes textes</h1>
        <p className="mt-4 rounded border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-300">
          Le descriptif arrive bientôt : les analyses linéaires des textes étudiés
          en classe seront listées ici.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mes textes</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {textes.length} lecture{textes.length > 1 ? 's' : ''} linéaire
        {textes.length > 1 ? 's' : ''} du descriptif. Clique sur un texte pour
        ouvrir son analyse.
      </p>

      {[...byOeuvre.entries()].map(([oeuvre, list]) => (
        <section key={oeuvre} className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {oeuvre}
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {list.map((t) => (
              <OralTextCard key={t.id} text={t} eleve={eleve ?? ''} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
