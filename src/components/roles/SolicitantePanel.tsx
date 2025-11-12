import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // ← AGREGADO: Para navigate
import { cn } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardFooter } from "@/components/dashboard-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Save, Send, Bell, CheckCircle2, Loader2 } from "lucide-react";
import { QRGenerator } from "@/components/qr-generator";
import { generateFolio, generateQRData } from "@/lib/folio-generator";

const API_BASE = "http://127.0.0.1:8000/api";

const sidebarItems = [
  { label: "Crear Trámite", href: "/solicitante", icon: "➕" },
  { label: "Mis Trámites", href: "/solicitante/tramites", icon: "📋" },
  { label: "Notificaciones", href: "/solicitante/notificaciones", icon: "🔔" },
];

export default function SolicitantePanel() {
  const navigate = useNavigate();  // ← AGREGADO: Para redirect
  const [currentSection, setCurrentSection] = useState("crear");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("");
  const [contenido, setContenido] = useState("");
  const [folio, setFolio] = useState("");
  const [qrData, setQrData] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [tramites, setTramites] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");  // ← AGREGADO: Role del localStorage

  // ← AGREGADO: Role Check + Redirect
  useEffect(() => {
    if (role !== 'solicitante') {
      alert("Acceso denegado – solo para solicitantes");
      navigate("/");  // ← FIX: Redirect a home si wrong role
    }
  }, [role, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!token) throw new Error("No token");
        const headers = { Authorization: `Token ${token}` };
        const [tramitesRes, notifRes] = await Promise.all([
          axios.get(`${API_BASE}/solicitante/tramites/`, { headers }),
          axios.get(`${API_BASE}/solicitante/notificaciones/`, { headers })
        ]);
        setTramites(tramitesRes.data);
        setNotificaciones(notifRes.data);
        console.log("Datos de solicitante cargados!");
      } catch (err) {
        setError("Error al cargar: " + (err as Error).message);
        console.error(err);
        setTramites([]);
        setNotificaciones([]);
      } finally {
        setLoading(false);
      }
    };
    if (token && role === 'solicitante') fetchData();  // ← FIX: Solo si role correcto
  }, [token, role]);

  const sectionMap: Record<string, string> = {
    "Crear Trámite": "crear",
    "Mis Trámites": "tramites",
    "Notificaciones": "notificaciones",
  };

  const handleSectionChange = (label: string, e: React.MouseEvent) => {
    e.preventDefault();
    const section = sectionMap[label] || "crear";
    setCurrentSection(section);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const handleTipoChange = (value: string) => {
    setTipo(value);
    const newFolio = generateFolio(value);
    setFolio(newFolio);
    const qr = generateQRData(newFolio, value, new Date().toISOString());
    setQrData(qr);
  };

  const handleSaveDraft = () => {
    if (!titulo || !tipo || !contenido) {
      alert("Completa todos los campos");
      return;
    }
    alert(`Borrador guardado con folio: ${folio}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !tipo || !contenido) {
      alert("Completa todos los campos");
      return;
    }
    try {
      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('tipo', tipo);
      formData.append('contenido', contenido);
      formData.append('folio', folio);
      if (file) formData.append('archivo', file);

      const headers = { Authorization: `Token ${token}` };
      await axios.post(`${API_BASE}/solicitante/create-tramite/`, formData, { headers });
      setShowQR(true);
      setTimeout(() => {
        alert(`Trámite creado con folio: ${folio}`);
        setTitulo("");
        setTipo("");
        setContenido("");
        setFolio("");
        setQrData("");
        setFile(null);
        setShowQR(false);
        window.location.reload();
      }, 3000);
    } catch (err) {
      alert("Error al enviar: " + (err as Error).message);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const renderCrearTramite = () => (
    <Card className="animate-in fade-in slide-in-from-bottom-4 border-2 border-[#3B82F6]/20 shadow-xl duration-700">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
        <CardTitle className="text-2xl text-[#3B82F6]">Crear Nuevo Trámite</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <Alert className="border-2 border-[#3B82F6]/20 bg-gradient-to-r from-blue-50 to-blue-100/50">
          <FileText className="h-4 w-4" />
          <AlertDescription>
            Completa el formulario para iniciar un nuevo trámite. El sistema generará un folio único y QR para rastreo. Adjunta un archivo si es necesario.
          </AlertDescription>
        </Alert>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título del Trámite</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Solicitud de Vacaciones"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Trámite</Label>
            <Select value={tipo} onValueChange={handleTipoChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacaciones">Vacaciones</SelectItem>
                <SelectItem value="permiso">Permiso</SelectItem>
                <SelectItem value="cambio">Cambio de Departamento</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
            {folio && <p className="text-sm text-blue-600">Folio generado: <strong>{folio}</strong></p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contenido">Descripción Detallada</Label>
            <Textarea
              id="contenido"
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Describe el motivo del trámite..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="archivo">Archivo Adjunto (Opcional)</Label>
            <Input
              id="archivo"
              type="file"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            />
            {file && <p className="text-sm text-gray-600">Archivo: {file.name}</p>}
          </div>
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={handleSaveDraft}>
              <Save className="mr-2 h-4 w-4" />
              Guardar Borrador
            </Button>
            <Button type="submit">
              <Send className="mr-2 h-4 w-4" />
              Enviar
            </Button>
          </div>
        </form>
        {showQR && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold">Trámite en proceso...</p>
              <p className="text-sm">Folio: {folio}</p>
              <div className="mt-2">
                <QRGenerator value={qrData} size={200} />
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  const renderMisTramites = () => (
    <Card className="animate-in fade-in slide-in-from-bottom-4 border-2 border-blue-200 shadow-xl duration-700">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
        <CardTitle className="text-2xl text-blue-600">Mis Trámites</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : tramites.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 mb-4">No tienes trámites en proceso. ¡Crea uno!</p>
            <Button variant="outline">Crear Trámite</Button>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Folio</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Archivo</TableHead>
                  <TableHead>QR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tramites.map((tramite: any) => (
                  <TableRow key={tramite.id}>
                    <TableCell className="font-mono text-sm text-blue-600">{tramite.folio}</TableCell>
                    <TableCell className="font-medium">{tramite.titulo}</TableCell>
                    <TableCell><Badge variant="secondary">{tramite.tipo}</Badge></TableCell>
                    <TableCell>
                      <Badge className={tramite.estado === "Pendiente" ? "bg-orange-500 text-white" : "bg-green-500 text-white"}>
                        {tramite.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-gray-600">{tramite.fecha}</TableCell>
                    <TableCell>
                      {tramite.archivo ? (
                        <a href={tramite.archivo} className="text-blue-600 hover:underline">Descargar</a>
                      ) : (
                        "No adjunto"
                      )}
                    </TableCell>
                    <TableCell>
                      <QRGenerator value={tramite.qr} size={48} />
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

  const renderNotificaciones = () => (
    <Card className="animate-in fade-in slide-in-from-bottom-4 border-2 border-yellow-200 shadow-2xl duration-700">
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100">
        <CardTitle className="flex items-center gap-2 text-2xl text-[#10B981]">
          <Bell className="h-6 w-6" />
          Notificaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : notificaciones.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 mb-4">Sin notificaciones nuevas. Todo en calma. 🔔</p>
            <Button variant="outline">Actualizar</Button>
          </div>
        ) : (
          notificaciones.map((notif: any) => (
            <div
              key={notif.id}
              className={`flex flex-col sm:flex-row items-start gap-4 rounded-xl p-4 shadow-sm ${
                notif.tipo === "success"
                  ? "bg-green-50 border-l-4 border-green-400"
                  : notif.tipo === "warning"
                    ? "bg-yellow-50 border-l-4 border-yellow-400"
                    : "bg-blue-50 border-l-4 border-blue-400"
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                notif.tipo === "success" ? "bg-green-500" : notif.tipo === "warning" ? "bg-yellow-500" : "bg-blue-500"
              }`}>
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{notif.mensaje}</p>
                <p className="text-sm text-gray-600">Folio: {notif.folio}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );

  const renderSection = () => {
    switch (currentSection) {
      case "crear":
        return renderCrearTramite();
      case "tramites":
        return renderMisTramites();
      case "notificaciones":
        return renderNotificaciones();
      default:
        return renderCrearTramite();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-white to-green-50/20">
      <DashboardHeader userName="Solicitante" role="Rol: Solicitante" onMenuToggle={toggleSidebar} />
      <div className="flex flex-1">
        <DashboardSidebar 
          items={sidebarItems.map((item) => ({
            ...item,
            onClick: (e: React.MouseEvent) => handleSectionChange(item.label, e)
          }))} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className={cn(
          "flex-1 transition-all duration-300 p-2 sm:p-4 lg:p-6 overflow-y-auto w-full",
          isSidebarOpen ? "lg:ml-0 ml-0" : "ml-0"
        )}>
          <div className="mx-auto max-w-6xl space-y-6 w-full">
            {renderSection()}
          </div>
        </main>
      </div>
      <DashboardFooter />
    </div>
  );
}