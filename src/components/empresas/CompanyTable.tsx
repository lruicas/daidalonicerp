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
import { ExternalLink, FileText } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { SECTIONS } from "@/lib/budget-data";
import {
  RELACIONES_UPV, PAGO_TYPES, FACTURAR_TYPES,
} from "@/lib/companies-data";
import type { Company, RelacionUPV, PagoType, FacturarType } from "@/lib/companies-data";
import type { Section } from "@/lib/budget-data";
import StarRating from "./StarRating";

interface CompanyTableProps {
  items: Company[];
  onUpdate: (updated: Company) => void;
}

const CompanyTable = ({ items, onUpdate }: CompanyTableProps) => {
  const { role } = useRole();
  const canEdit = role === "Presidente";
  const [editingId, setEditingId] = useState<string | null>(null);

  const startEdit = (id: string) => {
    if (canEdit) setEditingId(id);
  };

  const patch = (item: Company, updates: Partial<Company>) => {
    onUpdate({ ...item, ...updates });
  };

  const editing = (id: string) => editingId === id && canEdit;

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Nombre</TableHead>
            <TableHead className="font-semibold">CIF/VAT</TableHead>
            <TableHead className="font-semibold">Sección</TableHead>
            <TableHead className="font-semibold">Relación UPV</TableHead>
            <TableHead className="font-semibold">Pago</TableHead>
            <TableHead className="font-semibold">Correo</TableHead>
            <TableHead className="font-semibold">Teléfono</TableHead>
            <TableHead className="font-semibold">Facturar</TableHead>
            <TableHead className="font-semibold">Valoración</TableHead>
            <TableHead className="font-semibold">Fecha</TableHead>
            <TableHead className="font-semibold text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              className="group cursor-pointer hover:bg-muted/40 transition-colors"
              onDoubleClick={() => startEdit(item.id)}
            >
              {/* Nombre + Descripción */}
              <TableCell>
                {editing(item.id) ? (
                  <div className="space-y-1">
                    <Input
                      value={item.nombre}
                      onChange={(e) => patch(item, { nombre: e.target.value })}
                      className="h-8 text-sm"
                      autoFocus
                    />
                    <Input
                      value={item.descripcion}
                      onChange={(e) => patch(item, { descripcion: e.target.value })}
                      className="h-7 text-xs"
                      placeholder="Descripción"
                    />
                  </div>
                ) : (
                  <div>
                    <span className="font-medium text-sm">{item.nombre}</span>
                    <span className="block text-xs text-muted-foreground truncate max-w-[180px]">
                      {item.descripcion}
                    </span>
                  </div>
                )}
              </TableCell>

              {/* CIF */}
              <TableCell>
                {editing(item.id) ? (
                  <Input value={item.cif} onChange={(e) => patch(item, { cif: e.target.value })} className="h-8 text-sm w-28" />
                ) : (
                  <span className="text-sm font-mono">{item.cif}</span>
                )}
              </TableCell>

              {/* Sección */}
              <TableCell>
                {editing(item.id) ? (
                  <Select value={item.seccion} onValueChange={(v) => patch(item, { seccion: v as Section })}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SECTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-xs text-muted-foreground">{item.seccion}</span>
                )}
              </TableCell>

              {/* Relación UPV */}
              <TableCell>
                {editing(item.id) ? (
                  <Select value={item.relacion} onValueChange={(v) => patch(item, { relacion: v as RelacionUPV })}>
                    <SelectTrigger className="h-8 text-xs w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {RELACIONES_UPV.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-xs">{item.relacion}</span>
                )}
              </TableCell>

              {/* Pago */}
              <TableCell>
                {editing(item.id) ? (
                  <Select value={item.pago} onValueChange={(v) => patch(item, { pago: v as PagoType })}>
                    <SelectTrigger className="h-8 text-sm w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PAGO_TYPES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-xs">{item.pago}</span>
                )}
              </TableCell>

              {/* Correo */}
              <TableCell>
                {editing(item.id) ? (
                  <Input value={item.correo} onChange={(e) => patch(item, { correo: e.target.value })} className="h-8 text-sm w-40" />
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

              {/* Facturar */}
              <TableCell>
                {editing(item.id) ? (
                  <Select value={item.facturar} onValueChange={(v) => patch(item, { facturar: v as FacturarType })}>
                    <SelectTrigger className="h-8 text-sm w-24"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {FACTURAR_TYPES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-xs">{item.facturar}</span>
                )}
              </TableCell>

              {/* Valoración */}
              <TableCell>
                <StarRating
                  value={item.valoracion}
                  onChange={editing(item.id) ? (v) => patch(item, { valoracion: v }) : undefined}
                  readonly={!editing(item.id)}
                />
              </TableCell>

              {/* Fecha */}
              <TableCell className="text-sm whitespace-nowrap">
                {new Date(item.fecha).toLocaleDateString("es-ES")}
              </TableCell>

              {/* Acciones */}
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  {item.web && (
                    <a href={item.web} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Web">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                  )}
                  {item.documentacion && (
                    <a href={item.documentacion} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Documentación">
                        <FileText className="h-3.5 w-3.5 text-primary" />
                      </Button>
                    </a>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                No se encontraron empresas
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompanyTable;
