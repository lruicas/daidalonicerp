import type { Section } from "./budget-data";

export type RelacionUPV =
  | "No alta - Extranjero"
  | "No alta - Europa"
  | "No alta - España"
  | "Alta - Extranjero"
  | "Alta - Europa"
  | "Alta - España"
  | "Acuerdo Marco";

export type PagoType = "Al tercero" | "Adelantado" | "Divisa";
export type FacturarType = "Factura" | "FACE";

export const RELACIONES_UPV: RelacionUPV[] = [
  "No alta - Extranjero",
  "No alta - Europa",
  "No alta - España",
  "Alta - Extranjero",
  "Alta - Europa",
  "Alta - España",
  "Acuerdo Marco",
];

export const PAGO_TYPES: PagoType[] = ["Al tercero", "Adelantado", "Divisa"];
export const FACTURAR_TYPES: FacturarType[] = ["Factura", "FACE"];

export interface Company {
  id: string;
  nombre: string;
  descripcion: string;
  cif: string;
  seccion: Section;
  relacion: RelacionUPV;
  pago: PagoType;
  correo: string;
  telefono: string;
  web: string;
  facturar: FacturarType;
  valoracion: number;
  observaciones: string;
  documentacion: string;
  fecha: string;
}

export const mockCompanies: Company[] = [
  {
    id: "EMP-001",
    nombre: "TechSupply S.L.",
    descripcion: "Proveedor de componentes electrónicos",
    cif: "B12345678",
    seccion: "E-Hardware",
    relacion: "Alta - España",
    pago: "Al tercero",
    correo: "info@techsupply.es",
    telefono: "+34 961 234 567",
    web: "https://techsupply.es",
    facturar: "Factura",
    valoracion: 8,
    observaciones: "Entrega rápida, buen servicio postventa",
    documentacion: "https://example.com/docs/techsupply.pdf",
    fecha: "2025-09-15",
  },
  {
    id: "EMP-002",
    nombre: "DesignWorks GmbH",
    descripcion: "Agencia de diseño gráfico e industrial",
    cif: "DE987654321",
    seccion: "Diseño",
    relacion: "No alta - Europa",
    pago: "Divisa",
    correo: "contact@designworks.de",
    telefono: "+49 30 1234567",
    web: "https://designworks.de",
    facturar: "FACE",
    valoracion: 7,
    observaciones: "Trabajan en EUR, plazo 30 días",
    documentacion: "",
    fecha: "2025-10-02",
  },
  {
    id: "EMP-003",
    nombre: "CloudNet Inc.",
    descripcion: "Servicios cloud y hosting",
    cif: "US-123456",
    seccion: "E-Software",
    relacion: "No alta - Extranjero",
    pago: "Adelantado",
    correo: "sales@cloudnet.com",
    telefono: "+1 555 0199",
    web: "https://cloudnet.com",
    facturar: "Factura",
    valoracion: 9,
    observaciones: "SLA 99.9%, facturación mensual",
    documentacion: "https://example.com/docs/cloudnet-sla.pdf",
    fecha: "2025-11-20",
  },
  {
    id: "EMP-004",
    nombre: "MediaPro Comunicación",
    descripcion: "Producción audiovisual y RRPP",
    cif: "A87654321",
    seccion: "RRPP-Marketing",
    relacion: "Alta - España",
    pago: "Al tercero",
    correo: "hola@mediapro.com",
    telefono: "+34 600 123 456",
    web: "https://mediapro.com",
    facturar: "FACE",
    valoracion: 6,
    observaciones: "Acuerdo anual vigente hasta dic 2026",
    documentacion: "",
    fecha: "2025-08-10",
  },
  {
    id: "EMP-005",
    nombre: "Corporativa Partners",
    descripcion: "Consultoría de relaciones institucionales",
    cif: "B55667788",
    seccion: "RRPP-Corporativa",
    relacion: "Acuerdo Marco",
    pago: "Al tercero",
    correo: "info@corppartners.es",
    telefono: "+34 912 345 678",
    web: "https://corppartners.es",
    facturar: "Factura",
    valoracion: 10,
    observaciones: "",
    documentacion: "https://example.com/docs/acuerdo-marco.pdf",
    fecha: "2026-01-05",
  },
];
