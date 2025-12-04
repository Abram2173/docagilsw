// src/pages/AuthPage.tsx  ← VERSIÓN FINAL CORREGIDA (login compacto + animación perfecta)

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from '../assets/logo.png';
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "https://backencdart.onrender.com/api";

export default function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"login" | "register">(
    (searchParams.get("tab") as "login" | "register") || "login"
  );

  const switchTab = (tab: "login" | "register") => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // === Todos tus estados (sin cambios) ===
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);

  // === Tus validaciones y handlers (sin cambios) ===
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

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (password && e.target.value !== password) {
      setPasswordError("Las contraseñas no coinciden");
    } else {
      setPasswordError("");
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 2));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return setPasswordError("Las contraseñas no coinciden");
    if (!acceptTerms) return alert("Debes aceptar los términos y condiciones");

    setIsSubmitting(true);
    setErrorMsg("");

    const generatedUsername = registerEmail.split("@")[0].toLowerCase();

    try {
      await axios.post(`${API_BASE}/auth/register/`, {
        username: generatedUsername,
        full_name: fullName,
        email: registerEmail,
        phone: phone || "",
        department: department || "",
        role: role,
        password: password,
        confirm_password: confirmPassword,
      });

      setShowSuccessModal(true);
      setFullName(""); setRegisterEmail(""); setPhone(""); setDepartment("");
      setRole(""); setPassword(""); setConfirmPassword(""); setAcceptTerms(false);
      setCurrentStep(1);

    } catch (error: any) {
      const err = error.response?.data || {};
      let msg = "";
      if (err.email) msg = err.email[0];
      else if (err.username) msg = "Este correo ya está registrado";
      else if (err.non_field_errors) msg = err.non_field_errors[0];
      else msg = "Error al enviar la solicitud";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

const handleLoginSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setErrorMsg(""); // limpiamos cualquier mensaje anterior

  try {
    const { data } = await axios.post(`${API_BASE}/auth/login/`, {
      username: loginUsername,
      password: loginPassword,
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("full_name", data.full_name || loginUsername);
    localStorage.removeItem("role");
    navigate("/select-role");
  } catch (error: any) {
    // ← AQUÍ ESTÁ LA MAGIA (detecta TODOS los casos de cuenta pendiente)
    const responseData = error.response?.data;
    const status = error.response?.status;

    const isPending = 
      status === 403 || 
      status === 401 ||
      (responseData?.detail && (
        /pendiente|aprob|revis|aprobar|activar|pending|not approved|espera|administrador/i.test(responseData.detail)
      )) ||
      (responseData?.non_field_errors && responseData.non_field_errors.some((msg: string) =>
        /pendiente|aprob|revis|aprobar|activar|pending|not approved|espera|administrador/i.test(msg)
      ));

    if (isPending) {
      setShowPendingModal(true);     // ← Modal bonito con reloj
      setErrorMsg("");               // ← NO mostramos el mensaje rojo
    } else {
      setErrorMsg("Usuario o contraseña incorrectos");
    }
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center p-8 lg:p-16 bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 lg:p-12 relative">


<button
  onClick={() => navigate("/")}
  className="absolute top-6 left-6 p-2 rounded-full bg-white/70 hover:bg-white shadow-md hover:shadow-lg transition-all duration-200"
  title="Volver al inicio"
>
  <ArrowLeft className="h-5 w-5 text-slate-700" />
</button>

        {/* Logo y título */}
        <div className="text-center mb-10">
          <div className="w-full flex justify-center -mt-14">
            <img src={logo} alt="Logo" className="w-40 h-40 object-contain" />
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

        {/* === CONTENEDOR DE ANIMACIÓN SIN ALTURA FIJA === */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
              <motion.div
                key="login"
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  {errorMsg && <p className="text-red-600 text-center font-medium">{errorMsg}</p>}
                  <Input type="text" placeholder="Nombre de usuario" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} required disabled={isSubmitting} className="h-14 text-lg" />
                  <Input type="password" placeholder="Contraseña" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required disabled={isSubmitting} className="h-14 text-lg" />
                  <Button
                    type="submit"
                    disabled={isSubmitting || !loginUsername.trim() || !loginPassword.trim()}
                    className={`
                      w-full h-14 text-lg font-bold rounded-xl transition-all
                      ${isSubmitting || !loginUsername.trim() || !loginPassword.trim()
                        ? "bg-gray-400 cursor-not-allowed text-gray-200"
                        : "bg-gradient-to-r from-[#0EA5E9] to-[#10B981]  text-white"
                      }
                    `}
                  >
                    {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                  <div className="text-center space-y-3 pt-2">
                    <a href="/recuperar" className="text-sm font-medium text-sky-600 hover:underline block">¿Olvidaste tu contraseña?</a>
                    <p className="text-sm text-slate-600">
                      ¿No tienes cuenta?{" "}
                      <button type="button" onClick={() => switchTab("register")} className="font-semibold text-sky-600 hover:underline">
                        Regístrate aquí
                      </button>
                    </p>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  {errorMsg && <p className="text-red-600 text-center font-medium">{errorMsg}</p>}

                  {currentStep === 1 && (
                    <>
                      <Input placeholder="Nombre Completo" value={fullName} onChange={e => setFullName(e.target.value)} required className="h-12" />
                      <div>
                        <Input type="email" placeholder="Correo institucional" value={registerEmail} onChange={handleRegisterEmailChange} required className="h-12" />
                        {emailError && <p className="text-sm text-red-600 mt-1">{emailError}</p>}
                      </div>
                      <Input placeholder="Teléfono" value={phone} onChange={e => setPhone(e.target.value)} className="h-12" />
                      <Input placeholder="Departamento" value={department} onChange={e => setDepartment(e.target.value)} required className="h-12" />
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={
                        !fullName.trim() ||
                        !registerEmail.trim() ||
                        !department.trim() ||
                        emailError !== "" ||           // si el correo no es institucional
                        !registerEmail.endsWith("@instituto.edu.mx")
                      }
                      className="w-full h-12 text-lg font-bold rounded-xl transition-all duration-200
                        disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-gray-200
                        bg-sky-500 hover:bg-sky-600 text-white"
                    >
                      Siguiente
                    </Button>                   
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <Select value={role} onValueChange={setRole} required>
                        <SelectTrigger className="h-12"><SelectValue placeholder="Rol que solicitas" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solicitante">Usuario Final (Estudiante / Personal)</SelectItem>
                          <SelectItem value="revisor">Revisor / Aprobador</SelectItem>
                          <SelectItem value="auditor">Auditor Interno</SelectItem>
                          <SelectItem value="gestor">Gestor Documental</SelectItem>
                        </SelectContent>
                      </Select>

                      <Input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required className="h-12" />
                      <div>
                        <Input type="password" placeholder="Confirmar Contraseña" value={confirmPassword} onChange={handleConfirmPasswordChange} required className="h-12" />
                        {passwordError && <p className="text-sm text-red-600 mt-1">{passwordError}</p>}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" checked={acceptTerms} onCheckedChange={checked => setAcceptTerms(checked as boolean)} />
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

                  <div className="text-center pt-6">
                    <p className="text-sm text-slate-600">
                      ¿Ya tienes cuenta?{" "}
                      <button type="button" onClick={() => switchTab("login")} className="font-semibold text-sky-600 hover:underline">
                        Inicia sesión aquí
                      </button>
                    </p>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* === Modales (sin cambios) === */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 text-center">
              <div className="mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
                <CheckCircle2 className="w-14 h-14 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Solicitud Enviada!</h2>
              <p className="text-lg text-gray-700 mb-8">
                Tu cuenta está pendiente de aprobación por el administrador.<br />
                Te notificaremos cuando esté lista.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white text-xl px-12 py-7 rounded-2xl"
                onClick={() => { setShowSuccessModal(false); switchTab("login"); }}>
                Volver al inicio
              </Button>
            </div>
          </div>
        )}

        {showPendingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 text-center">
              <div className="mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-xl">
                <Clock className="w-14 h-14 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Cuenta Pendiente</h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Tu solicitud de acceso está siendo revisada por el administrador.<br />
                Te notificaremos cuando tu cuenta sea aprobada.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white text-xl px-12 py-7 rounded-2xl"
                onClick={() => setShowPendingModal(false)}>
                Entendido
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}