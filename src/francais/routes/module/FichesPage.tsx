import { useParams } from 'react-router-dom';
import { getFrenchModuleContent } from '@/francais/lib/french-content-loader';
import FicheCard from '@/francais/components/fiches/FicheCard';
import { useFrenchAppStore } from '@/francais/stores/french-app-store';
import type { FrenchModuleSlug } from '@/francais/lib/french-types';

export default function FichesPage() {
  const { slug } = useParams<{ slug: string }>();
  const content = slug ? getFrenchModuleContent(slug as FrenchModuleSlug) : null;
  const hiddenFiches = useFrenchAppStore((s) => s.hiddenFiches);
  const toggleFicheHidden = useFrenchAppStore((s) => s.toggleFicheHidden);

  if (!content) return null;
  const moduleSlug = content.meta.slug;
  const hidden = hiddenFiches[moduleSlug] ?? [];

  const fiches = [...content.fiches].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-6">
      {content.meta.description && (
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
          {content.meta.description}
        </p>
      )}

      <div className="mb-4 flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-400" />
          Essentiel
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-sky-400" />
          À connaître
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400" />
          Approfondissement
        </span>
      </div>

      {fiches.length === 0 ? (
        <p className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-sm text-slate-500 dark:text-slate-400">
          Aucune fiche pour ce module pour l’instant.
        </p>
      ) : (
        <div className="space-y-4">
          {fiches.map((fiche) => (
            <FicheCard
              key={fiche.id}
              fiche={fiche}
              hidden={hidden.includes(fiche.id)}
              onToggleHidden={() => { toggleFicheHidden(moduleSlug, fiche.id); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
