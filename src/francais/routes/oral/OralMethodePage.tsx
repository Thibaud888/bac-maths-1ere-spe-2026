import { getOralContent } from '@/francais/lib/french-content-loader';
import FicheCard from '@/francais/components/fiches/FicheCard';

export default function OralMethodePage() {
  const { methode } = getOralContent();

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Méthode</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Mener l’explication linéaire, réussir la lecture à voix haute, présenter
        son œuvre et conduire l’entretien.
      </p>

      {methode.length > 0 ? (
        <div className="mt-6 space-y-4">
          {methode.map((fiche) => (
            <FicheCard key={fiche.id} fiche={fiche} />
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-300">
          Les fiches de méthode arrivent bientôt.
        </p>
      )}
    </div>
  );
}
