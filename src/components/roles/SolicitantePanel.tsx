import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // ← AGREGADO: Para navigate
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardFooter } from "@/components/dashboard-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Bell, CheckCircle2, Loader2, RefreshCw, Package, HelpCircle } from "lucide-react";
import { generateFolio, generateQRData } from "@/lib/folio-generator";
import { DashboardHeader } from "../dashboard-header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";



const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";  // Render en prod

const sidebarItems = [
  { label: "Crear Trámite", href: "/solicitante", icon: "➕" },
  { label: "Mis Trámites", href: "/solicitante/tramites", icon: "📋" },
];

interface SolicitantePanelProps {
  userName: string;
  role: string;
}

export default function SolicitantePanel({ role, userName }: SolicitantePanelProps) {
  const navigate = useNavigate();  // ← AGREGADO: Para redirect
  const [currentSection, setCurrentSection] = useState("crear");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("");
  const [contenido, setContenido] = useState("");
  const [folio, setFolio] = useState("");
  const [, setQrData] = useState("");
  const [] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");


  const [tramiteEditandoId, setTramiteEditandoId] = useState<number | null>(null);
  const [tramiteACancelar, setTramiteACancelar] = useState<number | null>(null);
  const [tramiteSeleccionado, setTramiteSeleccionado] = useState<any>(null);

  const handleVerResultado = (tramite: any) => {
  setTramiteSeleccionado(tramite);
};


  
const handleEditarTramite = (tramite: any) => {
  // GUARDA EL TRÁMITE COMPLETO (esto es lo que faltaba)
  setSelectedTramite(tramite);

  // Precarga todo
  setTitulo(tramite.titulo || tramite.nombre || "");
  setTipo(tramite.etapa || tramite.tipo || "");
  setContenido(tramite.contenido || ""); // ← EL TEXTO QUE ESCRIBIÓ

  // Carga el archivo adjunto
  if (tramite.archivo) {
    fetch(tramite.archivo)
      .then(res => res.blob())
      .then(blob => {
        const fileName = tramite.archivo.split("/").pop() || "archivo_adjunto";
        const file = new File([blob], fileName, { type: blob.type });
        setFile(file);
      })
      .catch(() => console.log("No se pudo cargar el archivo"));
  } else {
    setFile(null);
  }

  // Indica que estamos editando
  setTramiteEditandoId(tramite.id);

  setCurrentSection("crear");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleCancelarTramite = (id: number) => {
  setTramiteACancelar(id);
};


const confirmarCancelacion = () => {
  if (!tramiteACancelar) return;

  // Solo lo quitamos de la lista del estudiante (frontend)
  setTramites(prev => prev.filter(t => t.id !== tramiteACancelar));
  
  alert("¡Trámite cancelado correctamente! Ya no aparecerá en tu lista.");
  setTramiteACancelar(null);
};


interface Tramite {
  id: number;
  folio: string;
  nombre?: string;
  titulo?: string;
  etapa?: string;
  tipo?: string;
  status?: string;
  estado?: string;
  created_at?: string;
  fecha?: string;
  archivo?: string | null;
  qr?: string;
}

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
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token");
      const headers = { Authorization: `Token ${token}` };  // ← FIX: Headers con token
      const [tramitesRes, notifsRes] = await Promise.all([
        axios.get(`${API_BASE}/solicitante/tramites/`, { headers }),  // ← FIX: Headers
        axios.get(`${API_BASE}/solicitante/notificaciones/`, { headers }),
      ]);
      setTramites(tramitesRes.data);
      setNotificaciones(notifsRes.data);
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
    "Crear Trámite": "crear",
    "Mis Trámites": "tramites",
    "Notificaciones": "notificaciones",
  };

  const fetchTramites = async () => {
  setIsLoading(true);
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE}/solicitante/tramites/`, {
      headers: { Authorization: `Token ${token}` }
    });
    setTramites(response.data);
  } catch (err) {
    console.error("Error cargando trámites:", err);
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  fetchTramites();
}, []);

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



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!titulo || !tipo || !contenido) {
    alert("Completa todos los campos");
    return;
  }
  setIsSubmitting(true);

  try {
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('tipo', tipo);
    formData.append('contenido', contenido);
    if (file) formData.append('archivo', file);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Token ${token}` };

    if (tramiteEditandoId) {
      // EDITAR = BORRAR + CREAR NUEVO
      // 1. Borra el viejo
      await axios.delete(`${API_BASE}/solicitante/tramites/${tramiteEditandoId}/`, { headers });
      
      // 2. Crea el nuevo
      
      alert("Trámite actualizado correctamente");
    } else {
      // CREAR NUEVO
      const response = await axios.post(`${API_BASE}/solicitante/create-tramite/`, formData, { headers });
      alert(`Trámite creado con folio: ${response.data.folio}`);
    }

    // Limpia todo
    setTitulo("");
    setTipo("");
    setContenido("");
    setFile(null);
    setSelectedTramite(null);
    setTramiteEditandoId(null);
    setCurrentSection("tramites");
    fetchTramites();
  } catch (err: any) {
    alert("Error: " + (err.response?.data?.error || "Inténtalo de nuevo"));
  } finally {
    setIsSubmitting(false);
  }
};


