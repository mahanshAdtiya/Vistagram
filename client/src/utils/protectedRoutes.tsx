import { Navigate, Outlet} from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const ProtectedRoutes = () => {
  const user = useAuthStore((state) => state.user);
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;