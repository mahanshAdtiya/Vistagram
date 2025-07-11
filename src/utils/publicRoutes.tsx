import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const PublicRoutes = () => {
  const user = useAuthStore((state) => state.user);

  return user ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoutes;