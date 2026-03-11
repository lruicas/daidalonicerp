import { useMemo, useState } from "react";
import { FileText, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Order, OrderStatus } from "@/lib/orders-data";
import {
  parseISO,
  differenceInCalendarDays,
  addDays,
  format,
  startOfWeek,
  eachWeekOfInterval,
  eachMonthOfInterval,
  isSameMonth,
} from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  orders: Order[];
}

const STATUS_COLOR: Record<OrderStatus, { bar: string; label: string }> = {
  "Pendiente de correo": { bar: "bg-red-300", label: "Atascado" },
  "Proforma": { bar: "bg-red-200", label: "Atascado" },
  "Solicitud empezada": { bar: "bg-primary", label: "En curso" },
  "Factura": { bar: "bg-primary/80", label: "En curso" },
  "Terminado": { bar: "bg-emerald-300", label: "Completado" },
};

const LEGEND = [
  { color: "bg-red-300", label: "Atascado (Pendiente / Proforma)" },
  { color: "bg-primary", label: "En curso (Solicitud / Factura)" },
  { color: "bg-emerald-300", label: "Completado (Terminado)" },
];

/** Estimated duration in days based on status */
const estimatedDuration = (order: Order): number => {
  if (order.estado === "Terminado") return 21;
  const created = parseISO(order.fecha);
  const today = new Date();
  const elapsed = differenceInCalendarDays(today, created);
  return Math.max(elapsed, 14);
};

const OrderTimeline = ({ orders }: Props) => {
  const [zoom, setZoom] = useState(50); // 20-100 range, maps to px per day

  const pxPerDay = useMemo(() => 4 + (zoom / 100) * 16, [zoom]); // 4-20px

  const { startDate, endDate, rows } = useMemo(() => {
    if (!orders.length) {
      const today = new Date();
      return { startDate: today, endDate: addDays(today, 60), rows: [] };
    }

    const mapped = orders.map((o) => {
      const start = parseISO(o.fecha);
      const duration = estimatedDuration(o);
      const end = addDays(start, duration);
      return { order: o, start, end, duration };
    });

    const allStarts = mapped.map((m) => m.start.getTime());
    const allEnds = mapped.map((m) => m.end.getTime());
    const earliest = new Date(Math.min(...allStarts));
    const latest = new Date(Math.max(...allEnds));
    const padStart = addDays(startOfWeek(earliest, { weekStartsOn: 1 }), -7);
    const padEnd = addDays(latest, 14);

    return { startDate: padStart, endDate: padEnd, rows: mapped };
  }, [orders]);

  const totalDays = differenceInCalendarDays(endDate, startDate);
  const totalWidth = totalDays * pxPerDay;

  const weekMarkers = useMemo(
    () => eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 }),
    [startDate, endDate]
  );

  const monthMarkers = useMemo(
    () => eachMonthOfInterval({ start: startDate, end: endDate }),
    [startDate, endDate]
  );

  const hasAttachments = (o: Order) => !!(o.proformaUrl || o.geaUrl || o.facturaUrl);

  return (
    <div className="space-y-4">
      {/* Zoom controls */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom((z) => Math.max(10, z - 15))}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Slider
          min={10}
          max={100}
          step={5}
          value={[zoom]}
          onValueChange={([v]) => setZoom(v)}
          className="w-32"
        />
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom((z) => Math.min(100, z + 15))}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground ml-1">Zoom</span>
      </div>

      {/* Timeline */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <div style={{ minWidth: totalWidth + 200 }}>
            {/* Month headers */}
            <div className="flex border-b bg-muted/30" style={{ paddingLeft: 200 }}>
              {monthMarkers.map((m, i) => {
                const offset = differenceInCalendarDays(m, startDate) * pxPerDay;
                const nextMonth = monthMarkers[i + 1];
                const width = nextMonth
                  ? differenceInCalendarDays(nextMonth, m) * pxPerDay
                  : totalWidth - offset;

                return (
                  <div
                    key={i}
                    className="text-xs font-semibold text-foreground capitalize py-1.5 border-r border-border/30 text-center truncate"
                    style={{ width, minWidth: 0 }}
                  >
                    {format(m, "MMMM yyyy", { locale: es })}
                  </div>
                );
              })}
            </div>

            {/* Week headers */}
            <div className="flex border-b" style={{ paddingLeft: 200 }}>
              {weekMarkers.map((w, i) => {
                const width = pxPerDay * 7;
                return (
                  <div
                    key={i}
                    className="text-[10px] text-muted-foreground py-1 border-r border-border/20 text-center"
                    style={{ width }}
                  >
                    {format(w, "dd/MM")}
                  </div>
                );
              })}
            </div>

            {/* Rows */}
            {rows.map(({ order, start, end, duration }, ri) => {
              const offsetDays = differenceInCalendarDays(start, startDate);
              const barLeft = offsetDays * pxPerDay;
              const barWidth = Math.max(duration * pxPerDay, 24);
              const colors = STATUS_COLOR[order.estado];

              return (
                <div key={order.id} className="flex items-center border-b border-border/20 hover:bg-muted/20 transition-colors" style={{ height: 38 }}>
                  {/* Label */}
                  <div className="w-[200px] shrink-0 px-3 flex items-center gap-2 border-r border-border/30">
                    <span className="text-xs font-medium truncate">{order.nombre}</span>
                  </div>

                  {/* Bar area */}
                  <div className="relative flex-1" style={{ height: "100%" }}>
                    {/* Week gridlines */}
                    {weekMarkers.map((w, wi) => {
                      const x = differenceInCalendarDays(w, startDate) * pxPerDay;
                      return (
                        <div
                          key={wi}
                          className="absolute top-0 bottom-0 border-l border-border/10"
                          style={{ left: x }}
                        />
                      );
                    })}

                    {/* Bar */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`absolute top-1.5 rounded-md ${colors.bar} cursor-pointer hover:opacity-80 transition-opacity flex items-center px-2 gap-1`}
                          style={{ left: barLeft, width: barWidth, height: 22 }}
                        >
                          {barWidth > 60 && (
                            <span className="text-[10px] font-medium text-foreground/80 truncate">
                              {order.nombre}
                            </span>
                          )}
                          {hasAttachments(order) && (
                            <FileText className="h-3 w-3 shrink-0 text-foreground/50" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs space-y-1 max-w-[220px]">
                        <p className="font-semibold">{order.nombre}</p>
                        <p>Empresa: {order.empresa}</p>
                        <p>Estado: {order.estado}</p>
                        <p>Inicio: {format(start, "dd/MM/yyyy")}</p>
                        <p>Fin est.: {format(end, "dd/MM/yyyy")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5">
        {LEGEND.map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${l.color}`} />
            <span className="text-xs text-muted-foreground">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTimeline;
