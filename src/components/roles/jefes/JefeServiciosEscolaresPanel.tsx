// src/components/roles/jefes/JefeServiciosEscolaresPanel.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { DashboardHeader } from "../../dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardFooter } from "@/components/dashboard-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, CheckCircle2, Loader2, User, History } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function JefeServiciosEscolaresPanel({ userName }: { userName: string; role:string }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tramites, setTramites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<"pendientes" | "historial">("pendientes");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTramites = async () => {
      setLoading(true);

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE}/tramites/aprobados/`, {
          headers: { Authorization: `Token ${token}` }
        });

        let todos = res.data;

        // ← SOLO TRÁMITES DE SERVICIOS ESCOLARES
        todos = todos.filter((t: any) => 
          t.etapa === 'calificaciones' || 
          t.etapa === 'documentos' || 
          t.etapa === 'inscripcion'
        );

        // Separar pendientes y entregados
        const pendientes = todos.filter((t: any) => t.status !== 'Entregado');
        const entregados = todos.filter((t: any) => t.status === 'Entregado');

        setTramites(activeSection === "pendientes" ? pendientes : entregados);
      } catch (err: any) {
        console.error("Error:", err);
        setTramites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTramites();
  }, [token, activeSection]);

  const handleConfirmarEntrega = async (id: number) => {
    if (!confirm("¿Confirmar que el documento fue entregado?")) return;

    try {
      await axios.post(`${API_BASE}/gestor/confirmar/${id}/`, {}, {
        headers: { Authorization: `Token ${token}` }
      });
      alert("¡Entrega confirmada!");
      // Recarga
      const res = await axios.get(`${API_BASE}/tramites/aprobados/`, {
        headers: { Authorization: `Token ${token}` }
      });
      let todos = res.data;
      todos = todos.filter((t: any) => 
        t.etapa === 'calificaciones' || 
        t.etapa === 'documentos' || 
        t.etapa === 'inscripcion'
      );
      setTramites(todos.filter((t: any) => t.status !== 'Entregado'));
    } catch (err) {
      alert("Error al confirmar");
    }
  };

  const sidebarItems = [
    {
      label: "Trámites por Entregar",
      icon: <Package className="h-5 w-5" />,
      onClick: () => setActiveSection("pendientes"),
      active: activeSection === "pendientes"
    },
    {
      label: "Historial de Entregas",
      icon: <History className="h-5 w-5" />,
      onClick: () => setActiveSection("historial"),
      active: activeSection === "historial"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-white to-teal-50">
      <DashboardHeader userName={userName} role="Jefe de Servicios Escolares" onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1">
        <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} items={sidebarItems} />

        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-teal-800 mb-2">Jefe de Servicios Escolares</h1>
              <p className="text-xl text-gray-600">Confirmar entrega de calificaciones, documentos e inscripciones</p>
            </div>

            <Card className="shadow-2xl border-0">
              <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-t-3xl">
                <CardTitle className="text-2xl flex items-center gap-4">
                  {activeSection === "pendientes" ? <Package className="h-8 w-8" /> : <History className="h-8 w-8" />}
                  {activeSection === "pendientes" ? "Trámites por Entregar" : "Historial de Entregas"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {loading ? (
                  <div className="text-center py-20">
                    <Loader2 className="h-20 w-20 animate-spin text-teal-600 mx-auto" />
                  </div>
                ) : tramites.length === 0 ? (
                  <div className="text-center py-20">
                    <CheckCircle2 className="h-24 w-24 text-green-500 mx-auto mb-6" />
                    <p className="text-2xl font-bold text-gray-700">¡Todo al día!</p>
                    <p className="text-gray-500 mt-2">No hay trámites pendientes de entrega</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-teal-50">
                        <TableHead className="text-teal-800 font-bold">Folio</TableHead>
                        <TableHead className="text-teal-800 font-bold">Trámite</TableHead>
                        <TableHead className="text-teal-800 font-bold">Estudiante</TableHead>
                        {activeSection === "pendientes" && <TableHead className="text-teal-800 font-bold">Acción</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tramites.map((t) => (
                        <TableRow key={t.id} className="hover:bg-teal-50">
                          <TableCell className="font-mono font-bold text-teal-600">{t.folio}</TableCell>
                          <TableCell className="font-medium">{t.titulo}</TableCell>
                          <TableCell className="flex items-center gap-2">
                            <User className="h-5 w-5 text-gray-500" />
                            {t.estudiante}
                          </TableCell>
                          {activeSection === "pendientes" && (
                            <TableCell className="text-center">
                              <Button
                                onClick={() => handleConfirmarEntrega(t.id)}
                                className="bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-bold"
                              >
                                <CheckCircle2 className="h-5 w-5 mr-2" />
                                Confirmar Entrega
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <DashboardFooter />
    </div>
  );
}