export type Section = "E-Software" | "E-Hardware" | "Diseño" | "RRPP-Marketing" | "RRPP-Corporativa";
export type Priority = "Alta" | "Media" | "Baja";
export type OrderStatus = "Pendiente" | "En proceso" | "Terminado";

export interface BudgetRow {
  id: string;
  nombre: string;
  descripcion: string;
  seccion: Section;
  empresa: string;
  referencia: string;
  enlace: string;
  unidades: number;
  precioUnitario: number;
  precioTotal: number;
  inventariable: boolean;
  comentarioCoordinador: string;
  prioridad: Priority;
  pedido: string;
  estadoPedido: OrderStatus;
  eventoEconomico: string[];
  fecha: string;
}

export const SECTIONS: Section[] = ["E-Software", "E-Hardware", "Diseño", "RRPP-Marketing", "RRPP-Corporativa"];
export const PRIORITIES: Priority[] = ["Alta", "Media", "Baja"];
export const ORDERS = ["PED-001", "PED-002", "PED-003", "PED-004", "PED-005"];
export const EVENTS = ["Feria Tech 2026", "Hackathon Spring", "Gala Anual", "Workshop IA", "Congreso Diseño"];
export const COMPANIES = ["TechCorp S.L.", "Diseños Martín", "Hardware Pro", "Marketing360", "EventosPro"];

export const COLUMNS = [
  "Nombre", "Descripción", "Sección", "Empresa", "Referencia", "Enlace",
  "Unidades", "Precio unit. (IVA)", "Precio total (IVA)", "Inventariable",
  "Comentario coordinador", "Prioridad", "Pedido", "Estado pedido",
  "Evento económico", "Fecha",
];

export const mockBudgets: BudgetRow[] = [
  {
    id: "1", nombre: "Licencia Adobe CC", descripcion: "Suite completa anual", seccion: "Diseño",
    empresa: "TechCorp S.L.", referencia: "REF-2026-001", enlace: "https://adobe.com",
    unidades: 5, precioUnitario: 726.00, precioTotal: 3630.00, inventariable: false,
    comentarioCoordinador: "Renovación urgente", prioridad: "Alta", pedido: "PED-001",
    estadoPedido: "Pendiente", eventoEconomico: ["Feria Tech 2026"], fecha: "2026-03-15",
  },
  {
    id: "2", nombre: "Monitor 4K 27\"", descripcion: "Para sala de diseño", seccion: "E-Hardware",
    empresa: "Hardware Pro", referencia: "REF-2026-002", enlace: "https://amazon.es",
    unidades: 3, precioUnitario: 483.89, precioTotal: 1451.67, inventariable: true,
    comentarioCoordinador: "", prioridad: "Media", pedido: "PED-002",
    estadoPedido: "En proceso", eventoEconomico: ["Hackathon Spring"], fecha: "2026-04-01",
  },
  {
    id: "3", nombre: "Hosting AWS", descripcion: "Servidor producción", seccion: "E-Software",
    empresa: "TechCorp S.L.", referencia: "REF-2026-003", enlace: "https://aws.amazon.com",
    unidades: 1, precioUnitario: 1200.00, precioTotal: 1200.00, inventariable: false,
    comentarioCoordinador: "Evaluar alternativas", prioridad: "Alta", pedido: "PED-003",
    estadoPedido: "Terminado", eventoEconomico: ["Feria Tech 2026", "Hackathon Spring"], fecha: "2026-02-10",
  },
  {
    id: "4", nombre: "Merchandising", descripcion: "Camisetas y tazas corporativas", seccion: "RRPP-Marketing",
    empresa: "Marketing360", referencia: "REF-2026-004", enlace: "",
    unidades: 200, precioUnitario: 8.50, precioTotal: 1700.00, inventariable: true,
    comentarioCoordinador: "Pedir muestras primero", prioridad: "Baja", pedido: "",
    estadoPedido: "Pendiente", eventoEconomico: ["Gala Anual"], fecha: "2026-05-20",
  },
  {
    id: "5", nombre: "Catering evento", descripcion: "Servicio para 80 personas", seccion: "RRPP-Corporativa",
    empresa: "EventosPro", referencia: "REF-2026-005", enlace: "https://eventospro.es",
    unidades: 1, precioUnitario: 2400.00, precioTotal: 2400.00, inventariable: false,
    comentarioCoordinador: "Confirmar menú vegetariano", prioridad: "Media", pedido: "PED-004",
    estadoPedido: "En proceso", eventoEconomico: ["Gala Anual", "Congreso Diseño"], fecha: "2026-06-10",
  },
  {
    id: "6", nombre: "Teclados mecánicos", descripcion: "Para equipo desarrollo", seccion: "E-Hardware",
    empresa: "Hardware Pro", referencia: "REF-2026-006", enlace: "https://pccomponentes.com",
    unidades: 10, precioUnitario: 89.99, precioTotal: 899.90, inventariable: true,
    comentarioCoordinador: "", prioridad: "Baja", pedido: "PED-005",
    estadoPedido: "Pendiente", eventoEconomico: [], fecha: "2026-07-01",
  },
];
