import { createContext, useContext, useState, ReactNode } from "react";

export type Role =
  | "Presidente"
  | "Gestor económico"
  | "Coordinador de sección"
  | "Coordinador de proyecto"
  | "Miembro";

export const ALL_ROLES: Role[] = [
  "Presidente",
  "Gestor económico",
  "Coordinador de sección",
  "Coordinador de proyecto",
  "Miembro",
];

interface Permissions {
  canEditInventario: boolean;
  canEditPresupuestos: boolean;
  canEditPedidos: boolean;
  canEditEventos: boolean;
  isAdmin: boolean;
  /** Legacy — true if role has any write permission */
  canEdit: boolean;
}

interface RoleContextType extends Permissions {
  role: Role;
  setRole: (r: Role) => void;
  /** @deprecated use setRole */
  toggleRole: () => void;
}

function permissionsFor(role: Role): Permissions {
  switch (role) {
    case "Presidente":
      return { canEditInventario: true, canEditPresupuestos: true, canEditPedidos: true, canEditEventos: true, isAdmin: true, canEdit: true };
    case "Gestor económico":
      return { canEditInventario: true, canEditPresupuestos: true, canEditPedidos: true, canEditEventos: true, isAdmin: false, canEdit: true };
    case "Coordinador de sección":
      return { canEditInventario: true, canEditPresupuestos: true, canEditPedidos: false, canEditEventos: false, isAdmin: false, canEdit: true };
    case "Coordinador de proyecto":
    case "Miembro":
    default:
      return { canEditInventario: false, canEditPresupuestos: false, canEditPedidos: false, canEditEventos: false, isAdmin: false, canEdit: false };
  }
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<Role>("Presidente");
  const perms = permissionsFor(role);

  const setRole = (r: Role) => setRoleState(r);
  const toggleRole = () => {
    const idx = ALL_ROLES.indexOf(role);
    setRoleState(ALL_ROLES[(idx + 1) % ALL_ROLES.length]);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, toggleRole, ...perms }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
};
