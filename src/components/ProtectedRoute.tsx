// // src/components/ProtectedRoute.tsx
// import type { JSX } from "react";
// import { Navigate } from "react-router-dom";

// interface ProtectedRouteProps {
//   children: JSX.Element;
//   allowedRoles: string[];  // roles permitidos para esta ruta
// }

// export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
//   const role = localStorage.getItem("role");

//   if (!role || !allowedRoles.includes(role)) {
//     // Si no tiene permiso, lo manda al select-role o login
//     return <Navigate to="/select-role" replace />;
//   }

//   return children;
// }