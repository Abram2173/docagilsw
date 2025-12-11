// // src/pages/QrLoginPage.tsx
// import React, { useState } from "react";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Loader2 } from "lucide-react";

// const API_BASE = import.meta.env.VITE_API_URL || "https://backencdart.onrender.com/api";

// export default function QrLoginPage() {
//   const [controlNumber, setControlNumber] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<"success" | "error" | null>(null);
//   const [message, setMessage] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!controlNumber.trim()) return;

//     setLoading(true);
//     setResult(null);

//     try {
//       const response = await axios.post(`${API_BASE}/auth/qr-login/`, {
//         numero_control: controlNumber.trim()
//       });

//       setResult("success");
//       setMessage(
//         `¡Bienvenido! Tu contraseña es: <strong>${response.data.password}</strong><br><br>` +
//         `Guárdala bien. Te llegó también a tu correo institucional.<br><br>` +
//         `<a href="/login" class="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block">Ir al Login</a>`
//       );
//     } catch (err: any) {
//       setResult("error");
//       setMessage(
//         err.response?.data?.error || 
//         "Número de control no encontrado o no autorizado"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 flex items-center justify-center p-8">
//       <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
//         <h1 className="text-4xl font-bold text-slate-900 mb-4">
//           Acceso Institucional
//         </h1>
//         <p className="text-xl text-gray-700 mb-8">
//           Ingresa tu número de control para generar tu contraseña
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <Input
//             type="text"
//             placeholder="Ej: 2025123456"
//             value={controlNumber}
//             onChange={(e) => setControlNumber(e.target.value)}
//             className="text-center text-2xl h-16"
//             disabled={loading}
//           />

//           <Button
//             type="submit"
//             disabled={loading || !controlNumber.trim()}
//             className="w-full h-16 text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white"
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="mr-3 h-6 w-6 animate-spin" />
//                 Verificando...
//               </>
//             ) : (
//               "Generar Contraseña"
//             )}
//           </Button>
//         </form>

//         {result && (
//           <Alert className={`mt-8 ${result === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}>
//             <AlertDescription
//               className="text-lg"
//               dangerouslySetInnerHTML={{ __html: message }}
//             />
//           </Alert>
//         )}
//       </div>
//     </div>
//   );
// }