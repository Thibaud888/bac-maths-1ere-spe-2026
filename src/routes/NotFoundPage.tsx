import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">404 — page introuvable</h1>
      <p className="mt-3 text-slate-600">Cette adresse ne correspond à aucune page.</p>
      <Link to="/" className="mt-6 inline-block text-sm text-blue-600 underline">
        Retour à l'accueil
      </Link>
    </main>
  );
}
