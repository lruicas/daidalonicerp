import type { Section } from "./budget-data";

export type MemberStatus = "Presidente" | "Coordinador de sección" | "Coordinador de proyecto" | "Miembro";
export type IdType = "DNI/NIF" | "NIE" | "PASS";

export const MEMBER_STATUSES: MemberStatus[] = ["Presidente", "Coordinador de sección", "Coordinador de proyecto", "Miembro"];
export const ID_TYPES: IdType[] = ["DNI/NIF", "NIE", "PASS"];

export interface Member {
  id: string;
  nombre: string;
  apellidos: string;
  seccion: Section;
  estatus: MemberStatus;
  titulacion: string;
  centro: string;
  anioUniversitario: number;
  telefono: string;
  correoUpv: string;
  correoPersonal: string;
  cumpleanos: string;
  tipoId: IdType;
  numeroId: string;
  fechaEntrada: string;
  fechaSalida: string;
}

export const mockMembers: Member[] = [
  {
    id: "MBR-001", nombre: "Carlos", apellidos: "Martínez López", seccion: "E-Software",
    estatus: "Presidente", titulacion: "Ing. Informática", centro: "ETSINF", anioUniversitario: 4,
    telefono: "+34 612 345 678", correoUpv: "carmarlo@upv.es", correoPersonal: "carlos.ml@gmail.com",
    cumpleanos: "1999-05-12", tipoId: "DNI/NIF", numeroId: "12345678A",
    fechaEntrada: "2022-09-01", fechaSalida: "",
  },
  {
    id: "MBR-002", nombre: "Laura", apellidos: "García Fernández", seccion: "Diseño",
    estatus: "Coordinador de sección", titulacion: "Bellas Artes", centro: "Facultad BBAA", anioUniversitario: 3,
    telefono: "+34 655 111 222", correoUpv: "laugarfe@upv.es", correoPersonal: "laura.gf@outlook.com",
    cumpleanos: "2000-11-30", tipoId: "DNI/NIF", numeroId: "87654321B",
    fechaEntrada: "2023-02-15", fechaSalida: "",
  },
  {
    id: "MBR-003", nombre: "Ahmed", apellidos: "Ben Salah", seccion: "E-Hardware",
    estatus: "Coordinador de proyecto", titulacion: "Ing. Electrónica", centro: "ETSIT", anioUniversitario: 2,
    telefono: "+34 677 333 444", correoUpv: "ahbesa@upv.es", correoPersonal: "ahmed.bs@gmail.com",
    cumpleanos: "2001-03-22", tipoId: "NIE", numeroId: "X1234567C",
    fechaEntrada: "2024-01-10", fechaSalida: "",
  },
  {
    id: "MBR-004", nombre: "Elena", apellidos: "Ruiz Sánchez", seccion: "RRPP-Marketing",
    estatus: "Miembro", titulacion: "ADE + Marketing", centro: "FADE", anioUniversitario: 2,
    telefono: "+34 688 555 666", correoUpv: "elruisa@upv.es", correoPersonal: "elena.rs@yahoo.es",
    cumpleanos: "2002-07-08", tipoId: "DNI/NIF", numeroId: "11223344D",
    fechaEntrada: "2024-09-01", fechaSalida: "",
  },
  {
    id: "MBR-005", nombre: "James", apellidos: "O'Brien", seccion: "RRPP-Corporativa",
    estatus: "Miembro", titulacion: "Business Admin", centro: "FADE", anioUniversitario: 1,
    telefono: "+34 699 777 888", correoUpv: "jaobri@upv.es", correoPersonal: "james.ob@gmail.com",
    cumpleanos: "2003-01-15", tipoId: "PASS", numeroId: "UK-9876543",
    fechaEntrada: "2025-09-01", fechaSalida: "",
  },
  {
    id: "MBR-006", nombre: "Ana", apellidos: "Pérez Gómez", seccion: "E-Software",
    estatus: "Miembro", titulacion: "Ing. Informática", centro: "ETSINF", anioUniversitario: 3,
    telefono: "+34 611 999 000", correoUpv: "anpergo@upv.es", correoPersonal: "ana.pg@gmail.com",
    cumpleanos: "2000-09-25", tipoId: "DNI/NIF", numeroId: "55667788E",
    fechaEntrada: "2023-09-01", fechaSalida: "2025-06-30",
  },
];
