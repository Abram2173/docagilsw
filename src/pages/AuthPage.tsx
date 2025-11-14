import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

//const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api" + "/";
const API_BASE = import.meta.env.VITE_API_URL || "https://backencdart.onrender.com/api";  // Render directo, sin local

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"login" | "register">(
    (searchParams.get("tab") as "login" | "register") || "login"
  );
  const navigate = useNavigate();

  // Estados compartidos
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Login states
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [showMfa, setShowMfa] = useState(false);
  const [remember, setRemember] = useState(false);

  // Register states
  const [currentStep, setCurrentStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Validaciones
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

  // ← AGREGADO: nextStep para error line 348
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));  // 3 steps max

  // ← FIX: Usa handlePasswordChange si la necesitas, o borra la función

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (password && e.target.value !== password) {
      setPasswordError("Las contraseñas no coinciden");
    } else {
      setPasswordError("");
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // ← Handle Register con Backend
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }
    if (!acceptTerms) {
      alert("Acepta los términos");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const response = await axios.post(`${API_BASE}/auth/register/`, {
        username: fullName.toLowerCase().replace(/\s+/g, '_'),
        full_name: fullName,
        email: registerEmail,
        phone,
        department,
        role,
        password,
        confirm_password: confirmPassword,
      });
      setIsSuccess(true);
      console.log("Registro exitoso:", response.data);
      setCurrentStep(1);
      setTimeout(() => {
        setIsSuccess(false);
        // Reset form
        setFullName(""); setRegisterEmail(""); setPhone(""); setDepartment(""); setRole("");
        setPassword(""); setConfirmPassword(""); setAcceptTerms(false);
      }, 3000);
    } catch (error: any) {
      setErrorMsg(error.response?.data?.non_field_errors?.[0] || "Error en registro. Intenta de nuevo.");
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ← Handle Login con Backend
  const handleLoginSubmit = async (e: React.FormEvent) => {
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
      // EXPANDE AQUÍ: Fetch MFA verify si backend lo tiene
    }
    setIsSubmitting(true);
    setErrorMsg("");
try {
  const response = await axios.post(`${API_BASE}/auth/login/`, {
    username: loginUsername,
    password: loginPassword,
  });
  const { token, role, full_name } = response.data;  // ← FIX: Destruye full_name de backend
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  localStorage.setItem('full_name', full_name || loginUsername);  // ← FIX: Guarda nombre real
  navigate('/dashboard');
} catch (error: any) {
  setErrorMsg(error.response?.data?.non_field_errors?.[0] || "Credenciales inválidas");
  alert(errorMsg);
}finally {
  setIsSubmitting(false);
  setShowMfa(false);
}
  };


  // Resto del JSX sin cambio (greeting, tabs, forms...)
  return (
    <div className="min-h-screen flex items-center justify-center p-8 lg:p-16 bg-slate-300">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-sky-100/50 border border-slate-200 p-8 lg:p-12">
        {/* Greeting */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {activeTab === "login" ? "¡Hola!" : "¡Crea tu Cuenta!"}
          </h2>
          <p className="text-2xl font-semibold text-slate-700 mb-1">
            {activeTab === "login" ? "Bienvenido" : "Solicita Acceso"}
          </p>
          <p className="text-xl font-medium text-slate-600">
            {activeTab === "login" ? "Inicia Sesión en tu Cuenta" : "Regístrate en DocAgil"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 bg-slate-100 p-1 rounded-xl">
          <Button
            type="button"
            variant={activeTab === "login" ? "default" : "ghost"}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === "login"
                ? "bg-sky-500 text-white shadow-lg hover:bg-sky-600"
                : "text-sky-500 hover:bg-slate-200 border border-sky-200"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Iniciar Sesión
          </Button>
          <Button
            type="button"
            variant={activeTab === "register" ? "default" : "ghost"}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === "register"
                ? "bg-sky-500 text-white shadow-lg hover:bg-sky-600"
                : "text-sky-500 hover:bg-slate-200 border border-sky-200"
            }`}
            onClick={() => {
              setActiveTab("register");
              setCurrentStep(1);
            }}
          >
            Crear Cuenta
          </Button>
        </div>

        {/* Contenedor de Forms */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: activeTab === "login" ? "translateX(0)" : "translateX(-100%)" }}
          >
            {/* Login Form */}
            <div className="w-full flex-shrink-0">
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                {errorMsg && <p className="text-red-600 text-sm text-center mb-4">{errorMsg}</p>} 
                {!showMfa ? (
                  <>
                    <div className="relative">
                      <Input
                        type="text"
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        placeholder="Nombre de Usuario (ej: solicitante)"
                        className="w-full px-0 py-3 text-slate-900 placeholder-slate-400 bg-transparent border-0 border-b-2 border-slate-300 focus:border-sky-500 focus:ring-sky-500/20 focus:outline-none transition-colors duration-300"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="relative">
                      <Input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Contraseña"
                        className="w-full px-0 py-3 text-slate-900 placeholder-slate-400 bg-transparent border-0 border-b-2 border-slate-300 focus:border-sky-500 focus:ring-sky-500/20 focus:outline-none transition-colors duration-300"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" checked={remember} onCheckedChange={(checked) => setRemember(checked as boolean)} />
                      <label htmlFor="remember" className="text-sm text-slate-700 cursor-pointer select-none">
                        Recordarme
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="mfa" checked={mfaEnabled} onCheckedChange={(checked) => setMfaEnabled(checked as boolean)} />
                      <label htmlFor="mfa" className="text-sm text-slate-700 cursor-pointer select-none">
                        Habilitar MFA
                      </label>
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 text-white font-bold text-lg rounded-full bg-sky-500 hover:bg-sky-600 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      {isSubmitting ? "Iniciando..." : "Iniciar Sesión"}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <Input
                        type="text"
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value)}
                        placeholder="Código MFA (6 dígitos)"
                        maxLength={6}
                        className="w-full px-0 py-3 text-slate-900 placeholder-slate-400 bg-transparent border-0 border-b-2 border-slate-300 focus:border-sky-500 focus:ring-sky-500/20 focus:outline-none transition-colors duration-300"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 text-white font-bold text-lg rounded-full bg-sky-500 hover:bg-sky-600 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      Verificar MFA
                    </Button>
                  </>
                )}
              </form>
            </div>

            {/* Register Form (sin cambio en JSX, solo handle arriba) */}
            <div className="w-full flex-shrink-0">
              {errorMsg && <p className="text-red-600 text-sm text-center mb-4">{errorMsg}</p>}
              {isSuccess && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  <p className="text-sm text-green-800">¡Solicitud enviada! Espera aprobación.</p>
                </div>
              )}
              {/* Indicador de pasos */}
              <div className="flex justify-center mb-6">
                <div className="flex space-x-2">
                  <div className={`w-8 h-2 rounded-full ${currentStep === 1 ? 'bg-sky-500' : 'bg-slate-300'}`}></div>
                  <div className={`w-8 h-2 rounded-full ${currentStep === 2 ? 'bg-sky-500' : 'bg-slate-300'}`}></div>
                </div>
              </div>
              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                {currentStep === 1 && (
                  <>
                    <div className="relative">
                      <Input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nombre Completo"
                        className="w-full px-0 py-3 text-slate-900 placeholder-slate-400 bg-transparent border-0 border-b-2 border-slate-300 focus:border-sky-500 focus:ring-sky-500/20 focus:outline-none transition-colors duration-300"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="relative">
                      <Input
                        type="email"
                        value={registerEmail}
                        onChange={handleRegisterEmailChange}
                        placeholder="Correo Institucional"
                        className="w-full px-0 py-3 text-slate-900 placeholder-slate-400 bg-transparent border-0 border-b-2 border-slate-300 focus:border-sky-500 focus:ring-sky-500/20 focus:outline-none transition-colors duration-300"
                        required
                        disabled={isSubmitting}
                      />
                      {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
                    </div>
                    <div className="relative">
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Número de Teléfono"
                        className="w-full px-0 py-3 text-slate-900 placeholder-slate-400 bg-transparent border-0 border-b-2 border-slate-300 focus:border-sky-500 focus:ring-sky-500/20 focus:outline-none transition-colors duration-300"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="relative">
                      <Input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Departamento o Área"
                        className="w-full px-0 py-3 text-slate-900 placeholder-slate-400 bg-transparent border-0 border-b-2 border-slate-300 focus:border-sky-500 focus:ring-sky-500/20 focus:outline-none transition-colors duration-300"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="w-full py-4 px-6 text-white font-bold text-lg rounded-full bg-sky-500 hover:bg-sky-600 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
                      disabled={isSubmitting}
                    >
                      Siguiente
                    </Button>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <div className="relative">
                      <Select value={role} onValueChange={setRole} disabled={isSubmitting}>
                        <SelectTrigger className="w-full px-0 py-3 text-slate-900 placeholder-slate-400 bg-transparent border-0 border-b-2 border-slate-300 focus:border-sky-500 focus:ring-sky-500/20 focus:outline-none transition-colors duration-300">
                          <SelectValue placeholder="Rol que solicitas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solicitante">Solicitante</SelectItem>
                          <SelectItem value="aprobador">Aprobador</SelectItem>
                          <SelectItem value="auditor">Auditor</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500 mt-1">El rol Administrador es asignado por el sistema</p>
                    </div>
                    <div className="relative">
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        className="w-full px-0 py-3 text-slate-900 placeholder-slate-400 bg-transparent border-0 border-b-2 border-slate-300 focus:border-sky-500 focus:ring-sky-500/20 focus:outline-none transition-colors duration-300"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="relative">
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        placeholder="Confirmar Contraseña"
                        className="w-full px-0 py-3 text-slate-900 placeholder-slate-400 bg-transparent border-0 border-b-2 border-slate-300 focus:border-sky-500 focus:ring-sky-500/20 focus:outline-none transition-colors duration-300"
                        required
                        disabled={isSubmitting}
                      />
                      {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(checked) => setAcceptTerms(checked as boolean)} disabled={isSubmitting} />
                      <label htmlFor="terms" className="text-sm text-slate-700 cursor-pointer select-none">
                        Acepto términos
                      </label>
                    </div>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="flex-1 py-4 px-6 text-sky-500 font-bold text-lg rounded-full border-2 border-sky-500 hover:bg-sky-500 hover:text-white transition-all duration-300"
                        disabled={isSubmitting}
                      >
                        Atrás
                      </Button>
                      <Button
                        type="submit"
                        disabled={!acceptTerms || isSubmitting}
                        className="flex-1 py-4 px-6 text-white font-bold text-lg rounded-full bg-sky-500 hover:bg-sky-600 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                      >
                        {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}