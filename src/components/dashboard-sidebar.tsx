// src/components/dashboard-sidebar.tsx
import { cn } from "@/lib/utils";

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

interface DashboardSidebarProps {
  items: SidebarItem[];
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ items, isOpen, onClose }: DashboardSidebarProps) {
  return (
    <>
      {/* Overlay móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* DOCK VERTICAL – SIN CLONELEMENT PARA EVITAR ERRORES */}
<aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-20 bg-gray-50/95 backdrop-blur-lg border-r border-gray-200/60 shadow-2xl flex flex-col items-center py-8 transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:shadow-xl",
          "top-[20px] h-[calc(100vh-40px)] rounded-3xl", // rounded suave para que quede chido
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Espacio superior */}
        <div className="h-8" />

        {items.map((item, i) => (
          <div
            key={i}
            data-tooltip={item.label}
            onClick={(e) => {
              item.onClick?.(e);
              onClose(); // cierra en móvil
            }}
            className={cn(
              "dock-item w-14 h-14 rounded-[18px] grid place-items-center cursor-pointer text-[#7b8794] transition-all",
              item.isActive && "active bg-[var(--accent)] text-white shadow-[0_14px_30px_rgba(47,107,255,.30)]",
              !item.isActive && "hover:bg-[rgba(47,107,255,.08)] hover:text-[var(--accent)]"
            )}
          >
            {/* RENDERIZA EL ÍCONO DIRECTAMENTE – TU CSS LO AJUSTA A 22PX */}
            {item.icon}
          </div>
        ))}

        {/* Espaciador inferior para centrar los ítems arriba */}
        <div className="dock-spacer" />
      </aside>
    </>
  );
}