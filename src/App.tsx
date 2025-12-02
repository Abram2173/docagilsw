// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import AuthPage from './pages/AuthPage';
import MiCuenta from './pages/profile/MiCuenta';
import SelectRole from './pages/SelectRole'; // ← AQUÍ ESTÁ TU PANTALLA DE ROLES

// TUS 5 PANELES
import SolicitantePanel from './components/roles/SolicitantePanel';
import AprobadorPanel from './components/roles/AprobadorPanel';
import AuditorPanel from './components/roles/AuditorPanel';
import GestorDocumentalPanel from './components/roles/GestorDocumentalPanel';
import AdministradorPanel from './components/roles/AdministradorPanel';

const useAuth = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') || '';
  const fullName = localStorage.getItem('full_name') || 'Usuario';
  const isLoggedIn = !!token;

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return { isLoggedIn, role, fullName, logout };
};

function ProtectedDashboard() {
  const { isLoggedIn, role, fullName } = useAuth();

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
      

      {/* USUARIO SIN ROL APROBADO */}
      {![ 'solicitante', 'aprobador', 'auditor', 'gestor', 'admin' ].includes(role) && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
          <div className="text-center p-10 bg-white rounded-3xl shadow-2xl max-w-md">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Acceso Pendiente</h2>
            <p className="text-lg text-gray-700 mb-6">
              Tu cuenta está en revisión por el administrador.
            </p>
            <button onClick={() => window.location.href = '/'} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl">
              Volver al inicio
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <Routes>
      {/* PÁGINA DE INICIO */}
      <Route path="/" element={<Landing />} />

      {/* SELECCIÓN DE ROL */}
      <Route path="/select-role" element={<SelectRole />} />

      {/* LOGIN */}
      <Route path="/auth" element={<AuthPage />} />

      {/* DASHBOARD */}
      <Route path="/dashboard" element={<ProtectedDashboard />} />

      

      {/* RUTAS POR ROL */}
      <Route path="/solicitante" element={<ProtectedDashboard />} />
      <Route path="/aprobador" element={<ProtectedDashboard />} />
      <Route path="/auditor" element={<ProtectedDashboard />} />
      <Route path="/gestor" element={<ProtectedDashboard />} />
      <Route path="/administrador" element={<ProtectedDashboard />} />

      {/* MI CUENTA */}
      <Route path="/cuenta" element={localStorage.getItem('token') ? <MiCuenta /> : <Navigate to="/auth" replace />} />

      {/* CUALQUIER OTRA → INICIO */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

      <Route path="/select-role" element={<SelectRole />} />
