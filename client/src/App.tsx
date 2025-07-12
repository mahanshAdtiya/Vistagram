import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoutes, PublicRoutes, PublicLayout} from './utils';
import {ExplorePage,LoginPage} from './pages';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route element={<PublicLayout />}>
          <Route path="/explore" element={<ExplorePage />} />
        </Route>
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route element={<PublicLayout />}>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/explore" replace />} />
      </Routes>
    </BrowserRouter>
  );
}