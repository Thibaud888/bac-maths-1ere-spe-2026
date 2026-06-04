import { Link, Navigate, useParams } from 'react-router-dom';
import { getOralText } from '@/francais/lib/french-content-loader';
import OralTextDetail from '@/francais/components/oral/OralTextDetail';

export default function OralTextDetailPage() {
  const { id } = useParams<{ id: string }>();
  const text = id ? getOralText(id) : null;

  if (!text) {
    return <Navigate to="/francais/oral/textes" replace />;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <Link
        to="/francais/oral/textes"
        className="text-sm text-emerald-700 dark:text-emerald-400 hover:underline"
      >
        ← Tous les textes
      </Link>
      <div className="mt-4">
        <OralTextDetail text={text} />
      </div>
    </div>
  );
}
