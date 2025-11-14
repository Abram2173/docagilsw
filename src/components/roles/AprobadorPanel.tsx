import React, { useState, useEffect } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardFooter } from "@/components/dashboard-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, MessageSquare, Loader2, Bell } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";  // Render en prod

const sidebarItems = [
  { label: "Pendientes", href: "/aprobador", icon: "⏳" },
  { label: "Historial", href: "/aprobador/historial", icon: "📜" },
  { label: "Notificaciones", href: "/aprobador/notificaciones", icon: "🔔" },
];

// ← FIX: Interface props para userName/role
interface AprobadorPanelProps {
  userName: string;
  role: string;
}

  export default function AprobadorPanel({  }: AprobadorPanelProps) {  // ← FIX: Props con interface
  const [currentSection, setCurrentSection] = useState<string>("pendientes");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [comentario, setComentario] = useState<string>("");
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);
  const [pendientes, setPendientes] = useState<any[]>([]);
  const [historial, setHistorial] = useState<any[]>([]);
  const [bitacora, setBitacora] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!token) throw new Error("No token");
        const headers = { Authorization: `Token ${token}` };
        const [pendientesRes, historialRes, bitacoraRes] = await Promise.all([
          axios.get(`${API_BASE}/aprobador/pendientes/`, { headers }),
          axios.get(`${API_BASE}/aprobador/historial/`, { headers }),
          axios.get(`${API_BASE}/aprobador/bitacora/`, { headers })
        ]);
        setPendientes(pendientesRes.data);
        setHistorial(historialRes.data);
        setBitacora(bitacoraRes.data);
        console.log("Datos de aprobador cargados!");
      } catch (err) {
        setError("Error al cargar datos: " + (err as Error).message);
        console.error(err);
        setPendientes([]);  // Fallback
        setHistorial([]);
        setBitacora([]);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  const sectionMap: Record<string, string> = {
    "Pendientes": "pendientes",
    "Historial": "historial",
    "Notificaciones": "notificaciones",
  };

  const handleSectionChange = (label: string, e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentSection(sectionMap[label]);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const handleApprove = async (id: number) => {
    try {
      const headers = { Authorization: `Token ${token}` };
      await axios.patch(`${API_BASE}/aprobador/tramite/${id}/approve/`, { comentario }, { headers });
      alert("Aprobado!");
      setComentario("");
      window.location.reload();
    } catch (err) {
      alert("Error al aprobar: " + (err as Error).message);
    }
  };

  const handleReject = async (id: number) => {
    if (!comentario) {
      alert("Agrega un comentario para rechazar");
      return;
    }
    try {
      const headers = { Authorization: `Token ${token}` };
      await axios.patch(`${API_BASE}/aprobador/tramite/${id}/reject/`, { comentario }, { headers });
      alert("Rechazado!");
      setComentario("");
      window.location.reload();
    } catch (err) {
      alert("Error al rechazar: " + (err as Error).message);
    }
  };


  const renderPendientes = () => (
    <Card className="animate-in fade-in slide-in-from-bottom-4 border-2 border-blue-200 shadow-xl duration-700">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
        <CardTitle className="text-2xl text-blue-600">Trámites Pendientes</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : pendientes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 mb-4">No hay trámites pendientes.</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Actualizar</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {pendientes.map((tramite: any) => (
              <Card key={tramite.id} className="border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">{tramite.titulo}</CardTitle>
                  <Badge variant="secondary">{tramite.tipo}</Badge>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-500 mb-4">{tramite.descripcion}</p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-end">
                    <Button variant="outline" onClick={() => setSelectedDoc(tramite.id)} className="flex-1 sm:flex-none">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Comentar
                    </Button>
                    <Button onClick={() => handleApprove(tramite.id)} className="bg-green-500 hover:bg-green-600 flex-1 sm:flex-none">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Aprobar
                    </Button>
                    <Button onClick={() => handleReject(tramite.id)} variant="destructive" className="flex-1 sm:flex-none">
                      <XCircle className="mr-2 h-4 w-4" />
                      Rechazar
                    </Button>
                  </div>
                  {selectedDoc === tramite.id && (
                    <div className="mt-4">
                      <Label htmlFor="comentario">Comentario (opcional)</Label>
                      <Textarea
                        id="comentario"
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        placeholder="Agrega comentarios..."
                      />
                      <div className="flex gap-2 mt-2">
                        <Button onClick={() => setSelectedDoc(null)} variant="outline">
                          Cancelar
                        </Button>
                        <Button onClick={() => handleApprove(tramite.id)}>
                          Confirmar
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderHistorial = () => (
    <Card className="animate-in fade-in slide-in-from-bottom-4 border-2 border-green-200 shadow-xl duration-700">
      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
        <CardTitle className="text-2xl text-green-600">Historial de Trámites</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : historial.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 mb-4">No hay historial.</p>
            <Button variant="outline">Actualizar</Button>
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
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historial.map((tramite: any) => (
                  <TableRow key={tramite.id}>
                    <TableCell className="font-mono">{tramite.folio}</TableCell>
                    <TableCell className="font-medium">{tramite.titulo}</TableCell>
                    <TableCell><Badge variant="secondary">{tramite.tipo}</Badge></TableCell>
                    <TableCell><Badge variant="default">{tramite.estado}</Badge></TableCell>
                    <TableCell>{tramite.solicitante}</TableCell>
                    <TableCell>{tramite.fecha}</TableCell>
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
    <Card className="animate-in fade-in slide-in-from-bottom-4 border-2 border-yellow-200 shadow-xl duration-700">
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100">
        <CardTitle className="flex items-center gap-2 text-2xl text-orange-600">
          <Bell className="h-6 w-6" />
          Notificaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : bitacora.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 mb-4">Sin notificaciones.</p>
            <Button variant="outline">Actualizar</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {bitacora.map((entry: any) => (
              <div key={entry.id} className="flex flex-col sm:flex-row items-start gap-3 border-l-2 border-orange-500 pl-4">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{entry.action}</p>
                  <p className="text-sm text-gray-500">
                    {entry.user} - {entry.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderSection = () => {
    switch (currentSection) {
      case "pendientes":
        return renderPendientes();
      case "historial":
        return renderHistorial();
      case "notificaciones":
        return renderNotificaciones();
      default:
        return renderPendientes();
    }
  };

return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50/20">
{  /*    <DashboardHeader userName={userName} role={role} onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />  // ← FIX: Props dinámicas
*/}      <div className="flex flex-1">
        <DashboardSidebar 
          items={sidebarItems.map((item) => ({
            ...item,
            onClick: (e) => handleSectionChange(item.label, e)
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