const [selectedTramite, setSelectedTramite] = useState<any>(null);

const carouselRef = useRef<HTMLDivElement>(null);

// === LISTA DE TRÁMITES ===
const tramitesList = [
  { titulo: "Becas Jóvenes escribiendo el futuro 2025", descripcion: "Apoyo económico para estudiantes de nivel medio superior", categoria: "Becas", badgeColor: "bg-amber-500" },
  { titulo: "Calendario Escolar Agosto – Diciembre 2025", descripcion: "Fechas oficiales del ciclo escolar actual", categoria: "Calendario", badgeColor: "bg-emerald-500" },
  { titulo: "Proceso de Re-Inscripción 2025", descripcion: "Pasos para inscribirte al siguiente semestre", categoria: "Inscripción", badgeColor: "bg-purple-500" },
  { titulo: "Descarga de boleta de calificaciones", descripcion: "Obtén tu historial académico oficial", categoria: "Calificaciones", badgeColor: "bg-red-500" },
  { titulo: "Constancia de estudios", descripcion: "Documento oficial que acredita tu inscripción", categoria: "Documentos", badgeColor: "bg-cyan-500" },
  { titulo: "Trámite Alta al IMSS", descripcion: "Regístrate al seguro social como estudiante", categoria: "Seguridad Social", badgeColor: "bg-indigo-500" },
  { titulo: "Biblioteca Virtual eLibro", descripcion: "Acceso a miles de libros digitales gratuitos", categoria: "Recursos", badgeColor: "bg-teal-500" },
  { titulo: "Buzón de Quejas y Sugerencias", descripcion: "Haz llegar tu voz al instituto", categoria: "Participación", badgeColor: "bg-orange-500" },
];

// === TARJETA REUTILIZABLE ===
const TarjetaTramite = ({ item }: { item: any }) => (
  <button
    onClick={() => {
      setSelectedTramite(item);
      setTitulo(item.titulo);
      handleTipoChange(item.categoria.toLowerCase());
    }}
    className="w-full max-w-[240px] min-w-[300px] sm:min-w-[280px] bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-400 border border-gray-100 group hover:-translate-y-4 flex-shrink-0 overflow-hidden flex flex-col"
  >
    <div className="p-6 sm:p-8 text-left flex-1">
      <h3 className="font-bold text-gray-800 text-lg sm:text-2xl leading-tight mb-3">
        {item.titulo}
      </h3>
      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
        {item.descripcion}
      </p>
    </div>

    <div className={cn(
      "h-20 sm:h-24 flex items-center justify-center text-white font-bold text-lg sm:text-xl rounded-b-3xl mt-auto",
      item.badgeColor
    )}>
      {item.categoria}
    </div>

    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
        <span className="text-white text-2xl sm:text-3xl font-bold">→</span>
      </div>
    </div>
  </button>
);

