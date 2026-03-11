import { User, ShieldCheck, Eye } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const { role, toggleRole, canEdit } = useRole();

  return (
    <header
      className="px-8 py-5 flex items-center justify-between"
      style={{ background: "linear-gradient(135deg, hsl(168, 62%, 55%), hsl(40, 95%, 62%), hsl(340, 82%, 65%))" }}
    >
      <h1 className="text-2xl font-light tracking-wide text-primary-foreground font-display">
        Daidalonic <span className="font-semibold">ERP</span>
      </h1>

      <div className="flex items-center gap-3">
        <Badge
          className={`text-xs font-medium border-0 transition-colors duration-300 ${
            canEdit
              ? "bg-emerald-500/20 text-emerald-100"
              : "bg-amber-500/20 text-amber-100"
          }`}
        >
          {canEdit ? (
            <><ShieldCheck className="h-3 w-3 mr-1" /> Edición activa</>
          ) : (
            <><Eye className="h-3 w-3 mr-1" /> Solo lectura</>
          )}
        </Badge>

        <button
          onClick={toggleRole}
          className="flex items-center gap-2 rounded-full bg-card/20 backdrop-blur-sm border border-primary-foreground/30 px-5 py-2 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-card/30 active:scale-95"
        >
          <User className="h-4 w-4" strokeWidth={1.5} />
          Cambiar vista: {role}
        </button>
      </div>
    </header>
  );
};

export default Header;
