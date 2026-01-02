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

  const [departamentoJefe, setDepartamentoJefe] = useState("");

  // === Tus validaciones y handlers (sin cambios) ===

const handleRegisterEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setRegisterEmail(value);

  if (value.trim() === "") {
    setEmailError("");
  } else {
    const lowerValue = value.toLowerCase().trim();
    if (
      lowerValue.endsWith("@instituto.edu.mx") ||
      lowerValue.endsWith(".tecnm.mx")
    ) {
      setEmailError("");
    } else {
      setEmailError("Solo correos institucionales del TecNM (@instituto.edu.mx o @*.tecnm.mx)");
    }
  }
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
        departamento_jefe: role === "gestor" ? departamentoJefe : ""
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
  setErrorMsg("");

  try {
    const { data } = await axios.post(`${API_BASE}/auth/login/`, {
      username: loginUsername,
      password: loginPassword,
    });

    // Guardamos token y nombre
    localStorage.setItem("token", data.token);
    localStorage.setItem("full_name", data.full_name || loginUsername);

    // Leemos el rol seleccionado en SelectRole
    const selectedRole = localStorage.getItem("selectedRole") || "solicitante";

    // Guardamos el rol definitivo
    localStorage.setItem("role", selectedRole);

    // Departamento si es gestor
    const dept = localStorage.getItem("departamentoJefe");
    if (dept) localStorage.setItem("departamentoJefe", dept);

    // ¡NAVEGACIÓN DIRECTA E INMEDIATA!
    navigate("/dashboard");

  } catch (error: any) {
    const responseData = error.response?.data;
    const status = error.response?.status;

    const isPending =
      status === 403 ||
      status === 401 ||
      (responseData?.detail && /pendiente|aprob|revis|aprobar|activar|pending|not approved|espera|administrador/i.test(responseData.detail)) ||
      (responseData?.non_field_errors && responseData.non_field_errors.some((msg: string) =>
        /pendiente|aprob|revis|aprobar|activar|pending|not approved|espera|administrador/i.test(msg)
      ));

    if (isPending) {
      setShowPendingModal(true);
      setErrorMsg("");
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
                  
                  <Input type="text" placeholder="Nombre de usuario" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} required disabled={isSubmitting} className="h-12 sm:h-14 text-base sm:text-lg" />
                  <Input type="password" placeholder="Contraseña" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required disabled={isSubmitting} className="h-12 sm:h-14 text-base sm:text-lg" />
                  
<Button
  type="submit"
  disabled={isSubmitting || !loginUsername.trim() || !loginPassword.trim()}
  className={`
    w-full 
    h-12 sm:h-14               // ← Más pequeño en móvil, grande en escritorio
    text-base sm:text-lg        // ← Texto legible en todos los tamaños
    font-bold 
    rounded-xl 
    transition-all 
    duration-300 
    shadow-lg 
    hover:shadow-xl
    ${isSubmitting || !loginUsername.trim() || !loginPassword.trim()
      ? "bg-gray-400 cursor-not-allowed text-gray-200"
      : "bg-gradient-to-r from-[#0EA5E9] to-[#10B981] text-white hover:from-[#0284c7] hover:to-[#059669] active:scale-95"
    }
  `}
>
  {isSubmitting ? (
    <span className="flex items-center justify-center gap-3">
      <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      Iniciando sesión...
    </span>
  ) : (
    "Iniciar Sesión"
  )}
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

{/* BOTÓN OFICIAL MICROSOFT — LA FRASE PERFECTA */}
<div className="mt-8 sm:mt-10">
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-gray-300"></div>
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="px-4 bg-white text-gray-500 font-medium">O continúa con</span>
    </div>
  </div>

  <div className="mt-8">
<Button
  onClick={() => {
    const clientId = import.meta.env.VITE_AZURE_CLIENT_ID;
    const redirectUri = encodeURIComponent(import.meta.env.VITE_AZURE_REDIRECT_URI || "http://localhost:5173/auth/callback");

    window.location.href = "https://login.microsoftonline.com/common/adminconsent?client_id=4d5ff0d-f74b-46cd-88ea-5408df16e4fd", +
      `client_id=${clientId}` +
      `&response_type=code` +
      `&redirect_uri=${redirectUri}` +
      `&scope=openid+profile+email+User.Read` +
      `&response_mode=query` +
      `&state=12345`;
  }}
  className="w-full h-16 bg-white border-2 border-gray-300 hover:border-gray-400 rounded-2xl shadow-xl hover:shadow-2xl transition-all group flex items-center justify-center gap-4"
>
  <svg className="w-10 h-10" viewBox="0 0 23 23">
    <path fill="#f25022" d="M0 0h11v11H0z"/>
    <path fill="#7fba00" d="M12 0h11v11H12z"/>
    <path fill="#00a4ef" d="M0 12h11v11H0z"/>
    <path fill="#ffb900" d="M12 12h11v11H12z"/>
  </svg>
  <span className="text-lg font-semibold text-gray-900">
    Iniciar sesión con Microsoft
  </span>
</Button>
  </div>
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
                    <Input 
                      placeholder="Nombre Completo" 
                      value={fullName} 
                      onChange={e => setFullName(e.target.value)} 
                      required 
                      className="h-12" 
                    />
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
                    <Input 
                      placeholder="Teléfono" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                      className="h-12" 
                    />

                    {/* ← PRIMERO ELIGE EL ROL */}
                    <Select value={role} onValueChange={setRole} required>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Rol que solicitas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solicitante">Usuario Final (Estudiante / Personal)</SelectItem>
                        <SelectItem value="revisor">Revisor / Aprobador</SelectItem>
                        <SelectItem value="gestor">Gestor Documental</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={
                        !fullName.trim() ||
                        !registerEmail.trim() ||
                        emailError !== "" ||
                        !role
                      }
                      className="w-full h-12 text-lg font-bold rounded-xl transition-all duration-200
                        disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-gray-200
                        bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white shadow-lg"
                    >
                      Siguiente
                    </Button>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    {/* ← SI ES JEFE: SELECT DE CATEGORÍAS */}
                    {role === "gestor" && (
                      <div className="mb-6">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Selecciona tu departamento
                        </label>
                        <Select value={departamentoJefe} onValueChange={setDepartamentoJefe} required>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Elige tu departamento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="becas">Becas</SelectItem>
                            <SelectItem value="inscripciones">Inscripciones</SelectItem>
                            <SelectItem value="servicios_escolares">Servicios Escolares</SelectItem>
                            <SelectItem value="imss">IMSS</SelectItem>
                            <SelectItem value="biblioteca">Biblioteca</SelectItem>
                            <SelectItem value="participacion">Participación Estudiantil</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* ← SI ES OTRO ROL: INPUT NORMAL DE DEPARTAMENTO */}
                    {role !== "gestor" && (
                      <Input 
                        placeholder="Departamento" 
                        value={department} 
                        onChange={e => setDepartment(e.target.value)} 
                        required 
                        className="h-12" 
                      />
                    )}

                    <Input 
                      type="password" 
                      placeholder="Contraseña" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      required 
                      className="h-12" 
                    />
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
                      <Checkbox id="terms" checked={acceptTerms} onCheckedChange={checked => setAcceptTerms(checked as boolean)} />
                      <label htmlFor="terms" className="text-sm text-slate-700 cursor-pointer">
                        Acepto los términos y condiciones
                      </label>
                    </div>

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-12">
                        Atrás
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={
                          !acceptTerms || 
                          isSubmitting || 
                          (role === "gestor" && !departamentoJefe) || 
                          (role !== "gestor" && !department.trim())
                        } 
                        className="flex-1 h-12 text-lg font-bold rounded-xl"
                      >
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