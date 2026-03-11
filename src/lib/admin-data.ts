export interface AccessUser {
  id: string;
  nombre: string;
  correoUpv: string;
  rol: "Presidente" | "Gestor económico" | "Coordinador de sección" | "Coordinador de proyecto" | "Miembro";
  activo: boolean;
}

export const ADMIN_ROLES: AccessUser["rol"][] = [
  "Presidente",
  "Gestor económico",
  "Coordinador de sección",
  "Coordinador de proyecto",
  "Miembro",
];

export const mockAccessUsers: AccessUser[] = [
  { id: "MBR-001", nombre: "Carlos Martínez López", correoUpv: "carmarlo@upv.es", rol: "Presidente", activo: true },
  { id: "MBR-002", nombre: "Laura García Fernández", correoUpv: "laugarfe@upv.es", rol: "Coordinador de sección", activo: true },
  { id: "MBR-003", nombre: "Ahmed Ben Salah", correoUpv: "ahbesa@upv.es", rol: "Coordinador de proyecto", activo: true },
  { id: "MBR-004", nombre: "Elena Ruiz Sánchez", correoUpv: "elruisa@upv.es", rol: "Miembro", activo: true },
  { id: "MBR-005", nombre: "James O'Brien", correoUpv: "jaobri@upv.es", rol: "Miembro", activo: false },
  { id: "MBR-006", nombre: "Ana Pérez Gómez", correoUpv: "anpergo@upv.es", rol: "Gestor económico", activo: true },
];

export interface ActivityPoint {
  dia: string;
  logins: number;
  acciones: number;
}

export const mockActivity: ActivityPoint[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return {
    dia: d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" }),
    logins: Math.floor(Math.random() * 15) + 2,
    acciones: Math.floor(Math.random() * 30) + 5,
  };
});

export interface ModuleUsage {
  modulo: string;
  usos: number;
}

export const mockModuleUsage: ModuleUsage[] = [
  { modulo: "Presupuestos", usos: 142 },
  { modulo: "Pedidos", usos: 118 },
  { modulo: "Inventario", usos: 95 },
  { modulo: "Eventos", usos: 73 },
  { modulo: "Empresas", usos: 54 },
  { modulo: "Miembros", usos: 41 },
];

export interface VersionEntry {
  version: string;
  fecha: string;
  descripcion: string;
}

export const mockVersions: VersionEntry[] = [
  { version: "v2.3.0", fecha: "2026-03-10", descripcion: "Panel de Administración y gestión de accesos" },
  { version: "v2.2.0", fecha: "2026-02-20", descripcion: "Importación/exportación Excel en módulos" },
  { version: "v2.1.0", fecha: "2026-01-15", descripcion: "Añadido OCR en facturas y recibos" },
  { version: "v2.0.0", fecha: "2025-11-01", descripcion: "Migración de BBDD y nuevo diseño" },
  { version: "v1.5.0", fecha: "2025-09-10", descripcion: "Módulo de patrocinadores y colaboradores" },
  { version: "v1.0.0", fecha: "2025-06-01", descripcion: "Lanzamiento inicial del ERP" },
];

export interface BackupEntry {
  id: string;
  fecha: string;
  tamano: string;
  estado: "Completada" | "Fallida";
}

export const mockBackups: BackupEntry[] = [
  { id: "BK-010", fecha: "2026-03-10 02:00", tamano: "1.2 GB", estado: "Completada" },
  { id: "BK-009", fecha: "2026-03-03 02:00", tamano: "1.1 GB", estado: "Completada" },
  { id: "BK-008", fecha: "2026-02-24 02:00", tamano: "1.1 GB", estado: "Completada" },
  { id: "BK-007", fecha: "2026-02-17 02:00", tamano: "980 MB", estado: "Fallida" },
  { id: "BK-006", fecha: "2026-02-10 02:00", tamano: "1.0 GB", estado: "Completada" },
  { id: "BK-005", fecha: "2026-02-03 02:00", tamano: "990 MB", estado: "Completada" },
  { id: "BK-004", fecha: "2026-01-27 02:00", tamano: "950 MB", estado: "Completada" },
  { id: "BK-003", fecha: "2026-01-20 02:00", tamano: "940 MB", estado: "Completada" },
  { id: "BK-002", fecha: "2026-01-13 02:00", tamano: "920 MB", estado: "Fallida" },
  { id: "BK-001", fecha: "2026-01-06 02:00", tamano: "910 MB", estado: "Completada" },
];
