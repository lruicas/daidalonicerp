import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { SPONSOR_TYPES, SPONSOR_STATUSES } from "@/lib/sponsors-data";
import type { Sponsor, SponsorType, SponsorStatus } from "@/lib/sponsors-data";

interface SponsorTableProps {
  items: Sponsor[];
  onUpdate: (updated: Sponsor) => void;
}

const STATUS_COLORS: Record<SponsorStatus, string> = {
  Vigente: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  Permanente: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  Paralizada: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Terminada: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

const SponsorTable = ({ items, onUpdate }: SponsorTableProps) => {
  const { role } = useRole();
  const canEdit = role === "Presidente";
  const [editingId, setEditingId] = useState<string | null>(null);

  const startEdit = (id: string) => { if (canEdit) setEditingId(id); };
  const patch = (item: Sponsor, updates: Partial<Sponsor>) => onUpdate({ ...item, ...updates });
  const editing = (id: string) => editingId === id && canEdit;

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Nombre</TableHead>
            <TableHead className="font-semibold">Tipo</TableHead>
            <TableHead className="font-semibold">Estado</TableHead>
            <TableHead className="font-semibold">Correo</TableHead>
            <TableHead className="font-semibold">Teléfono</TableHead>
            <TableHead className="font-semibold">Condiciones</TableHead>
            <TableHead className="font-semibold">Observaciones</TableHead>
            <TableHead className="font-semibold">Fecha inicio</TableHead>
            <TableHead className="font-semibold text-center">Doc</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="group cursor-pointer hover:bg-muted/40 transition-colors" onDoubleClick={() => startEdit(item.id)}>
              {/* Nombre + Descripción */}
              <TableCell>
                {editing(item.id) ? (
                  <div className="space-y-1">
                    <Input value={item.nombre} onChange={(e) => patch(item, { nombre: e.target.value })} className="h-8 text-sm" autoFocus />
                    <Input value={item.descripcion} onChange={(e) => patch(item, { descripcion: e.target.value })} className="h-7 text-xs" placeholder="Descripción" />
                  </div>
                ) : (
                  <div>
                    <span className="font-medium text-sm">{item.nombre}</span>
                    <span className="block text-xs text-muted-foreground truncate max-w-[200px]">{item.descripcion}</span>
                  </div>
                )}
              </TableCell>

              {/* Tipo */}
              <TableCell>
                {editing(item.id) ? (
                  <Select value={item.tipo} onValueChange={(v) => patch(item, { tipo: v as SponsorType })}>
                    <SelectTrigger className="h-8 text-xs w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>{SPONSOR_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                ) : (
                  <span className="text-xs text-muted-foreground">{item.tipo}</span>
                )}
              </TableCell>

              {/* Estado */}
              <TableCell>
                {editing(item.id) ? (
                  <Select value={item.estado} onValueChange={(v) => patch(item, { estado: v as SponsorStatus })}>
                    <SelectTrigger className="h-8 text-xs w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>{SPONSOR_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                ) : (
                  <Badge variant="outline" className={`text-xs font-medium border-0 ${STATUS_COLORS[item.estado]}`}>
                    {item.estado}
                  </Badge>
                )}
              </TableCell>

              {/* Correo */}
              <TableCell>
                {editing(item.id) ? (
                  <Input value={item.correo} onChange={(e) => patch(item, { correo: e.target.value })} className="h-8 text-sm w-44" />
                ) : (
                  <a href={`mailto:${item.correo}`} className="text-xs text-primary hover:underline">{item.correo}</a>
                )}
              </TableCell>

              {/* Teléfono */}
              <TableCell>
                {editing(item.id) ? (
                  <Input value={item.telefono} onChange={(e) => patch(item, { telefono: e.target.value })} className="h-8 text-sm w-32" />
                ) : (
                  <span className="text-xs">{item.telefono}</span>
                )}
              </TableCell>

              {/* Condiciones */}
              <TableCell>
                {editing(item.id) ? (
                  <Textarea value={item.condiciones} onChange={(e) => patch(item, { condiciones: e.target.value })} className="text-xs min-h-[60px] w-44" />
                ) : (
                  <span className="text-xs text-muted-foreground truncate block max-w-[180px]">{item.condiciones}</span>
                )}
              </TableCell>

              {/* Observaciones */}
              <TableCell>
                {editing(item.id) ? (
                  <Textarea value={item.observaciones} onChange={(e) => patch(item, { observaciones: e.target.value })} className="text-xs min-h-[60px] w-44" />
                ) : (
                  <span className="text-xs text-muted-foreground truncate block max-w-[180px]">{item.observaciones}</span>
                )}
              </TableCell>

              {/* Fecha inicio */}
              <TableCell className="text-sm whitespace-nowrap">
                {editing(item.id) ? (
                  <Input type="date" value={item.fechaInicio} onChange={(e) => patch(item, { fechaInicio: e.target.value })} className="h-8 text-sm w-36" />
                ) : (
                  new Date(item.fechaInicio).toLocaleDateString("es-ES")
                )}
              </TableCell>

              {/* Documentación */}
              <TableCell className="text-center">
                {item.documentacion && (
                  <a href={item.documentacion} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-7 w-7" title="Documentación">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                    </Button>
                  </a>
                )}
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No se encontraron patrocinadores</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SponsorTable;
