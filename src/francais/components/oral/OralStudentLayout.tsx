import { useEffect } from 'react';
import { Link, Navigate, Outlet, useParams } from 'react-router-dom';
import {
  getOralStudent,
  oralStudentExists,
} from '@/francais/lib/french-content-loader';
import { useFrenchAppStore } from '@/francais/stores/french-app-store';
import OralTabs from './OralTabs';
import OralViewModeToggle from './OralViewModeToggle';

/**
 * Espace oral d'un élève : garde le paramètre `:eleve`, mémorise le dernier
 * élève ouvert, et affiche l'en-tête (nom + « changer d'élève ») au-dessus des
 * onglets. Le contenu propre à l'élève (textes, entretien) est résolu dans les
 * pages enfant.
 */
export default function OralStudentLayout() {
  const { eleve } = useParams<{ eleve: string }>();
  const setLastOralStudent = useFrenchAppStore((s) => s.setLastOralStudent);
  const oralViewMode = useFrenchAppStore((s) => s.oralViewMode);
  const setOralViewMode = useFrenchAppStore((s) => s.setOralViewMode);

  const valid = !!eleve && oralStudentExists(eleve);

  useEffect(() => {
    if (valid && eleve) setLastOralStudent(eleve);
  }, [valid, eleve, setLastOralStudent]);

  if (!valid || !eleve) {
    return <Navigate to="/francais/oral" replace />;
  }

  const student = getOralStudent(eleve);

  return (
    <>
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 px-6 py-2">
        <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-300">
          🎓 {student?.nom ?? eleve}
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <OralViewModeToggle value={oralViewMode} onChange={setOralViewMode} />
          <Link
            to="/francais/oral"
            className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            ← Changer d’élève
          </Link>
        </div>
      </div>
      <OralTabs eleve={eleve} />
      <Outlet />
    </>
  );
}
