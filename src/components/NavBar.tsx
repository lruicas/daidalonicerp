import { useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  CalendarDays,
  ShoppingCart,
  Package,
  Users,
  ChevronDown,
  Building2,
  Handshake,
  UserCheck,
} from "lucide-react";

const mainLinks = [
  { label: "Dashboard", icon: LayoutDashboard, href: "#" },
  { label: "Presupuestos", icon: Wallet, href: "#" },
  { label: "Eventos Económicos", icon: CalendarDays, href: "#" },
  { label: "Pedidos", icon: ShoppingCart, href: "#" },
  { label: "Inventario", icon: Package, href: "#" },
];

const directoryLinks = [
  { label: "Empresas", icon: Building2, href: "#" },
  { label: "Patrocinadores / Colaboradores", icon: Handshake, href: "#" },
  { label: "Miembros", icon: UserCheck, href: "#" },
];

const NavBar = () => {
  const [dirOpen, setDirOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");

  return (
    <nav className="relative" style={{ backgroundColor: "hsl(168, 45%, 42%)" }}>
      <div className="flex items-center gap-1 px-8 py-3">
        {mainLinks.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setActive(label)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-primary-foreground transition-opacity ${
              active === label ? "opacity-100 bg-primary-foreground/10" : "opacity-70 hover:opacity-100"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.5} />
            {label}
          </button>
        ))}

        {/* Directorios dropdown */}
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
              {directoryLinks.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => {
                    setActive(label);
                    setDirOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-opacity hover:opacity-70"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
