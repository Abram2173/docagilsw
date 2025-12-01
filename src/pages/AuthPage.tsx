// src/pages/AuthPage.tsx
import React, { useState } from "react";
import logo from '../assets/logo.png'; // ajustar ruta
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Clock } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "https://backencdart.onrender.com/api";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [activeTab] = useState<"login" | "register">(
    (searchParams.get("tab") as "login" | "register") || "login"
  );
  const navigate = useNavigate();

  // Estados compartidos
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // === LOGIN (SIN RECORDARME NI MFA) ===
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // === REGISTER ===
  const [currentStep, setCurrentStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Validación de correo institucional
  const validateEmail = (email: string) => {
    if (email && !email.endsWith("@instituto.edu.mx")) {
      setEmailError("El correo debe ser institucional (@instituto.edu.mx)");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleRegisterEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterEmail(e.target.value);
    validateEmail(e.target.value);
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (password && e.target.value !== password) {
      setPasswordError("Las contraseñas no coinciden");
    } else {
      setPasswordError("");
    }
  };

  // === REGISTER SUBMIT ===
const handleRegisterSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (password !== confirmPassword) {
    setPasswordError("Las contraseñas no coinciden");
    return;
  }
  if (!acceptTerms) {
    alert("Debes aceptar los términos y condiciones");
    return;
  }

  setIsSubmitting(true);
  setErrorMsg("");

  const generatedUsername = registerEmail.split("@")[0].toLowerCase();

  const payload = {
    username: generatedUsername,
    full_name: fullName,
    email: registerEmail,
    phone: phone || "",
    department: department || "",
    role: role,
    password: password,
    confirm_password: confirmPassword,
  };

  try {
    await axios.post(`${API_BASE}/auth/register/`, payload);
    
    // ← MUESTRA EL MODAL BONITO
    setShowSuccessModal(true);

    // Limpia el formulario
    setFullName("");
    setRegisterEmail("");
    setPhone("");
    setDepartment("");
    setRole("");
    setPassword("");
    setConfirmPassword("");
    setAcceptTerms(false);
    setCurrentStep(1);

  } catch (error: any) {
    console.error("Error del backend:", error.response?.data);
    const err = error.response?.data;
    let msg = "";
    if (err?.email) msg = err.email[0];
    else if (err?.username) msg = "Este correo ya está registrado";
    else if (err?.non_field_errors) msg = err.non_field_errors[0];
    else msg = "Error al enviar la solicitud";
    setErrorMsg(msg);
  } finally {
    setIsSubmitting(false);
  }
};

  // === LOGIN SUBMIT (SIMPLE Y LIMPIO) ===
const handleLoginSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setErrorMsg("");

  try {
    const response = await axios.post(`${API_BASE}/auth/login/`, {
      username: loginUsername,
      password: loginPassword,
    });

    const { token, role, full_name } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("full_name", full_name || loginUsername);

    navigate("/dashboard");
  } catch (error: any) {
    console.error("Error login:", error.response);

    // ← SI NO ESTÁ APROBADO → ABRE EL MODAL
    if (error.response?.status === 403 || 
        error.response?.data?.detail?.includes("aprob") ||
        error.response?.data?.non_field_errors?.[0]?.includes("aprob")) {
      setShowPendingModal(true);
    } 
    // ← SI ES CONTRASEÑA MAL → MENSAJE NORMAL
    else {
      setErrorMsg("Usuario o contraseña incorrectos");
    }
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center p-8 lg:p-16 bg-gradient-to-br from-sky-50 via-white to-emerald-50">
<div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 lg:p-12 relative">
        {/* Greeting */}
          <div className="text-center mb-10 "> {/* ← ESTE -mt-16 SUBE TODO */}            {/* Fondo negro para que el logo azul/brillante resalte */}
<div className="w-full flex justify-center -mt-14">
  <img src={logo} className="w-40 h-40 object-contain" />
</div>
      
          <h2 className="text-4xl font-bold text-slate-900 mb-2">
            {activeTab === "login" ? "¡Hola!" : "¡Crea tu Cuenta!"}
          </h2>
          <p className="text-2xl font-semibold text-slate-700 mb-1">
            {activeTab === "login" ? "Bienvenido" : "Solicita Acceso"}
          </p>
          <p className="text-xl text-slate-600">
            {activeTab === "login" ? "Inicia Sesión en Dart" : "Regístrate en el Sistema"}
          </p>
        </div>

        {/* Tabs
        <div className="flex gap-4 mb-8">
          <Button
            variant={activeTab === "login" ? "default" : "outline"}
            onClick={() => setActiveTab("login")}
            className="flex-1 h-12 text-lg rounded-xl"
          >
            Iniciar Sesión
          </Button>
          <Button
            variant={activeTab === "register" ? "default" : "outline"}
            onClick={() => setActiveTab("register")}
            className="flex-1 h-12 text-lg rounded-xl"
          >
            Crear Cuenta
          </Button>
        </div> */}

        {/* LOGIN LIMPIO */}
        {activeTab === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {errorMsg && <p className="text-red-600 text-center font-medium">{errorMsg}</p>}

            <Input
              type="text"
              placeholder="Nombre de Usuario (ej: solicitante)"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              required
              disabled={isSubmitting}
              className="h-14 text-lg"
            />

            <Input
              type="password"
              placeholder="Contraseña"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              disabled={isSubmitting}
              className="h-14 text-lg"
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 text-lg font-bold rounded-xl bg-sky-500 hover:bg-sky-600"
            >
              {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>

            <div className="text-center pt-4">
              <a href="/recuperar" className="text-sm font-medium text-sky-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </form>
        )}
        {/* MODAL DE ÉXITO - BONITO Y PROFESIONAL */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 text-center">
              <div className="mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
                <CheckCircle2 className="w-14 h-14 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ¡Solicitud Enviada!
              </h2>
              
              <p className="text-lg text-gray-700 mb-8">
                Tu cuenta está pendiente de aprobación por el administrador.<br />
                Te notificaremos cuando esté lista.
              </p>

              <Button
                size="lg"
                className="bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white text-xl px-12 py-7 rounded-2xl"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate("/select-role");  // ← LO MANDA A SELECTROLE
                }}
              >
                Volver al inicio
              </Button>
            </div>
          </div>
        )}

        {/* MODAL - CUENTA PENDIENTE DE APROBACIÓN */}
        {showPendingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 text-center">
              <div className="mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-xl">
                <Clock className="w-14 h-14 text-white" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Cuenta Pendiente
              </h2>

              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Tu solicitud de acceso está siendo revisada por el administrador.<br />
                Te notificaremos cuando tu cuenta sea aprobada.
              </p>

              <Button
                size="lg"
                className="bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white text-xl px-12 py-7 rounded-2xl"
                onClick={() => setShowPendingModal(false)}
              >
                Entendido
              </Button>
            </div>
          </div>
        )}

        {/* REGISTER (mantiene tu flujo de 2 pasos) */}
        {activeTab === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            {currentStep === 1 && (
              <>
                <Input placeholder="Nombre Completo" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="h-12" />
                <div>
                  <Input
                    type="email"
                    placeholder="Correo institucional"
                    value={registerEmail}
                    onChange={handleRegisterEmailChange}
                    required
                    className="h-12"
                  />
                  {emailError && <p className="text-sm text-red-600 mt-1">{emailError}</p>}
                </div>
                <Input placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-12" />
                <Input placeholder="Departamento" value={department} onChange={(e) => setDepartment(e.target.value)} required className="h-12" />
                <Button type="button" onClick={nextStep} className="w-full h-12 text-lg rounded-xl">Siguiente</Button>
              </>
            )}

            {currentStep === 2 && (
              <>
                <Select value={role} onValueChange={setRole} required>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Rol que solicitas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solicitante">Usuario Final (Estudiante / Personal)</SelectItem>
                    <SelectItem value="revisor">Revisor / Aprobador</SelectItem>
                    <SelectItem value="auditor">Auditor Interno</SelectItem>
                    <SelectItem value="gestor">Gestor Documental</SelectItem>
                  </SelectContent>
                </Select>

                <Input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12" />
                <div>
                  <Input
                    type="password"
                    placeholder="Confirmar Contraseña"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                    className="h-12"
                  />
                  {passwordError && <p className="text-sm text-red-600 mt-1">{passwordError}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(checked) => setAcceptTerms(checked as boolean)} />
                  <label htmlFor="terms" className="text-sm text-slate-700 cursor-pointer">Acepto los términos y condiciones</label>
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-12">Atrás</Button>
                  <Button type="submit" disabled={!acceptTerms || isSubmitting} className="flex-1 h-12 text-lg font-bold rounded-xl">
                    {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
                  </Button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
    
  );
}