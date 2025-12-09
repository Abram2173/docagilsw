// DirectorPanel.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { DashboardHeader } from "../dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardFooter } from "@/components/dashboard-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, CheckCircle2, Loader2, User, History } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function DirectorPanel({ userName }: { userName: string; role:String }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tramites, setTramites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<"pendientes" | "historial">("pendientes");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTramites = async () => {
      setLoading(true);

      if (!token) {
        console.error("NO HAY TOKEN");
        setLoading(false);
        return;
      }

try {
  const res = await axios.get(`${API_BASE}/tramites/aprobados/`, {
    headers: { Authorization: `Token ${token}` }
  });

  // ← ESTA LÍNEA ES LA QUE FALTABA
  let todos = res.data;

// ← FILTRO SEGURO PARA DIRECTOR (ignora acentos y mayúsculas)
todos = todos.filter((t: any) => 
  t.etapa && t.etapa.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === 'participacion'
);

  // Separar pendientes y entregados
  const pendientes = todos.filter((t: any) => t.status === 'Aprobado');
  const entregados = todos.filter((t: any) => t.status === 'Entregado');

  setTramites(activeSection === "pendientes" ? pendientes : entregados);
} catch (err: any) {
  console.error("Error:", err.response?.data || err.message);
  setTramites([]);
} finally {
  setLoading(false);
}
    };
    

    fetchTramites();
  }, [token, activeSection]);

  const sidebarItems = [
    {
      label: "Trámites por Revisar",
      icon: <Package className="h-5 w-5" />,
      onClick: () => setActiveSection("pendientes"),
      active: activeSection === "pendientes"
    },
    {
      label: "Historial",
      icon: <History className="h-5 w-5" />,
      onClick: () => setActiveSection("historial"),
      active: activeSection === "historial"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-white to-red-50">
      <DashboardHeader userName={userName} role="Director" onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1">
        <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} items={sidebarItems} />

        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-red-800 mb-2">Director</h1>
              <p className="text-xl text-gray-600">
                Revisar trámites de Participación Estudiantil (quejas y permisos)
              </p>
            </div>

            <Card className="shadow-2xl border-0">
              <CardHeader className="bg-gradient-to-r from-red-600 to-orange-700 text-white rounded-t-3xl">
                <CardTitle className="text-2xl flex items-center gap-4">
                  {activeSection === "pendientes" ? <Package className="h-8 w-8" /> : <History className="h-8 w-8" />}
                  {activeSection === "pendientes" ? "Trámites por Revisar" : "Historial"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {loading ? (
                  <div className="text-center py-20">
                    <Loader2 className="h-20 w-20 animate-spin text-red-600 mx-auto" />
                  </div>
                ) : tramites.length === 0 ? (
                  <div className="text-center py-20">
                    <CheckCircle2 className="h-24 w-24 text-green-500 mx-auto mb-6" />
                    <p className="text-2xl font-bold text-gray-700">¡Todo al día!</p>
                    <p className="text-gray-500 mt-2">
                      {activeSection === "pendientes" ? "No hay trámites pendientes" : "No hay historial aún"}
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-red-50">
                        <TableHead className="text-red-800 font-bold">Folio</TableHead>
                        <TableHead className="text-red-800 font-bold">Trámite</TableHead>
                        <TableHead className="text-red-800 font-bold">Estudiante</TableHead>
                        <TableHead className="text-red-800 font-bold">Fecha</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tramites.map((t) => (
                        <TableRow key={t.id} className="hover:bg-red-50">
                          <TableCell className="font-mono font-bold text-red-600">{t.folio}</TableCell>
                          <TableCell className="font-medium">{t.titulo}</TableCell>
                          <TableCell className="flex items-center gap-2">
                            <User className="h-5 w-5 text-gray-500" />
                            {t.estudiante}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {t.fecha || "Sin fecha"}
                          </TableCell>
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