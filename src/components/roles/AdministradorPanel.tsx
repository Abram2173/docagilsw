import { useState, useEffect } from "react";
import axios from "axios";  // Para fetch – npm i axios si no lo tienes
// import QRCode from 'qrcode.react';  // Descomenta si quieres QR: npm i qrcode.react @types/qrcode.react
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardFooter } from "@/components/dashboard-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Settings, FileText, Database, TrendingUp, Clock, CheckCircle2, FileText as FileTextIcon, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE = "http://127.0.0.1:8000/api";  // Ajusta puerto si cambias

export default function AdministradorPanel() {
  const [currentSection, setCurrentSection] = useState("usuarios");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [etapasFlujo, setEtapasFlujo] = useState<any[]>([]);
  const [reportes, setReportes] = useState<any[]>([]);
  const [kpis, setKpis] = useState({ usuarios: 0, documentos: 0, tiempo: "0 días", cumplimiento: "0%" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("No autenticado – inicia sesión");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const headers = { Authorization: `Token ${token}` };
        const [usuariosRes, flujosRes, reportesRes, kpisRes] = await Promise.all([
          axios.get(`${API_BASE}/admin/usuarios/`, { headers }),
          axios.get(`${API_BASE}/documents/flows/`, { headers }),
          axios.get(`${API_BASE}/admin/reportes/`, { headers }),
          axios.get(`${API_BASE}/admin/kpis/`, { headers })
        ]);
        setUsuarios(usuariosRes.data);
        setEtapasFlujo(flujosRes.data);
        setReportes(reportesRes.data);
        setKpis(kpisRes.data || { usuarios: 0, documentos: 0, tiempo: "0 días", cumplimiento: "0%" });
        console.log("Datos cargados desde backend!");
      } catch (err) {
        setError("Error al cargar datos: " + (err as Error).message);
        console.error(err);
        // Fallback hardcoded temporal
        setUsuarios([
          { id: 1, full_name: "Juan Pérez", email: "juan@instituto.edu.mx", role: "solicitante", estado: "Activo", is_approved: true },
          { id: 2, full_name: "Test Solicitante", email: "test@instituto.edu.mx", role: "solicitante", estado: "Pendiente", is_approved: false }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const sectionMap: Record<string, string> = {
    "Usuarios": "usuarios",
    "Flujos": "flujos",
    "KPIs Globales": "kpis",
    "Reportes": "reportes",
    "Mantenimiento": "mantenimiento",
  };

  const handleSectionChange = (label: string) => {
    const section = sectionMap[label] || "usuarios";
    setCurrentSection(section);
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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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

  const renderKPIs = () => (
    <Card className="animate-in fade-in slide-in-from-bottom-4 border-2 border-slate-200 shadow-slate-100 duration-700">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
        <CardTitle className="flex items-center gap-3 text-2xl text-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 shadow-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          KPIs Globales
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">{kpis.usuarios}</p>
                <p className="text-sm text-slate-500">Usuarios Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500">
                <FileTextIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">{kpis.documentos}</p>
                <p className="text-sm text-slate-500">Documentos Procesados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">{kpis.tiempo}</p>
                <p className="text-sm text-slate-500">Tiempo Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">{kpis.cumplimiento}</p>
                <p className="text-sm text-slate-500">Cumplimiento</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );

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
        userName="Administrador" 
        role="Rol: Administrador" 
        onMenuToggle={toggleSidebar}
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
      <DashboardFooter />
    </div>
  );
}