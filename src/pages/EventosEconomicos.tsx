import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { CalendarDays, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventFilters from "@/components/eventos/EventFilters";
import EventTable from "@/components/eventos/EventTable";
import { mockEvents, EconomicEvent, EventStatus, SPONSORS, EVENT_STATUSES } from "@/lib/events-data";
import { useRole } from "@/contexts/RoleContext";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const EventosEconomicos = () => {
  const { canEdit } = useRole();
  const [events, setEvents] = useState<EconomicEvent[]>(mockEvents);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<EventStatus | "all">("all");

  // New event form state
  const [newEvent, setNewEvent] = useState<Partial<EconomicEvent>>({
    nombre: "", descripcion: "", fechaInicio: "", fechaFin: "",
    colaborador: SPONSORS[0], presupuesto: 0, estado: "Sin comenzar", observaciones: "",
  });

  const filtered = events.filter((e) => {
    const matchSearch = !search ||
      e.nombre.toLowerCase().includes(search.toLowerCase()) ||
      e.colaborador.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || e.estado === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateRow = (id: string, updates: Partial<EconomicEvent>) => {
    setEvents((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const addEvent = () => {
    if (!newEvent.nombre || !newEvent.fechaInicio || !newEvent.fechaFin) {
      toast.error("Completa al menos nombre y fechas");
      return;
    }
    const ev: EconomicEvent = {
      id: `ev-${Date.now()}`,
      nombre: newEvent.nombre ?? "",
      descripcion: newEvent.descripcion ?? "",
      fechaInicio: newEvent.fechaInicio ?? "",
      fechaFin: newEvent.fechaFin ?? "",
      colaborador: newEvent.colaborador ?? SPONSORS[0],
      presupuesto: newEvent.presupuesto ?? 0,
      estado: (newEvent.estado as EventStatus) ?? "Sin comenzar",
      observaciones: newEvent.observaciones ?? "",
    };
    setEvents((prev) => [...prev, ev]);
    setNewEvent({
      nombre: "", descripcion: "", fechaInicio: "", fechaFin: "",
      colaborador: SPONSORS[0], presupuesto: 0, estado: "Sin comenzar", observaciones: "",
    });
    toast.success("Evento añadido correctamente");
  };

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-primary" strokeWidth={1.5} />
            <h2 className="text-xl font-semibold text-foreground">Eventos Económicos</h2>
          </div>

          {canEdit && (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" strokeWidth={1.5} />
                  Nuevo evento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Añadir evento económico</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Nombre *</Label>
                    <Input value={newEvent.nombre} onChange={(e) => setNewEvent({ ...newEvent, nombre: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Descripción</Label>
                    <Input value={newEvent.descripcion} onChange={(e) => setNewEvent({ ...newEvent, descripcion: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label>Fecha inicio *</Label>
                      <Input type="date" value={newEvent.fechaInicio} onChange={(e) => setNewEvent({ ...newEvent, fechaInicio: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Fecha fin *</Label>
                      <Input type="date" value={newEvent.fechaFin} onChange={(e) => setNewEvent({ ...newEvent, fechaFin: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label>Colaborador</Label>
                      <Select value={newEvent.colaborador} onValueChange={(v) => setNewEvent({ ...newEvent, colaborador: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {SPONSORS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Presupuesto (€)</Label>
                      <Input type="number" value={newEvent.presupuesto} onChange={(e) => setNewEvent({ ...newEvent, presupuesto: Number(e.target.value) })} />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Estado</Label>
                    <Select value={newEvent.estado} onValueChange={(v) => setNewEvent({ ...newEvent, estado: v as EventStatus })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {EVENT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Observaciones</Label>
                    <Input value={newEvent.observaciones} onChange={(e) => setNewEvent({ ...newEvent, observaciones: e.target.value })} />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={addEvent}>Añadir</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <EventFilters search={search} onSearchChange={setSearch} filterStatus={filterStatus} onStatusChange={setFilterStatus} />
        <EventTable rows={filtered} onUpdateRow={updateRow} />
      </div>
    </AppLayout>
  );
};

export default EventosEconomicos;
