import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppStore } from '@/stores/app-store';

export default function ChapterPage() {
  const { slug } = useParams<{ slug: string }>();
  const setLastVisitedChapter = useAppStore((state) => state.setLastVisitedChapter);

  useEffect(() => {
    if (slug) {
      setLastVisitedChapter(slug);
    }
  }, [slug, setLastVisitedChapter]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link to="/" className="text-sm text-blue-600 underline">
        ← Accueil
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Chapitre : {slug ?? 'inconnu'}</h1>
      <p className="mt-3 text-slate-600">
        Stub — le contenu de ce chapitre sera ajouté dans une phase ultérieure.
      </p>
    </main>
  );
}
