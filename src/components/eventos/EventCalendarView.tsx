import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { EconomicEvent, EventStatus } from "@/lib/events-data";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  parseISO,
  isWithinInterval,
  differenceInCalendarDays,
} from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  events: EconomicEvent[];
}

const STATUS_COLORS: Record<EventStatus, { bg: string; text: string }> = {
  "Sin comenzar": { bg: "bg-muted", text: "text-muted-foreground" },
  "En progreso": { bg: "bg-primary", text: "text-primary-foreground" },
  "Terminado": { bg: "bg-ring/30", text: "text-muted-foreground" },
};

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const EventCalendarView = ({ events }: Props) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<EconomicEvent | null>(null);
  const [expandDay, setExpandDay] = useState<string | null>(null);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const start = startOfWeek(monthStart, { weekStartsOn: 1 });
    const end = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Group events by the days they span in the current calendar view
  const getEventsForDay = (day: Date): EconomicEvent[] => {
    return events.filter((ev) => {
      const evStart = parseISO(ev.fechaInicio);
      const evEnd = parseISO(ev.fechaFin);
      return isWithinInterval(day, { start: evStart, end: evEnd }) || isSameDay(day, evStart) || isSameDay(day, evEnd);
    });
  };

  // Check if this day is the start of the event (or the first visible day of the week for multi-day)
  const isEventStart = (day: Date, ev: EconomicEvent): boolean => {
    const evStart = parseISO(ev.fechaInicio);
    return isSameDay(day, evStart);
  };

  // Calculate how many cells an event bar should span from this day
  const getSpan = (day: Date, ev: EconomicEvent): number => {
    const evEnd = parseISO(ev.fechaFin);
    const dayOfWeek = (day.getDay() + 6) % 7; // 0=Mon
    const remainingInWeek = 7 - dayOfWeek;
    const daysUntilEnd = differenceInCalendarDays(evEnd, day) + 1;
    return Math.min(daysUntilEnd, remainingInWeek);
  };

  const weeks = useMemo(() => {
    const result: Date[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      result.push(calendarDays.slice(i, i + 7));
    }
    return result;
  }, [calendarDays]);

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-sm font-semibold text-foreground capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: es })}
        </h3>
        <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground border-r last:border-r-0">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 border-b last:border-b-0" style={{ minHeight: 100 }}>
          {week.map((day, di) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());
            const MAX_VISIBLE = 2;
            const hiddenCount = dayEvents.length - MAX_VISIBLE;

            return (
              <div
                key={di}
                className={`relative border-r last:border-r-0 p-1 ${
                  isCurrentMonth ? "bg-card" : "bg-muted/20"
                }`}
              >
                {/* Day number */}
                <div className="flex justify-end mb-0.5">
                  <span
                    className={`text-xs w-6 h-6 flex items-center justify-center rounded-full ${
                      isToday
                        ? "bg-primary text-primary-foreground font-bold"
                        : isCurrentMonth
                        ? "text-foreground"
                        : "text-muted-foreground/40"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                </div>

                {/* Event bars */}
                <div className="space-y-0.5">
                  {dayEvents.slice(0, MAX_VISIBLE).map((ev) => {
                    const showBar = isEventStart(day, ev);
                    // For continuation days on Mon, also show
                    const evStart = parseISO(ev.fechaInicio);
                    const isContinuation = !isSameDay(day, evStart) && di === 0;

                    if (!showBar && !isContinuation) return null;

                    const span = getSpan(day, ev);
                    const colors = STATUS_COLORS[ev.estado];

                    return (
                      <button
                        key={ev.id}
                        onClick={() => setSelectedEvent(ev)}
                        className={`block text-left rounded ${colors.bg} ${colors.text} px-1.5 py-0.5 text-[10px] leading-tight truncate hover:opacity-80 transition-opacity`}
                        style={{
                          width: span > 1 ? `calc(${span * 100}% + ${(span - 1) * 1}px)` : "100%",
                          zIndex: 10,
                          position: span > 1 ? "relative" : undefined,
                        }}
                      >
                        <span className="font-semibold">{ev.nombre}</span>
                        {span > 1 && (
                          <span className="ml-1 opacity-70">
                            {ev.presupuesto.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })}
                          </span>
                        )}
                      </button>
                    );
                  })}

                  {/* More indicator */}
                  {hiddenCount > 0 && (
                    <button
                      onClick={() => setExpandDay(format(day, "yyyy-MM-dd"))}
                      className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold hover:bg-primary/25 transition-colors mx-auto"
                    >
                      +{hiddenCount}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* Expand day dialog */}
      <Dialog open={!!expandDay} onOpenChange={(open) => !open && setExpandDay(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm">
              Eventos del {expandDay ? format(parseISO(expandDay), "d 'de' MMMM yyyy", { locale: es }) : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {expandDay &&
              getEventsForDay(parseISO(expandDay)).map((ev) => {
                const colors = STATUS_COLORS[ev.estado];
                return (
                  <button
                    key={ev.id}
                    onClick={() => { setExpandDay(null); setSelectedEvent(ev); }}
                    className={`w-full text-left rounded-md ${colors.bg} ${colors.text} px-3 py-2 text-sm hover:opacity-80 transition-opacity`}
                  >
                    <span className="font-semibold">{ev.nombre}</span>
                    <span className="block text-xs opacity-70 mt-0.5">
                      {ev.presupuesto.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                    </span>
                  </button>
                );
              })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Event detail dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.nombre}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-3 py-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">Fecha</span>
                  {format(parseISO(selectedEvent.fechaInicio), "dd/MM/yyyy")} – {format(parseISO(selectedEvent.fechaFin), "dd/MM/yyyy")}
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Colaborador</span>
                  {selectedEvent.colaborador}
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Presupuesto</span>
                  <span className="font-semibold">
                    {selectedEvent.presupuesto.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Estado</span>
                  <Badge className={`text-xs ${STATUS_COLORS[selectedEvent.estado].bg} ${STATUS_COLORS[selectedEvent.estado].text}`}>
                    {selectedEvent.estado}
                  </Badge>
                </div>
              </div>
              {selectedEvent.descripcion && (
                <div>
                  <span className="text-xs text-muted-foreground block">Descripción</span>
                  <p className="text-sm">{selectedEvent.descripcion}</p>
                </div>
              )}
              {selectedEvent.observaciones && (
                <div>
                  <span className="text-xs text-muted-foreground block">Observaciones</span>
                  <p className="text-sm text-muted-foreground">{selectedEvent.observaciones}</p>
                </div>
              )}
              <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => setSelectedEvent(null)}>
                Ver detalle
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventCalendarView;
