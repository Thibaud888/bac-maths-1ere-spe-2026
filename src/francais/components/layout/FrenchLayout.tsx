import { Outlet } from 'react-router-dom';
import FrenchSidebar from './FrenchSidebar';
import FrenchHeader from './FrenchHeader';

export default function FrenchLayout() {
  return (
    <div className="flex min-h-screen">
      <FrenchSidebar />
      <div className="flex flex-1 flex-col">
        <FrenchHeader />
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