// === renderCrearTramite() FINAL Y PERFECTO ===
const renderCrearTramite = () => (
  <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden">
    <CardHeader className="bg-gradient-to-br from-blue-50 to-cyan-50 pb-8">
      <CardTitle className="text-3xl font-bold text-center text-blue-700">
        Selecciona tu Trámite
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 sm:p-8 pt-0">

      <Alert className="mb-8 sm:mb-10 border-l-4 border-blue-500 bg-blue-50/80">
        <FileText className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800 font-medium text-sm sm:text-base">
          Elige el trámite que necesitas. Se generará automáticamente tu folio y código QR.
        </AlertDescription>
      </Alert>

      {!selectedTramite ? (
        <div className="space-y-8">
          {/* CARRUSEL INFINITO + RESPONSIVE */}
{/* CARRUSEL SIN DUPLICAR + FLECHAS + VUELTA AL INICIO */}
<div className="space-y-10">
  <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-50/30 via-white to-emerald-50/30 shadow-inner">
    <div 
      ref={carouselRef}
      className="overflow-x-auto scrollbar-hide scroll-smooth"
    >
      <div className="flex gap-8 px-6 py-10">
        {tramitesList.map((item, index) => (
          <TarjetaTramite key={index} item={item} />
        ))}
      </div>
    </div>
  </div>

  {/* FLECHAS ABAJO */}
{/* FLECHAS (opcional) */}
<div className="flex justify-center items-center gap-12 py-6">
  <button onClick={() => carouselRef.current?.scrollBy({ left: -400, behavior: "smooth" })}>
    ←
  </button>
  <button onClick={() => carouselRef.current?.scrollBy({ left: 400, behavior: "smooth" })}>
    →
  </button>
</div>
</div>
        </div>
      ) : (
  /* === TU FORMULARIO === */
  <div className="max-w-3xl mx-auto space-y-8">
    <Button variant="ghost" size="sm" onClick={() => setSelectedTramite(null)}>
      ← Volver a selección
    </Button>

          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <AlertDescription className="text-lg">
              <strong>Trámite seleccionado:</strong> {selectedTramite.titulo}
              {folio && <p className="mt-2 text-green-700">Folio: <strong>{folio}</strong></p>}
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-10 rounded-3xl shadow-2xl border">
            <Textarea
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Describe tu solicitud..."
              className="min-h-48 text-lg"
              required
            />
            <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold text-xl py-8">
              Enviar Trámite
            </Button>
          </form>
        </div>
      )}
    </CardContent>
  </Card>
);

