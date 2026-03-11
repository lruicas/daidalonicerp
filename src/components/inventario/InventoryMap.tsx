import { useState, useRef, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { ZoomIn, ZoomOut, RotateCcw, QrCode, Trash2, Plus, GripVertical, Eye, Pencil, ArrowRight, PanelLeftClose, PanelLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { useRole } from "@/contexts/RoleContext";
import { useInventory } from "@/contexts/InventoryContext";
import { useIsMobile } from "@/hooks/use-mobile";
import type { InventoryItem, InventoryStatus } from "@/lib/inventory-data";
import type { MapZone } from "@/lib/zone-data";
import { ZONE_BORDER_COLORS, findZoneAtPoint, getItemsInZone } from "@/lib/zone-data";
import MapToolbar from "./map/MapToolbar";
import ZoneEditorDialog from "./map/ZoneEditorDialog";
import QRDialog from "./map/QRDialog";
import AddItemDialog from "./map/AddItemDialog";
import ItemSidePanel from "./map/ItemSidePanel";
import ItemDetailModal from "./map/ItemDetailModal";
import AIAssistantPanel from "./map/AIAssistantPanel";

interface Props {
  items: InventoryItem[];
  onUpdate: (updated: InventoryItem) => void;
}

const SVG_W = 820;
const SVG_H = 500;

const STATUS_BORDER: Record<InventoryStatus, string> = {
  Nuevo: "hsl(168,62%,55%)",
  Funciona: "hsl(142,60%,50%)",
  Averiado: "hsl(30,95%,55%)",
  Roto: "hsl(0,80%,58%)",
};

const STATUS_BG: Record<InventoryStatus, string> = {
  Nuevo: "hsla(168,62%,55%,0.15)",
  Funciona: "hsla(142,60%,50%,0.15)",
  Averiado: "hsla(30,95%,55%,0.15)",
  Roto: "hsla(0,80%,58%,0.15)",
};

function itemRadius(units: number): number {
  if (units >= 10) return 18;
  if (units >= 5) return 15;
  return 12;
}

const InventoryMap = ({ items, onUpdate }: Props) => {
  const { canEditInventario: canEdit } = useRole();
  const isMobile = useIsMobile();
  const {
    mapConfig, setItemPositions, addZone, updateZone, removeZone, addLabel, removeLabel, setItems, addMovement,
  } = useInventory();
  const { zones, labels, itemPositions } = mapConfig;

  // State
  const [search, setSearch] = useState("");
  const [statusFilters, setStatusFilters] = useState<Set<InventoryStatus>>(new Set(["Nuevo", "Funciona", "Averiado", "Roto"]));
  const [responsableFilter, setResponsableFilter] = useState("all");
  const [heatMap, setHeatMap] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [draggingItem, setDraggingItem] = useState<string | null>(null);
  const [draggingZone, setDraggingZone] = useState<string | null>(null);
  const [resizingZone, setResizingZone] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [zoneDialog, setZoneDialog] = useState<{ open: boolean; parentId?: string | null; initial?: Partial<MapZone> }>({ open: false });
  const [qrZone, setQrZone] = useState<MapZone | null>(null);
  const [addItemZone, setAddItemZone] = useState<{ open: boolean; zoneName: string }>({ open: false, zoneName: "" });
  const [detailItem, setDetailItem] = useState<InventoryItem | null>(null);
  const [panelCollapsed, setPanelCollapsed] = useState(isMobile);
  const [sidePanelDragItem, setSidePanelDragItem] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  // Helpers
  const svgPoint = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left) / rect.width * SVG_W / zoom - pan.x / zoom,
      y: (clientY - rect.top) / rect.height * SVG_H / zoom - pan.y / zoom,
    };
  }, [zoom, pan]);

  const toggleStatus = (s: InventoryStatus) => {
    setStatusFilters(prev => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  };

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (!statusFilters.has(item.estado)) return false;
      if (responsableFilter !== "all" && item.responsable !== responsableFilter) return false;
      return true;
    });
  }, [items, statusFilters, responsableFilter]);

  const locatedItemIds = useMemo(() => new Set(Object.keys(itemPositions)), [itemPositions]);

  const matchesSearch = (item: InventoryItem) => {
    if (!search) return false;
    const q = search.toLowerCase();
    return item.nombre.toLowerCase().includes(q) || item.id.toLowerCase().includes(q) || item.responsable.toLowerCase().includes(q);
  };

  // Heat map density
  const zoneDensity = useMemo(() => {
    if (!heatMap) return {};
    const density: Record<string, number> = {};
    let maxCount = 1;
    zones.forEach(z => {
      const count = getItemsInZone(z.id, zones, itemPositions).filter(id => filteredItems.some(i => i.id === id)).length;
      density[z.id] = count;
      if (count > maxCount) maxCount = count;
    });
    Object.keys(density).forEach(k => { density[k] = density[k] / maxCount; });
    return density;
  }, [heatMap, zones, itemPositions, filteredItems]);

  const heatColor = (intensity: number) => {
    if (intensity > 0.7) return "hsla(0,80%,55%,0.25)";
    if (intensity > 0.4) return "hsla(30,90%,55%,0.2)";
    if (intensity > 0.1) return "hsla(50,90%,55%,0.15)";
    return "hsla(210,60%,55%,0.08)";
  };

  // Zone item counts (for capacity display)
  const zoneItemCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    zones.forEach(z => {
      counts[z.id] = getItemsInZone(z.id, zones, itemPositions).filter(id => items.some(i => i.id === id)).length;
    });
    return counts;
  }, [zones, itemPositions, items]);

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (draggingItem || draggingZone || resizingZone) return;
    if (e.button === 1 || (e.button === 0 && e.target === svgRef.current)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [draggingItem, draggingZone, resizingZone, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      return;
    }
    const pt = svgPoint(e.clientX, e.clientY);
    if (draggingItem) {
      setItemPositions(prev => ({ ...prev, [draggingItem]: { x: pt.x, y: pt.y } }));
    }
    if (draggingZone && editMode) {
      const zone = zones.find(z => z.id === draggingZone);
      if (zone) updateZone({ ...zone, x: pt.x - zone.width / 2, y: pt.y - zone.height / 2 });
    }
    if (resizingZone && editMode) {
      const zone = zones.find(z => z.id === resizingZone);
      if (zone) updateZone({ ...zone, width: Math.max(60, pt.x - zone.x), height: Math.max(40, pt.y - zone.y) });
    }
  }, [isPanning, panStart, draggingItem, draggingZone, resizingZone, editMode, svgPoint, zones, setItemPositions, updateZone]);

  const handleMouseUp = useCallback(() => {
    if (draggingItem) {
      const pos = itemPositions[draggingItem];
      if (pos) {
        const targetZone = findZoneAtPoint(zones, pos.x, pos.y);
        const item = items.find(i => i.id === draggingItem);
        if (item && targetZone) {
          onUpdate({ ...item, ubicacion: targetZone.name });
          toast.success(`📍 '${item.nombre}' movido a '${targetZone.name}'`);
        } else if (item && !targetZone) {
          toast.info(`'${item.nombre}' fuera de zona`);
        }
      }
    }
    setDraggingItem(null);
    setDraggingZone(null);
    setResizingZone(null);
    setIsPanning(false);
  }, [draggingItem, itemPositions, zones, items, onUpdate]);

  // Drop from side panel (HTML drag)
  const handleSvgDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("text/plain");
    if (!itemId) return;
    const pt = svgPoint(e.clientX, e.clientY);
    setItemPositions(prev => ({ ...prev, [itemId]: { x: pt.x, y: pt.y } }));
    const targetZone = findZoneAtPoint(zones, pt.x, pt.y);
    const item = items.find(i => i.id === itemId);
    if (item && targetZone) {
      onUpdate({ ...item, ubicacion: targetZone.name });
      toast.success(`📍 '${item.nombre}' ubicado en '${targetZone.name}'`);
    } else if (item) {
      toast.info(`'${item.nombre}' colocado en el mapa`);
    }
    setSidePanelDragItem(null);
  }, [svgPoint, zones, items, onUpdate, setItemPositions]);

  const handleZoomIn = () => setZoom(z => Math.min(3, z + 0.25));
  const handleZoomOut = () => setZoom(z => Math.max(0.5, z - 0.25));
  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const zoomToItem = (itemId: string) => {
    const pos = itemPositions[itemId];
    if (!pos) return;
    setZoom(2);
    setPan({ x: SVG_W / 2 - pos.x * 2, y: SVG_H / 2 - pos.y * 2 });
  };

  const hasZones = zones.length > 0;
  const hasSearch = search.length > 0;

  // Render zone
  const renderZone = (zone: MapZone, isSubzone: boolean) => {
    const parentColor = isSubzone ? zones.find(z => z.id === zone.parentId)?.color || zone.color : zone.color;
    const colors = ZONE_BORDER_COLORS[parentColor];
    const heat = heatMap ? zoneDensity[zone.id] || 0 : 0;
    const count = zoneItemCounts[zone.id] || 0;
    const atCapacity = zone.capacity ? count >= zone.capacity : false;

    return (
      <ContextMenu key={zone.id}>
        <ContextMenuTrigger asChild>
          <g>
            <rect
              x={zone.x} y={zone.y} width={zone.width} height={zone.height}
              rx={isSubzone ? 4 : 6}
              fill={heatMap ? heatColor(heat) : (isSubzone ? colors.lightBg : colors.bg)}
              stroke={atCapacity ? "hsl(0,80%,58%)" : colors.border}
              strokeWidth={editMode ? (isSubzone ? 1.5 : 2) : (isSubzone ? 0.8 : 1.2)}
              strokeDasharray={editMode ? (isSubzone ? "4,2" : "6,3") : (isSubzone ? "3,3" : "none")}
              style={{ cursor: editMode ? "move" : "default", transition: "fill 0.3s" }}
              onMouseDown={e => { if (editMode) { e.stopPropagation(); setDraggingZone(zone.id); } }}
            />
            {/* Zone name */}
            <text x={zone.x + 8} y={zone.y + (isSubzone ? 12 : 16)} fontSize={isSubzone ? 8 : 10} fontWeight={600}
              fill={colors.border} opacity={isSubzone ? 0.7 : 1} style={{ pointerEvents: "none" }}>
              {zone.name}
            </text>
            {/* Capacity indicator */}
            {zone.capacity && !isSubzone && (
              <text x={zone.x + zone.width - 8} y={zone.y + zone.height - 6} textAnchor="end"
                fontSize={8} fill={atCapacity ? "hsl(0,80%,58%)" : colors.border} opacity={0.6}
                style={{ pointerEvents: "none" }}>
                {count}/{zone.capacity}
              </text>
            )}
            {/* QR icon (parent zones only) */}
            {!isSubzone && (
              <g style={{ cursor: "pointer" }}
                onClick={e => { e.stopPropagation(); setQrZone(zone); }}
                transform={`translate(${zone.x + zone.width - 18}, ${zone.y + 5})`}>
                <rect width={14} height={14} rx={2} fill="hsl(var(--card))" stroke={colors.border} strokeWidth={0.5} />
                <text x={7} y={11} textAnchor="middle" fontSize={9} fill={colors.border}>Q</text>
              </g>
            )}
            {/* Type label */}
            {!isSubzone && (
              <text x={zone.x + 8} y={zone.y + zone.height - 6} fontSize={8}
                fill={colors.border} opacity={0.5} style={{ pointerEvents: "none" }}>
                {zone.type}
              </text>
            )}
            {/* Resize handle */}
            {editMode && (
              <rect
                x={zone.x + zone.width - (isSubzone ? 8 : 10)} y={zone.y + zone.height - (isSubzone ? 8 : 10)}
                width={isSubzone ? 8 : 10} height={isSubzone ? 8 : 10} rx={2}
                fill={colors.border} fillOpacity={0.4}
                style={{ cursor: "se-resize" }}
                onMouseDown={e => { e.stopPropagation(); setResizingZone(zone.id); }}
              />
            )}
          </g>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setAddItemZone({ open: true, zoneName: zone.name })}>
            <Plus className="h-3.5 w-3.5 mr-2" />Añadir objeto aquí
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setQrZone(zone)}>
            <QrCode className="h-3.5 w-3.5 mr-2" />Ver código QR
          </ContextMenuItem>
          {canEdit && editMode && (
            <>
              <ContextMenuSeparator />
              {!isSubzone && (
                <ContextMenuItem onClick={() => setZoneDialog({ open: true, parentId: zone.id })}>
                  <Plus className="h-3.5 w-3.5 mr-2" />Añadir subzona
                </ContextMenuItem>
              )}
              <ContextMenuItem onClick={() => setZoneDialog({ open: true, initial: zone })}>
                <Pencil className="h-3.5 w-3.5 mr-2" />Editar {isSubzone ? "subzona" : "zona"}
              </ContextMenuItem>
              <ContextMenuItem className="text-destructive" onClick={() => { removeZone(zone.id); toast.success("Zona eliminada"); }}>
                <Trash2 className="h-3.5 w-3.5 mr-2" />Eliminar
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  return (
    <div className="space-y-3">
      <MapToolbar
        search={search} onSearchChange={setSearch}
        statusFilters={statusFilters} onToggleStatus={toggleStatus}
        responsableFilter={responsableFilter} onResponsableChange={setResponsableFilter}
        heatMap={heatMap} onToggleHeatMap={() => setHeatMap(h => !h)}
        editMode={editMode} onToggleEditMode={() => { setEditMode(e => !e); if (editMode) toast.success("Configuración guardada"); }}
        onAddZone={() => setZoneDialog({ open: true, parentId: null })}
        onAddSubzone={() => setZoneDialog({ open: true, parentId: zones.find(z => !z.parentId)?.id || null })}
        onAddLabel={() => { addLabel({ id: `l-${Date.now()}`, text: "Nueva etiqueta", x: 400, y: 250 }); toast.success("Etiqueta añadida"); }}
        canEdit={canEdit}
      />

      <div className="flex gap-3">
        {/* Side panel - hidden on mobile by default, toggle with button */}
        {isMobile ? (
          !panelCollapsed && (
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setPanelCollapsed(true)}>
              <div className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r shadow-lg animate-slide-in-right" onClick={e => e.stopPropagation()}>
                <ItemSidePanel
                  items={filteredItems}
                  locatedItemIds={locatedItemIds}
                  collapsed={false}
                  onToggle={() => setPanelCollapsed(true)}
                  onDragStart={setSidePanelDragItem}
                  onItemClick={setDetailItem}
                  onZoomToItem={id => { zoomToItem(id); setPanelCollapsed(true); }}
                />
              </div>
            </div>
          )
        ) : (
          <ItemSidePanel
            items={filteredItems}
            locatedItemIds={locatedItemIds}
            collapsed={panelCollapsed}
            onToggle={() => setPanelCollapsed(c => !c)}
            onDragStart={setSidePanelDragItem}
            onItemClick={setDetailItem}
            onZoomToItem={zoomToItem}
          />
        )}

        <div className="flex-1 rounded-lg border bg-card overflow-hidden relative min-w-0">
          {/* Zoom controls + mobile panel toggle */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
            {isMobile && (
              <Button variant="outline" size="icon" className="h-8 w-8 bg-card/90" onClick={() => setPanelCollapsed(false)}>
                <PanelLeft className="h-4 w-4" />
              </Button>
            )}
            <Button variant="outline" size="icon" className="h-8 w-8 bg-card/90" onClick={handleZoomIn}><ZoomIn className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-card/90" onClick={handleZoomOut}><ZoomOut className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-card/90" onClick={handleReset}><RotateCcw className="h-4 w-4" /></Button>
          </div>

          {!hasZones ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <GripVertical className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Aún no has creado tu espacio.</p>
                <p className="text-xs text-muted-foreground mt-1">Comienza dibujando tus zonas de almacenamiento.</p>
              </div>
              {canEdit && (
                <Button size="sm" onClick={() => setZoneDialog({ open: true, parentId: null })} className="gap-1.5">
                  <Plus className="h-4 w-4" />Crear primera zona
                </Button>
              )}
            </div>
          ) : (
            <svg
              ref={svgRef}
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              className="w-full select-none"
              style={{ maxHeight: 560, background: "hsl(var(--card))", cursor: isPanning ? "grabbing" : "default" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onDragOver={e => e.preventDefault()}
              onDrop={handleSvgDrop}
            >
              <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
                {/* Grid */}
                {Array.from({ length: 12 }, (_, i) => (
                  <line key={`v${i}`} x1={i * (SVG_W / 11)} y1={0} x2={i * (SVG_W / 11)} y2={SVG_H}
                    stroke="hsl(var(--border))" strokeWidth={0.3} strokeDasharray="4,8" />
                ))}
                {Array.from({ length: 8 }, (_, i) => (
                  <line key={`h${i}`} x1={0} y1={i * (SVG_H / 7)} x2={SVG_W} y2={i * (SVG_H / 7)}
                    stroke="hsl(var(--border))" strokeWidth={0.3} strokeDasharray="4,8" />
                ))}

                {/* Zones — parent first, then children */}
                {zones.filter(z => !z.parentId).map(z => renderZone(z, false))}
                {zones.filter(z => z.parentId).map(z => renderZone(z, true))}

                {/* Labels */}
                {labels.map(label => (
                  <ContextMenu key={label.id}>
                    <ContextMenuTrigger asChild>
                      <text x={label.x} y={label.y} fontSize={11} fontWeight={500}
                        fill="hsl(var(--muted-foreground))" opacity={0.6}
                        style={{ cursor: editMode ? "move" : "default", pointerEvents: editMode ? "auto" : "none" }}>
                        {label.text}
                      </text>
                    </ContextMenuTrigger>
                    {editMode && (
                      <ContextMenuContent>
                        <ContextMenuItem className="text-destructive" onClick={() => { removeLabel(label.id); toast.success("Etiqueta eliminada"); }}>
                          <Trash2 className="h-3.5 w-3.5 mr-2" />Eliminar etiqueta
                        </ContextMenuItem>
                      </ContextMenuContent>
                    )}
                  </ContextMenu>
                ))}

                {/* Items */}
                {filteredItems.map(item => {
                  const pos = itemPositions[item.id];
                  if (!pos) return null;
                  const isMatch = hasSearch && matchesSearch(item);
                  const isDimmed = hasSearch && !isMatch;
                  const isSelected = selectedItem === item.id;
                  const borderColor = STATUS_BORDER[item.estado];
                  const bgColor = STATUS_BG[item.estado];
                  const r = isMatch ? itemRadius(item.unidades) + 4 : isSelected ? itemRadius(item.unidades) + 2 : itemRadius(item.unidades);

                  return (
                    <ContextMenu key={item.id}>
                      <ContextMenuTrigger asChild>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <g
                              onMouseDown={e => {
                                if (!canEdit) return;
                                e.stopPropagation();
                                setDraggingItem(item.id);
                                setSelectedItem(item.id);
                              }}
                              onClick={() => {
                                setSelectedItem(prev => prev === item.id ? null : item.id);
                                setDetailItem(item);
                              }}
                              style={{
                                cursor: canEdit ? (draggingItem === item.id ? "grabbing" : "grab") : "pointer",
                                transition: "opacity 0.2s",
                                filter: isMatch ? "none" : undefined,
                              }}
                              opacity={isDimmed ? 0.15 : 1}
                            >
                              {/* Glow for search match */}
                              {isMatch && (
                                <circle cx={pos.x} cy={pos.y} r={r + 4} fill="hsla(50,90%,55%,0.3)" stroke="hsl(50,90%,55%)" strokeWidth={1.5}>
                                  <animate attributeName="r" values={`${r + 2};${r + 6};${r + 2}`} dur="1.5s" repeatCount="indefinite" />
                                </circle>
                              )}
                              {/* Shadow */}
                              <circle cx={pos.x + 1} cy={pos.y + 1} r={r} fill="hsla(0,0%,0%,0.08)" />
                              {/* Background circle */}
                              <circle cx={pos.x} cy={pos.y} r={r}
                                fill={bgColor} stroke={borderColor}
                                strokeWidth={isSelected ? 3 : 2}
                              />
                              {/* Photo or initials */}
                              {item.fotoUrl ? (
                                <>
                                  <clipPath id={`clip-${item.id}`}>
                                    <circle cx={pos.x} cy={pos.y} r={r - 2} />
                                  </clipPath>
                                  <image
                                    href={item.fotoUrl}
                                    x={pos.x - r + 2} y={pos.y - r + 2}
                                    width={(r - 2) * 2} height={(r - 2) * 2}
                                    clipPath={`url(#clip-${item.id})`}
                                    style={{ pointerEvents: "none" }}
                                  />
                                </>
                              ) : (
                                <text x={pos.x} y={pos.y + 4} textAnchor="middle"
                                  fill={borderColor} fontSize={r > 14 ? 9 : 7} fontWeight={700}
                                  style={{ pointerEvents: "none", userSelect: "none" }}>
                                  {item.nombre.slice(0, 2).toUpperCase()}
                                </text>
                              )}
                              {/* Units badge for larger items */}
                              {item.unidades > 1 && (
                                <>
                                  <circle cx={pos.x + r - 3} cy={pos.y - r + 3} r={6} fill="hsl(var(--foreground))" />
                                  <text x={pos.x + r - 3} y={pos.y - r + 6} textAnchor="middle"
                                    fontSize={7} fill="hsl(var(--background))" fontWeight={700}
                                    style={{ pointerEvents: "none" }}>
                                    {item.unidades > 99 ? "99+" : item.unidades}
                                  </text>
                                </>
                              )}
                            </g>
                          </TooltipTrigger>
                          <TooltipContent className="bg-foreground/90 text-background text-xs border-0 max-w-[220px] p-3">
                            <p className="font-semibold">{item.nombre}</p>
                            <p className="opacity-70">× {item.unidades} unidades</p>
                            <p className="opacity-70">{item.responsable || "Sin asignar"}</p>
                            <p className="opacity-70">{item.ubicacion || "Sin ubicación"}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: borderColor }} />
                              <span className="opacity-70">{item.estado}</span>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem onClick={() => setDetailItem(item)}>
                          <Eye className="h-3.5 w-3.5 mr-2" />Ver detalles
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => toast.info("Arrastra el objeto a la nueva zona")}>
                          <ArrowRight className="h-3.5 w-3.5 mr-2" />Mover a otra zona
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  );
                })}
              </g>
            </svg>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
        {(["Nuevo", "Funciona", "Averiado", "Roto"] as InventoryStatus[]).map(s => (
          <div key={s} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_BORDER[s] }} />
            <span className="text-muted-foreground">{s}</span>
          </div>
        ))}
        {heatMap && (
          <>
            <div className="h-4 w-px bg-border" />
            <span className="text-muted-foreground">Calor:</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-3 rounded" style={{ backgroundColor: "hsla(210,60%,55%,0.15)" }} />
              <span className="text-muted-foreground">Baja</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-3 rounded" style={{ backgroundColor: "hsla(30,90%,55%,0.3)" }} />
              <span className="text-muted-foreground">Media</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-3 rounded" style={{ backgroundColor: "hsla(0,80%,55%,0.35)" }} />
              <span className="text-muted-foreground">Alta</span>
            </div>
          </>
        )}
      </div>

      {/* Dialogs */}
      <ZoneEditorDialog
        open={zoneDialog.open}
        onClose={() => setZoneDialog({ open: false })}
        onSave={zone => {
          if (zoneDialog.initial?.id) updateZone(zone);
          else addZone(zone);
          toast.success(`Zona '${zone.name}' ${zoneDialog.initial?.id ? "actualizada" : "creada"}`);
        }}
        initial={zoneDialog.initial}
        parentId={zoneDialog.parentId}
      />
      <QRDialog open={!!qrZone} onClose={() => setQrZone(null)} zone={qrZone} />
      <AddItemDialog
        open={addItemZone.open}
        onClose={() => setAddItemZone({ open: false, zoneName: "" })}
        onAdd={item => {
          setItems(prev => [item, ...prev]);
          const targetZone = zones.find(z => z.name === addItemZone.zoneName);
          if (targetZone) {
            setItemPositions(prev => ({
              ...prev,
              [item.id]: { x: targetZone.x + targetZone.width / 2, y: targetZone.y + targetZone.height / 2 },
            }));
          }
          toast.success(`'${item.nombre}' añadido a '${addItemZone.zoneName}'`);
        }}
        zoneName={addItemZone.zoneName}
        nextId={`INV-${String(items.length + 1).padStart(3, "0")}`}
      />
      <ItemDetailModal
        item={detailItem}
        open={!!detailItem}
        onClose={() => setDetailItem(null)}
        onUpdate={updated => { onUpdate(updated); setDetailItem(updated); }}
        onMoveRequest={() => toast.info("Arrastra el objeto a la nueva zona en el mapa")}
      />
    </div>
  );
};

export default InventoryMap;
