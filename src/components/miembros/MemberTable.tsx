import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/contexts/RoleContext";
import { SECTIONS } from "@/lib/budget-data";
import { MEMBER_STATUSES, ID_TYPES } from "@/lib/members-data";
import type { Member, MemberStatus, IdType } from "@/lib/members-data";
import type { Section } from "@/lib/budget-data";

interface MemberTableProps {
  items: Member[];
  onUpdate: (updated: Member) => void;
}

const STATUS_COLORS: Record<MemberStatus, string> = {
  Presidente: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  "Coordinador de sección": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "Coordinador de proyecto": "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  Miembro: "bg-gray-100 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300",
};

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("es-ES") : "—";

const MemberTable = ({ items, onUpdate }: MemberTableProps) => {
  const { role } = useRole();
  const canEdit = role === "Presidente";
  const [editingId, setEditingId] = useState<string | null>(null);

  const startEdit = (id: string) => { if (canEdit) setEditingId(id); };
  const patch = (item: Member, updates: Partial<Member>) => onUpdate({ ...item, ...updates });
  const isEditing = (id: string) => editingId === id && canEdit;

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Nombre</TableHead>
            <TableHead className="font-semibold">Sección</TableHead>
            <TableHead className="font-semibold">Estatus</TableHead>
            <TableHead className="font-semibold">Titulación</TableHead>
            <TableHead className="font-semibold">Centro</TableHead>
            <TableHead className="font-semibold">Año</TableHead>
            <TableHead className="font-semibold">Teléfono</TableHead>
            <TableHead className="font-semibold">Correo UPV</TableHead>
            <TableHead className="font-semibold">Correo personal</TableHead>
            <TableHead className="font-semibold">Cumpleaños</TableHead>
            <TableHead className="font-semibold">Identificación</TableHead>
            <TableHead className="font-semibold">Entrada</TableHead>
            <TableHead className="font-semibold">Salida</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const ed = isEditing(item.id);
            return (
              <TableRow key={item.id} className="group cursor-pointer hover:bg-muted/40 transition-colors" onDoubleClick={() => startEdit(item.id)}>
                {/* Nombre + Apellidos */}
                <TableCell>
                  {ed ? (
                    <div className="space-y-1">
                      <Input value={item.nombre} onChange={(e) => patch(item, { nombre: e.target.value })} className="h-8 text-sm" autoFocus />
                      <Input value={item.apellidos} onChange={(e) => patch(item, { apellidos: e.target.value })} className="h-7 text-xs" placeholder="Apellidos" />
                    </div>
                  ) : (
                    <div>
                      <span className="font-medium text-sm">{item.nombre} {item.apellidos}</span>
                    </div>
                  )}
                </TableCell>

                {/* Sección */}
                <TableCell>
                  {ed ? (
                    <Select value={item.seccion} onValueChange={(v) => patch(item, { seccion: v as Section })}>
                      <SelectTrigger className="h-8 text-xs w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>{SECTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  ) : (
                    <span className="text-xs text-muted-foreground">{item.seccion}</span>
                  )}
                </TableCell>

                {/* Estatus */}
                <TableCell>
                  {ed ? (
                    <Select value={item.estatus} onValueChange={(v) => patch(item, { estatus: v as MemberStatus })}>
                      <SelectTrigger className="h-8 text-xs w-40"><SelectValue /></SelectTrigger>
                      <SelectContent>{MEMBER_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="outline" className={`text-xs font-medium border-0 whitespace-nowrap ${STATUS_COLORS[item.estatus]}`}>
                      {item.estatus}
                    </Badge>
                  )}
                </TableCell>

                {/* Titulación */}
                <TableCell>
                  {ed ? <Input value={item.titulacion} onChange={(e) => patch(item, { titulacion: e.target.value })} className="h-8 text-xs w-36" />
                    : <span className="text-xs">{item.titulacion}</span>}
                </TableCell>

                {/* Centro */}
                <TableCell>
                  {ed ? <Input value={item.centro} onChange={(e) => patch(item, { centro: e.target.value })} className="h-8 text-xs w-28" />
                    : <span className="text-xs">{item.centro}</span>}
                </TableCell>

                {/* Año */}
                <TableCell>
                  {ed ? <Input type="number" min={1} max={6} value={item.anioUniversitario} onChange={(e) => patch(item, { anioUniversitario: Number(e.target.value) })} className="h-8 text-xs w-16" />
                    : <span className="text-xs text-center block">{item.anioUniversitario}º</span>}
                </TableCell>

                {/* Teléfono */}
                <TableCell>
                  {ed ? <Input value={item.telefono} onChange={(e) => patch(item, { telefono: e.target.value })} className="h-8 text-xs w-32" />
                    : <span className="text-xs">{item.telefono}</span>}
                </TableCell>

                {/* Correo UPV */}
                <TableCell>
                  {ed ? <Input value={item.correoUpv} onChange={(e) => patch(item, { correoUpv: e.target.value })} className="h-8 text-xs w-36" />
                    : <a href={`mailto:${item.correoUpv}`} className="text-xs text-primary hover:underline">{item.correoUpv}</a>}
                </TableCell>

                {/* Correo personal */}
                <TableCell>
                  {ed ? <Input value={item.correoPersonal} onChange={(e) => patch(item, { correoPersonal: e.target.value })} className="h-8 text-xs w-40" />
                    : <a href={`mailto:${item.correoPersonal}`} className="text-xs text-primary hover:underline">{item.correoPersonal}</a>}
                </TableCell>

                {/* Cumpleaños */}
                <TableCell className="whitespace-nowrap">
                  {ed ? <Input type="date" value={item.cumpleanos} onChange={(e) => patch(item, { cumpleanos: e.target.value })} className="h-8 text-xs w-36" />
                    : <span className="text-xs">{fmtDate(item.cumpleanos)}</span>}
                </TableCell>

                {/* Identificación */}
                <TableCell>
                  {ed ? (
                    <div className="space-y-1">
                      <Select value={item.tipoId} onValueChange={(v) => patch(item, { tipoId: v as IdType })}>
                        <SelectTrigger className="h-7 text-xs w-24"><SelectValue /></SelectTrigger>
                        <SelectContent>{ID_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                      </Select>
                      <Input value={item.numeroId} onChange={(e) => patch(item, { numeroId: e.target.value })} className="h-7 text-xs w-28" />
                    </div>
                  ) : (
                    <div>
                      <span className="text-[10px] text-muted-foreground">{item.tipoId}</span>
                      <span className="block text-xs font-mono">{item.numeroId}</span>
                    </div>
                  )}
                </TableCell>

                {/* Entrada */}
                <TableCell className="whitespace-nowrap">
                  {ed ? <Input type="date" value={item.fechaEntrada} onChange={(e) => patch(item, { fechaEntrada: e.target.value })} className="h-8 text-xs w-36" />
                    : <span className="text-xs">{fmtDate(item.fechaEntrada)}</span>}
                </TableCell>

                {/* Salida */}
                <TableCell className="whitespace-nowrap">
                  {ed ? <Input type="date" value={item.fechaSalida} onChange={(e) => patch(item, { fechaSalida: e.target.value })} className="h-8 text-xs w-36" />
                    : <span className="text-xs">{item.fechaSalida ? fmtDate(item.fechaSalida) : "—"}</span>}
                </TableCell>
              </TableRow>
            );
          })}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">No se encontraron miembros</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MemberTable;
