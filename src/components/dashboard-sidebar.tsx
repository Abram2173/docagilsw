// src/components/dashboard-sidebar.tsx
import { cn } from "@/lib/utils";

interface SidebarItem {
  label: string;
  href?: string;                    // ← ahora opcional
  icon: React.ReactNode;            // ← ahora acepta íconos de Lucide
  isActive?: boolean;               // ← para resaltar sección activa
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
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-slate-800 p-6 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="space-y-3">
          {items.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              onClick={(e) => {
                item.onClick?.(e);
                onClose(); // Cierra en móvil
              }}
              className={cn(
                "flex items-center gap-4 rounded-xl px-5 py-4 text-white transition-all cursor-pointer",
                item.isActive
                  ? "bg-green-600 shadow-lg font-semibold"
                  : "hover:bg-slate-700 hover:scale-105"
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-lg">{item.label}</span>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}