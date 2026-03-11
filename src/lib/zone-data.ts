export type ZoneType = "Armario" | "Estantería" | "Mesa" | "Caja" | "Rack" | "Almacén" | "Sala" | "Otro";

export const ZONE_TYPES: ZoneType[] = ["Armario", "Estantería", "Mesa", "Caja", "Rack", "Almacén", "Sala", "Otro"];

export type ZoneBorderColor = "turquesa" | "naranja" | "rosa";

export const ZONE_BORDER_COLORS: Record<ZoneBorderColor, { border: string; bg: string; lightBg: string }> = {
  turquesa: { border: "hsl(168,62%,55%)", bg: "hsla(168,62%,55%,0.08)", lightBg: "hsla(168,62%,55%,0.04)" },
  naranja:  { border: "hsl(30,95%,62%)",  bg: "hsla(30,95%,62%,0.08)",  lightBg: "hsla(30,95%,62%,0.04)" },
  rosa:     { border: "hsl(340,82%,65%)", bg: "hsla(340,82%,65%,0.08)", lightBg: "hsla(340,82%,65%,0.04)" },
};

export interface MapZone {
  id: string;
  name: string;
  type: ZoneType;
  color: ZoneBorderColor;
  x: number;
  y: number;
  width: number;
  height: number;
  parentId: string | null; // null = top-level, string = subzone
  capacity?: number; // max items, optional
}

export interface MapLabel {
  id: string;
  text: string;
  x: number;
  y: number;
}

export interface MovementRecord {
  id: string;
  itemId: string;
  fromZone: string;
  toZone: string;
  date: string;
  movedBy: string;
}

export interface MapConfig {
  zones: MapZone[];
  labels: MapLabel[];
  itemPositions: Record<string, { x: number; y: number }>; // itemId -> position
}

// Default example zones
export const defaultZones: MapZone[] = [
  { id: "z1", name: "Armario principal", type: "Armario", color: "turquesa", x: 40, y: 40, width: 260, height: 200, parentId: null },
  { id: "z1-a", name: "Balda superior", type: "Estantería", color: "turquesa", x: 50, y: 55, width: 110, height: 55, parentId: "z1" },
  { id: "z1-b", name: "Balda central", type: "Estantería", color: "turquesa", x: 50, y: 120, width: 110, height: 55, parentId: "z1" },
  { id: "z1-c", name: "Balda inferior", type: "Estantería", color: "turquesa", x: 170, y: 55, width: 120, height: 120, parentId: "z1" },
  { id: "z2", name: "Mesa de trabajo", type: "Mesa", color: "naranja", x: 340, y: 40, width: 240, height: 140, parentId: null },
  { id: "z3", name: "Estantería de electrónica", type: "Estantería", color: "rosa", x: 40, y: 280, width: 300, height: 160, parentId: null },
  { id: "z3-a", name: "Cajón 1", type: "Caja", color: "rosa", x: 50, y: 295, width: 130, height: 60, parentId: "z3" },
  { id: "z3-b", name: "Cajón 2", type: "Caja", color: "rosa", x: 195, y: 295, width: 130, height: 60, parentId: "z3" },
  { id: "z4", name: "Rack servidor", type: "Rack", color: "turquesa", x: 620, y: 40, width: 140, height: 180, parentId: null },
  { id: "z5", name: "Almacén B", type: "Almacén", color: "naranja", x: 380, y: 280, width: 200, height: 160, parentId: null },
];

export const defaultLabels: MapLabel[] = [
  { id: "l1", text: "Zona de hardware", x: 140, y: 268 },
  { id: "l2", text: "Zona de materiales", x: 460, y: 268 },
];

export function findZoneAtPoint(zones: MapZone[], x: number, y: number): MapZone | null {
  // Prefer subzones (children) over parents
  const subzones = zones.filter(z => z.parentId !== null);
  const topLevel = zones.filter(z => z.parentId === null);
  
  for (const z of subzones) {
    if (x >= z.x && x <= z.x + z.width && y >= z.y && y <= z.y + z.height) return z;
  }
  for (const z of topLevel) {
    if (x >= z.x && x <= z.x + z.width && y >= z.y && y <= z.y + z.height) return z;
  }
  return null;
}

export function getItemsInZone(zoneId: string, zones: MapZone[], itemPositions: Record<string, { x: number; y: number }>): string[] {
  const zone = zones.find(z => z.id === zoneId);
  if (!zone) return [];
  return Object.entries(itemPositions)
    .filter(([, pos]) => pos.x >= zone.x && pos.x <= zone.x + zone.width && pos.y >= zone.y && pos.y <= zone.y + zone.height)
    .map(([id]) => id);
}
