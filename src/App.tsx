import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Landing from './pages/Landing';  // ← Se queda, home
import AuthPage from './pages/AuthPage';  // ← Login/register
import SolicitantePanel from './components/roles/SolicitantePanel';
import AprobadorPanel from './components/roles/AprobadorPanel';
import AuditorPanel from './components/roles/AuditorPanel';
import AdministradorPanel from './components/roles/AdministradorPanel';
import MiCuenta from './pages/profile/MiCuenta';
import {DashboardHeader} from './components/dashboard-header';  // ← FIX: Import DashboardHeader (ajusta path si es diferente)

// Hook auth (igual)
const useAuth = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') || 'usuario';
  const fullName = localStorage.getItem('full_name') || 'Usuario';  // ← FIX: Lee nombre
  const isLoggedIn = token !== null;

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('full_name');  // ← Limpia nombre
    navigate('/auth?tab=login');
  };

  return { isLoggedIn, role, fullName, logout };
};

function App() {
  const { isLoggedIn, role, fullName, logout } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<AuthPage />} />
      {/* Dashboard base protegido */}
      <Route
        path="/dashboard"
        element={
          isLoggedIn ? (
            <div>
              <DashboardHeader userName={fullName} role={role} onMenuToggle={logout} />
              {role === 'solicitante' ? <SolicitantePanel userName={fullName} role={role} /> :  // ← Ya pasa props
              role === 'aprobador' ? <AprobadorPanel userName={fullName} role={role} /> :
              role === 'auditor' ? <AuditorPanel userName={fullName} role={role} /> :
              role === 'admin' ? <AdministradorPanel userName={fullName} role={role} /> :
              <Navigate to="/auth?tab=login" replace />}
            </div>
          ) : <Navigate to="/auth?tab=login" replace />
        }
      />
      {/* Resto rutas igual */}
      <Route path="/solicitante" element={isLoggedIn && role === 'solicitante' ? <SolicitantePanel userName={''} role={''} /> : <Navigate to="/auth?tab=login" replace />} />
      <Route path="/aprobador" element={isLoggedIn && role === 'aprobador' ? <AprobadorPanel userName={''} role={''} /> : <Navigate to="/auth?tab=login" replace />} />
      <Route path="/auditor" element={isLoggedIn && role === 'auditor' ? <AuditorPanel userName={''} role={''} /> : <Navigate to="/auth?tab=login" replace />} />
      <Route path="/administrador" element={isLoggedIn && role === 'admin' ? <AdministradorPanel userName={''} role={''} /> : <Navigate to="/auth?tab=login" replace />} />
      <Route path="/cuenta" element={isLoggedIn ? <MiCuenta /> : <Navigate to="/auth?tab=login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;