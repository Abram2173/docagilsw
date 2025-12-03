// src/App.tsx
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Landing from './pages/Landing';
import AuthPage from './pages/AuthPage';
import MiCuenta from './pages/profile/MiCuenta';
import SelectRole from './pages/SelectRole';

// TUS PANELES
import SolicitantePanel from './components/roles/SolicitantePanel';
import AprobadorPanel from './components/roles/AprobadorPanel';
import AuditorPanel from './components/roles/AuditorPanel';
import GestorDocumentalPanel from './components/roles/GestorDocumentalPanel';
import AdministradorPanel from './components/roles/AdministradorPanel';
import DirectorPanel from './components/roles/DirectorPanel';
import SubdirectorPanel from './components/roles/SubdirectorPanel';
import CoordinadorPanel from './components/roles/CoordinadorPanel';
import { Button } from './components/ui/button';

const useAuth = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') || '';
  const fullName = localStorage.getItem('full_name') || 'Usuario';
  const isLoggedIn = !!token;

  const logout = () => {
    localStorage.clear();
    window.location.href = '/auth';
  };

  return { isLoggedIn, role, fullName, logout };
};
// ← QUITA TODO EL CÓDIGO DE allowedRoles y currentPath
// ← DEJA SOLO EL PANEL SEGÚN ROL

function ProtectedDashboard() {
  const { isLoggedIn, role, fullName } = useAuth();
  const navigate = useNavigate(); // ← AÑADE ESTA LÍNEA AQUÍ

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      {role === 'solicitante' && <SolicitantePanel userName={fullName} role={role} />}
      {role === 'aprobador' && <AprobadorPanel userName={fullName} role={role} />}
      {role === 'auditor' && <AuditorPanel userName={fullName} role={role} />}
      {role === 'gestor' && <GestorDocumentalPanel userName={fullName} role={role} />}
      {role === 'admin' && <AdministradorPanel userName={fullName} role={role} />}
      {role === 'director' && <DirectorPanel userName={fullName} role={role} />}
      {role === 'subdirector' && <SubdirectorPanel userName={fullName} role={role} />}
      {role === 'coordinador' && <CoordinadorPanel userName={fullName} role={role} />}

      {/* SIN ROL */}
      {!role && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-10 bg-white rounded-3xl shadow-2xl">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Selecciona tu rol</h2>
            <Button onClick={() => navigate("/select-role")}>
              Ir a selección de rol
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/select-role" element={<SelectRole />} />
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<AuthPage />} />

      <Route path="/dashboard" element={<ProtectedDashboard />} />
      <Route path="/solicitante" element={<ProtectedDashboard />} />
      <Route path="/aprobador" element={<ProtectedDashboard />} />
      <Route path="/auditor" element={<ProtectedDashboard />} />
      <Route path="/gestor" element={<ProtectedDashboard />} />
      <Route path="/administrador" element={<ProtectedDashboard />} />
      <Route path="/director" element={<ProtectedDashboard />} />
      <Route path="/subdirector" element={<ProtectedDashboard />} />
      <Route path="/coordinador" element={<ProtectedDashboard />} />

      <Route path="/cuenta" element={localStorage.getItem('token') ? <MiCuenta /> : <Navigate to="/auth" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;