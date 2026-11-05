import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import ClubesPage from './pages/ClubesPage/ClubesPage';
import DeportistasPage from './pages/DeportistasPage/DeportistasPage';
import BuscarPage from './pages/BuscarPage/BuscarPage';
import MapaPage from './pages/MapaPage/MapaPage';
import AdminPage from './pages/AdminPage/AdminPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SolicitudPage from './pages/SolicitudPage/SolicitudPage';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import type { JSX } from 'react/jsx-runtime';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('adminToken');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// METI TODO DENTRO DE UN ENVOLTORIO
const AppLayout = () => {
  const location = useLocation();
  const isPanelAdmin = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <>
      <ScrollToTop />
      {/* PARA QUE NO APAREZCA EL FOOTER EN ADMIN*/}
      {!isPanelAdmin && <Navbar />}
      
      <main className={isPanelAdmin ? 'h-screen' : ''}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/clubes" element={<ClubesPage />} />
          <Route path="/mapa" element={<MapaPage />} />
          <Route path="/deportistas" element={<DeportistasPage />} />
          <Route path="/buscar" element={<BuscarPage />} />
          <Route path="/solicitud" element={<SolicitudPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!isPanelAdmin && <Footer />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;