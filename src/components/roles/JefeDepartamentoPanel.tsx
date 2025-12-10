// JefeDepartamentoPanel.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { DashboardHeader } from "../dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardFooter } from "@/components/dashboard-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, CheckCircle2, Loader2, User, History } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function JefeDepartamentoPanel({ userName }: { userName: string; role:string }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tramites, setTramites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<"pendientes" | "historial">("pendientes");

  const token = localStorage.getItem("token");
  const departamentoJefe = localStorage.getItem("departamentoJefe") || ""; // ← el que eligió en select-role

  // ← MAPPING DE CATEGORÍA A ETAPA EN LA BASE DE DATOS
// ← MUEVE EL MAPPING FUERA DEL useEffect (aquí arriba, después de los estados)
// ← MAPPING COMPLETO Y CORRECTO
const mapping: Record<string, string | string[]> = {
  becas: 'becas',
  inscripcion: 'inscripcion',  // ← ESTO ES LO QUE FALTABA
  servicios_escolares: ['calificaciones', 'documentos', 'inscripcion'],
  imss: 'seguridad_social',
  biblioteca: 'recursos',
  participacion: 'participacion',
};

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

      const departamentoJefe = localStorage.getItem("departamentoJefe") || "";
      const dept = departamentoJefe.toLowerCase();

      // ← FILTRO FINAL Y QUE FUNCIONA AL 100%
      todos = todos.filter((t: any) => {
        const etapa = t.etapa?.toLowerCase() || "";

        if (dept.includes("imss")) return etapa === "seguridad_social";
        if (dept.includes("biblioteca")) return etapa === "recursos";
        if (dept.includes("becas")) return etapa === "becas";
        if (dept.includes("inscripcion")) return etapa === "inscripcion";  // singular!
        if (dept.includes("servicios_escolares")) return ["calificaciones", "documentos", "inscripcion"].includes(etapa);
        if (dept.includes("participacion")) return etapa === "participacion";

        return false;
      });

      const pendientes = todos.filter((t: any) => t.status === 'Aprobado');
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


// ← AHORA handleConfirmarEntrega SÍ VE EL MAPPING
const handleConfirmarEntrega = async (id: number) => {
  if (!confirm("¿Confirmar que el documento fue entregado?")) return;

  try {
    await axios.post(`${API_BASE}/gestor/confirmar/${id}/`, {}, {
      headers: { Authorization: `Token ${token}` }
    });
    alert("¡Entrega confirmada!");

    const res = await axios.get(`${API_BASE}/tramites/aprobados/`, {
      headers: { Authorization: `Token ${token}` }
    });
    let todos = res.data;

    if (departamentoJefe) {
      const dept = departamentoJefe.toLowerCase().trim();
      let categorias = mapping[dept] || [];
      if (!Array.isArray(categorias)) categorias = [categorias];
      todos = todos.filter((t: any) => categorias.includes(t.etapa));
    }

    setTramites(todos.filter((t: any) => t.status !== 'Entregado'));
  } catch (err) {
    alert("Error al confirmar");
  }
};

  // ← TÍTULO DINÁMICO SEGÚN DEPARTAMENTO
  const tituloDepartamento = departamentoJefe ? departamentoJefe.charAt(0).toUpperCase() + departamentoJefe.slice(1) : "Departamento";

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
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <DashboardHeader userName={userName} role={`Jefe de ${tituloDepartamento}`} onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1">
        <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} items={sidebarItems} />

        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-blue-800 mb-2">Jefe de {tituloDepartamento}</h1>
              <p className="text-xl text-gray-600">
                {activeSection === "pendientes" ? "Confirmar entrega de documentos solicitados" : "Historial de documentos entregados"}
              </p>
            </div>

            <Card className="shadow-2xl border-0">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-t-3xl">
                <CardTitle className="text-2xl flex items-center gap-4">
                  {activeSection === "pendientes" ? <Package className="h-8 w-8" /> : <History className="h-8 w-8" />}
                  {activeSection === "pendientes" ? "Trámites por Entregar" : "Historial de Entregas"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {loading ? (
                  <div className="text-center py-20">
                    <Loader2 className="h-20 w-20 animate-spin text-blue-600 mx-auto" />
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
                      <TableRow className="bg-emerald-50">
                        <TableHead className="text-emerald-800 font-bold">Folio</TableHead>
                        <TableHead className="text-emerald-800 font-bold">Trámite</TableHead>
                        <TableHead className="text-emerald-800 font-bold">Estudiante</TableHead>
                        {activeSection === "pendientes" && <TableHead className="text-emerald-800 font-bold">Acción</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tramites.map((t) => (
                        <TableRow key={t.id} className="hover:bg-emerald-50">
                          <TableCell className="font-mono font-bold text-blue-600">{t.folio}</TableCell>
                          <TableCell className="font-medium">{t.titulo}</TableCell>
                          <TableCell className="flex items-center gap-2">
                            <User className="h-5 w-5 text-gray-500" />
                            {t.estudiante}
                          </TableCell>
                          {activeSection === "pendientes" && (
                            <TableCell className="text-center">
                              <Button
                                onClick={() => handleConfirmarEntrega(t.id)}
                                className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold"
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