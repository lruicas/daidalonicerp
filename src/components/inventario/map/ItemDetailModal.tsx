import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, ExternalLink, Eye, ArrowRight, Calendar, User, MapPin, Hash, Layers } from "lucide-react";
import type { InventoryItem, InventoryStatus } from "@/lib/inventory-data";
import { INVENTORY_STATUSES } from "@/lib/inventory-data";
import { useNavigate } from "react-router-dom";

const STATUS_COLOR: Record<InventoryStatus, string> = {
  Nuevo: "bg-[hsl(168,62%,55%)]",
  Funciona: "bg-[hsl(142,60%,50%)]",
  Averiado: "bg-[hsl(30,95%,55%)]",
  Roto: "bg-[hsl(0,80%,58%)]",
};

interface Props {
  item: InventoryItem | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (item: InventoryItem) => void;
  onMoveRequest: () => void;
}

const ItemDetailModal = ({ item, open, onClose, onUpdate, onMoveRequest }: Props) => {
  const navigate = useNavigate();

  if (!item) return null;

  const handleStateChange = (estado: InventoryStatus) => {
    onUpdate({ ...item, estado });
  };

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border shrink-0">
              {item.fotoUrl ? (
                <img src={item.fotoUrl} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <Package className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{item.nombre}</p>
              <p className="text-xs text-muted-foreground font-normal">{item.id}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Estado</span>
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${STATUS_COLOR[item.estado]}`} />
              <Select value={item.estado} onValueChange={v => handleStateChange(v as InventoryStatus)}>
                <SelectTrigger className="h-7 w-32 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INVENTORY_STATUSES.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Hash className="h-3 w-3" />
              <span>Unidades: <strong className="text-foreground">{item.unidades}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <User className="h-3 w-3" />
              <span className="truncate">{item.responsable || "Sin asignar"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{item.ubicacion || "Sin ubicación"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{item.fecha}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
              <Layers className="h-3 w-3" />
              <span>{item.seccion}</span>
            </div>
          </div>

          {item.observaciones && (
            <div className="text-xs p-2 rounded bg-muted/50">
              <p className="text-muted-foreground mb-0.5">Observaciones</p>
              <p>{item.observaciones}</p>
            </div>
          )}

          {item.enlace && (
            <a href={item.enlace} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
              <ExternalLink className="h-3 w-3" />Enlace del producto
            </a>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => {
            onClose();
            navigate(`/inventario?highlight=${item.id}`);
          }}>
            <Eye className="h-3.5 w-3.5" />Ver en tabla
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => {
            onClose();
            onMoveRequest();
          }}>
            <ArrowRight className="h-3.5 w-3.5" />Mover a otra zona
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDetailModal;
