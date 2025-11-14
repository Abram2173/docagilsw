import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, LogOut, User, Settings, Menu } from "lucide-react";  // ← Agregué Menu
import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  userName: string;
  role: string;
  onMenuToggle: () => void;  // ← NUEVO: Para hamburguesa
}

export function DashboardHeader({ userName, role, onMenuToggle }: DashboardHeaderProps) {
  const [notificationCount] = useState(3);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('Logout: Token removido, yendo a home');
    navigate("/");
  };

  return (
    <header className="relative border-b border-sky-200/30 bg-gradient-to-r from-sky-500 via-sky-600 to-sky-500 px-4 lg:px-6 py-4 shadow-lg lg:pl-0">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

      <div className="relative flex items-center justify-between">
        {/* ← NUEVO: Hamburguesa solo en mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-white"
          onClick={onMenuToggle}
        >
          <Menu className="h-6 w-6" />
        </Button>

        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 animate-in zoom-in items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-white/30 duration-500">
            <User className="h-6 w-6 text-white" />
          </div>
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
<p className="text-lg font-semibold text-white">Hola, {userName || 'Usuario'}</p>  // ← FIX: Fallback si no hay nombre            <div className="flex items-center gap-2 text-sm text-white/90">
              <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm">
                {role}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white transition-all hover:bg-white/20 hover:scale-110 active:scale-95"
            >
              <Bell className="h-5 w-5" />
            </Button>
            {notificationCount > 0 && (
              <Badge className="absolute -right-1 -top-1 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-red-500 p-0 text-[10px] font-bold text-white ring-2 ring-white">
                {notificationCount}
              </Badge>
            )}
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-white transition-all hover:bg-white/20 hover:scale-110 active:scale-95"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <Settings className="h-5 w-5" />
            </Button>

            {showUserMenu && (
              <div className="absolute right-0 top-12 z-50 w-48 animate-in fade-in slide-in-from-top-2 rounded-lg border border-slate-200 bg-white shadow-lg duration-200">
                <Link
                  to="/cuenta"
                  className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-slate-100"
                >
                  <User className="h-4 w-4" />
                  Mi Cuenta
                </Link>
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="w-full px-4 py-2 text-left text-sm text-slate-500 hover:bg-slate-100"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2 bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="font-semibold">Salir</span>
          </Button>
        </div>
      </div>
    </header>
  );
}