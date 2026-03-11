import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MapZone, ZoneType, ZoneBorderColor } from "@/lib/zone-data";
import { ZONE_TYPES, ZONE_BORDER_COLORS } from "@/lib/zone-data";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (zone: MapZone) => void;
  initial?: Partial<MapZone>;
  parentId?: string | null;
}

const ZoneEditorDialog = ({ open, onClose, onSave, initial, parentId = null }: Props) => {
  const [name, setName] = useState(initial?.name || "");
  const [type, setType] = useState<ZoneType>(initial?.type || "Armario");
  const [color, setColor] = useState<ZoneBorderColor>(initial?.color || "turquesa");

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: initial?.id || `z-${Date.now()}`,
      name: name.trim(),
      type,
      color,
      x: initial?.x || 100,
      y: initial?.y || 100,
      width: initial?.width || (parentId ? 120 : 200),
      height: initial?.height || (parentId ? 60 : 140),
      parentId: parentId ?? initial?.parentId ?? null,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initial?.id ? "Editar zona" : parentId ? "Añadir subzona" : "Añadir zona"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Nombre</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Armario A" autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label>Tipo</Label>
            <Select value={type} onValueChange={v => setType(v as ZoneType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ZONE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Color de borde</Label>
            <div className="flex gap-3">
              {(Object.keys(ZONE_BORDER_COLORS) as ZoneBorderColor[]).map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${color === c ? "ring-2 ring-offset-2 ring-ring scale-110" : "opacity-60 hover:opacity-100"}`}
                  style={{ backgroundColor: ZONE_BORDER_COLORS[c].bg, borderColor: ZONE_BORDER_COLORS[c].border }}
                  title={c}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!name.trim()}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ZoneEditorDialog;
