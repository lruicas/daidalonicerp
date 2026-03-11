import { useState, useRef, useCallback } from "react";
import { Search, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import type { InventoryItem, InventoryStatus } from "@/lib/inventory-data";

interface Props {
  items: InventoryItem[];
  onUpdate: (updated: InventoryItem) => void;
}

const STATUS_COLOR: Record<InventoryStatus, string> = {
  Nuevo: "fill-primary stroke-primary",
  Funciona: "fill-primary stroke-primary",
  Averiado: "fill-orange-400 stroke-orange-400",
  Roto: "fill-rose-400 stroke-rose-400",
};

const STATUS_LABEL_COLOR: Record<InventoryStatus, string> = {
  Nuevo: "bg-primary text-primary-foreground",
  Funciona: "bg-primary text-primary-foreground",
  Averiado: "bg-orange-400 text-white",
  Roto: "bg-rose-400 text-white",
};

// Predefined positions on the floor plan for items
const POSITIONS: { x: number; y: number }[] = [
  { x: 80, y: 90 },
  { x: 200, y: 85 },
  { x: 340, y: 95 },
  { x: 520, y: 80 },
  { x: 650, y: 90 },
  { x: 130, y: 230 },
  { x: 300, y: 240 },
  { x: 470, y: 225 },
  { x: 600, y: 235 },
  { x: 80, y: 370 },
  { x: 230, y: 360 },
  { x: 420, y: 375 },
  { x: 580, y: 365 },
  { x: 700, y: 370 },
  { x: 150, y: 150 },
  { x: 400, y: 160 },
];

const SVG_W = 780;
const SVG_H = 440;

const InventoryMap = ({ items, onUpdate }: Props) => {
  const [search, setSearch] = useState("");
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(() => {
    const map: Record<string, { x: number; y: number }> = {};
    items.forEach((item, i) => {
      map[item.id] = POSITIONS[i % POSITIONS.length];
    });
    return map;
  });
  const [dragging, setDragging] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getPos = (id: string) => positions[id] || { x: 100, y: 100 };

  const handleMouseDown = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(id);
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!dragging || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const x = Math.max(12, Math.min(SVG_W - 12, ((e.clientX - rect.left) / rect.width) * SVG_W));
      const y = Math.max(12, Math.min(SVG_H - 12, ((e.clientY - rect.top) / rect.height) * SVG_H));
      setPositions((prev) => ({ ...prev, [dragging]: { x, y } }));
    },
    [dragging]
  );

  const handleMouseUp = useCallback(() => {
    if (dragging) {
      const item = items.find((i) => i.id === dragging);
      if (item) {
        const pos = positions[dragging];
        const locationLabel = `Zona ${Math.ceil(pos.x / 260)}-${Math.ceil(pos.y / 150)}`;
        onUpdate({ ...item, ubicacion: locationLabel });
        toast.success("Ubicación actualizada");
      }
      setDragging(null);
    }
  }, [dragging, items, positions, onUpdate]);

  const matchesSearch = (item: InventoryItem) => {
    if (!search) return false;
    const q = search.toLowerCase();
    return item.nombre.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
  };

  const hasSearch = search.length > 0;

  return (
    <div className="space-y-3">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar elemento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => toast.info("Funcionalidad en desarrollo")}
        >
          <Pencil className="h-3.5 w-3.5" />
          Editar mapa
        </Button>
      </div>

      {/* Floor plan */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full"
          style={{ maxHeight: 500, background: "hsl(var(--card))" }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Grid lines */}
          {Array.from({ length: 10 }, (_, i) => (
            <line
              key={`v${i}`}
              x1={i * (SVG_W / 9)}
              y1={0}
              x2={i * (SVG_W / 9)}
              y2={SVG_H}
              stroke="hsl(var(--border))"
              strokeWidth={0.5}
              strokeDasharray="4,6"
            />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={i * (SVG_H / 5)}
              x2={SVG_W}
              y2={i * (SVG_H / 5)}
              stroke="hsl(var(--border))"
              strokeWidth={0.5}
              strokeDasharray="4,6"
            />
          ))}

          {/* Furniture — shelves */}
          <rect x={30} y={50} width={180} height={80} rx={4} fill="none" stroke="hsl(var(--border))" strokeWidth={1.2} />
          <text x={120} y={95} textAnchor="middle" className="text-[9px]" fill="hsl(var(--muted-foreground))" opacity={0.6}>Estantería A</text>

          <rect x={280} y={50} width={180} height={80} rx={4} fill="none" stroke="hsl(var(--border))" strokeWidth={1.2} />
          <text x={370} y={95} textAnchor="middle" className="text-[9px]" fill="hsl(var(--muted-foreground))" opacity={0.6}>Armario 1</text>

          <rect x={490} y={50} width={140} height={80} rx={4} fill="none" stroke="hsl(var(--border))" strokeWidth={1.2} />
          <text x={560} y={95} textAnchor="middle" className="text-[9px]" fill="hsl(var(--muted-foreground))" opacity={0.6}>Armario 2</text>

          <rect x={660} y={50} width={90} height={80} rx={4} fill="none" stroke="hsl(var(--border))" strokeWidth={1.2} />
          <text x={705} y={95} textAnchor="middle" className="text-[9px]" fill="hsl(var(--muted-foreground))" opacity={0.6}>Cajón</text>

          {/* Tables */}
          <rect x={80} y={190} width={220} height={90} rx={6} fill="none" stroke="hsl(var(--border))" strokeWidth={1.2} />
          <text x={190} y={240} textAnchor="middle" className="text-[9px]" fill="hsl(var(--muted-foreground))" opacity={0.6}>Mesa principal</text>

          <rect x={380} y={190} width={180} height={90} rx={6} fill="none" stroke="hsl(var(--border))" strokeWidth={1.2} />
          <text x={470} y={240} textAnchor="middle" className="text-[9px]" fill="hsl(var(--muted-foreground))" opacity={0.6}>Mesa auxiliar</text>

          <rect x={590} y={190} width={160} height={90} rx={6} fill="none" stroke="hsl(var(--border))" strokeWidth={1.2} />
          <text x={670} y={240} textAnchor="middle" className="text-[9px]" fill="hsl(var(--muted-foreground))" opacity={0.6}>Rack servidor</text>

          {/* Bottom shelves */}
          <rect x={30} y={330} width={260} height={80} rx={4} fill="none" stroke="hsl(var(--border))" strokeWidth={1.2} />
          <text x={160} y={375} textAnchor="middle" className="text-[9px]" fill="hsl(var(--muted-foreground))" opacity={0.6}>Almacén B</text>

          <rect x={370} y={330} width={200} height={80} rx={4} fill="none" stroke="hsl(var(--border))" strokeWidth={1.2} />
          <text x={470} y={375} textAnchor="middle" className="text-[9px]" fill="hsl(var(--muted-foreground))" opacity={0.6}>Sala reuniones</text>

          <rect x={600} y={330} width={150} height={80} rx={4} fill="none" stroke="hsl(var(--border))" strokeWidth={1.2} />
          <text x={675} y={375} textAnchor="middle" className="text-[9px]" fill="hsl(var(--muted-foreground))" opacity={0.6}>Almacén C</text>

          {/* Item markers */}
          {items.map((item) => {
            const pos = getPos(item.id);
            const colors = STATUS_COLOR[item.estado];
            const isMatch = hasSearch && matchesSearch(item);
            const isDimmed = hasSearch && !isMatch;
            const radius = isMatch ? 14 : 10;

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <g
                    onMouseDown={handleMouseDown(item.id)}
                    style={{ cursor: dragging === item.id ? "grabbing" : "grab" }}
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={radius}
                      className={colors}
                      fillOpacity={isDimmed ? 0.15 : 0.85}
                      strokeWidth={isMatch ? 3 : 1.5}
                      strokeOpacity={isDimmed ? 0.2 : 1}
                      style={{ transition: "r 0.2s, fill-opacity 0.2s" }}
                    />
                    {/* Item initials */}
                    <text
                      x={pos.x}
                      y={pos.y + 3.5}
                      textAnchor="middle"
                      fill="white"
                      fontSize={isMatch ? 8 : 7}
                      fontWeight={600}
                      style={{ pointerEvents: "none", userSelect: "none" }}
                    >
                      {item.nombre.slice(0, 2).toUpperCase()}
                    </text>
                  </g>
                </TooltipTrigger>
                <TooltipContent className="bg-foreground/90 text-background text-xs border-0">
                  <p className="font-semibold">{item.nombre}</p>
                  <p className="opacity-70">{item.responsable || "Sin asignar"}</p>
                  <p className="opacity-70">{item.ubicacion || "Sin ubicación"}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">Nuevo / Funciona</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-orange-400" />
          <span className="text-xs text-muted-foreground">Averiado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-rose-400" />
          <span className="text-xs text-muted-foreground">Roto</span>
        </div>
      </div>
    </div>
  );
};

export default InventoryMap;
