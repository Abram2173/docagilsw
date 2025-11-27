// src/App.tsx  ← REEMPLAZA TODO TU ARCHIVO CON ESTE
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import AuthPage from './pages/AuthPage';
import MiCuenta from './pages/profile/MiCuenta';

// TUS PANELES (NO CAMBIAMOS NOMBRES)
import SolicitantePanel from './components/roles/SolicitantePanel';
import AprobadorPanel from './components/roles/AprobadorPanel';
import AuditorPanel from './components/roles/AuditorPanel';
import AdministradorPanel from './components/roles/AdministradorPanel';
import GestorDocumentalPanel from './components/roles/GestorDocumentalPanel'; // ← AÑADIDO

import { DashboardHeader } from './components/dashboard-header';

const useAuth = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') || '';
  const fullName = localStorage.getItem('full_name') || 'Usuario';
  const isLoggedIn = !!token;

  const logout = () => {
    localStorage.clear();
    window.location.href = '/auth?tab=login';
  };

  return { isLoggedIn, role, fullName, logout };
};

function ProtectedDashboard() {
  const { isLoggedIn, role, fullName, logout } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/auth?tab=login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader userName={fullName} role={role} onMenuToggle={logout} />

      {/* MAPEO DE ROLES DEL BACKEND → TUS PANELES */}
      {role === 'solicitante' && <SolicitantePanel userName={fullName} role={role} />}
      {role === 'aprobador'   && <AprobadorPanel userName={fullName} role={role} />}
      {role === 'auditor'     && <AuditorPanel userName={fullName} role={role} />}
      {role === 'gestor'      && <GestorDocumentalPanel userName={fullName} role={role} />} {/* ← AÑADIDO */}
      {role === 'admin'       && <AdministradorPanel userName={fullName} role={role} />}

      {/* USUARIOS NO APROBADOS O SIN ROL */}
      {role === '' && (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-sky-50 to-emerald-50">
          <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md border">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Acceso Pendiente</h2>
            <p className="text-lg text-gray-700">
              Tu cuenta aún no ha sido aprobada por el administrador.
            </p>
            <button onClick={logout} className="mt-6 text-sky-600 font-bold hover:underline">
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/recuperar" element={<div className="p-10">Recuperar contraseña (próximamente)</div>} />

      {/* TODAS LAS RUTAS VAN AL MISMO DASHBOARD */}
      <Route path="/dashboard" element={<ProtectedDashboard />} />
      <Route path="/solicitante" element={<ProtectedDashboard />} />
      <Route path="/aprobador" element={<ProtectedDashboard />} />
      <Route path="/auditor" element={<ProtectedDashboard />} />
      <Route path="/gestor" element={<ProtectedDashboard />} /> {/* ← RUTA PARA GESTOR */}
      <Route path="/administrador" element={<ProtectedDashboard />} />

      <Route path="/cuenta" element={localStorage.getItem('token') ? <MiCuenta /> : <Navigate to="/auth" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;