// src/components/roles/GestorDocumentalPanel.tsx
import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardFooter } from "@/components/dashboard-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, History, Search, Plus, CheckCircle2, LayoutDashboard } from "lucide-react";
import { DashboardHeader } from "../dashboard-header";

interface GestorDocumentalPanelProps {
  userName: string;
  role: string;
}

export default function GestorDocumentalPanel({ userName, role }: GestorDocumentalPanelProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // ← Empieza cerrado en móvil
  const [currentSection, setCurrentSection] = useState("dashboard");

  const sidebarItems = [
    { label: "Dashboard",       icon: <LayoutDashboard className="h-5 w-5" />, section: "dashboard" },
    { label: "Subir Documento", icon: <Upload className="h-5 w-5" />,          section: "subir" },
    { label: "Catálogo Maestro", icon: <Search className="h-5 w-5" />,       section: "catalogo" },
    { label: "Historial",       icon: <History className="h-5 w-5" />,         section: "historial" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-white to-green-50/30">

      {/* HEADER CON EL BOTÓN QUE SÍ ABRE EL SIDEBAR */}
      <DashboardHeader
        userName={userName}
        role={role}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}   // ← ESTO ES LA CLAVE
      />

      <div className="flex flex-1">
        <DashboardSidebar
          items={sidebarItems.map(item => ({
            ...item,
            isActive: currentSection === item.section,
            onClick: () => setCurrentSection(item.section),
          }))}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mx-auto max-w-7xl space-y-8">

            {/* DASHBOARD */}
            {currentSection === "dashboard" && (
              <div className="space-y-8">
                <h1 className="text-4xl font-bold text-gray-900">¡Hola, {userName}!</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { title: "En Borrador", value: 4, color: "text-blue-600", bg: "bg-blue-50" },
                    { title: "En Revisión", value: 12, color: "text-yellow-600", bg: "bg-yellow-50" },
                    { title: "Aprobados", value: 48, color: "text-green-600", bg: "bg-green-50" },
                    { title: "Por Vencer", value: 3, color: "text-orange-600", bg: "bg-orange-50" },
                  ].map((stat) => (
                    <Card key={stat.title} className={`${stat.bg} border-2 border-gray-200`}>
                      <CardContent className="pt-6">
                        <p className="text-sm text-gray-600">{stat.title}</p>
                        <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {["Subiste PROC-001 v2.0", "Enviado MAN-002 a revisión", "Aprobado POL-005"].map((act, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <p>{act}</p>
                          </div>
                          <span className="text-sm text-gray-500">hace {i + 1}h</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* SUBIR DOCUMENTO */}
            {currentSection === "subir" && (
              <Card className="max-w-4xl mx-auto border-2 border-green-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="text-3xl text-green-700 flex items-center gap-4">
                    <Upload className="h-8 w-8" /> Subir Documento Oficial
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Título del Documento</Label>
                      <Input placeholder="Ej: Manual de Procedimientos Académicos" className="h-12" />
                    </div>
                    <div>
                      <Label>Código ISO</Label>
                      <Input placeholder="Ej: PROC-001 v2.0" className="h-12" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Tipo de Documento</Label>
                      <Select>
                        <SelectTrigger className="h-12"><SelectValue placeholder="Selecciona tipo" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="procedimiento">Procedimiento</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="politica">Política</SelectItem>
                          <SelectItem value="formato">Formato</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Área Responsable</Label>
                      <Input placeholder="Ej: Dirección Académica" className="h-12" />
                    </div>
                  </div>

                  <div>
                    <Label>Archivo PDF (versión controlada)</Label>
                    <div className="border-4 border-dashed border-green-400 rounded-2xl p-16 text-center hover:border-green-600 transition-all bg-green-50/50">
                      <Upload className="h-20 w-20 mx-auto text-green-600 mb-4" />
                      <p className="text-xl font-medium text-gray-700">Arrastra tu archivo aquí</p>
                      <p className="text-gray-500 mt-2">o haz clic para seleccionar</p>
                      <Button variant="outline" className="mt-6">Seleccionar archivo</Button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button size="lg" className="h-14 px-10 text-lg font-bold bg-green-600 hover:bg-green-700">
                      <CheckCircle2 className="mr-3 h-6 w-6" />
                      Enviar a Aprobación Multinivel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CATÁLOGO MAESTRO */}
            {currentSection === "catalogo" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold">Catálogo Maestro</h2>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 h-5 w-5" /> Nuevo Documento
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Código</TableHead>
                          <TableHead>Título</TableHead>
                          <TableHead>Versión</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Área</TableHead>
                          <TableHead>Última Mod.</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Aquí irán los documentos reales del backend */}
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                            No hay documentos aún. ¡Sube el primero!
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* HISTORIAL */}
            {currentSection === "historial" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <History className="h-7 w-7" /> Historial de Actividad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10 text-gray-500">
                    <History className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">Aún no hay actividad registrada</p>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        </main>
      </div>

      <DashboardFooter />
    </div>
  );
}