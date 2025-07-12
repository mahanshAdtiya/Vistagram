import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { ProtectedRoutes, PublicRoutes, PublicLayout } from './utils';
import { ExplorePage, LoginPage } from './pages';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';


export default function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    fetchUser();
  }, []);

  if (!isHydrated) return <div className="p-10 text-center">Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<ExplorePage />} />
        </Route>

        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route element={<PublicLayout />}>
            <Route path="/explore" element={<ExplorePage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}