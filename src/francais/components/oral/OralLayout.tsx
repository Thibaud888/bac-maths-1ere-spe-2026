import { Outlet } from 'react-router-dom';
import OralTabs from './OralTabs';

export default function OralLayout() {
  return (
    <>
      <OralTabs />
      <Outlet />
    </>
  );
}
