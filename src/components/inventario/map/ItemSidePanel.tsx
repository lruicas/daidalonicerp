import { useState, useMemo } from "react";
import { Package, MapPin, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { InventoryItem, InventoryStatus } from "@/lib/inventory-data";

const STATUS_DOT: Record<InventoryStatus, string> = {
  Nuevo: "bg-[hsl(168,62%,55%)]",
  Funciona: "bg-[hsl(142,60%,50%)]",
  Averiado: "bg-[hsl(30,95%,55%)]",
  Roto: "bg-[hsl(0,80%,58%)]",
};

interface Props {
  items: InventoryItem[];
  locatedItemIds: Set<string>;
  collapsed: boolean;
  onToggle: () => void;
  onDragStart: (itemId: string) => void;
  onItemClick: (item: InventoryItem) => void;
  onZoomToItem: (itemId: string) => void;
}

const ItemSidePanel = ({ items, locatedItemIds, collapsed, onToggle, onDragStart, onItemClick, onZoomToItem }: Props) => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("unlocated");

  const unlocated = useMemo(() => items.filter(i => !locatedItemIds.has(i.id)), [items, locatedItemIds]);
  const located = useMemo(() => items.filter(i => locatedItemIds.has(i.id)), [items, locatedItemIds]);

  const filterItems = (list: InventoryItem[]) => {
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter(i => i.nombre.toLowerCase().includes(q) || i.responsable.toLowerCase().includes(q) || i.id.toLowerCase().includes(q));
  };

  const ItemCard = ({ item }: { item: InventoryItem }) => (
    <div
      draggable
      onDragStart={e => {
        e.dataTransfer.setData("text/plain", item.id);
        onDragStart(item.id);
      }}
      onClick={() => onItemClick(item)}
      className="flex items-center gap-2 p-2 rounded-md border bg-card hover:bg-accent/50 cursor-grab active:cursor-grabbing transition-colors group"
    >
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 border">
        {item.fotoUrl ? (
          <img src={item.fotoUrl} alt="" className="w-full h-full rounded-full object-cover" />
        ) : (
          <Package className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{item.nombre}</p>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[item.estado]}`} />
          <span className="text-[10px] text-muted-foreground">{item.unidades}u · {item.estado}</span>
        </div>
      </div>
      {locatedItemIds.has(item.id) && (
        <button
          onClick={e => { e.stopPropagation(); onZoomToItem(item.id); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          title="Zoom al objeto"
        >
          <MapPin className="h-3.5 w-3.5 text-primary" />
        </button>
      )}
    </div>
  );

  if (collapsed) {
    return (
      <div className="flex flex-col items-center">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={onToggle}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="mt-2 writing-mode-vertical text-xs text-muted-foreground">
          {unlocated.length > 0 && (
            <Badge variant="secondary" className="text-[10px] px-1 py-0 mb-1">{unlocated.length}</Badge>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 shrink-0 flex flex-col border rounded-lg bg-card overflow-hidden">
      <div className="flex items-center justify-between p-2 border-b">
        <span className="text-xs font-semibold">Objetos</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onToggle}>
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Buscar…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-7 text-xs pl-7"
          />
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-2 h-7">
          <TabsTrigger value="unlocated" className="text-[10px] h-6 gap-1">
            Sin ubicar
            {unlocated.length > 0 && (
              <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4 min-w-4">{unlocated.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all" className="text-[10px] h-6">Todos ({items.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="unlocated" className="flex-1 m-0 min-h-0">
          <ScrollArea className="h-full max-h-[400px] p-2">
            <div className="space-y-1.5">
              {filterItems(unlocated).length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  {unlocated.length === 0 ? "¡Todos ubicados! 🎉" : "Sin resultados"}
                </p>
              ) : (
                filterItems(unlocated).map(item => <ItemCard key={item.id} item={item} />)
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="all" className="flex-1 m-0 min-h-0">
          <ScrollArea className="h-full max-h-[400px] p-2">
            <div className="space-y-1.5">
              {filterItems(located.concat(unlocated)).length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">Sin resultados</p>
              ) : (
                filterItems(located.concat(unlocated)).map(item => <ItemCard key={item.id} item={item} />)
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ItemSidePanel;
