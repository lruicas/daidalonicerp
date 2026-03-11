import { createContext, useContext, useState, ReactNode } from "react";

type Role = "Presidente" | "Miembro";

interface RoleContextType {
  role: Role;
  toggleRole: () => void;
  canEdit: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>("Presidente");
  const toggleRole = () => setRole(prev => (prev === "Presidente" ? "Miembro" : "Presidente"));
  const canEdit = role === "Presidente";

  return (
    <RoleContext.Provider value={{ role, toggleRole, canEdit }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
};
