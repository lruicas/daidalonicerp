import { createContext, useContext, useState, type ReactNode } from "react";
import type { InventoryItem } from "@/lib/inventory-data";
import { mockInventory } from "@/lib/inventory-data";
import type { MapZone, MapLabel, MapConfig } from "@/lib/zone-data";
import { defaultZones, defaultLabels } from "@/lib/zone-data";

interface InventoryContextType {
  items: InventoryItem[];
  setItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  addItems: (newItems: InventoryItem[]) => void;
  clonedByOrder: Record<string, InventoryItem[]>;
  registerCloned: (orderId: string, items: InventoryItem[]) => void;
  // Map config
  mapConfig: MapConfig;
  setZones: React.Dispatch<React.SetStateAction<MapZone[]>>;
  setLabels: React.Dispatch<React.SetStateAction<MapLabel[]>>;
  setItemPositions: React.Dispatch<React.SetStateAction<Record<string, { x: number; y: number }>>>;
  addZone: (zone: MapZone) => void;
  updateZone: (zone: MapZone) => void;
  removeZone: (id: string) => void;
  addLabel: (label: MapLabel) => void;
  removeLabel: (id: string) => void;
}

const InventoryContext = createContext<InventoryContextType | null>(null);

// Generate default positions for items within zones
function generateDefaultPositions(items: InventoryItem[], zones: MapZone[]): Record<string, { x: number; y: number }> {
  const sinUbicar = zones.find(z => z.id === "z-sin");
  const positions: Record<string, { x: number; y: number }> = {};
  
  // Map items to zones by matching ubicacion text
  const zoneKeywords: Record<string, string[]> = {
    "z1-a": ["balda superior", "estantería a"],
    "z1-b": ["balda central", "armario 3"],
    "z1-c": ["balda inferior"],
    "z1": ["armario principal", "armario"],
    "z2": ["mesa", "sala diseño", "mesa principal"],
    "z3-a": ["cajón 1", "cajón de electrónica"],
    "z3-b": ["cajón 2"],
    "z3": ["estantería", "electrónica"],
    "z4": ["rack", "servidor", "planta 2"],
    "z5": ["almacén b", "almacén"],
  };

  items.forEach((item, idx) => {
    const ub = item.ubicacion.toLowerCase();
    let targetZone: MapZone | undefined;

    for (const [zoneId, keywords] of Object.entries(zoneKeywords)) {
      if (keywords.some(k => ub.includes(k))) {
        targetZone = zones.find(z => z.id === zoneId);
        break;
      }
    }

    if (!targetZone && sinUbicar) targetZone = sinUbicar;
    if (!targetZone) targetZone = zones[0];

    if (targetZone) {
      // Spread items within zone
      const padding = 20;
      const cols = Math.max(1, Math.floor((targetZone.width - padding * 2) / 36));
      const row = Math.floor(idx % 6 / cols);
      const col = idx % cols;
      positions[item.id] = {
        x: targetZone.x + padding + col * 36 + 16,
        y: targetZone.y + padding + 14 + row * 36,
      };
    }
  });

  return positions;
}

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<InventoryItem[]>(mockInventory);
  const [clonedByOrder, setClonedByOrder] = useState<Record<string, InventoryItem[]>>({});
  const [zones, setZones] = useState<MapZone[]>(defaultZones);
  const [labels, setLabels] = useState<MapLabel[]>(defaultLabels);
  const [itemPositions, setItemPositions] = useState<Record<string, { x: number; y: number }>>(() =>
    generateDefaultPositions(mockInventory, defaultZones)
  );

  const addItems = (newItems: InventoryItem[]) => {
    setItems((prev) => [...newItems, ...prev]);
    // Place new items in "Sin ubicar" zone
    const sinUbicar = zones.find(z => z.id === "z-sin");
    if (sinUbicar) {
      const newPos: Record<string, { x: number; y: number }> = {};
      newItems.forEach((item, i) => {
        newPos[item.id] = {
          x: sinUbicar.x + 20 + (i % 3) * 36,
          y: sinUbicar.y + 30 + Math.floor(i / 3) * 36,
        };
      });
      setItemPositions(prev => ({ ...prev, ...newPos }));
    }
  };

  const registerCloned = (orderId: string, cloned: InventoryItem[]) => {
    setClonedByOrder((prev) => ({ ...prev, [orderId]: cloned }));
    addItems(cloned);
  };

  const addZone = (zone: MapZone) => setZones(prev => [...prev, zone]);
  const updateZone = (zone: MapZone) => setZones(prev => prev.map(z => z.id === zone.id ? zone : z));
  const removeZone = (id: string) => setZones(prev => prev.filter(z => z.id !== id && z.parentId !== id));
  const addLabel = (label: MapLabel) => setLabels(prev => [...prev, label]);
  const removeLabel = (id: string) => setLabels(prev => prev.filter(l => l.id !== id));

  const mapConfig: MapConfig = { zones, labels, itemPositions };

  return (
    <InventoryContext.Provider value={{
      items, setItems, addItems, clonedByOrder, registerCloned,
      mapConfig, setZones, setLabels, setItemPositions,
      addZone, updateZone, removeZone, addLabel, removeLabel,
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used within InventoryProvider");
  return ctx;
};
