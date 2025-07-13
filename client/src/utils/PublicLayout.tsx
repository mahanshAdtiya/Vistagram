import { Outlet } from 'react-router-dom';
import {BottomNav} from '@/components'

export default function PublicLayout() {
  return (
    <div className="relative min-h-screen pb-16">
      <Outlet />
      <BottomNav/>
    </div>
  );
}