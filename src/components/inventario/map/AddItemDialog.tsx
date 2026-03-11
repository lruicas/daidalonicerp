import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MEMBERS, INVENTORY_STATUSES } from "@/lib/inventory-data";
import { SECTIONS } from "@/lib/budget-data";
import type { InventoryItem, InventoryStatus } from "@/lib/inventory-data";
import type { Section } from "@/lib/budget-data";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (item: InventoryItem) => void;
  zoneName: string;
  nextId: string;
}

const AddItemDialog = ({ open, onClose, onAdd, zoneName, nextId }: Props) => {
  const [nombre, setNombre] = useState("");
  const [unidades, setUnidades] = useState(1);
  const [responsable, setResponsable] = useState(MEMBERS[0]);
  const [estado, setEstado] = useState<InventoryStatus>("Nuevo");
  const [seccion, setSeccion] = useState<Section>("E-Hardware");

  const handleSave = () => {
    if (!nombre.trim()) return;
    onAdd({
      id: nextId,
      nombre: nombre.trim(),
      unidades,
      ubicacion: zoneName,
      responsable,
      estado,
      seccion,
      enlace: "",
      observaciones: "",
      fecha: new Date().toISOString().slice(0, 10),
      fotoUrl: "",
      presupuestoId: "",
    });
    setNombre("");
    setUnidades(1);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo objeto en "{zoneName}"</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label>Nombre</Label>
            <Input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Arduino Uno" autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Unidades</Label>
              <Input type="number" min={1} value={unidades} onChange={e => setUnidades(Number(e.target.value) || 1)} />
            </div>
            <div className="space-y-1.5">
              <Label>Estado</Label>
              <Select value={estado} onValueChange={v => setEstado(v as InventoryStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{INVENTORY_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Responsable</Label>
              <Select value={responsable} onValueChange={setResponsable}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{MEMBERS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Sección</Label>
              <Select value={seccion} onValueChange={v => setSeccion(v as Section)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!nombre.trim()}>Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
