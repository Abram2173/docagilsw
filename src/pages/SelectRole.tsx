// src/pages/SelectRole.tsx
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, FileText, CheckCircle2, Shield, UserCheck, Sparkles, Lightbulb } from "lucide-react"

export default function SelectRole() {
  const navigate = useNavigate()

  const roles = [
    {
      role: "gestor",
      title: "Jefe de Departamento",
      desc: "Subo y gestiono documentos oficiales",
      icon: <FileText className="w-12 h-12" />,
      color: "from-emerald-500 to-emerald-600"
    },
    {
      role: "aprobador",
      title: "Subdirección / Revisor",
      desc: "Apruebo y superviso documentos",
      icon: <CheckCircle2 className="w-12 h-12" />,
      color: "from-sky-500 to-sky-600"
    },
    {
      role: "auditor",
      title: "Auditor Interno",
      desc: "Reviso cumplimiento normativo",
      icon: <Shield className="w-12 h-12" />,
      color: "from-purple-500 to-purple-600"
    },
    {
      role: "solicitante",
      title: "Estudiante o Personal",
      desc: "Solicito trámites y consulto documentos",
      icon: <Users className="w-12 h-12" />,
      color: "from-slate-500 to-slate-600"
    },
  ]

  const handleSelectRole = (role: string) => {
    // Guarda el rol temporalmente
    localStorage.setItem("selected_role", role)
    navigate("/auth?tab=login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
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
            Selecciona tu rol para continuar
          </p>
        </div>

{/* TARJETAS DE ROLES - PERFECTAS EN MÓVIL Y ESCRITORIO */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
  {roles.map((r) => (
    <Card
      key={r.role}
      className={`shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer transform hover:scale-105 border-0 bg-gradient-to-br ${r.color} text-white h-full`}
      onClick={() => handleSelectRole(r.role)}
    >
      <CardContent className="p-6 md:p-8 text-center flex flex-col items-center justify-center h-full">
        <div className="mb-4">{r.icon}</div>
        <h3 className="text-xl md:text-2xl font-bold mb-2">{r.title}</h3>
        <p className="text-sm md:text-base opacity-90 mb-4">{r.desc}</p>
        <Button variant="secondary" size="sm" className="mt-auto bg-white/20 hover:bg-white/30">
          Continuar
        </Button>
      </CardContent>
    </Card>
  ))}
</div>

        {/* Admin oculto */}
        <div className="text-center mt-12">
          <Button
            variant="ghost"
            onClick={() => handleSelectRole("admin")}
            className="text-gray-500 hover:text-gray-700"
          >
            <UserCheck className="w-5 h-5 mr-2" />
            Acceso Administrador
          </Button>
        </div>
      </div>
    </div>
  )
}