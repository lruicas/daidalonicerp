import { useState, useMemo } from "react";
import { Sparkles, CheckCircle2, ArrowRight, Lightbulb, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useInventory } from "@/contexts/InventoryContext";
import type { InventoryItem } from "@/lib/inventory-data";
import type { MapZone } from "@/lib/zone-data";

interface Suggestion {
  id: string;
  type: "relocate" | "capacity" | "coherence" | "group";
  title: string;
  description: string;
  itemIds: string[];
  targetZone?: string;
  confidence: number;
}

function generateSuggestions(items: InventoryItem[], zones: MapZone[], itemPositions: Record<string, { x: number; y: number }>): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const locatedItems = items.filter(i => itemPositions[i.id]);

  // 1. Section coherence: items of same section should be near each other
  const sectionZoneMap: Record<string, Record<string, number>> = {};
  locatedItems.forEach(item => {
    const pos = itemPositions[item.id];
    if (!pos) return;
    const zone = zones.find(z => !z.parentId && pos.x >= z.x && pos.x <= z.x + z.width && pos.y >= z.y && pos.y <= z.y + z.height);
    if (!zone) return;
    if (!sectionZoneMap[item.seccion]) sectionZoneMap[item.seccion] = {};
    sectionZoneMap[item.seccion][zone.name] = (sectionZoneMap[item.seccion][zone.name] || 0) + 1;
  });

  Object.entries(sectionZoneMap).forEach(([section, zoneCounts]) => {
    const entries = Object.entries(zoneCounts).sort((a, b) => b[1] - a[1]);
    if (entries.length > 1) {
      const mainZone = entries[0][0];
      const outliers = locatedItems.filter(item => {
        if (item.seccion !== section) return false;
        const pos = itemPositions[item.id];
        if (!pos) return false;
        const zone = zones.find(z => !z.parentId && pos.x >= z.x && pos.x <= z.x + z.width && pos.y >= z.y && pos.y <= z.y + z.height);
        return zone && zone.name !== mainZone;
      });
      if (outliers.length > 0) {
        suggestions.push({
          id: `coh-${section}`,
          type: "coherence",
          title: `Consolidar ${section}`,
          description: `El ${Math.round(entries[0][1] / locatedItems.filter(i => i.seccion === section).length * 100)}% de objetos de ${section} están en "${mainZone}". ${outliers.length} objeto(s) están dispersos.`,
          itemIds: outliers.map(i => i.id),
          targetZone: mainZone,
          confidence: 0.85,
        });
      }
    }
  });

  // 2. Capacity warnings
  zones.filter(z => z.capacity && !z.parentId).forEach(zone => {
    const count = Object.entries(itemPositions).filter(([id, pos]) =>
      pos.x >= zone.x && pos.x <= zone.x + zone.width && pos.y >= zone.y && pos.y <= zone.y + zone.height && items.some(i => i.id === id)
    ).length;
    if (zone.capacity && count >= zone.capacity * 0.9) {
      const averiados = locatedItems.filter(item => {
        const pos = itemPositions[item.id];
        return pos && item.estado === "Averiado" && pos.x >= zone.x && pos.x <= zone.x + zone.width && pos.y >= zone.y && pos.y <= zone.y + zone.height;
      });
      if (averiados.length > 0) {
        suggestions.push({
          id: `cap-${zone.id}`,
          type: "capacity",
          title: `"${zone.name}" casi llena`,
          description: `Al ${Math.round(count / zone.capacity! * 100)}% de capacidad. ${averiados.length} objeto(s) averiado(s) podrían reubicarse.`,
          itemIds: averiados.map(i => i.id),
          confidence: 0.78,
        });
      }
    }
  });

  // 3. Damaged items grouping
  const damaged = locatedItems.filter(i => i.estado === "Averiado" || i.estado === "Roto");
  if (damaged.length >= 2) {
    const damagedZones = new Set<string>();
    damaged.forEach(item => {
      const pos = itemPositions[item.id];
      if (!pos) return;
      const zone = zones.find(z => !z.parentId && pos.x >= z.x && pos.x <= z.x + z.width && pos.y >= z.y && pos.y <= z.y + z.height);
      if (zone) damagedZones.add(zone.name);
    });
    if (damagedZones.size > 1) {
      suggestions.push({
        id: "group-damaged",
        type: "group",
        title: "Agrupar objetos dañados",
        description: `Hay ${damaged.length} objetos averiados/rotos dispersos en ${damagedZones.size} zonas. Considera crear una zona de reparación.`,
        itemIds: damaged.map(i => i.id),
        confidence: 0.72,
      });
    }
  }

  // 4. Unlocated items suggestion
  const unlocated = items.filter(i => !itemPositions[i.id]);
  if (unlocated.length > 0) {
    // Suggest locations based on section
    unlocated.slice(0, 3).forEach(item => {
      const sameSection = locatedItems.filter(i => i.seccion === item.seccion);
      if (sameSection.length > 0) {
        const pos = itemPositions[sameSection[0].id];
        const zone = zones.find(z => !z.parentId && pos && pos.x >= z.x && pos.x <= z.x + z.width && pos.y >= z.y && pos.y <= z.y + z.height);
        if (zone) {
          suggestions.push({
            id: `loc-${item.id}`,
            type: "relocate",
            title: `Ubicar "${item.nombre}"`,
            description: `Basado en su sección (${item.seccion}), este objeto debería ir en "${zone.name}" donde hay ${sameSection.length} objeto(s) similares.`,
            itemIds: [item.id],
            targetZone: zone.name,
            confidence: 0.9,
          });
        }
      }
    });
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  relocate: <ArrowRight className="h-3.5 w-3.5" />,
  capacity: <Lightbulb className="h-3.5 w-3.5" />,
  coherence: <Lightbulb className="h-3.5 w-3.5" />,
  group: <Lightbulb className="h-3.5 w-3.5" />,
};

