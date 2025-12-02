// src/components/roles/DirectorPanel.tsx
import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, FileCheck, Users, Award, Shield, Calendar, CheckCircle2 } from "lucide-react";

export default function DirectorPanel({ userName, role }: { userName: string; role: string }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // MENÚ EXCLUSIVO DEL DIRECTOR
  const sidebarItems = [
    { label: "Reporte Anual ISO", icon: <FileCheck className="w-6 h-6" />, section: "reporte" },
    { label: "Aprobaciones Finales", icon: <CheckCircle2 className="w-6 h-6" />, section: "aprobaciones" },
    { label: "Supervisar Áreas", icon: <Users className="w-6 h-6" />, section: "areas" },
    { label: "Programas Operativos", icon: <Calendar className="w-6 h-6" />, section: "programas" },
  ];

  const handleSectionChange = (section: string) => {
    console.log("Director →", section);
    setIsSidebarOpen(false); // ← Cierra el sidebar después de tocar
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* HEADER */}
      <DashboardHeader
        userName={userName}
        role={role}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex flex-1">
        {/* SIDEBAR PERSONALIZADO */}
        <DashboardSidebar
          items={sidebarItems.map(item => ({
            ...item,
            onClick: () => handleSectionChange(item.section)
          }))}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 p-8 md:p-12">
          <div className="max-w-7xl mx-auto space-y-16">
            {/* TÍTULO DIRECTIVO */}
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-black mb-6">
                Dirección General
              </h1>
              <p className="text-2xl md:text-3xl opacity-90">
                Instituto Tecnológico de Matehuala
              </p>
            </div>

            {/* ESTADÍSTICAS GLOBALES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-white/10 backdrop-blur border-white/20 shadow-2xl">
                <CardContent className="p-10 text-center">
                  <Award className="w-24 h-24 mx-auto mb-6 text-yellow-400" />
                  <p className="text-7xl font-black">100%</p>
                  <p className="text-2xl mt-4">Cumplimiento ISO</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur border-white/20 shadow-2xl">
                <CardContent className="p-10 text-center">
                  <FileCheck className="w-24 h-24 mx-auto mb-6 text-emerald-400" />
                  <p className="text-7xl font-black">342</p>
                  <p className="text-2xl mt-4">Documentos Oficiales</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur border-white/20 shadow-2xl">
                <CardContent className="p-10 text-center">
                  <TrendingUp className="w-24 h-24 mx-auto mb-6 text-cyan-400" />
                  <p className="text-7xl font-black">+28%</p>
                  <p className="text-2xl mt-4">Eficiencia 2025</p>
                </CardContent>
              </Card>
            </div>

            {/* ACCIONES DIRECTIVAS */}
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-12">Acciones Directivas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Button className="h-40 text-2xl bg-gradient-to-br from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 font-bold">
                  <Shield className="w-16 h-16 mb-4" />
                  Reporte Anual ISO
                </Button>
                <Button className="h-40 text-2xl bg-gradient-to-br from-emerald-600 to-teal-600 font-bold">
                  <CheckCircle2 className="w-16 h-16 mb-4" />
                  Aprobaciones Finales
                </Button>
                <Button className="h-40 text-2xl bg-gradient-to-br from-purple-600 to-indigo-600 font-bold">
                  <Users className="w-16 h-16 mb-4" />
                  Supervisar Áreas
                </Button>
                <Button className="h-40 text-2xl bg-gradient-to-br from-cyan-600 to-blue-600 font-bold">
                  <Calendar className="w-16 h-16 mb-4" />
                  Programas Operativos
                </Button>
              </div>
            </div>

            {/* FRASE FINAL */}
            <div className="text-center py-12 bg-black/30 rounded-3xl">
              <p className="text-4xl font-bold italic">
                "La excelencia institucional comienza con el control total de nuestra documentación"
              </p>
              <p className="text-2xl mt-6 opacity-80">- Dirección General</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}