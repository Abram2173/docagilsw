import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, FileText, CheckCircle2, Lock } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [showMfa, setShowMfa] = useState(false);
  const navigate = useNavigate();

  const getRoleFromUsername = (username: string) => {
    const lowerUsername = username.toLowerCase();
    if (lowerUsername.includes("solicitante")) return "solicitante";
    if (lowerUsername.includes("aprobador")) return "aprobador";
    if (lowerUsername.includes("auditor")) return "auditor";
    if (lowerUsername.includes("admin")) return "admin";
    return "solicitante"; // Default
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (mfaEnabled && !showMfa) {
      setShowMfa(true);
      return;
    }

    if (mfaEnabled && showMfa) {
      if (mfaCode.length !== 6) {
        alert("Código MFA inválido");
        return;
      }
    }

    // Simulación fácil – set token y navega por rol detectado del username
    localStorage.setItem('token', 'ok');  // Token simple pa' auth
    const detectedRole = getRoleFromUsername(username);
    console.log('Entrando como:', detectedRole, 'con usuario:', username);  // Debug en consola

    // Redirige según rol detectado
    switch (detectedRole) {
      case "solicitante":
        navigate("/solicitante");
        break;
      case "aprobador":
        navigate("/aprobador");
        break;
      case "auditor":
        navigate("/auditor");
        break;
      case "admin":
        navigate("/administrador");
        break;
      default:
        navigate("/solicitante");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-white via-green-50/30 to-blue-50/30 px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 top-1/4 h-72 w-72 animate-pulse rounded-full bg-green-200/20 blur-3xl" />
        <div className="absolute -right-4 bottom-1/4 h-72 w-72 animate-pulse rounded-full bg-blue-200/20 blur-3xl delay-1000" />
      </div>

      <Card className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 border-white/20 bg-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl duration-700">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-20 w-20 animate-in zoom-in items-center justify-center rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] shadow-lg duration-1000">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="animate-in fade-in text-5xl font-bold text-[#10B981] duration-1000 delay-200">
            DocAgil
          </CardTitle>
          <CardDescription className="animate-in fade-in text-lg text-gray-600 duration-1000 delay-300">
            Sistema de Gestión de Documentos Internos
          </CardDescription>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-[#10B981]">
              <CheckCircle2 className="h-3 w-3" />
              Seguro
            </div>
            <div className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-[#3B82F6]">
              <Lock className="h-3 w-3" />
              Encriptado
            </div>
            <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-[#10B981]">
              <Shield className="h-3 w-3" />
              MFA
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {!showMfa ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-base font-semibold text-gray-700">
                    Nombre de Usuario
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="solicitante"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="h-12 border-2 border-gray-200 bg-white/50 backdrop-blur-sm transition-all focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
                  />
                  <p className="flex items-center gap-1 text-xs text-gray-500">
                    <CheckCircle2 className="h-3 w-3 text-[#10B981]" />
                    Usa tu nombre de usuario (ej: solicitante, aprobador)
                  </p>
                  <p className="text-xs text-gray-500 italic mt-1">
                    Rol se detecta automáticamente por el nombre (ej: solicitante → Solicitante)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base font-semibold text-gray-700">
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 border-2 border-gray-200 bg-white/50 backdrop-blur-sm transition-all focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
                  />
                </div>
                <div className="flex items-center space-x-3 rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/50 p-4 transition-all hover:border-[#3B82F6] hover:bg-blue-50">
                  <Checkbox
                    id="mfa"
                    checked={mfaEnabled}
                    onCheckedChange={(checked) => setMfaEnabled(checked as boolean)}
                    className="h-5 w-5"
                  />
                  <Label htmlFor="mfa" className="flex flex-1 items-center gap-2 text-sm font-medium cursor-pointer">
                    <Shield className="h-5 w-5 text-[#3B82F6]" />
                    <span className="text-gray-700">Habilitar Autenticación Multifactor (MFA)</span>
                  </Label>
                </div>
              </>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-center shadow-inner">
                  <div className="mx-auto mb-3 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-[#3B82F6] shadow-lg">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <p className="font-semibold text-[#3B82F6]">Código de Verificación Enviado</p>
                  <p className="mt-1 text-sm text-blue-700">Revisa tu correo electrónico</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mfaCode" className="text-base font-semibold text-gray-700">
                    Código de Verificación (6 dígitos)
                  </Label>
                  <Input
                    id="mfaCode"
                    type="text"
                    placeholder="123456"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    required
                    className="h-14 border-2 border-gray-200 bg-white text-center text-3xl font-bold tracking-[0.5em] transition-all focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-2 bg-white hover:bg-gray-50"
                  onClick={() => setShowMfa(false)}
                >
                  Volver
                </Button>
              </div>
            )}
            <Button
              type="submit"
              className="h-14 w-full bg-gradient-to-r from-[#10B981] to-[#059669] text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
            >
              {showMfa ? "✓ Verificar e Iniciar Sesión" : "Iniciar Sesión →"}
            </Button>
            {!showMfa && (
              <div className="flex flex-col items-center gap-3 text-sm">
                <Link
                  to="/recuperar"
                  className="font-semibold text-[#3B82F6] transition-all hover:text-[#2563EB] hover:underline hover:underline-offset-4"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
                <Link
                  to="/registro"
                  className="font-semibold text-[#3B82F6] transition-all hover:text-[#2563EB] hover:underline hover:underline-offset-4"
                >
                  Registrarse (Solicitar cuenta) →
                </Link>
              </div>
            )}
          </form>
          <div className="mt-8 border-t pt-6">
            <p className="text-center text-xs text-gray-500">
              Desarrollado por Abram Ortiz Martínez, José Jerónimo Medrano Flores, Jesús Abdiel Chapa Cruz
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}