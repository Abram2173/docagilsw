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
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-slate-300 p-6 transform transition-transform duration-300 lg:translate-x-0 lg:static",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <nav className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              onClick={item.onClick}   // ← SOLO EJECUTA TU FUNCIÓN, NO CIERRA
              className={cn(
                "flex items-center gap-4 rounded-xl px-5 py-4 text-black cursor-pointer transition-all",
                item.isActive ? "bg-green-600 font-bold" : "hover:bg-slate-400"
              )}
            >
              {item.icon}
              <span className="text-lg">{item.label}</span>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}