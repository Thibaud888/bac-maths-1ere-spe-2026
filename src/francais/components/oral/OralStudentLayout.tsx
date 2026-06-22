import { useEffect } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { oralStudentExists } from '@/francais/lib/french-content-loader';
import { useFrenchAppStore } from '@/francais/stores/french-app-store';
import OralViewModeToggle from './OralViewModeToggle';

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

  return (
    <>
      <div className="flex items-center justify-end border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 px-6 py-2">
        <OralViewModeToggle value={oralViewMode} onChange={setOralViewMode} />
      </div>
      <Outlet />
    </>
  );
}
