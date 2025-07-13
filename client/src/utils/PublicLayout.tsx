import { Outlet } from 'react-router-dom';
import LeftSidebar from '@/components/LeftSideBar';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex">
      <div className="w-[16%]">
        <LeftSidebar />
      </div>
      
      <div className="flex-1 px-4 pb-16">
        <Outlet />
      </div>
    </div>
  );
}
