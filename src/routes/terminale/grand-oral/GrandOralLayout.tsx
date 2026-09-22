import { Outlet } from 'react-router-dom';
import SectionTabs from '@/components/layout/SectionTabs';
import { GRAND_ORAL_SECTIONS } from '@/lib/spaces';

export default function GrandOralLayout() {
  return (
    <>
      <SectionTabs
        items={GRAND_ORAL_SECTIONS}
        accent="amber"
        label="Sections du grand oral"
      />
      <Outlet />
    </>
  );
}
