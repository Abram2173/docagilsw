// src/components/dashboard-header.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, LogOut, User, Menu, Lightbulb, CircleCheck } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
  role: string;
  onMenuToggle: () => void;
}

export function DashboardHeader({ userName, role, onMenuToggle }: DashboardHeaderProps) {
  const [notificationCount] = useState(3);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <header className="relative border-b border-sky-200/30 bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 px-4 lg:px-6 py-4 shadow-lg">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />

      <div className="relative flex items-center justify-between">

        {/* IZQUIERDA: LOGO DART + MENÚ MÓVIL */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/20"
            onClick={onMenuToggle}
          >
            <Menu className="h-8 w-8" />
          </Button>

          <div className="flex items-center gap-3">
        {/* LOGO DART OFICIAL */}
        <div className="flex items-center gap-3 group">


          <div className="flex items-baseline">
            <span className="text-4xl sm:text-3xl md:text-5xl font-bold text-[#000000]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              D
            </span>
            <span className="text-2xl sm:text-3xl md:text-3xl font-black text-[#000000] tracking-wider" style={{ fontFamily: "'Norwester', sans-serif", letterSpacing: "0.12em" }}>
              ART
            </span>
          </div>

            <div className="relative">
            <Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#ffffff] fill-[#0EA5E9] animate-pulse-slow" />
            <CircleCheck className="w-5 h-5 text-[#ffffff] absolute -top-1 -right-1" />
            
          </div>
        </div>
          </div>
        </div>

        {/* DERECHA: USUARIO + NOTIFICACIONES + MENÚ */}
        <div className="flex items-center gap-4">

          {/* NOTIFICACIONES */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Bell className="h-6 w-6" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs font-bold">
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* AVATAR + MENÚ DESPLEGABLE */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 rounded-full bg-white/20 px-4 py-2 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">Hola, {userName || 'Usuario'}</p>
                <Badge variant="secondary" className="text-xs bg-white/30 text-white">
                  {role}
                </Badge>
              </div>
              <div className="h-10 w-10 rounded-full bg-white/40 flex items-center justify-center ring-2 ring-white/60">
                <User className="h-6 w-6 text-white" />
              </div>
            </button>

            {/* MENÚ DESPLEGABLE */}
            {showUserMenu && (
              <div className="absolute right-0 top-14 z-50 w-64 rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
                <div className="px-4 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white">
                  <p className="font-bold text-lg">{userName || 'Usuario'}</p>
                  <p className="text-sm opacity-90">{role}</p>
                </div>

                <button
                  onClick={() => { setShowUserMenu(false); navigate("/cuenta"); }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <User className="h-5 w-5" /> Mi Perfil
                </button>

                <hr className="border-slate-200" />

                <button
                  onClick={() => { setShowUserMenu(false); handleLogout(); }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                  <LogOut className="h-5 w-5" /> Cerrar Sesión
                </button>
              </div>
            )}
          </div>

          {/* BOTÓN SALIR (opcional, si quieres mantenerlo visible) */}
        </div>
      </div>
    </header>
  );
}