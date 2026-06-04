import { useEffect } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { frenchModuleExists } from '@/francais/lib/french-content-loader';
import { useFrenchAppStore } from '@/francais/stores/french-app-store';
import FrenchTabs from './FrenchTabs';

export default function FrenchModuleLayout() {
  const { slug } = useParams<{ slug: string }>();
  const setLastVisitedModule = useFrenchAppStore((s) => s.setLastVisitedModule);
  const isValid = !!slug && frenchModuleExists(slug);

  useEffect(() => {
    if (isValid && slug) {
      setLastVisitedModule(slug);
    }
  }, [isValid, slug, setLastVisitedModule]);

  if (!isValid) {
    return <Navigate to="/francais" replace />;
  }

  return (
    <>
      <FrenchTabs />
      <Outlet />
    </>
  );
}
