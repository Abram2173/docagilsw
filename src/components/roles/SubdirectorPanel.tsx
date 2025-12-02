// src/components/roles/SubdirectorPanel.tsx
import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, FileText, Users, Clock, TrendingUp } from "lucide-react"

export default function SubdirectorPanel({ userName, role }: { userName: string; role: string }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // MENÚ EXCLUSIVO DE SUBDIRECCIÓN
  const sidebarItems = [
    { label: "Documentos por Revisar", icon: <FileText className="w-6 h-6" />, section: "revision" },
    { label: "Aprobaciones Pendientes", icon: <CheckCircle2 className="w-6 h-6" />, section: "aprobaciones" },
    { label: "Supervisar Departamentos", icon: <Users className="w-6 h-6" />, section: "departamentos" },
    { label: "Reportes de Área", icon: <TrendingUp className="w-6 h-6" />, section: "reportes" },
  ]

  const handleSectionChange = (section: string) => {
    console.log("Subdirector →", section)
    setIsSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
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
                Subdirección
              </h1>
              <p className="text-2xl md:text-3xl text-gray-600">
                Revisión y aprobación institucional
              </p>
            </div>

            {/* ESTADÍSTICAS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <Card className="shadow-2xl bg-gradient-to-br from-sky-500 to-sky-600 text-white">
                <CardContent className="p-10 text-center">
                  <Clock className="w-20 h-20 mx-auto mb-6" />
                  <p className="text-7xl font-black">18</p>
                  <p className="text-2xl mt-4">Pendientes</p>
                </CardContent>
              </Card>

              <Card className="shadow-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <CardContent className="p-10 text-center">
                  <CheckCircle2 className="w-20 h-20 mx-auto mb-6" />
                  <p className="text-7xl font-black">142</p>
                  <p className="text-2xl mt-4">Aprobados</p>
                </CardContent>
              </Card>

              <Card className="shadow-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-10 text-center">
                  <Users className="w-20 h-20 mx-auto mb-6" />
                  <p className="text-7xl font-black">5</p>
                  <p className="text-2xl mt-4">Departamentos</p>
                </CardContent>
              </Card>

              <Card className="shadow-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                <CardContent className="p-10 text-center">
                  <TrendingUp className="w-20 h-20 mx-auto mb-6" />
                  <p className="text-7xl font-black">96%</p>
                  <p className="text-2xl mt-4">Cumplimiento</p>
                </CardContent>
              </Card>
            </div>

            {/* ACCIONES */}
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-12">Acciones de Subdirección</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Button className="h-40 text-2xl bg-gradient-to-br from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700">
                  <FileText className="w-16 h-16 mb-4" />
                  Revisar Documentos
                </Button>
                <Button className="h-40 text-2xl bg-gradient-to-br from-emerald-600 to-teal-600">
                  <CheckCircle2 className="w-16 h-16 mb-4" />
                  Aprobar Pendientes
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}