// src/pages/profile/MiCuenta.tsx
"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Camera, Mail, Building, Shield, Calendar, Eye, EyeOff, LogOut, User, Lock } from "lucide-react"

export default function MiCuenta() {
  const navigate = useNavigate()
  
  // Datos del usuario
  const [userData] = useState({
    name: "Ana López",
    email: "ana.lopez@instituto.edu.mx",
    role: "Gestor Documental",
    department: "Calidad",
    joinDate: "Marzo 2024",
    lastAccess: "Hoy, 14:30"
  })

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleLogout = () => {
    localStorage.clear()
    navigate("/auth")
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsUpdating(false)
    alert("¡Contraseña actualizada con éxito!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/20 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* BOTÓN REGRESAR + TÍTULO */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="hover:bg-white/20 rounded-full"
          >
            <ArrowLeft className="h-8 w-8" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Mi Perfil</h1>
            <p className="text-lg text-gray-600">Gestiona tu información personal y seguridad</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* TARJETA DE PERFIL */}
          <Card className="lg:col-span-1 shadow-xl border-0">
            <CardContent className="p-8 text-center">
              <div className="relative inline-block mb-6">
                <Avatar className="w-32 h-32 mx-auto border-4 border-white shadow-2xl">
                  <AvatarImage src="/logo.png" />
                  <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-sky-500 to-emerald-500">
                    {userData.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-2 right-2 p-3 bg-gradient-to-br from-sky-500 to-emerald-500 text-white rounded-full shadow-lg hover:scale-110 transition-all">
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">{userData.name}</h2>
              <p className="text-gray-600 mb-4">{userData.email}</p>
              <Badge className="mb-6 text-lg py-2 px-6 bg-gradient-to-r from-emerald-500 to-sky-500 text-white">
                {userData.role}
              </Badge>

              <Separator className="my-6" />

              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Departamento</p>
                    <p className="font-medium">{userData.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Miembro desde</p>
                    <p className="font-medium">{userData.joinDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Último acceso</p>
                    <p className="font-medium">{userData.lastAccess}</p>
                  </div>
                </div>
              </div>

              <Button onClick={handleLogout} variant="destructive" className="w-full mt-8 text-lg py-6">
                <LogOut className="mr-3 h-5 w-5" />
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>

          {/* CONFIGURACIÓN */}
          <div className="lg:col-span-2 space-y-8">
            {/* INFORMACIÓN PERSONAL */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <User className="w-6 h-6" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Nombre</Label>
                    <Input defaultValue={userData.name.split(" ")[0]} className="h-12" />
                  </div>
                  <div>
                    <Label>Apellido</Label>
                    <Input defaultValue={userData.name.split(" ").slice(1).join(" ")} className="h-12" />
                  </div>
                </div>
                <div>
                  <Label>Correo electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input defaultValue={userData.email} className="pl-12 h-12" readOnly />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button size="lg" className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600">
                    Guardar Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* CAMBIAR CONTRASEÑA */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Lock className="w-6 h-6" />
                  Cambiar Contraseña
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-6">
                  <div>
                    <Label>Contraseña actual</Label>
                    <div className="relative">
                      <Input type={showCurrentPassword ? "text" : "password"} placeholder="••••••••" className="pr-12 h-12" />
                      <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">
                        {showCurrentPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label>Nueva contraseña</Label>
                    <div className="relative">
                      <Input type={showNewPassword ? "text" : "password"} placeholder="Mínimo 8 caracteres" className="pr-12 h-12" />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">
                        {showNewPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isUpdating} size="lg" className="bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600">
                      {isUpdating ? "Actualizando..." : "Actualizar Contraseña"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* ESTADÍSTICAS */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Mi Actividad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: "Documentos Creados", value: "45", color: "from-sky-500 to-blue-500" },
                    { label: "Aprobaciones", value: "128", color: "from-emerald-500 to-green-500" },
                    { label: "Revisiones", value: "23", color: "from-orange-500 to-yellow-500" },
                    { label: "Acciones Totales", value: "356", color: "from-purple-500 to-pink-500" },
                  ].map((stat) => (
                    <div key={stat.label} className={`text-center p-6 bg-gradient-to-br ${stat.color} rounded-2xl text-white shadow-lg`}>
                      <p className="text-4xl font-black">{stat.value}</p>
                      <p className="text-sm opacity-90 mt-2">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}