const TYPE_LABELS: Record<string, string> = {
  relocate: "Ubicación",
  capacity: "Capacidad",
  coherence: "Coherencia",
  group: "Agrupación",
};

interface Props {
  open: boolean;
  onClose: () => void;
}

const AIAssistantPanel = ({ open, onClose }: Props) => {
  const { items, mapConfig, setItemPositions } = useInventory();
  const { zones, itemPositions } = mapConfig;
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const suggestions = useMemo(() => generateSuggestions(items, zones, itemPositions), [items, zones, itemPositions]);

  const handleApply = (suggestion: Suggestion) => {
    if (suggestion.targetZone) {
      const targetZone = zones.find(z => z.name === suggestion.targetZone);
      if (targetZone) {
        const newPositions: Record<string, { x: number; y: number }> = {};
        suggestion.itemIds.forEach((id, i) => {
          newPositions[id] = {
            x: targetZone.x + 30 + (i % 4) * 36,
            y: targetZone.y + 30 + Math.floor(i / 4) * 36,
          };
        });
        setItemPositions(prev => ({ ...prev, ...newPositions }));
      }
    }
    setAppliedIds(prev => new Set([...prev, suggestion.id]));
    toast.success(`Sugerencia aplicada: ${suggestion.title}`);
  };

  if (!open) return null;

  return (
    <div className="fixed right-4 top-1/4 z-50 w-80 rounded-xl border bg-card shadow-xl animate-in slide-in-from-right-5 max-h-[60vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-primary/5 to-accent/5 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">Asistente IA</p>
            <p className="text-[10px] text-muted-foreground">Sugerencias de organización</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 space-y-2">
          {suggestions.length === 0 ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="h-10 w-10 mx-auto text-primary/40 mb-2" />
              <p className="text-sm font-medium text-foreground">¡Todo en orden!</p>
              <p className="text-xs text-muted-foreground mt-1">No hay sugerencias de mejora en este momento.</p>
            </div>
          ) : (
            suggestions.map(s => {
              const isApplied = appliedIds.has(s.id);
              const isExpanded = expandedId === s.id;
              return (
                <div key={s.id} className={`rounded-lg border p-3 transition-colors ${isApplied ? "bg-primary/5 border-primary/20" : "hover:bg-accent/30"}`}>
                  <button className="w-full text-left" onClick={() => setExpandedId(isExpanded ? null : s.id)}>
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 text-primary">{TYPE_ICONS[s.type]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-semibold">{s.title}</span>
                          <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">{TYPE_LABELS[s.type]}</Badge>
                          <span className="text-[9px] text-muted-foreground ml-auto">{Math.round(s.confidence * 100)}%</span>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" /> : <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="mt-2 ml-6 space-y-2">
                      <p className="text-xs text-muted-foreground">{s.description}</p>
                      <div className="flex items-center gap-2">
                        {s.targetZone && !isApplied && (
                          <Button size="sm" className="h-7 text-xs gap-1" onClick={() => handleApply(s)}>
                            <CheckCircle2 className="h-3 w-3" />Aplicar
                          </Button>
                        )}
                        {isApplied && (
                          <span className="text-xs text-primary font-medium flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />Aplicada
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      {suggestions.length > 0 && (
        <div className="border-t px-4 py-2">
          <p className="text-[10px] text-muted-foreground text-center">
            {suggestions.filter(s => !appliedIds.has(s.id)).length} sugerencia(s) pendiente(s)
          </p>
        </div>
      )}
    </div>
  );
};

export default AIAssistantPanel;
