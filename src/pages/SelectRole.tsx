// src/pages/SelectRole.tsx
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Building2, Shield, FileText, CheckCircle2, GraduationCap, Settings, Sparkles, Lightbulb } from "lucide-react"
import { useState } from "react";

export default function SelectRole() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [departamentoJefe, setDepartamentoJefe] = useState("");

  const roles = [
    { role: "director", title: "Dirección", desc: "Aprobación final", icon: Building2, color: "bg-[#D64545]" },
    { role: "subdirector", title: "Subdirección", desc: "Supervisión institucional", icon: Shield, color: "bg-[#2A6F97]" },
    { role: "gestor", title: "Jefe de Departamento", desc: "Gestión documental", icon: FileText, color: "bg-[#1E90FF]" },
    { role: "aprobador", title: "Personal Administrativo", desc: "Trámites internos", icon: CheckCircle2, color: "bg-[#4CAF50]" },
    { role: "solicitante", title: "Estudiante", desc: "Consulta y trámites", icon: GraduationCap, color: "bg-[#F4A100]" },
  ];

  // ← FUNCIÓN QUE SE LLAMA AL HACER CLICK EN UNA TARJETA
  const handleRoleClick = (role: string) => {
    if (role !== "gestor") {
      // ← SI NO ES JEFE, VA DIRECTO AL DASHBOARD
      localStorage.setItem("role", role);
      navigate("/auth");
    } else {
      // ← SI ES JEFE, SOLO MUESTRA EL SELECT DE DEPARTAMENTO
      setSelectedRole(role);
    }
  };

  // ← BOTÓN CONTINUAR (SOLO PARA JEFES)
  const handleContinuar = () => {
    if (selectedRole === "gestor" && !departamentoJefe) {
      alert("Por favor elige tu departamento");
      return;
    }

    let finalRole = selectedRole;

    if (selectedRole === "gestor") {
      switch (departamentoJefe.toLowerCase()) {
        case "imss":
          finalRole = "gestor_imss";
          break;
        case "inscripciones":
          finalRole = "gestor_inscripciones";
          break;
        case "servicios_escolares":
          finalRole = "gestor_servicios";
          break;
        case "biblioteca":
          finalRole = "gestor_biblioteca";
          break;
        case "becas":
          finalRole = "gestor_becas";
          break;
        default:
          finalRole = "gestor";
      }
    }

    localStorage.setItem("role", finalRole);
    if (selectedRole === "gestor") {
      localStorage.setItem("departamentoJefe", departamentoJefe);
    }

    navigate("/auth");
  };

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

      {/* GRID DE ROLES */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl w-full">
        {roles.map((r) => {
          const Icon = r.icon;
          return (
            <Card
              key={r.role}
              className={`shadow-2xl hover:shadow-3xl transition-all cursor-pointer hover:scale-105 ${r.color} text-white ${selectedRole === r.role ? "ring-4 ring-white ring-offset-4 ring-offset-gray-800" : ""}`}
              onClick={() => handleRoleClick(r.role)}  // ← AHORA SÍ EXISTE
            >
              <div className="p-8 text-center">
                <Icon className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{r.title}</h3>
                <p className="text-sm opacity-90">{r.desc}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* SELECT + BOTÓN SOLO PARA JEFE */}
      {selectedRole === "gestor" && (
        <div className="mt-10 w-full max-w-md space-y-6">
          <label className="block text-lg font-medium text-gray-700 mb-3 text-center">
            Selecciona tu departamento
          </label>
          <Select value={departamentoJefe} onValueChange={setDepartamentoJefe}>
            <SelectTrigger className="h-14 text-lg">
              <SelectValue placeholder="Elige tu departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="becas">Becas</SelectItem>
              <SelectItem value="inscripcion">Inscripciones</SelectItem>
              <SelectItem value="servicios_escolares">Servicios Escolares</SelectItem>
              <SelectItem value="imss">IMSS</SelectItem>
              <SelectItem value="biblioteca">Biblioteca</SelectItem>
              <SelectItem value="participacion">Participación Estudiantil</SelectItem>
            </SelectContent>
          </Select>

          <Button
            size="lg"
            onClick={handleContinuar}
            disabled={!departamentoJefe}
            className="w-full px-12 py-6 text-xl font-bold bg-gradient-to-r from-[#0EA5E9] to-[#10B981] hover:from-[#0D94D1] hover:to-[#0FA472]"
          >
            Continuar
          </Button>
        </div>
      )}

      {/* ADMIN OCULTO */}
      <div className="mt-10">
        <Button
          variant="ghost"
          onClick={() => {
            localStorage.setItem("selectedRole", "admin");
            navigate("/auth");  // ← al login, no dashboard
          }}
        >
          <Settings className="w-5 h-5 mr-2" />
          Acceso Administrador
        </Button>
      </div>
    </div>
  );
}