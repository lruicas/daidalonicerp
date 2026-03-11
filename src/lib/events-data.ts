export type EventStatus = "Sin comenzar" | "En progreso" | "Terminado";

export interface EconomicEvent {
  id: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  colaborador: string;
  presupuesto: number;
  estado: EventStatus;
  observaciones: string;
}

export const EVENT_STATUSES: EventStatus[] = ["Sin comenzar", "En progreso", "Terminado"];

export const SPONSORS = [
  "Banco Santander", "Telefónica", "Iberdrola", "Repsol", "Inditex",
  "CaixaBank", "BBVA", "Mapfre", "Endesa", "Acciona",
];

export const mockEvents: EconomicEvent[] = [
  {
    id: "1", nombre: "Feria Tech 2026", descripcion: "Stand y charlas en feria tecnológica",
    fechaInicio: "2026-04-10", fechaFin: "2026-04-12", colaborador: "Telefónica",
    presupuesto: 8500, estado: "En progreso", observaciones: "Confirmar ponentes antes del 20/03",
  },
  {
    id: "2", nombre: "Hackathon Spring", descripcion: "Hackathon de 48h para estudiantes",
    fechaInicio: "2026-05-01", fechaFin: "2026-05-03", colaborador: "Banco Santander",
    presupuesto: 5200, estado: "Sin comenzar", observaciones: "Pendiente reservar aula magna",
  },
  {
    id: "3", nombre: "Gala Anual", descripcion: "Cena de gala con premios y networking",
    fechaInicio: "2026-06-15", fechaFin: "2026-06-15", colaborador: "CaixaBank",
    presupuesto: 12000, estado: "Sin comenzar", observaciones: "",
  },
  {
    id: "4", nombre: "Workshop IA", descripcion: "Taller práctico de inteligencia artificial",
    fechaInicio: "2026-03-20", fechaFin: "2026-03-21", colaborador: "Iberdrola",
    presupuesto: 3000, estado: "Terminado", observaciones: "Feedback muy positivo",
  },
  {
    id: "5", nombre: "Congreso Diseño", descripcion: "Congreso internacional de diseño UX/UI",
    fechaInicio: "2026-07-05", fechaFin: "2026-07-07", colaborador: "Inditex",
    presupuesto: 9800, estado: "Sin comenzar", observaciones: "Buscar venue alternativo",
  },
  {
    id: "6", nombre: "Meetup Blockchain", descripcion: "Charla mensual sobre Web3 y blockchain",
    fechaInicio: "2026-03-28", fechaFin: "2026-03-28", colaborador: "BBVA",
    presupuesto: 1500, estado: "En progreso", observaciones: "Streaming en YouTube confirmado",
  },
];
