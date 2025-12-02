// src/components/roles/DirectorPanel.tsx
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, TrendingUp, FileCheck, Users, Award, Shield, Calendar, CheckCircle2 } from "lucide-react"

export default function DirectorPanel({ userName }: { userName: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* HEADER DIRECTIVO */}
      <div className="border-b border-white/20 bg-black/30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Building2 className="w-16 h-16 text-yellow-400" />
            <div>
              <h1 className="text-4xl font-black">Dirección General</h1>
              <p className="text-xl opacity-90">Instituto Tecnológico de Matehuala</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{userName}</p>
            <p className="text-yellow-400 font-semibold">Director</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8 space-y-12">
        {/* MENSAJE INSTITUCIONAL */}
        <div className="text-center py-12 bg-white/10 rounded-3xl backdrop-blur">
          <h2 className="text-5xl font-black mb-6">Visión Institucional Completa</h2>
          <p className="text-2xl opacity-90 max-w-5xl mx-auto leading-relaxed">
            Como Director, tienes acceso total a reportes institucionales, aprobaciones finales 
            y supervisión del cumplimiento normativo ISO 9001/27001 en tiempo real.
          </p>
        </div>

        {/* ESTADÍSTICAS DIRECTIVAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-yellow-600 to-amber-600 border-0 shadow-2xl">
            <CardContent className="p-10 text-center">
              <Award className="w-20 h-20 mx-auto mb-6" />
              <p className="text-7xl font-black">100%</p>
              <p className="text-2xl mt-4">Cumplimiento ISO</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-600 to-teal-600 border-0 shadow-2xl">
            <CardContent className="p-10 text-center">
              <FileCheck className="w-20 h-20 mx-auto mb-6" />
              <p className="text-7xl font-black">342</p>
              <p className="text-2xl mt-4">Documentos Oficiales</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 border-0 shadow-2xl">
            <CardContent className="p-10 text-center">
              <TrendingUp className="w-20 h-20 mx-auto mb-6" />
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
          <p className="text-3xl font-bold italic">
            "La excelencia institucional comienza con el control total de nuestra documentación"
          </p>
          <p className="text-xl mt-4 opacity-80">- Dirección General</p>
        </div>
      </div>
    </div>
  )
}