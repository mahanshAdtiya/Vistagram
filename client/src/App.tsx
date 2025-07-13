import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

import {ProtectedRoutes,PublicRoutes,PublicLayout} from './utils';

import {HomePage,ExplorePage,LoginPage,ProfilePage,EditPage,PostPage} from './pages';

import { useAuthStore } from '@/store/useAuthStore';
import { useSocketStore } from '@/store/useSocketStore';

export default function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const initializeSocket = useSocketStore((state) => state.initializeSocket);
  const disconnectSocket = useSocketStore((state) => state.disconnectSocket);

  useEffect(() => {
    fetchUser();
  }, []);


  useEffect(() => {
    if (isHydrated && user?._id) {
      initializeSocket(user._id);
    } else if (isHydrated) {
      disconnectSocket();
    }
  }, [isHydrated, user]);


  if (!isHydrated) return <div className="p-10 text-center">Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="/post/:id" element={<PostPage />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/account/:id" element={<ProfilePage />} />
            <Route path="/account/edit" element={<EditPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}