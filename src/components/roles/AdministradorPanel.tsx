import { useState, useEffect } from "react";
import axios from "axios";  // Para fetch – npm i axios si no lo tienes
// import QRCode from 'qrcode.react';  // Descomenta si quieres QR: npm i qrcode.react @types/qrcode.react
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardFooter } from "@/components/dashboard-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Settings, FileText, Database, Clock, CheckCircle2, FileText as FileTextIcon, User, Loader2, TrendingUp, X, Users, } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "../dashboard-header";
// ← AQUÍ AGREGAS ESTO
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api" + "/";  // Render en prod

// ← FIX: Interface props para userName/role
interface AdministradorPanelProps {
  userName: string;
  role: string;
}

export default function AdministradorPanel({ userName, role }: AdministradorPanelProps) {  // ← FIX: Props con interface
  const [currentSection, setCurrentSection] = useState("usuarios");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [etapasFlujo, setEtapasFlujo] = useState<any[]>([]);
  const [reportes] = useState<any[]>([]);
  // const [, setKpis] = useState({ usuarios: 0, documentos: 0, tiempo: "0 días", cumplimiento: "0%" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [showKPIModal, setShowKPIModal] = useState(false);

  const token = localStorage.getItem("token");


useEffect(() => {
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No autenticado – inicia sesión");
      setLoading(false);
      return;
    }
    const headers = { Authorization: `Token ${token}` };  // ← AGREGADO: Headers con token
    setLoading(true);
    setError(null);
    try {
      const [usuariosRes, flujosRes,] = await Promise.all([
        axios.get(`${API_BASE}/admin/usuarios/`, { headers }),  // ← AGREGADO: { headers } en cada call
        axios.get(`${API_BASE}/documents/flows/`, { headers }),
        axios.get(`${API_BASE}/admin/reportes/`, { headers }),
        axios.get(`${API_BASE}/admin/kpis/`, { headers }),
      ]);
      setUsuarios(usuariosRes.data);
setEtapasFlujo(flujosRes.data);  // ← CAMBIA A:
setDocumentos(flujosRes.data);   // ← ASÍ LO USAMOS EN LAS GRÁFICAS
      // setKpis(kpisRes.data);
    } catch (error: any) {
      setError(error.response?.data?.non_field_errors?.[0] || "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [token]);

const handleSectionChange = (label: string) => {
    const map: Record<string, string> = {
      Usuarios: "usuarios",
      "Flujos": "flujos",
      "KPIs Globales": "kpis",
      Reportes: "reportes",
      Mantenimiento: "mantenimiento",
    };
    setCurrentSection(map[label] || "usuarios");
  };

  const handleApproveUser = async (userId: number) => {
    if (!token) {
      alert("No autenticado");
      return;
    }
    try {
      const headers = { Authorization: `Token ${token}` };
      await axios.patch(`${API_BASE}/admin/users/${userId}/approve/`, {}, { headers });
      setUsuarios(usuarios.map(u => u.id === userId ? { ...u, is_approved: true, estado: "Activo" } : u));
      alert(`Usuario ${userId} aprobado!`);
    } catch (err) {
      alert("Error al aprobar: " + (err as Error).message);
    }
  };


  const renderUsuarios = () => (
    <Card className="animate-in fade-in slide-in-from-bottom-4 border-2 border-slate-200 shadow-slate-100 duration-700">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
        <CardTitle className="flex items-center gap-3 text-2xl text-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 shadow-lg">
            <User className="h-6 w-6 text-white" />
          </div>
          Gestión de Usuarios
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : usuarios.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 mb-4">No hay usuarios para mostrar.</p>
            <Button onClick={() => window.location.reload()} variant="outline">Actualizar</Button>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            {/* Pendientes */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mb-6 min-w-full">
              <h3 className="mb-4 text-lg font-semibold text-slate-700">Usuarios Pendientes de Aprobación</h3>
              <div className="space-y-3">
                {usuarios
                  .filter((u: any) => u.estado === "Pendiente")
                  .map((u: any) => (
                    <div key={u.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg bg-white p-3 shadow-sm gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{u.full_name || u.nombre || 'Sin nombre'}</p>
                          <p className="text-sm text-slate-500">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Badge variant="secondary" className="bg-sky-100 text-sky-800">
                          {u.role || u.rol || 'Sin rol'}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => handleApproveUser(u.id)}
                          className="bg-sky-500 hover:bg-sky-600 text-white shadow-sm"
                        >
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          Aprobar
                        </Button>
                      </div>
                    </div>
                  )) || <p className="text-slate-500">Sin pendientes</p>}
              </div>
            </div>

            {/* Tabla full */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((u: any) => (
                    <TableRow key={u.id} className="hover:bg-slate-50">
                      <TableCell>{u.id}</TableCell>
                      <TableCell className="font-medium text-slate-900">{u.full_name || u.nombre}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-sky-100 text-sky-800">
                          {u.role || u.rol}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={u.estado === "Activo" ? "default" : "secondary"} className={u.estado === "Activo" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                          {u.estado || (u.is_approved ? "Activo" : "Pendiente")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => handleApproveUser(u.id)} variant="outline" className="border-slate-200 hover:bg-slate-50">
                          Aprobar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderFlujos = () => (
    <Card className="animate-in fade-in slide-in-from-bottom-4 border-2 border-slate-200 shadow-slate-100 duration-700">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
        <CardTitle className="flex items-center gap-3 text-2xl text-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 shadow-lg">
            <FileTextIcon className="h-6 w-6 text-white" />
          </div>
          Gestión de Flujos de Documentos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : etapasFlujo.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 mb-4">No hay flujos disponibles.</p>
            <Button variant="outline">Crear Flujo</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {etapasFlujo.map((etapa: any) => (
              <Card key={etapa.id} className="border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                      <FileTextIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{etapa.nombre}</h3>
                      <p className="text-sm text-slate-500">{etapa.descripcion}</p>
                      <p className="text-xs text-slate-400">Folio: {etapa.folio} | Etapa: {etapa.etapa}</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">{etapa.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  // ← PON ESTO DESPUÉS DE TUS useState (fuera de cualquier función)
const usuariosPorRol = usuarios.reduce((acc: any[], user: any) => {
  const rolName = 
    user.role === "gestor" ? "Gestor Documental" :
    user.role === "aprobador" ? "Revisor" :
    user.role === "auditor" ? "Auditor" :
    "Usuario Final";

  const existing = acc.find((item: any) => item.rol === rolName);
  if (existing) existing.cantidad += 1;
  else acc.push({ rol: rolName, cantidad: 1, color: 
    user.role === "gestor" ? "#10B981" :
    user.role === "aprobador" ? "#0EA5E9" :
    user.role === "auditor" ? "#8B5CF6" : "#64748B"
  });
  return acc;
}, []);

const estadoDocs = [
  { name: "Aprobados", value: documentos.filter(d => d.etapa?.toLowerCase().includes("aprobad")).length || 0, color: "#10B981" },
  { name: "En Revisión", value: documentos.filter(d => d.etapa?.toLowerCase().includes("cambio")).length || 0, color: "#0EA5E9" },
  { name: "Pendientes", value: documentos.filter(d => d.etapa?.toLowerCase().includes("permiso")).length || 0, color: "#F59E0B" },
  { name: "Por Vencer", value: 0, color: "#EF4444" },
];


const renderKPIs = () => {
  // ← NÚMEROS REALES DE USUARIOS
  const totalUsuarios = usuarios.length;
  const aprobados = usuarios.filter(u => u.is_approved === true).length;
  const pendientes = totalUsuarios - aprobados;

  // ← NÚMEROS REALES DE DOCUMENTOS (lo que tienes en la captura)
  const documentosAprobados = documentos.filter(d => d.etapa?.toLowerCase().includes("aprobad")).length;
  const documentosEnRevision = documentos.filter(d => d.etapa?.toLowerCase().includes("cambio")).length;
  const documentosPendientes = documentos.filter(d => d.etapa?.toLowerCase().includes("permiso")).length;

  // ← GRÁFICA DE BARRAS - DOCUMENTOS POR ESTADO (REAL)
  const estadoDocs = [
    { name: "Aprobados", value: documentosAprobados, color: "#10B981" },
    { name: "En Revisión", value: documentosEnRevision, color: "#0EA5E9" },
    { name: "Pendientes", value: documentosPendientes, color: "#F59E0B" },
    { name: "Por Vencer", value: 0, color: "#EF4444" },
  ];

  // ← GRÁFICA DE PASTEL - USUARIOS POR ROL (REAL)
  const usuariosPorRol = usuarios.reduce((acc: any[], user: any) => {
    const rolName = 
      user.role === "gestor" ? "Gestor Documental" :
      user.role === "aprobador" ? "Revisor" :
      user.role === "auditor" ? "Auditor" :
      "Usuario Final";

    const existing = acc.find((item: any) => item.rol === rolName);
    if (existing) existing.cantidad += 1;
    else acc.push({ rol: rolName, cantidad: 1, color: 
      user.role === "gestor" ? "#10B981" :
      user.role === "aprobador" ? "#0EA5E9" :
      user.role === "auditor" ? "#8B5CF6" : "#64748B"
    });
    return acc;
  }, []);

  return (
    <div className="space-y-12">
      <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
        KPIs Globales del Sistema
      </h2>

{/* 4 TARJETAS KPIs - VERSIÓN COMPACTA Y BRUTAL */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
  {/* USUARIOS REGISTRADOS */}
  <Card className="shadow-xl bg-gradient-to-br from-sky-500 to-sky-600 text-white hover:shadow-2xl transition-all duration-300">
    <CardContent className="p-5 md:p-6 text-center">
      <User className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 opacity-90" />
      <p className="text-3xl md:text-4xl font-black">{totalUsuarios}</p>
      <p className="text-sm md:text-base mt-1 opacity-90">Usuarios Registrados</p>
    </CardContent>
  </Card>

  {/* APROBADOS */}
  <Card className="shadow-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:shadow-2xl transition-all duration-300">
    <CardContent className="p-5 md:p-6 text-center">
      <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 opacity-90" />
      <p className="text-3xl md:text-4xl font-black">{aprobados}</p>
      <p className="text-sm md:text-base mt-1 opacity-90">Aprobados</p>
    </CardContent>
  </Card>

  {/* PENDIENTES */}
  <Card className="shadow-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white hover:shadow-2xl transition-all duration-300">
    <CardContent className="p-5 md:p-6 text-center">
      <Clock className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 opacity-90" />
      <p className="text-3xl md:text-4xl font-black">{pendientes}</p>
      <p className="text-sm md:text-base mt-1 opacity-90">Pendientes</p>
    </CardContent>
  </Card>

  {/* DOCUMENTOS TOTALES */}
  <Card className="shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-2xl transition-all duration-300">
    <CardContent className="p-5 md:p-6 text-center">
      <FileText className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 opacity-90" />
      <p className="text-3xl md:text-4xl font-black">{documentos.length}</p>
      <p className="text-sm md:text-base mt-1 opacity-90">Documentos</p>
    </CardContent>
  </Card>
</div>

 {/* GRÁFICAS - SOLO EN ESCRITORIO (lg y más grande) */}
<div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
  {/* GRÁFICA 1: USUARIOS POR ROL */}
  <Card className="shadow-2xl">
    <CardHeader>
      <CardTitle className="text-2xl flex items-center gap-3">
        <Users className="w-8 h-8 text-[#0EA5E9]" />
        Usuarios por Rol
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={usuariosPorRol}
            dataKey="cantidad"
            nameKey="rol"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={140}
            paddingAngle={5}
            label={(entry: any) => `${entry.rol}: ${entry.cantidad}`}
          >
            {usuariosPorRol.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value} usuarios`} />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>

  {/* GRÁFICA 2: ESTADO DE DOCUMENTOS */}
  <Card className="shadow-2xl">
    <CardHeader>
      <CardTitle className="text-2xl">Estado Actual de Documentos</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={estadoDocs}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#0EA5E9" radius={[12, 12, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
</div>

{/* MENSAJE EN MÓVIL Y TABLET */}
<div className="lg:hidden text-center py-12">
  <div className="bg-gradient-to-br from-sky-50 to-emerald-50 rounded-3xl p-8 shadow-lg">
    <TrendingUp className="w-16 h-16 mx-auto mb-4 text-[#0EA5E9]" />
    <h3 className="text-2xl font-bold text-gray-900 mb-2">Gráficas disponibles en escritorio</h3>
    <p className="text-gray-600">Usa una pantalla más grande para ver los KPIs detallados</p>
  </div>
</div>
  </div>
  );
};

  const renderReportes = () => (
    <Card className="animate-in fade-in slide-in-from-bottom-4 border-2 border-slate-200 shadow-slate-100 duration-700">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
        <CardTitle className="flex items-center gap-3 text-2xl text-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 shadow-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          Reportes Generados
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : reportes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 mb-4">No hay reportes disponibles.</p>
            <Button variant="outline">Crear Reporte</Button>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportes.map((r: any) => (
                  <TableRow key={r.id} className="hover:bg-slate-50">
                    <TableCell>{r.id}</TableCell>
                    <TableCell className="font-medium text-slate-900">{r.titulo}</TableCell>
                    <TableCell>{r.fecha}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-800">
                        {r.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={r.status === "generado" ? "default" : "secondary"} className="bg-green-100 text-green-800">
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="border-slate-200 hover:bg-slate-50">
                        Descargar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderMantenimiento = () => (
    <Card className="animate-in fade-in slide-in-from-bottom-4 border-2 border-slate-200 shadow-slate-100 duration-700">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
        <CardTitle className="flex items-center gap-3 text-2xl text-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 shadow-lg">
            <Database className="h-6 w-6 text-white" />
          </div>
          Mantenimiento del Sistema
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Button className="group h-20 bg-gradient-to-r from-sky-500 to-sky-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 w-full">
            <Database className="mr-3 h-6 w-6 transition-all group-hover:scale-110" />
            <span className="text-lg font-semibold text-white">Crear Backup</span>
          </Button>
          <Button className="group h-20 bg-gradient-to-r from-sky-500 to-sky-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 w-full">
            <Settings className="mr-3 h-6 w-6 transition-all group-hover:scale-110" />
            <span className="text-lg font-semibold text-white">Configurar Notificaciones</span>
          </Button>
          <Button className="group h-20 bg-gradient-to-r from-slate-700 to-slate-800 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 w-full">
            <FileText className="mr-3 h-6 w-6 transition-all group-hover:scale-110" />
            <span className="text-lg font-semibold text-white">Ver Logs del Sistema</span>
          </Button>
          <Button className="group h-20 bg-gradient-to-r from-slate-700 to-slate-800 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 w-full">
            <Settings className="mr-3 h-6 w-6 transition-all group-hover:scale-110" />
            <span className="text-lg font-semibold text-white">Integración ERP</span>
          </Button>
        </div>
        <div className="animate-in fade-in rounded-xl bg-gradient-to-r from-sky-50 to-slate-50 p-5 shadow-lg duration-700 delay-500 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 shadow-md">
              <CheckCircle2 className="h-5 w-5 animate-pulse text-white" />
            </div>
            <div>
              <p className="font-semibold text-sky-700">Sistema Operando Normalmente</p>
              <p className="text-sm text-slate-600">
                Último backup: Cargando... | Integraciones activas: 0
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSection = () => {
    switch (currentSection) {
      case "usuarios":
        return renderUsuarios();
      case "flujos":
        return renderFlujos();
      case "kpis":
        return renderKPIs();
      case "reportes":
        return renderReportes();
      case "mantenimiento":
        return renderMantenimiento();
      default:
        return renderUsuarios();
    }
  };

  const sidebarItems = [
    { label: "Usuarios", href: "/administrador", icon: "👥" },
    { label: "Flujos", href: "/administrador", icon: "🔄" },
    { label: "KPIs Globales", href: "/administrador", icon: "📊" },
    { label: "Reportes", href: "/administrador", icon: "📄" },
    { label: "Mantenimiento", href: "/administrador", icon: "⚙️" },
  ];

return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-sky-50/20">
<DashboardHeader 
  userName={userName} 
  role={role} 
  onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}   // ← ESTO ES LA CLAVE
/>
      <div className="flex flex-1">
        <DashboardSidebar 
          items={sidebarItems.map(item => ({
            ...item,
            onClick: () => handleSectionChange(item.label)
          }))} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className={cn(
          "flex-1 transition-all duration-300 p-2 sm:p-4 lg:p-6 overflow-y-auto w-full",
          isSidebarOpen ? "lg:ml-0 ml-0" : "ml-0"
        )}>
          <div className="mx-auto max-w-7xl space-y-6 w-full">
            {renderSection()}
          </div>
        </main>
      </div>
{/* BOTÓN FLOTANTE - SOLO EN LA SECCIÓN "KPIs Globales" */}
{currentSection === "kpis" && (
  <div className="fixed bottom-8 right-6 z-50 lg:hidden">
    <Button
      size="icon"
      className="rounded-full shadow-2xl bg-gradient-to-br from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 w-16 h-16 flex items-center justify-center"
      onClick={() => setShowKPIModal(true)}
    >
      <TrendingUp className="w-8 h-8 text-white" />
    </Button>
  </div>
)}

   {/* MODAL DE KPIs - PERFECTO EN MÓVIL */}
{showKPIModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
      {/* CABECERA */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">KPIs Globales</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowKPIModal(false)}
          className="text-gray-600 hover:bg-gray-100 rounded-full"
        >
          <X className="w-8 h-8" />
        </Button>
      </div>

      {/* CONTENIDO RESPONSIVE */}
      <div className="p-6 md:p-8 space-y-10">
        {/* GRÁFICA DE PASTEL */}
        <Card className="shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl md:text-2xl flex items-center gap-3">
              <Users className="w-7 h-7 text-[#0EA5E9]" />
              Usuarios por Rol
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={usuariosPorRol}
                  dataKey="cantidad"
                  nameKey="rol"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={5}
                  label={(entry: any) => `${entry.rol}: ${entry.cantidad}`}
                >
                  {usuariosPorRol.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value} usuarios`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* GRÁFICA DE BARRAS */}
        <Card className="shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl md:text-2xl">Estado Actual de Documentos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={estadoDocs}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0EA5E9" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
)}
      <DashboardFooter />
    </div>  
  );
}