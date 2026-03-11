export type PurchaseType = "GEA" | "Adelantado" | "A terceros";
export type OrderStatus = "Pendiente de correo" | "Proforma" | "Solicitud empezada" | "Factura" | "Terminado";
export type ShippingStatus = "No enviado" | "Problemas" | "En camino" | "Recibido";

export const ORDER_STEPS: OrderStatus[] = [
  "Pendiente de correo",
  "Proforma",
  "Solicitud empezada",
  "Factura",
  "Terminado",
];

export const PURCHASE_TYPES: PurchaseType[] = ["GEA", "Adelantado", "A terceros"];
export const SHIPPING_STATUSES: ShippingStatus[] = ["No enviado", "Problemas", "En camino", "Recibido"];

export interface Order {
  id: string;
  nombre: string;
  empresa: string;
  tipoCompra: PurchaseType;
  precioTotal: number;
  estado: OrderStatus;
  fecha: string;
  eventos: string[];
  envio: ShippingStatus;
  proformaUrl: string;
  geaUrl: string;
  facturaUrl: string;
  observaciones: string;
  observacionesTramite: string;
}

export const mockOrders: Order[] = [
  {
    id: "PED-001",
    nombre: "Licencias Adobe CC",
    empresa: "TechCorp S.L.",
    tipoCompra: "GEA",
    precioTotal: 3630.0,
    estado: "Solicitud empezada",
    fecha: "2026-03-15",
    eventos: ["Feria Tech 2026"],
    envio: "No enviado",
    proformaUrl: "proforma_adobe.pdf",
    geaUrl: "",
    facturaUrl: "",
    observaciones: "Renovación urgente de licencias",
    observacionesTramite: "Esperando aprobación de GEA",
  },
  {
    id: "PED-002",
    nombre: "Monitores 4K",
    empresa: "Hardware Pro",
    tipoCompra: "Adelantado",
    precioTotal: 1451.67,
    estado: "Factura",
    fecha: "2026-04-01",
    eventos: ["Hackathon Spring"],
    envio: "En camino",
    proformaUrl: "proforma_monitores.pdf",
    geaUrl: "gea_monitores.pdf",
    facturaUrl: "factura_monitores.pdf",
    observaciones: "Para sala de diseño",
    observacionesTramite: "",
  },
  {
    id: "PED-003",
    nombre: "Hosting AWS anual",
    empresa: "TechCorp S.L.",
    tipoCompra: "A terceros",
    precioTotal: 1200.0,
    estado: "Terminado",
    fecha: "2026-02-10",
    eventos: ["Feria Tech 2026", "Hackathon Spring"],
    envio: "Recibido",
    proformaUrl: "proforma_aws.pdf",
    geaUrl: "gea_aws.pdf",
    facturaUrl: "factura_aws.pdf",
    observaciones: "Servidor producción",
    observacionesTramite: "Todo completado",
  },
  {
    id: "PED-004",
    nombre: "Catering Gala",
    empresa: "EventosPro",
    tipoCompra: "GEA",
    precioTotal: 2400.0,
    estado: "Proforma",
    fecha: "2026-06-10",
    eventos: ["Gala Anual", "Congreso Diseño"],
    envio: "No enviado",
    proformaUrl: "proforma_catering.pdf",
    geaUrl: "",
    facturaUrl: "",
    observaciones: "Confirmar menú vegetariano",
    observacionesTramite: "Pendiente de recibir proforma definitiva",
  },
  {
    id: "PED-005",
    nombre: "Teclados mecánicos",
    empresa: "Hardware Pro",
    tipoCompra: "Adelantado",
    precioTotal: 899.9,
    estado: "Pendiente de correo",
    fecha: "2026-07-01",
    eventos: [],
    envio: "No enviado",
    proformaUrl: "",
    geaUrl: "",
    facturaUrl: "",
    observaciones: "Para equipo desarrollo",
    observacionesTramite: "",
  },
  {
    id: "PED-006",
    nombre: "Merchandising corporativo",
    empresa: "Marketing360",
    tipoCompra: "A terceros",
    precioTotal: 1700.0,
    estado: "Pendiente de correo",
    fecha: "2026-05-20",
    eventos: ["Gala Anual"],
    envio: "No enviado",
    proformaUrl: "",
    geaUrl: "",
    facturaUrl: "",
    observaciones: "Camisetas y tazas",
    observacionesTramite: "Pedir muestras antes de confirmar",
  },
];
