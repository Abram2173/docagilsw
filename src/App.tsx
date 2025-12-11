// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import AuthPage from './pages/AuthPage';
import MiCuenta from './pages/profile/MiCuenta';
import SelectRole from './pages/SelectRole';

// PANELES
import SolicitantePanel from './components/roles/SolicitantePanel';
import AprobadorPanel from './components/roles/AprobadorPanel';
import AuditorPanel from './components/roles/AuditorPanel';
import GestorDocumentalPanel from './components/roles/JefeDepartamentoPanel'; // panel genérico (opcional)
import AdministradorPanel from './components/roles/AdministradorPanel';
import DirectorPanel from './components/roles/DirectorPanel';
import SubdirectorPanel from './components/roles/SubdirectorPanel';
import CoordinadorPanel from './components/roles/CoordinadorPanel';

// ← IMPORTS DE LOS PANELES DE JEFES
import JefeIMSSPanel from './components/roles/jefes/JefeIMSSPanel';
import JefeBecasPanel from './components/roles/jefes/JefeBecasPanel';
import JefeServiciosEscolaresPanel from './components/roles/jefes/JefeServiciosEscolaresPanel';
import JefeBibliotecaPanel from './components/roles/jefes/JefeBibliotecaPanel';

import { Button } from './components/ui/button';
import AuthCallback from './pages/AuthCallback';

const useAuth = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') || '';
  const fullName = localStorage.getItem('full_name') || 'Usuario';
  const isLoggedIn = !!token;

  return { isLoggedIn, role, fullName };
};

function Dashboard() {
  const { isLoggedIn, role, fullName } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  if (!role) {
    return <Navigate to="/select-role" replace />;
  }

  // ← IGNORA MAYÚSCULAS
  const r = role.toLowerCase().trim();

  // ← PANEL SEGÚN ROL
// ← PANEL SEGÚN ROL (ORDEN CORRECTO)
if (r.includes('solicitante')) return <SolicitantePanel userName={fullName} role={role} />;
if (r.includes('aprobador') || r.includes('revisor')) return <AprobadorPanel userName={fullName} role={role} />;
if (r.includes('auditor')) return <AuditorPanel userName={fullName} role={role} />;
if (r.includes('admin') || r.includes('administrador')) return <AdministradorPanel userName={fullName} role={role} />;
if (r === 'director') return <DirectorPanel userName={fullName} role={role} />;  // ← PRIMERO EL DIRECTOR
if (r === 'subdirector') return <SubdirectorPanel userName={fullName} role={role} />;  // ← DESPUÉS EL SUBDIRECTOR
if (r.includes('coordinador')) return <CoordinadorPanel userName={fullName} role={role} />;

// ← JEFES ESPECÍFICOS
if (r === 'gestor_imss') return <JefeIMSSPanel userName={fullName} role={role} />;
if (r === 'gestor_becas') return <JefeBecasPanel userName={fullName} role={role} />;
// if (r === 'gestor_inscripciones') return <JefeInscripcionesPanel userName={fullName} role={role} />;
if (r === 'gestor_servicios') return <JefeServiciosEscolaresPanel userName={fullName} role={role} />;
if (r === 'gestor_biblioteca') return <JefeBibliotecaPanel userName={fullName} role={role} />;

// ← JEFE GENÉRICO
if (r.includes('gestor')) return <GestorDocumentalPanel userName={fullName} role={role} />;

// ← ACCESO DENEGADO
  // ← MENSAJE DE ACCESO DENEGADO
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center p-10 bg-white rounded-3xl shadow-2xl max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Acceso Denegado</h1>
        <p className="text-lg text-gray-600 mb-8">
          No tienes permiso para acceder a este panel.<br />
          Tu rol no está autorizado para esta sección.
        </p>
        <Button onClick={() => window.location.href = "/dashboard"} className="bg-blue-600 hover:bg-blue-700 text-white">
          Volver al Dashboard
        </Button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/select-role" element={<SelectRole />} />

      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="*" element={<Dashboard />} />

      <Route path="/cuenta" element={localStorage.getItem('token') ? <MiCuenta /> : <Navigate to="/auth" replace />} />
    </Routes>
  );
}

export default App;