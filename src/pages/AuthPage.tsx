// src/pages/AuthPage.tsx
import React, { useState } from "react";
import logo from '../assets/logo.png'; // ajustar ruta
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const API_BASE = import.meta.env.VITE_API_URL || "https://backencdart.onrender.com/api";

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

  // GENERAMOS UN USERNAME ÚNICO A PARTIR DEL EMAIL
  const generatedUsername = registerEmail.split("@")[0].toLowerCase();

  const payload = {
    username: generatedUsername,           // OBLIGATORIO y único
    full_name: fullName,
    email: registerEmail,
    phone: phone || "",
    department: department || "",
    role: role,                            // solicitante, aprobador, auditor, gestor
    password: password,
    confirm_password: confirmPassword,     // Tu serializer lo necesita
  };

  console.log("Enviando registro:", payload); // Para que veas en consola

  try {
    await axios.post(`${API_BASE}/auth/register/`, payload);
    alert("¡Solicitud enviada con éxito! El administrador te aprobará pronto.");
    setActiveTab("login");
    // Reset form
    setCurrentStep(1);
    setFullName(""); 
    setRegisterEmail(""); 
    setPhone(""); 
    setDepartment(""); 
    setRole("");
    setPassword(""); 
    setConfirmPassword(""); 
    setAcceptTerms(false);
  } catch (error: any) {
    console.error("Error del backend:", error.response?.data);
    const err = error.response?.data;
    let msg = "";
    if (err?.email) msg = err.email[0];
    else if (err?.username) msg = "Nombre de usuario ya existe";
    else if (err?.non_field_errors) msg = err.non_field_errors[0];
    else msg = "Error en el registro. Intenta con otro correo.";
    
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
      setErrorMsg(error.response?.data?.non_field_errors?.[0] || "Usuario o contraseña incorrectos");
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

        {/* Tabs */}
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
        </div>

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