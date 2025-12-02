// src/components/roles/CoordinadorPanel.tsx
import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Search, Clock, CheckCircle2, FileText, Users, } from "lucide-react"

export default function CoordinadorPanel({ userName, role }: { userName: string; role: string }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // MENÚ EXCLUSIVO DEL COORDINADOR
  const sidebarItems = [
    { label: "Registrar Documento", icon: <Upload className="w-6 h-6" />, section: "registrar" },
    { label: "Buscar Trámite", icon: <Search className="w-6 h-6" />, section: "buscar" },
    { label: "En Seguimiento", icon: <Clock className="w-6 h-6" />, section: "seguimiento" },
    { label: "Completados", icon: <CheckCircle2 className="w-6 h-6" />, section: "completados" },
  ]

  const handleSectionChange = (section: string) => {
    console.log("Coordinador →", section)
    setIsSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
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

        {/* CONTENIDO */}
        <main className="flex-1 p-8 md:p-12">
          <div className="max-w-7xl mx-auto space-y-16">
            {/* TÍTULO */}
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6">
                Coordinador / Oficina
              </h1>
              <p className="text-2xl md:text-3xl text-gray-600 mb-12">
                Hola, {userName}
              </p>
            </div>

            {/* ESTADÍSTICAS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <Card className="shadow-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                <CardContent className="p-10 text-center">
                  <Upload className="w-20 h-20 mx-auto mb-6" />
                  <p className="text-7xl font-black">23</p>
                  <p className="text-xl mt-4">Por Registrar</p>
                </CardContent>
              </Card>

              <Card className="shadow-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
                <CardContent className="p-10 text-center">
                  <FileText className="w-20 h-20 mx-auto mb-6" />
                  <p className="text-7xl font-black">89</p>
                  <p className="text-xl mt-4">Registrados Hoy</p>
                </CardContent>
              </Card>

              <Card className="shadow-2xl bg-gradient-to-br from-amber-600 to-orange-600 text-white">
                <CardContent className="p-10 text-center">
                  <Clock className="w-20 h-20 mx-auto mb-6" />
                  <p className="text-7xl font-black">12</p>
                  <p className="text-xl mt-4">En Seguimiento</p>
                </CardContent>
              </Card>

              <Card className="shadow-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                <CardContent className="p-10 text-center">
                  <Users className="w-20 h-20 mx-auto mb-6" />
                  <p className="text-7xl font-black">156</p>
                  <p className="text-xl mt-4">Atendidos este mes</p>
                </CardContent>
              </Card>
            </div>

            {/* ACCIONES RÁPIDAS */}
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-12">Acciones Rápidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                <Button className="h-36 text-2xl bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  <Upload className="w-14 h-14 mb-3" />
                  Registrar Documento
                </Button>
                <Button className="h-36 text-2xl bg-gradient-to-br from-purple-600 to-pink-600">
                  <Search className="w-14 h-14 mb-3" />
                  Buscar Trámite
                </Button>
                <Button className="h-36 text-2xl bg-gradient-to-br from-amber-600 to-orange-600">
                  <Clock className="w-14 h-14 mb-3" />
                  En Seguimiento
                </Button>
                <Button className="h-36 text-2xl bg-gradient-to-br from-emerald-600 to-teal-600">
                  <CheckCircle2 className="w-14 h-14 mb-3" />
                  Completados
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}