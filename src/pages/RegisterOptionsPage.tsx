// // src/pages/RegisterOptionsPage.tsx
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";

// export default function RegisterOptionsPage() {
//   const navigate = useNavigate();

  

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 flex items-center justify-center p-8">
//       <div className="w-full max-w-4xl">

//         {/* BOTÓN VOLVER */}
//         <button
//           onClick={() => navigate(-1)}
//           className="absolute top-8 left-8 flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-all"
//         >
//           <ArrowLeft className="h-6 w-6" />
//           Volver al login
//         </button>

//         <div className="text-center mb-16 mt-20">
//           <h1 className="text-5xl font-bold text-slate-900 mb-4">
//             ¿Cómo quieres registrarte?
//           </h1>
//           <p className="text-2xl text-slate-600">
//             Elige la opción más rápida y cómoda para ti
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 gap-12">

//           {/* OPCIÓN QR */}
//           <div 
//             onClick={() => navigate("/qr-login")}
//             className="bg-gradient-to-br from-emerald-50 to-teal-50 border-4 border-emerald-200 rounded-3xl p-12 text-center cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
//           >
//             <div className="w-36 h-36 mx-auto mb-8 bg-white rounded-3xl shadow-2xl flex items-center justify-center group-hover:shadow-3xl">
//               <div className="text-8xl font-bold text-emerald-600">QR</div>
//             </div>
//             <h2 className="text-4xl font-bold text-emerald-800 mb-6">
//               Escanear QR
//             </h2>
//             <p className="text-xl text-gray-700 leading-relaxed mb-6">
//               La forma <strong>más rápida</strong>. Escanea el código con tu celular y accede al instante con tu número de control.
//             </p>
//             <p className="text-2xl font-bold text-emerald-600">
//               Recomendado para estudiantes
//             </p>
//           </div>

//           {/* OPCIÓN MANUAL */}
//           <div 
//             onClick={() => navigate("/register")}
//             className="bg-gradient-to-br from-blue-50 to-indigo-50 border-4 border-blue-200 rounded-3xl p-12 text-center cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
//           >
//             <div className="w-36 h-36 mx-auto mb-8 bg-white rounded-3xl shadow-2xl flex items-center justify-center group-hover:shadow-3xl">
//               <div className="text-8xl font-bold text-blue-600">Form</div>
//             </div>
//             <h2 className="text-4xl font-bold text-blue-800 mb-6">
//               Registro Manual
//             </h2>
//             <p className="text-xl text-gray-700 leading-relaxed mb-6">
//               Completa el formulario con tus datos. Tu solicitud será revisada por el administrador.
//             </p>
//             <p className="text-2xl font-bold text-blue-600">
//               Para personal, jefes y roles especiales
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }