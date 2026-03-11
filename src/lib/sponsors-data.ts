export type SponsorType = "Universidad" | "Empresa" | "Fondo de inversión" | "Cátedra" | "Particular" | "Profesor particular";
export type SponsorStatus = "Terminada" | "Paralizada" | "Vigente" | "Permanente";

export const SPONSOR_TYPES: SponsorType[] = ["Universidad", "Empresa", "Fondo de inversión", "Cátedra", "Particular", "Profesor particular"];
export const SPONSOR_STATUSES: SponsorStatus[] = ["Terminada", "Paralizada", "Vigente", "Permanente"];

export interface Sponsor {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: SponsorType;
  estado: SponsorStatus;
  correo: string;
  telefono: string;
  condiciones: string;
  observaciones: string;
  documentacion: string;
  fechaInicio: string;
}

export const mockSponsors: Sponsor[] = [
  {
    id: "PAT-001", nombre: "Universidad Politécnica de Valencia", descripcion: "Colaboración institucional en proyectos de I+D",
    tipo: "Universidad", estado: "Permanente", correo: "colaboraciones@upv.es", telefono: "+34 963 877 000",
    condiciones: "Cesión de espacios y difusión conjunta", observaciones: "Renovación automática anual",
    documentacion: "https://example.com/docs/upv-convenio.pdf", fechaInicio: "2023-01-15",
  },
  {
    id: "PAT-002", nombre: "Banco Santander", descripcion: "Patrocinio principal de eventos anuales",
    tipo: "Empresa", estado: "Vigente", correo: "patrocinios@santander.com", telefono: "+34 912 345 678",
    condiciones: "Visibilidad de marca en todos los eventos, mención en RRSS", observaciones: "Contrato hasta dic 2026",
    documentacion: "https://example.com/docs/santander-contrato.pdf", fechaInicio: "2025-03-01",
  },
  {
    id: "PAT-003", nombre: "Cátedra Telefónica", descripcion: "Apoyo a formación en telecomunicaciones",
    tipo: "Cátedra", estado: "Vigente", correo: "catedra@telefonica.com", telefono: "+34 900 123 456",
    condiciones: "Financiación de becas y talleres técnicos", observaciones: "",
    documentacion: "", fechaInicio: "2024-09-01",
  },
  {
    id: "PAT-004", nombre: "Capital Innova Fund", descripcion: "Fondo de inversión para startups universitarias",
    tipo: "Fondo de inversión", estado: "Paralizada", correo: "info@capitalinnova.es", telefono: "+34 611 222 333",
    condiciones: "Participación en demo days, mentoring", observaciones: "Pendiente de renovación de términos",
    documentacion: "https://example.com/docs/capitalinnova.pdf", fechaInicio: "2024-02-10",
  },
  {
    id: "PAT-005", nombre: "Prof. García Martínez", descripcion: "Asesoramiento técnico en IA y ML",
    tipo: "Profesor particular", estado: "Terminada", correo: "garcia.martinez@upv.es", telefono: "+34 655 444 333",
    condiciones: "Colaboración ad honorem", observaciones: "Finalizó en enero 2026",
    documentacion: "", fechaInicio: "2025-06-01",
  },
  {
    id: "PAT-006", nombre: "María López Ruiz", descripcion: "Donante particular para programa de becas",
    tipo: "Particular", estado: "Vigente", correo: "mlopez@gmail.com", telefono: "+34 677 888 999",
    condiciones: "Donación anual de 2.000€", observaciones: "Agradecimiento en memoria anual",
    documentacion: "", fechaInicio: "2025-01-20",
  },
];
