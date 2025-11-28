// src/components/dashboard-header.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, LogOut, User, Settings, Menu, Lightbulb, Sparkles } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
  role: string;
  onMenuToggle: () => void;
}

export function DashboardHeader({ userName, role, onMenuToggle }: DashboardHeaderProps) {
  const [notificationCount] = useState(3);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  // ← AHORA SÍ VA A /auth (PÁGINA DE LOGIN)
  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");  // ← ESTO ES LO QUE QUERÍAS
  };

  return (
    <header className="relative border-b border-sky-200/30 bg-gradient-to-r from-neutral-100 via-sky-600 to-sky-500 px-4 lg:px-6 py-4 shadow-lg">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

      <div className="relative flex items-center justify-between">
                  {/* BOTÓN MENÚ - SOLO EN MÓVIL */}
<Button
  variant="ghost"
  size="icon"
  className="lg:hidden text-black hover:bg-black/10 rounded-lg"
  onClick={onMenuToggle}
>
  <Menu className="h-14 w-14" />
</Button>

        {/* LOGO DART OFICIAL */}
        <div className="flex items-center gap-3 group">
          <div className="relative">
            <Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#0EA5E9] fill-[#0EA5E9] animate-pulse-slow" />
            <Sparkles className="w-5 h-5 text-[#10B981] absolute -top-1 -right-1 animate-bounce-slow" />
          </div>

          <div className="flex items-baseline">
            <span className="text-4xl sm:text-3xl md:text-5xl font-bold text-[#000000]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              D
            </span>
            <span className="text-2xl sm:text-3xl md:text-3xl font-black text-[#000000] tracking-wider" style={{ fontFamily: "'Norwester', sans-serif", letterSpacing: "0.12em" }}>
              ART
            </span>
          </div>
        </div>



                  {/* USUARIO */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
          <p className="hidden sm:block text-lg font-semibold text-white">
            Hola, {userName || 'Usuario'}
          </p>

          <Badge 
            variant="secondary" 
            className="hidden sm:inline bg-white/20 text-white backdrop-blur-sm"
          >
            {role}
          </Badge>

          </div>
          <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* NOTIFICACIONES + MENÚ + SALIR */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Bell className="h-5 w-5" />
            </Button>
            {notificationCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs font-bold">
                {notificationCount}
              </Badge>
            )}
          </div>

          {/* MENÚ USUARIO */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setShowUserMenu(!showUserMenu)}>
              <Settings className="h-5 w-5" />
            </Button>

            {showUserMenu && (
              <div className="absolute right-0 top-12 z-50 w-48 rounded-lg border border-slate-200 bg-white shadow-lg">
                <button
                  onClick={() => { setShowUserMenu(false); navigate("/cuenta"); }}
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100"
                >
                  <User className="h-4 w-4" /> Mi Cuenta
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" /> Cerrar Sesión
                </button>
              </div>
            )}
          </div>

{/* BOTÓN SALIR → VA AL INICIO (LANDING) */}
<Button 
  variant="ghost" 
  size="sm" 
  onClick={() => {
    localStorage.clear();           // Borra todo
    navigate("/");                  // ← VA AL INICIO (Landing)
  }} 
  className="gap-2 text-white hover:bg-white/20 transition-all"
>
  <LogOut className="h-4 w-4" />
  <span className="hidden md:inline font-semibold">Salir</span>
</Button>
        </div>
      </div>
    </header>
  );
}