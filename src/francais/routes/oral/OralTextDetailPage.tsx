import { Link, Navigate, useParams } from 'react-router-dom';
import { getOralText } from '@/francais/lib/french-content-loader';
import OralTextDetail from '@/francais/components/oral/OralTextDetail';
import RevisedToggle from '@/francais/components/oral/RevisedToggle';

export default function OralTextDetailPage() {
  const { eleve, id } = useParams<{ eleve: string; id: string }>();
  const text = eleve && id ? getOralText(eleve, id) : null;

  if (!text) {
    return <Navigate to={`/francais/oral/${eleve ?? ''}/textes`} replace />;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <Link
        to={`/francais/oral/${eleve ?? ''}/textes`}
        className="text-sm text-emerald-700 dark:text-emerald-400 hover:underline"
      >
        ← Tous les textes
      </Link>
      <div className="mt-4">
        <OralTextDetail text={text} />
      </div>
      <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-4">
        <RevisedToggle checkKey={`${eleve ?? ''}::text::${text.id}`} />
      </div>
    </div>
  );
}
