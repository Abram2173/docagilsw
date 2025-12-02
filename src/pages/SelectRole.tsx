// src/pages/SelectRole.tsx
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Building2, Shield, FileText, Users, CheckCircle2, GraduationCap, UserCheck, Settings, Sparkles, Lightbulb } from "lucide-react"

export default function SelectRole() {
  const navigate = useNavigate()

  const roles = [
    { role: "director", title: "Dirección", desc: "Aprobación final", icon: Building2, color: "bg-[#0A2A66]" },
    { role: "subdirector", title: "Subdirección", desc: "Supervisión institucional", icon: Shield, color: "bg-[#145DA0]" },
    { role: "gestor", title: "Jefe de Departamento", desc: "Gestión documental", icon: FileText, color: "bg-[#1E90FF]" },
    { role: "coordinador", title: "Coordinador / Oficina", desc: "Registro diario", icon: Users, color: "bg-[#4DA6FF]" },
    { role: "aprobador", title: "Personal Administrativo", desc: "Trámites internos", icon: CheckCircle2, color: "bg-[#7EC8E3]" },
    { role: "solicitante", title: "Estudiante", desc: "Consulta y trámites", icon: GraduationCap, color: "bg-[#10B981]" },
    { role: "auditor", title: "Auditor Interno", desc: "Revisión normativa", icon: UserCheck, color: "bg-[#F59E0B]" },
  ]

  const handleSelect = (role: string) => {
    localStorage.setItem("selected_role", role)
    navigate("/auth")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 flex flex-col items-center justify-center p-6">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="relative">
              <Lightbulb className="w-20 h-20 text-[#0EA5E9] fill-[#0EA5E9]" />
              <Sparkles className="w-10 h-10 text-[#10B981] absolute -top-2 -right-2" />
            </div>
            <h1 className="text-7xl font-black bg-gradient-to-r from-[#0EA5E9] to-[#10B981] bg-clip-text text-transparent">
              Dart
            </h1>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ¿Quién eres en la institución?
          </h2>
          <p className="text-xl text-gray-600">
            Selecciona para continuar
          </p>
        </div>

      {/* GRID COMPACTO - TODO EN PANTALLA SIN SCROLL */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl w-full">
        {roles.map((r) => {
          const Icon = r.icon
          return (
            <Card
              key={r.role}
              className={`shadow-2xl hover:shadow-3xl transition-all cursor-pointer hover:scale-105 ${r.color} text-white`}
              onClick={() => handleSelect(r.role)}
            >
              <div className="p-8 text-center">
                <Icon className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{r.title}</h3>
                <p className="text-sm opacity-90">{r.desc}</p>
              </div>
            </Card>
          )
        })}
      </div>

      {/* ADMIN OCULTO */}
      <div className="mt-10">
        <Button
          variant="ghost"
          onClick={() => handleSelect("admin")}
          className="text-gray-500 hover:text-gray-700"
        >
          <Settings className="w-5 h-5 mr-2" />
          Acceso Administrador
        </Button>
      </div>
    </div>
  )
}