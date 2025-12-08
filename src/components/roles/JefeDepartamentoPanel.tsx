// JefeDepartamentoPanel.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { DashboardHeader } from "../dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardFooter } from "@/components/dashboard-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, CheckCircle2, Loader2, User } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function JefeDepartamentoPanel({ userName }: { userName: string; role: string }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tramites, setTramites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

useEffect(() => {
  const fetchTramites = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    console.log("TOKEN QUE ENVÍA EL JEFE:", token);

    if (!token) {
      console.error("NO HAY TOKEN - el usuario no está logueado bien");
      setLoading(false);
      return;
    }

    try {
const res = await axios.get(`${API_BASE}/gestor/tramites`, {
  headers: {
    Authorization: `Token ${token}`,
    'Content-Type': 'application/json'  // solo si es necesario
  },
  // QUITA cualquier línea de cache o cache-control
});

      // ← ESTE LOG TE DICE SI ES LA VERSIÓN NUEVA O LA VIEJA
      console.log("RESPUESTA DEL BACKEND:", res.data);

      setTramites(res.data);
    } catch (err: any) {
      console.error("Error completo:", err.response?.data || err.message);
      setTramites([]);
    } finally {
      setLoading(false);
    }
  };
  fetchTramites();
}, []);



  const handleConfirmarEntrega = async (id: number) => {
    if (!confirm("¿Confirmar que el documento fue entregado?")) return;
    try {
      await axios.post(`${API_BASE}/gestor/confirmar/${id}/`, {}, {
        headers: { Authorization: `Token ${token}` }
      });
      alert("¡Entrega confirmada!");
      // Recarga
      const res = await axios.get(`${API_BASE}/gestor/tramites/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setTramites(res.data);
    } catch (err) {
      alert("Error al confirmar");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <DashboardHeader userName={userName} role="Jefe de Departamento" onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1">
        <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} items={[]} />

        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-blue-800 mb-2">Jefe de Departamento</h1>
              <p className="text-xl text-gray-600">Confirmar entrega de documentos solicitados</p>
            </div>

            <Card className="shadow-2xl border-0">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-t-3xl">
                <CardTitle className="text-2xl flex items-center gap-4">
                  <Package className="h-8 w-8" />
                  Trámites por Entregar
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
                        <TableHead className="text-emerald-800 font-bold">Acción</TableHead>
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
                          <TableCell className="text-center">
                            <Button
                              onClick={() => handleConfirmarEntrega(t.id)}
                              className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold"
                            >
                              <CheckCircle2 className="h-5 w-5 mr-2" />
                              Confirmar Entrega
                            </Button>
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