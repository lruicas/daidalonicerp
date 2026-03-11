import { useState } from "react";
// Header uses Poppins for branding
import { User } from "lucide-react";

const Header = () => {
  const [role, setRole] = useState<"Presidente" | "Miembro">("Presidente");

  const toggleRole = () => {
    setRole(prev => (prev === "Presidente" ? "Miembro" : "Presidente"));
  };

  return (
    <header
      className="px-8 py-5 flex items-center justify-between"
      style={{ background: "linear-gradient(135deg, hsl(168, 62%, 55%), hsl(40, 95%, 62%), hsl(340, 82%, 65%))" }}
    >
      <h1 className="text-2xl font-light tracking-wide text-primary-foreground">
        Daidalonic <span className="font-semibold">ERP</span>
      </h1>

      <button
        onClick={toggleRole}
        className="flex items-center gap-2 rounded-full bg-card/20 backdrop-blur-sm border border-primary-foreground/30 px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-80"
      >
        <User className="h-4 w-4" strokeWidth={1.5} />
        Cambiar vista: {role}
      </button>
    </header>
  );
};

export default Header;
