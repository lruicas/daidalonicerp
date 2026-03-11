import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, ExternalLink, Upload, FileText } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { SECTIONS } from "@/lib/budget-data";
import { MEMBERS, INVENTORY_STATUSES } from "@/lib/inventory-data";
import type { InventoryItem, InventoryStatus } from "@/lib/inventory-data";
import type { Section } from "@/lib/budget-data";

const statusStyles: Record<InventoryStatus, string> = {
  Nuevo: "bg-primary/15 text-primary",
  Funciona: "bg-primary text-primary-foreground",
  Averiado: "bg-secondary/20 text-secondary",
  Roto: "bg-destructive/15 text-destructive",
};

interface InventoryTableProps {
  items: InventoryItem[];
  onUpdate: (updated: InventoryItem) => void;
  highlightId?: string | null;
}

const InventoryTable = ({ items, onUpdate, highlightId }: InventoryTableProps) => {
  const { canEdit } = useRole();
  const [editingId, setEditingId] = useState<string | null>(null);

  const startEdit = (id: string) => {
    if (canEdit) setEditingId(id);
  };

  const update = (item: InventoryItem, patch: Partial<InventoryItem>) => {
    onUpdate({ ...item, ...patch });
  };

  const isEditing = (id: string) => editingId === id && canEdit;

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold w-[52px]">Foto</TableHead>
            <TableHead className="font-semibold">Nombre</TableHead>
            <TableHead className="font-semibold text-center">Uds.</TableHead>
            <TableHead className="font-semibold">Ubicación</TableHead>
            <TableHead className="font-semibold">Responsable</TableHead>
            <TableHead className="font-semibold">Estado</TableHead>
            <TableHead className="font-semibold">Sección</TableHead>
            <TableHead className="font-semibold">Fecha</TableHead>
            <TableHead className="font-semibold text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              className={`group cursor-pointer hover:bg-muted/40 transition-colors ${highlightId === item.id ? "bg-primary/10 ring-1 ring-primary/30" : ""}`}
              onDoubleClick={() => startEdit(item.id)}
            >
              {/* Foto */}
              <TableCell>
                <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  {item.fotoUrl ? (
                    <img src={item.fotoUrl} alt={item.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </TableCell>

              {/* Nombre */}
              <TableCell>
                {isEditing(item.id) ? (
                  <Input
                    value={item.nombre}
                    onChange={(e) => update(item, { nombre: e.target.value })}
                    onBlur={() => setEditingId(null)}
                    autoFocus
                    className="h-8 text-sm"
                  />
                ) : (
                  <div>
                    <span className="font-medium text-sm">{item.nombre}</span>
                    <span className="block text-xs text-muted-foreground">{item.id}</span>
                  </div>
                )}
              </TableCell>

              {/* Unidades */}
              <TableCell className="text-center">
                {isEditing(item.id) ? (
                  <Input
                    type="number"
                    value={item.unidades}
                    onChange={(e) => update(item, { unidades: parseInt(e.target.value) || 0 })}
                    onBlur={() => setEditingId(null)}
                    className="h-8 text-sm w-16 mx-auto text-center"
                  />
                ) : (
                  <span className="text-sm font-medium">{item.unidades}</span>
                )}
              </TableCell>

              {/* Ubicación */}
              <TableCell>
                {isEditing(item.id) ? (
                  <Input
                    value={item.ubicacion}
                    onChange={(e) => update(item, { ubicacion: e.target.value })}
                    onBlur={() => setEditingId(null)}
                    className="h-8 text-sm"
                  />
                ) : (
                  <span className="text-sm">{item.ubicacion}</span>
                )}
              </TableCell>

              {/* Responsable */}
              <TableCell>
                {isEditing(item.id) ? (
                  <Select value={item.responsable} onValueChange={(v) => update(item, { responsable: v })}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MEMBERS.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-sm">{item.responsable}</span>
                )}
              </TableCell>

              {/* Estado */}
              <TableCell>
                {isEditing(item.id) ? (
                  <Select value={item.estado} onValueChange={(v) => update(item, { estado: v as InventoryStatus })}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INVENTORY_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={`text-xs ${statusStyles[item.estado]}`}>
                    {item.estado}
                  </Badge>
                )}
              </TableCell>

              {/* Sección */}
              <TableCell>
                {isEditing(item.id) ? (
                  <Select value={item.seccion} onValueChange={(v) => update(item, { seccion: v as Section })}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTIONS.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-xs text-muted-foreground">{item.seccion}</span>
                )}
              </TableCell>

              {/* Fecha */}
              <TableCell className="text-sm">
                {new Date(item.fecha).toLocaleDateString("es-ES")}
              </TableCell>

              {/* Acciones */}
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  {item.enlace && (
                    <a href={item.enlace} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                  )}
                  {item.presupuestoId && (
                    <Link to={`/presupuestos?highlight=${item.presupuestoId}`} onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <span title="Ver presupuesto"><FileText className="h-3.5 w-3.5 text-primary" /></span>
                      </Button>
                    </Link>
                  )}
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        update(item, { fotoUrl: `https://picsum.photos/seed/${item.id}/100` });
                      }}
                    >
                      <span title="Subir foto"><Upload className="h-3.5 w-3.5" /></span>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                No se encontraron elementos en el inventario
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryTable;