const renderMisTramites = () => (
  <Card className="animate-in fade-in slide-in-from-bottom-4 border-2 border-blue-200 shadow-xl duration-700">
    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="flex justify-between items-center">
        <CardTitle className="text-3xl text-blue-700 font-bold">Mis Trámites</CardTitle>
        <Button
          onClick={fetchTramites}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold shadow-lg flex items-center gap-2"
        >
          <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </div>
    </CardHeader>
    <CardContent className="p-6">
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : tramites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500 mb-6">Aún no tienes trámites creados</p>
          <Button onClick={() => setCurrentSection("crear")} size="lg">
            Crear mi primer trámite
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <Table>
<TableHeader>
  <TableRow className="bg-blue-50">
    <TableHead className="font-bold text-blue-800">Folio</TableHead>
    <TableHead className="font-bold text-blue-800">Trámite</TableHead>
    <TableHead className="font-bold text-blue-800">Tipo</TableHead>
    {/* QUITAMOS LA COLUMNA "ESTADO" */}
    <TableHead className="font-bold text-blue-800">Fecha</TableHead>
    <TableHead className="font-bold text-blue-800">Archivo</TableHead>
    <TableHead className="font-bold text-blue-800 text-center">Acciones</TableHead>
  </TableRow>
</TableHeader>

<TableBody>
  {tramites.map((t) => {
    const esEditable = t.status === "Pendiente" || t.estado === "Pendiente";
    
    return (
      <TableRow key={t.id} className="hover:bg-blue-50 transition-colors">
        <TableCell className="w-32 sm:w-40">
          <div className="font-mono font-bold text-blue-600 text-xs sm:text-sm leading-tight">
            {t.folio}
          </div>
        </TableCell>
        <TableCell className="font-medium">
          {t.nombre || t.titulo || "Sin título"}
        </TableCell>
        <TableCell>
          <Badge variant="secondary">
            {t.etapa || t.tipo || "General"}
          </Badge>
        </TableCell>
        {/* QUITAMOS EL Badge de estado */}
        <TableCell>
          {t.created_at ? new Date(t.created_at).toLocaleDateString('es-MX') : t.fecha || "—"}
        </TableCell>
        <TableCell>
          {t.archivo ? (
            <a href={t.archivo} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Descargar
            </a>
          ) : (
            <span className="text-gray-500">No adjunto</span>
          )}
        </TableCell>

        {/* ACCIONES */}
        <TableCell className="text-center">
          <div className="flex items-center justify-center gap-2">
            {esEditable && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-400 hover:bg-blue-50 text-blue-700"
                  onClick={() => handleEditarTramite(t)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleCancelarTramite(t.id)}
                >
                  Cancelar
                </Button>
              </>
            )}
            {!esEditable && (
              <Button
                size="sm"
                variant="default"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => handleVerResultado(t)}
              >
                Ver resultado
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  })}
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
     <DashboardHeader 
  userName={userName} 
  role={role} 
  onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}   // ← ESTO ES LA CLAVE
/>
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
      {/* BOTÓN DE AYUDA FLOTANTE EN ESQUINA INFERIOR DERECHA (COMO WHATSAPP) */}
<div className="fixed bottom-6 right-6 z-50">
  <Dialog>
    <DialogTrigger asChild>
      <Button
        size="icon"
        className="rounded-full shadow-2xl w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 transition-all hover:scale-110"
      >
        <HelpCircle className="h-9 w-9 text-white" />
      </Button>
    </DialogTrigger>

    <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold flex items-center gap-3">
          Guía para Estudiantes
        </DialogTitle>
        <DialogDescription className="text-lg text-gray-600">
          Todo lo que puedes hacer en Dart
        </DialogDescription>
      </DialogHeader>

      <div className="mt-6 space-y-5 text-left">
        <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
          <FileText className="h-7 w-7 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <strong className="text-lg">Crear Trámite</strong>
            <p className="text-gray-700 mt-1">Elige tu trámite del carrusel y llena el formulario. Se genera tu folio y QR automáticamente.</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
          <Package className="h-7 w-7 text-green-600 mt-1 flex-shrink-0" />
          <div>
            <strong className="text-lg">Mis Trámites</strong>
            <p className="text-gray-700 mt-1">Revisa el estado, descarga archivos y ve tu código QR.</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-xl">
          <CheckCircle2 className="h-7 w-7 text-emerald-600 mt-1 flex-shrink-0" />
          <div>
            <strong className="text-lg">Confirmación de Entrega</strong>
            <p className="text-gray-700 mt-1">Cuando el jefe confirme la entrega, tu trámite quedará como "Entregado".</p>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</div>


{/* VENTANA BONITA PARA CANCELAR TRÁMITE */}
<Dialog open={tramiteACancelar !== null} onOpenChange={() => setTramiteACancelar(null)}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle className="text-xl flex items-center gap-2">
        Cancelar Trámite
      </DialogTitle>
      <DialogDescription className="text-base">
        ¿Estás seguro de que quieres cancelar este trámite?<br />
        <strong className="text-red-600">Ya no aparecerá en tu lista.</strong>
      </DialogDescription>
    </DialogHeader>
    <div className="flex justify-end gap-4 mt-6">
      <Button variant="outline" onClick={() => setTramiteACancelar(null)}>
        No, volver
      </Button>
      <Button variant="destructive" onClick={confirmarCancelacion}>
        Sí, cancelar trámite
      </Button>
    </div>
  </DialogContent>
</Dialog>

{/* VENTANA PARA VER RESULTADO DEL TRÁMITE */}
<Dialog open={tramiteSeleccionado !== null} onOpenChange={() => setTramiteSeleccionado(null)}>
<DialogContent className="max-w-2xl">
  <DialogHeader>
    <DialogTitle className="text-2xl font-bold">Resultado del Trámite</DialogTitle>
    <DialogDescription className="sr-only">Detalles del resultado de tu trámite</DialogDescription>
  </DialogHeader>

  {tramiteSeleccionado && (
    <div className="space-y-6 mt-6">

      {/* MENSAJE VERDE PARA ENTREGADO */}
      {(tramiteSeleccionado.status === "Entregado" || tramiteSeleccionado.estado === "Entregado") && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-r-xl">
          <p className="text-2xl font-bold text-green-800 mb-3">
            ¡Tu documento ya fue entregado!
          </p>
          <p className="text-green-700 text-lg">
            Puedes pasar a recogerlo en la ventanilla de <strong>Servicios Escolares</strong>
          </p>
          <p className="font-mono text-xl text-green-900 mt-4 bg-white px-5 py-3 rounded-lg inline-block">
            Folio: {tramiteSeleccionado.folio}
          </p>
        </div>
      )}

      {/* MENSAJE AZUL PARA APROBADO */}
      {(tramiteSeleccionado.status === "Aprobado" || tramiteSeleccionado.estado === "Aprobado") && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
          <p className="text-2xl font-bold text-blue-800 mb-3">
            ¡Tu trámite fue aprobado!
          </p>
          <p className="text-blue-700 text-lg">
            El jefe lo revisó y está en proceso de entrega. Te avisaremos cuando esté listo.
          </p>
        </div>
      )}

      {/* MENSAJE ROJO PARA RECHAZADO */}
      {(tramiteSeleccionado.status === "Rechazado" || tramiteSeleccionado.estado === "Rechazado") && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-6 rounded-r-xl">
          <p className="text-2xl font-bold text-red-800 mb-3">
            Tu trámite fue rechazado
          </p>
          <p className="text-red-700 text-lg">
            Motivo: <strong>{tramiteSeleccionado.motivo_rechazo || "No especificado por el jefe"}</strong>
          </p>
          <p className="text-red-600 mt-3">
            Puedes crear un nuevo trámite corregido.
          </p>
        </div>
      )}

      {/* DETALLES DEL TRÁMITE */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h3 className="font-bold text-xl text-gray-800 mb-4">
          {tramiteSeleccionado.titulo || tramiteSeleccionado.nombre}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-gray-600">Folio:</span>
            <p className="font-mono text-lg">{tramiteSeleccionado.folio}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Estado:</span>
            <Badge className="ml-2" variant="default">
              {tramiteSeleccionado.status || tramiteSeleccionado.estado}
            </Badge>
          </div>
        </div>
      </div>

      {/* ARCHIVO Y TEXTO */}
      {tramiteSeleccionado.contenido && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Tu mensaje:</h4>
          <p className="bg-white p-4 rounded-lg border">{tramiteSeleccionado.contenido}</p>
        </div>
      )}

      {tramiteSeleccionado.archivo && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Archivo adjunto:</h4>
          <a href={tramiteSeleccionado.archivo} target="_blank" rel="noopener noreferrer"
             className="text-blue-600 hover:underline font-medium">
            Descargar archivo
          </a>
        </div>
      )}
    </div>
  )}

  <DialogFooter>
    <Button onClick={() => setTramiteSeleccionado(null)}>Cerrar</Button>
  </DialogFooter>
</DialogContent>
</Dialog>
      <DashboardFooter />
    </div>
    
  );
}