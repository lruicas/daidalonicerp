import { createContext, useContext, useState, type ReactNode } from "react";
import type { InventoryItem } from "@/lib/inventory-data";
import { mockInventory } from "@/lib/inventory-data";
import type { MapZone, MapLabel, MapConfig, MovementRecord } from "@/lib/zone-data";
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
  // Movement history
  movementHistory: MovementRecord[];
  addMovement: (record: Omit<MovementRecord, "id">) => void;
  getItemHistory: (itemId: string) => MovementRecord[];
}

const InventoryContext = createContext<InventoryContextType | null>(null);

function generateDefaultPositions(items: InventoryItem[], zones: MapZone[]): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {};
  
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

    if (!targetZone) targetZone = zones[0];

    if (targetZone) {
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

// Seed some example movement history
const seedHistory: MovementRecord[] = [
  { id: "mv-1", itemId: "INV-001", fromZone: "Almacén B", toZone: "Sala Diseño, mesa principal", date: "2026-03-01", movedBy: "Ana Martínez" },
  { id: "mv-2", itemId: "INV-002", fromZone: "Estantería de electrónica", toZone: "Armario 3, cajón 2", date: "2026-02-20", movedBy: "Pedro López" },
  { id: "mv-3", itemId: "INV-004", fromZone: "Mesa de trabajo", toZone: "Rack servidor, planta 2", date: "2026-01-10", movedBy: "Miguel Torres" },
  { id: "mv-4", itemId: "INV-005", fromZone: "Sala de reuniones B", toZone: "Sala de reuniones A", date: "2025-08-15", movedBy: "Carlos García" },
  { id: "mv-5", itemId: "INV-003", fromZone: "Armario principal", toZone: "Almacén B, estantería 1", date: "2026-05-10", movedBy: "Laura Sánchez" },
];

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<InventoryItem[]>(mockInventory);
  const [clonedByOrder, setClonedByOrder] = useState<Record<string, InventoryItem[]>>({});
  const [zones, setZones] = useState<MapZone[]>(defaultZones);
  const [labels, setLabels] = useState<MapLabel[]>(defaultLabels);
  const [itemPositions, setItemPositions] = useState<Record<string, { x: number; y: number }>>(() =>
    generateDefaultPositions(mockInventory, defaultZones)
  );
  const [movementHistory, setMovementHistory] = useState<MovementRecord[]>(seedHistory);

  const addItems = (newItems: InventoryItem[]) => {
    setItems((prev) => [...newItems, ...prev]);
  };

  const registerCloned = (orderId: string, cloned: InventoryItem[]) => {
    setClonedByOrder((prev) => ({ ...prev, [orderId]: cloned }));
    addItems(cloned);
  };

  const addMovement = (record: Omit<MovementRecord, "id">) => {
    const newRecord: MovementRecord = { ...record, id: `mv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` };
    setMovementHistory(prev => [newRecord, ...prev]);
  };

  const getItemHistory = (itemId: string) => movementHistory.filter(m => m.itemId === itemId);

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
      movementHistory, addMovement, getItemHistory,
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
