import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';  // ← Se queda, home
import AuthPage from './pages/AuthPage';  // ← Login/register
import SolicitantePanel from './components/roles/SolicitantePanel';
import AprobadorPanel from './components/roles/AprobadorPanel';
import AuditorPanel from './components/roles/AuditorPanel';
import AdministradorPanel from './components/roles/AdministradorPanel';
import MiCuenta from './pages/profile/MiCuenta';

// Hook auth (token + role de localStorage)
const useAuth = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');  // Guarda role post-login (de backend response)
  const isLoggedIn = token !== null;
  return { isLoggedIn, role };
};

function App() {
  const { isLoggedIn, role } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />  // ← Home: Landing, se queda
      <Route path="/auth" element={<AuthPage />} />  // ← Auth: login/register
      {/* Dashboard base protegido – si logged, muestra panel por role */}
      <Route
        path="/dashboard"
        element={
          isLoggedIn ? (
            role === 'solicitante' ? <SolicitantePanel /> :
            role === 'aprobador' ? <AprobadorPanel /> :
            role === 'auditor' ? <AuditorPanel /> :
            role === 'admin' ? <AdministradorPanel /> :
            <Navigate to="/auth?tab=login" replace />
          ) : <Navigate to="/auth?tab=login" replace />
        }
      />
      {/* Rutas directas por rol (opcional, si quieres /solicitante directo) */}
      <Route path="/solicitante" element={isLoggedIn && role === 'solicitante' ? <SolicitantePanel /> : <Navigate to="/auth?tab=login" replace />} />
      <Route path="/aprobador" element={isLoggedIn && role === 'aprobador' ? <AprobadorPanel /> : <Navigate to="/auth?tab=login" replace />} />
      <Route path="/auditor" element={isLoggedIn && role === 'auditor' ? <AuditorPanel /> : <Navigate to="/auth?tab=login" replace />} />
      <Route path="/administrador" element={isLoggedIn && role === 'admin' ? <AdministradorPanel /> : <Navigate to="/auth?tab=login" replace />} />
      <Route path="/cuenta" element={isLoggedIn ? <MiCuenta /> : <Navigate to="/auth?tab=login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />  // Fallback a Landing
    </Routes>
  );
}

export default App;