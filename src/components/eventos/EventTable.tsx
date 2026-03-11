import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Check, X, ArrowUpDown } from "lucide-react";
import { EconomicEvent, EventStatus, EVENT_STATUSES, SPONSORS } from "@/lib/events-data";
import { useRole } from "@/contexts/RoleContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Props {
  rows: EconomicEvent[];
  onUpdateRow: (id: string, updates: Partial<EconomicEvent>) => void;
}

const statusStyle: Record<EventStatus, string> = {
  "Sin comenzar": "bg-muted text-muted-foreground",
  "En progreso": "bg-primary text-primary-foreground",
  "Terminado": "bg-ring text-primary-foreground",
};

type SortKey = keyof EconomicEvent;

const EventTable = ({ rows, onUpdateRow }: Props) => {
  const { canEdit } = useRole();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<EconomicEvent>>({});
  const [sortKey, setSortKey] = useState<SortKey>("fechaInicio");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sorted = [...rows].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];
    let cmp = 0;
    if (typeof valA === "number" && typeof valB === "number") {
      cmp = valA - valB;
    } else {
      cmp = String(valA).localeCompare(String(valB), "es");
    }
    return sortAsc ? cmp : -cmp;
  });

  const startEdit = (row: EconomicEvent) => { setEditingId(row.id); setDraft({ ...row }); };
  const cancelEdit = () => { setEditingId(null); setDraft({}); };
  const saveEdit = () => { if (editingId) { onUpdateRow(editingId, draft); cancelEdit(); } };

  const SortHeader = ({ label, field, className }: { label: string; field: SortKey; className?: string }) => (
    <TableHead className={className}>
      <button onClick={() => handleSort(field)} className="flex items-center gap-1 hover:text-foreground transition-colors">
        {label}
        <ArrowUpDown className={cn("h-3 w-3", sortKey === field ? "text-foreground" : "text-muted-foreground/50")} />
      </button>
    </TableHead>
  );

  return (
    <div className="rounded-lg border bg-card">
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {canEdit && <TableHead className="w-[70px]">Acción</TableHead>}
              <SortHeader label="Nombre" field="nombre" className="min-w-[160px]" />
              <SortHeader label="Descripción" field="descripcion" className="min-w-[200px]" />
              <SortHeader label="Fecha" field="fechaInicio" className="min-w-[180px]" />
              <SortHeader label="Colaborador" field="colaborador" className="min-w-[150px]" />
              <SortHeader label="Presupuesto" field="presupuesto" className="min-w-[120px] text-right" />
              <SortHeader label="Estado" field="estado" className="min-w-[120px]" />
              <SortHeader label="Observaciones" field="observaciones" className="min-w-[200px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((row) => {
              const editing = editingId === row.id;
              return (
                <TableRow key={row.id} className={editing ? "bg-primary-light/30" : ""}>
                  {canEdit && (
                    <TableCell>
                      {editing ? (
                        <div className="flex gap-1">
                          <button onClick={saveEdit} className="text-primary hover:opacity-70"><Check className="h-4 w-4" /></button>
                          <button onClick={cancelEdit} className="text-destructive hover:opacity-70"><X className="h-4 w-4" /></button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(row)} className="text-muted-foreground hover:text-foreground">
                          <Pencil className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      )}
                    </TableCell>
                  )}

                  {/* Nombre */}
                  <TableCell>
                    {editing ? (
                      <Input value={draft.nombre ?? ""} onChange={(e) => setDraft({ ...draft, nombre: e.target.value })} className="h-8 text-xs" />
                    ) : (
                      <span className="text-sm font-medium">{row.nombre}</span>
                    )}
                  </TableCell>

                  {/* Descripción */}
                  <TableCell>
                    {editing ? (
                      <Input value={draft.descripcion ?? ""} onChange={(e) => setDraft({ ...draft, descripcion: e.target.value })} className="h-8 text-xs" />
                    ) : (
                      <span className="text-sm text-muted-foreground">{row.descripcion}</span>
                    )}
                  </TableCell>

                  {/* Fecha rango */}
                  <TableCell>
                    {editing ? (
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 text-xs">
                              {draft.fechaInicio ? format(parseISO(draft.fechaInicio), "dd/MM/yy") : "Inicio"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={draft.fechaInicio ? parseISO(draft.fechaInicio) : undefined}
                              onSelect={(d) => d && setDraft({ ...draft, fechaInicio: format(d, "yyyy-MM-dd") })}
                              locale={es} className={cn("p-3 pointer-events-auto")} />
                          </PopoverContent>
                        </Popover>
                        <span className="text-xs text-muted-foreground">–</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 text-xs">
                              {draft.fechaFin ? format(parseISO(draft.fechaFin), "dd/MM/yy") : "Fin"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={draft.fechaFin ? parseISO(draft.fechaFin) : undefined}
                              onSelect={(d) => d && setDraft({ ...draft, fechaFin: format(d, "yyyy-MM-dd") })}
                              locale={es} className={cn("p-3 pointer-events-auto")} />
                          </PopoverContent>
                        </Popover>
                      </div>
                    ) : (
                      <span className="text-xs">
                        {format(parseISO(row.fechaInicio), "dd/MM/yyyy")} – {format(parseISO(row.fechaFin), "dd/MM/yyyy")}
                      </span>
                    )}
                  </TableCell>

                  {/* Colaborador */}
                  <TableCell>
                    {editing ? (
                      <Select value={draft.colaborador} onValueChange={(v) => setDraft({ ...draft, colaborador: v })}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {SPONSORS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-sm">{row.colaborador}</span>
                    )}
                  </TableCell>

                  {/* Presupuesto */}
                  <TableCell className="text-right">
                    {editing ? (
                      <Input type="number" step="0.01" value={draft.presupuesto ?? 0}
                        onChange={(e) => setDraft({ ...draft, presupuesto: Number(e.target.value) })}
                        className="h-8 text-xs text-right w-[100px] ml-auto" />
                    ) : (
                      <span className="text-sm font-medium">
                        {row.presupuesto.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                      </span>
                    )}
                  </TableCell>

                  {/* Estado */}
                  <TableCell>
                    {editing ? (
                      <Select value={draft.estado} onValueChange={(v) => setDraft({ ...draft, estado: v as EventStatus })}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {EVENT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className={cn("text-xs", statusStyle[row.estado])}>{row.estado}</Badge>
                    )}
                  </TableCell>

                  {/* Observaciones */}
                  <TableCell>
                    {editing ? (
                      <Input value={draft.observaciones ?? ""} onChange={(e) => setDraft({ ...draft, observaciones: e.target.value })} className="h-8 text-xs" />
                    ) : (
                      <span className="text-xs text-muted-foreground">{row.observaciones || "—"}</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={canEdit ? 8 : 7} className="text-center py-8 text-muted-foreground">
                  No se encontraron eventos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default EventTable;
