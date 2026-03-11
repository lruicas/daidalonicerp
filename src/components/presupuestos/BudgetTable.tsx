import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Pencil, Check, X } from "lucide-react";
import { BudgetRow, SECTIONS, PRIORITIES, ORDERS, EVENTS, COMPANIES, Section, Priority } from "@/lib/budget-data";
import { useRole } from "@/contexts/RoleContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Props {
  rows: BudgetRow[];
  onUpdateRow?: (id: string, updates: Partial<BudgetRow>) => void;
}

const priorityColor: Record<Priority, string> = {
  Alta: "bg-destructive text-destructive-foreground",
  Media: "bg-secondary text-secondary-foreground",
  Baja: "bg-primary text-primary-foreground",
};

const BudgetTable = ({ rows, onUpdateRow }: Props) => {
  const { canEditPresupuestos: canEdit } = useRole();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<BudgetRow>>({});

  const startEdit = (row: BudgetRow) => {
    setEditingId(row.id);
    setDraft({ ...row });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = () => {
    if (editingId) {
      onUpdateRow(editingId, draft);
      setEditingId(null);
      setDraft({});
    }
  };

  const isEditing = (id: string) => editingId === id;

  const CompanyInput = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    return (
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setSuggestions(
              COMPANIES.filter((c) => c.toLowerCase().includes(e.target.value.toLowerCase()) && e.target.value.length > 0)
            );
          }}
          onBlur={() => setTimeout(() => setSuggestions([]), 150)}
          className="h-8 text-xs min-w-[120px]"
        />
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
            {suggestions.map((s) => (
              <button
                key={s}
                className="block w-full text-left px-3 py-1.5 text-xs hover:bg-muted"
                onMouseDown={() => { onChange(s); setSuggestions([]); }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-lg border bg-card">
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {canEdit && <TableHead className="w-[70px]">Acción</TableHead>}
              <TableHead className="min-w-[140px]">Nombre</TableHead>
              <TableHead className="min-w-[160px]">Descripción</TableHead>
              <TableHead className="min-w-[130px]">Sección</TableHead>
              <TableHead className="min-w-[140px]">Empresa</TableHead>
              <TableHead className="min-w-[110px]">Referencia</TableHead>
              <TableHead className="w-[50px]">Enlace</TableHead>
              <TableHead className="w-[80px] text-right">Uds.</TableHead>
              <TableHead className="w-[110px] text-right">P. unit.</TableHead>
              <TableHead className="w-[110px] text-right">P. total</TableHead>
              <TableHead className="w-[70px] text-center">Inv.</TableHead>
              <TableHead className="min-w-[160px]">Comentario</TableHead>
              <TableHead className="w-[90px]">Prioridad</TableHead>
              <TableHead className="min-w-[100px]">Pedido</TableHead>
              <TableHead className="min-w-[110px]">Estado</TableHead>
              <TableHead className="min-w-[160px]">Evento econ.</TableHead>
              <TableHead className="min-w-[120px]">Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const editing = isEditing(row.id);
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

                  {/* Sección */}
                  <TableCell>
                    {editing ? (
                      <Select value={draft.seccion} onValueChange={(v) => setDraft({ ...draft, seccion: v as Section })}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{SECTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    ) : (
                      <span className="text-sm">{row.seccion}</span>
                    )}
                  </TableCell>

                  {/* Empresa */}
                  <TableCell>
                    {editing ? (
                      <CompanyInput value={draft.empresa ?? ""} onChange={(v) => setDraft({ ...draft, empresa: v })} />
                    ) : (
                      <span className="text-sm">{row.empresa}</span>
                    )}
                  </TableCell>

                  {/* Referencia */}
                  <TableCell>
                    {editing ? (
                      <Input value={draft.referencia ?? ""} onChange={(e) => setDraft({ ...draft, referencia: e.target.value })} className="h-8 text-xs" />
                    ) : (
                      <span className="text-xs text-muted-foreground">{row.referencia}</span>
                    )}
                  </TableCell>

                  {/* Enlace */}
                  <TableCell className="text-center">
                    {row.enlace ? (
                      <a href={row.enlace} target="_blank" rel="noopener noreferrer" className="text-primary hover:opacity-70">
                        <ExternalLink className="h-4 w-4 inline" strokeWidth={1.5} />
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* Unidades */}
                  <TableCell className="text-right">
                    {editing ? (
                      <Input type="number" value={draft.unidades ?? 0} onChange={(e) => setDraft({ ...draft, unidades: Number(e.target.value) })} className="h-8 text-xs text-right w-[70px] ml-auto" />
                    ) : (
                      <span className="text-sm">{row.unidades}</span>
                    )}
                  </TableCell>

                  {/* Precio unitario */}
                  <TableCell className="text-right">
                    {editing ? (
                      <Input type="number" step="0.01" value={draft.precioUnitario ?? 0} onChange={(e) => setDraft({ ...draft, precioUnitario: Number(e.target.value) })} className="h-8 text-xs text-right w-[100px] ml-auto" />
                    ) : (
                      <span className="text-sm">{row.precioUnitario.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</span>
                    )}
                  </TableCell>

                  {/* Precio total */}
                  <TableCell className="text-right">
                    {editing ? (
                      <Input type="number" step="0.01" value={draft.precioTotal ?? 0} onChange={(e) => setDraft({ ...draft, precioTotal: Number(e.target.value) })} className="h-8 text-xs text-right w-[100px] ml-auto" />
                    ) : (
                      <span className="text-sm font-medium">{row.precioTotal.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</span>
                    )}
                  </TableCell>

                  {/* Inventariable */}
                  <TableCell className="text-center">
                    {editing ? (
                      <Checkbox checked={draft.inventariable} onCheckedChange={(v) => setDraft({ ...draft, inventariable: !!v })} />
                    ) : (
                      <span className={`text-xs font-medium ${row.inventariable ? "text-primary" : "text-muted-foreground"}`}>
                        {row.inventariable ? "Sí" : "No"}
                      </span>
                    )}
                  </TableCell>

                  {/* Comentario */}
                  <TableCell>
                    {editing ? (
                      <Input value={draft.comentarioCoordinador ?? ""} onChange={(e) => setDraft({ ...draft, comentarioCoordinador: e.target.value })} className="h-8 text-xs" />
                    ) : (
                      <span className="text-xs text-muted-foreground">{row.comentarioCoordinador || "—"}</span>
                    )}
                  </TableCell>

                  {/* Prioridad */}
                  <TableCell>
                    {editing ? (
                      <Select value={draft.prioridad} onValueChange={(v) => setDraft({ ...draft, prioridad: v as Priority })}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                      </Select>
                    ) : (
                      <Badge className={cn("text-xs", priorityColor[row.prioridad])}>{row.prioridad}</Badge>
                    )}
                  </TableCell>

                  {/* Pedido */}
                  <TableCell>
                    {editing ? (
                      <Select value={draft.pedido || "none"} onValueChange={(v) => setDraft({ ...draft, pedido: v === "none" ? "" : v })}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sin pedido</SelectItem>
                          {ORDERS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-xs">{row.pedido || "—"}</span>
                    )}
                  </TableCell>

                  {/* Estado pedido (read-only) */}
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{row.estadoPedido}</Badge>
                  </TableCell>

                  {/* Evento económico */}
                  <TableCell>
                    {editing ? (
                      <Select value={draft.eventoEconomico?.[0] || "none"} onValueChange={(v) => setDraft({ ...draft, eventoEconomico: v === "none" ? [] : [v] })}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Ninguno</SelectItem>
                          {EVENTS.map((ev) => <SelectItem key={ev} value={ev}>{ev}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {row.eventoEconomico.length > 0 ? row.eventoEconomico.map((ev) => (
                          <Badge key={ev} variant="secondary" className="text-[10px]">{ev}</Badge>
                        )) : <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                    )}
                  </TableCell>

                  {/* Fecha */}
                  <TableCell>
                    {editing ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 text-xs w-full justify-start">
                            {draft.fecha ? format(parseISO(draft.fecha), "dd/MM/yyyy") : "Elegir"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={draft.fecha ? parseISO(draft.fecha) : undefined}
                            onSelect={(d) => d && setDraft({ ...draft, fecha: format(d, "yyyy-MM-dd") })}
                            locale={es}
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <span className="text-xs">{row.fecha ? format(parseISO(row.fecha), "dd/MM/yyyy") : "—"}</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={canEdit ? 17 : 16} className="text-center py-8 text-muted-foreground">
                  No se encontraron presupuestos
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

export default BudgetTable;
