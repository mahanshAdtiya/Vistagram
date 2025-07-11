import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoutes, PublicRoutes } from './utils';
import { LandingPage, LoginPage, Chapter } from './pages';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chapter/:id" element={<Chapter />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
