import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Wallet, CalendarDays, ShoppingCart, Package,
  Users, ChevronDown, Building2, Handshake, UserCheck, Settings,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

const mainLinks = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "Presupuestos", icon: Wallet, to: "/presupuestos" },
  { label: "Eventos Económicos", icon: CalendarDays, to: "/eventos-economicos" },
  { label: "Pedidos", icon: ShoppingCart, to: "/pedidos-orders" },
  { label: "Inventario", icon: Package, to: "/inventario" },
];

const directoryLinks = [
  { label: "Empresas", icon: Building2, to: "/empresas" },
  { label: "Patrocinadores / Colaboradores", icon: Handshake, to: "/patrocinadores" },
  { label: "Miembros", icon: UserCheck, to: "/miembros" },
];

const NavBar = () => {
  const [dirOpen, setDirOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="relative" style={{ backgroundColor: "hsl(168, 45%, 42%)" }}>
      <div className="flex items-center gap-1 px-8 py-3">
        {mainLinks.map(({ label, icon: Icon, to }) => (
          <Link
            key={label}
            to={to}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-primary-foreground transition-opacity ${
              pathname === to ? "opacity-100 bg-primary-foreground/10" : "opacity-70 hover:opacity-100"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.5} />
            {label}
          </Link>
        ))}

        <div className="relative">
          <button
            onClick={() => setDirOpen(!dirOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-primary-foreground transition-opacity ${
              dirOpen ? "opacity-100 bg-primary-foreground/10" : "opacity-70 hover:opacity-100"
            }`}
          >
            <Users className="h-4 w-4" strokeWidth={1.5} />
            Directorios
            <ChevronDown className={`h-3 w-3 transition-transform ${dirOpen ? "rotate-180" : ""}`} strokeWidth={1.5} />
          </button>

          {dirOpen && (
            <div className="absolute top-full left-0 mt-1 min-w-[260px] rounded-lg bg-card shadow-lg border border-border z-50 py-1">
              {directoryLinks.map(({ label, icon: Icon, to }) => (
                <Link
                  key={label}
                  to={to}
                  onClick={() => setDirOpen(false)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-opacity hover:opacity-70"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
