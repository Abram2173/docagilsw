import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";  // ← Agregado: Para clases condicionales
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardFooter } from "@/components/dashboard-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BarChart3, FileText, TrendingUp, Download, FileSpreadsheet, QrCode, Loader2 } from "lucide-react";  // ← Agregado Loader2
import { QRGenerator } from "@/components/qr-generator";
import { generateQRData } from "@/lib/folio-generator";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";  // ← FIX: Define API_BASE

const sidebarItems = [
  { label: "KPIs", href: "/auditor", icon: "📊" },
  { label: "Reportes", href: "/auditor/reportes", icon: "📄" },
  { label: "Bitácora Global", href: "/auditor/bitacora", icon: "📋" },
];

// Datos hardcodeados REMOVIDOS: Ahora estados vacíos para fetch dinámico
// const initialHistorial = [...] ← BORRADO
// const tiempoCicloData = [...] ← BORRADO
// const rechazosData = [...] ← BORRADO

export default function AuditorPanel() {
  const [currentSection, setCurrentSection] = useState("kpis");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [usuarios, setUsuarios] = useState([]);  // ← FIX: State para usuarios
  const [etapasFlujo, setEtapasFlujo] = useState([]);  // ← FIX: State para flujos
  const [reportes, setReportes] = useState([]);  // ← State para reportes
  const [kpis, setKpis] = useState({ usuarios: 0, documentos: 0, tiempo: "0 días", cumplimiento: "0%" });  // ← FIX: State para KPIs
  const [historial, setHistorial] = useState([]);  // ← FIX: State para historial (úsalo en fetch si lo tienes)
  const [tiempoData, setTiempoData] = useState([]);  // Para gráficos
  const [rechazosData, setRechazosData] = useState([]);  // Para rechazos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No token – inicia sesión");
        setLoading(false);
        return;
      }
      const headers = { Authorization: `Token ${token}` };
      const [usuariosRes, flujosRes, reportesRes, kpisRes] = await Promise.all([
        axios.get(`${API_BASE}/auditor/usuarios/`, { headers }),  // ← FIX: /auditor/usuarios/ (no /admin/)
        axios.get(`${API_BASE}/documents/flows/`, { headers }),  // ← Ya 200, general
        axios.get(`${API_BASE}/auditor/reportes/`, { headers }),  // ← FIX: /auditor/reportes/
        axios.get(`${API_BASE}/auditor/kpis/`, { headers }),  // ← FIX: /auditor/kpis/
      ]);

      setUsuarios(usuariosRes.data);
      setEtapasFlujo(flujosRes.data);
      setReportes(reportesRes.data);
      setKpis(kpisRes.data);
      setHistorial(kpisRes.data.historial || []);
      setTiempoData(kpisRes.data.tiempo_data || []);
      setRechazosData(kpisRes.data.rechazos_data || []);
    } catch (error: any) {
      console.log('Error fetchData:', error);  // ← FIX: Console, no logout
      setError(error.response?.data?.non_field_errors?.[0] || "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [token]);

  const sectionMap: Record<string, string> = {
    "KPIs": "kpis",
    "Reportes": "reportes",
    "Bitácora Global": "bitacora",
  };

  const handleSectionChange = (label: string, e: React.MouseEvent) => {
    e.preventDefault();
    const section = sectionMap[label] || "kpis";
    setCurrentSection(section);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);  // ← Cierra sidebar en mobile
  };

  const handleExportPDF = () => {
    alert("Generando reporte PDF con códigos QR...");  // ← En real: API o jsPDF
  };

  const handleExportExcel = () => {
    alert("Exportando datos a Excel...");  // ← En real: API
  };

  const handleExportCSV = () => {
    alert("Exportando datos a CSV...");  // ← En real: API
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
const renderKPIs = () => (
  <div className="grid gap-6 md:grid-cols-3">  {/* Responsive */}
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">Tiempo Promedio de Ciclo</CardTitle>
        <TrendingUp className="h-4 w-4 text-[#3B82F6]" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-[#10B981]">{kpis.tiempo || "0 días"}</div>  // ← FIX: Usa kpis.tiempo (silencia warning)
        <p className="text-xs text-gray-500">Usuarios: {usuarios.length || 0}</p>  // ← FIX: Usa usuarios.length
      </CardContent>
    </Card>

    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">% de Rechazos</CardTitle>
        <BarChart3 className="h-4 w-4 text-[#3B82F6]" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-[#10B981]">{kpis.cumplimiento || "0%"}</div>  // ← FIX: Usa kpis.cumplimiento
        <p className="text-xs text-gray-500">Documentos: {kpis.documentos || 0}</p>  // ← FIX: Usa kpis.documentos
      </CardContent>
    </Card>

    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">Documentos Auditados</CardTitle>
        <FileText className="h-4 w-4 text-[#3B82F6]" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-[#10B981]">{etapasFlujo.length || 0}</div>  // ← FIX: Usa etapasFlujo.length
        <p className="text-xs text-gray-500">Reportes: {reportes.length || 0}</p>  // ← FIX: Usa reportes.length
      </CardContent>
    </Card>

    {/* Gráficos: Usa data de states */}
    <Card className="md:col-span-3">
      <CardHeader>
        <CardTitle>Tendencias de Tiempo de Ciclo</CardTitle>
      </CardHeader>
      <CardContent>
        {tiempoData.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No hay datos para mostrar en el gráfico.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={tiempoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="dias" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  </div>
);

  const renderReportes = () => (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl text-[#10B981]">
          <Download className="h-6 w-6" />
          Generador de Reportes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-700">Selecciona formato de reporte</Label>
          <div className="grid gap-3 md:grid-cols-3">
            <Button className="bg-[#3B82F6] hover:bg-[#2563EB]" onClick={handleExportPDF}>
              <Download className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
            <Button className="bg-[#10B981] hover:bg-[#059669]" onClick={handleExportExcel}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Exportar Excel
            </Button>
            <Button className="bg-[#3B82F6] hover:bg-[#2563EB]" onClick={handleExportCSV}>
              <FileText className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-[#3B82F6]">
              Los reportes PDF incluirán códigos QR para verificación de documentos
            </p>
          </div>
        </div>

        {rechazosData.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No hay datos para el gráfico de rechazos.</p>  // ← NUEVO: Placeholder
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rechazosData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="porcentaje" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );

  const renderBitacora = () => (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl text-[#10B981]">
          <QrCode className="h-6 w-6" />
          Bitácora Global de Documentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <>
            <div className="mb-4 flex flex-col sm:flex-row gap-3">  {/* ← Responsive flex */}
              <Select>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="compra">Compra</SelectItem>
                  <SelectItem value="reembolso">Reembolso</SelectItem>
                  <SelectItem value="vacaciones">Vacaciones</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="aprobado">Aprobado</SelectItem>
                  <SelectItem value="rechazado">Rechazado</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {historial.length === 0 ? (  // ← NUEVO: Mensaje vacío
              <div className="text-center py-8">
                <p className="text-slate-500 mb-4">Bitácora vacía. ¡Primer día auditando!</p>
                <Button onClick={() => { /* Recargar */ }} variant="outline">Actualizar</Button>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">  {/* ← FIX: Responsive scroll */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Folio</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Tiempo</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>QR</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historial.map((doc: any) => (
                      <TableRow key={doc.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium">{doc.id || 'Sin folio'}</TableCell>
                        <TableCell>{doc.tipo || 'Sin tipo'}</TableCell>
                        <TableCell>{doc.estado || 'Sin estado'}</TableCell>
                        <TableCell>{doc.tiempo || 'Sin tiempo'}</TableCell>
                        <TableCell>{doc.fecha || 'Sin fecha'}</TableCell>
                        <TableCell>
                          <QRGenerator value={generateQRData(doc.qr || 'Sin QR', doc.tipo || '', doc.fecha || '')} size={48} />
                        </TableCell>
                      </TableRow>
                    )) || <TableRow><TableCell colSpan={6} className="text-center text-slate-500">Sin bitácora</TableCell></TableRow>}  // ← FALLBACK
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );

  const renderSection = () => {
    switch (currentSection) {
      case "kpis":
        return renderKPIs();
      case "reportes":
        return renderReportes();
      case "bitacora":
        return renderBitacora();
      default:
        return renderKPIs();
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader userName="Auditor" role="Rol: Auditor" onMenuToggle={toggleSidebar} />  {/* ← Pasando toggle */}
      <div className="flex flex-1">
        <DashboardSidebar 
          items={sidebarItems.map((item) => ({
            ...item,
            onClick: (e: React.MouseEvent) => handleSectionChange(item.label, e)
          }))} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}  // ← Agregado pa' mobile
        />
        <main className={cn(  // ← Usando cn pa' responsive
          "flex-1 bg-gray-50 transition-all duration-300 p-2 sm:p-4 lg:p-6 overflow-y-auto w-full",
          isSidebarOpen ? "lg:ml-0 ml-0" : "ml-0"
        )}>
          <div className="mx-auto max-w-6xl space-y-6 w-full"> {/* ← Centrado y max width */}
            {renderSection()}
          </div>
        </main>
      </div>
      <DashboardFooter />
    </div>
  );
}