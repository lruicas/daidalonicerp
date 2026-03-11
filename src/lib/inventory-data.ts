import type { Section } from "./budget-data";

export type InventoryStatus = "Nuevo" | "Funciona" | "Averiado" | "Roto";

export const INVENTORY_STATUSES: InventoryStatus[] = ["Nuevo", "Funciona", "Averiado", "Roto"];

export const MEMBERS = [
  "Carlos García",
  "Ana Martínez",
  "Pedro López",
  "Laura Sánchez",
  "Miguel Torres",
  "Sofía Ruiz",
  "Javier Fernández",
  "Elena Díaz",
];

export interface InventoryItem {
  id: string;
  nombre: string;
  unidades: number;
  ubicacion: string;
  responsable: string;
  estado: InventoryStatus;
  seccion: Section;
  enlace: string;
  observaciones: string;
  fecha: string;
  fotoUrl: string;
  presupuestoId: string;
}

export const mockInventory: InventoryItem[] = [
  {
    id: "INV-001",
    nombre: "Monitor 4K 27\"",
    unidades: 3,
    ubicacion: "Sala Diseño, mesa principal",
    responsable: "Ana Martínez",
    estado: "Nuevo",
    seccion: "E-Hardware",
    enlace: "https://amazon.es/monitor-4k",
    observaciones: "Recibidos en perfecto estado",
    fecha: "2026-04-05",
    fotoUrl: "",
    presupuestoId: "2",
  },
  {
    id: "INV-002",
    nombre: "Teclado mecánico Cherry MX",
    unidades: 10,
    ubicacion: "Armario 3, cajón 2",
    responsable: "Pedro López",
    estado: "Funciona",
    seccion: "E-Hardware",
    enlace: "https://pccomponentes.com/teclado",
    observaciones: "",
    fecha: "2026-07-05",
    fotoUrl: "",
    presupuestoId: "6",
  },
  {
    id: "INV-003",
    nombre: "Camisetas corporativas",
    unidades: 150,
    ubicacion: "Almacén B, estantería 1",
    responsable: "Laura Sánchez",
    estado: "Nuevo",
    seccion: "RRPP-Marketing",
    enlace: "",
    observaciones: "Tallas S-XL surtidas",
    fecha: "2026-05-25",
    fotoUrl: "",
    presupuestoId: "4",
  },
  {
    id: "INV-004",
    nombre: "Router WiFi 6",
    unidades: 2,
    ubicacion: "Rack servidor, planta 2",
    responsable: "Miguel Torres",
    estado: "Funciona",
    seccion: "E-Hardware",
    enlace: "https://amazon.es/router",
    observaciones: "Firmware actualizado a v3.2",
    fecha: "2026-01-15",
    fotoUrl: "",
    presupuestoId: "",
  },
  {
    id: "INV-005",
    nombre: "Proyector Epson",
    unidades: 1,
    ubicacion: "Sala de reuniones A",
    responsable: "Carlos García",
    estado: "Averiado",
    seccion: "E-Hardware",
    enlace: "",
    observaciones: "Lámpara fundida, pendiente de repuesto",
    fecha: "2025-09-10",
    fotoUrl: "",
    presupuestoId: "",
  },
  {
    id: "INV-006",
    nombre: "Roll-up corporativo",
    unidades: 4,
    ubicacion: "Almacén B, estantería 3",
    responsable: "Sofía Ruiz",
    estado: "Roto",
    seccion: "RRPP-Corporativa",
    enlace: "",
    observaciones: "2 de 4 con pie roto",
    fecha: "2025-11-20",
    fotoUrl: "",
    presupuestoId: "",
  },
];
