// // src/components/AccessDenied.tsx
// import { Button } from "@/components/ui/button";
// import { AlertCircle } from "lucide-react";

// export default function AccessDenied() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="text-center p-10 bg-white rounded-3xl shadow-2xl max-w-md">
//         <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
//         <h1 className="text-3xl font-bold text-gray-800 mb-4">Acceso Denegado</h1>
//         <p className="text-lg text-gray-600 mb-8">
//           No tienes permiso para acceder a este panel.<br />
//           Tu rol no está autorizado para esta sección.
//         </p>
//         <Button 
//           onClick={() => window.location.href = "/dashboard"}
//           className="bg-blue-600 hover:bg-blue-700 text-white"
//         >
//           Volver al Dashboard
//         </Button>
//       </div>
//     </div>
//   );
// }