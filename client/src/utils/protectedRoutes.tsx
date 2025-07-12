import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const ProtectedRoutes = () => {
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  if (!isHydrated) return null;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;