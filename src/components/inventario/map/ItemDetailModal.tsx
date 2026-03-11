import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, ExternalLink, Eye, ArrowRight, Calendar, User, MapPin, Hash, Layers, Clock } from "lucide-react";
import type { InventoryItem, InventoryStatus } from "@/lib/inventory-data";
import { INVENTORY_STATUSES } from "@/lib/inventory-data";
import { useNavigate } from "react-router-dom";
import { useInventory } from "@/contexts/InventoryContext";
import { useState } from "react";

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
  const { getItemHistory } = useInventory();
  const [tab, setTab] = useState<"details" | "history">("details");

  if (!item) return null;

  const history = getItemHistory(item.id);

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

        {/* Tab switcher */}
        <div className="flex gap-1 border-b">
          <button
            onClick={() => setTab("details")}
            className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors ${
              tab === "details" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Detalles
          </button>
          <button
            onClick={() => setTab("history")}
            className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1 ${
              tab === "history" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="h-3 w-3" />
            Historial
            {history.length > 0 && (
              <span className="ml-1 text-[10px] bg-muted rounded-full px-1.5 py-0.5">{history.length}</span>
            )}
          </button>
        </div>

        {tab === "details" ? (
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
        ) : (
          <ScrollArea className="max-h-[280px]">
            {history.length === 0 ? (
              <div className="py-8 text-center">
                <Clock className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                <p className="text-xs text-muted-foreground">Sin movimientos registrados</p>
              </div>
            ) : (
              <div className="relative pl-4 py-2 space-y-0">
                {/* Timeline line */}
                <div className="absolute left-[7px] top-4 bottom-4 w-px bg-border" />
                {history.map((mv, i) => (
                  <div key={mv.id} className="relative flex gap-3 pb-4 last:pb-0">
                    <div className={`relative z-10 w-3 h-3 rounded-full border-2 mt-0.5 shrink-0 ${
                      i === 0 ? "bg-primary border-primary" : "bg-card border-muted-foreground/30"
                    }`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-foreground">
                        <span className="text-muted-foreground">De</span> {mv.fromZone} <span className="text-muted-foreground">→</span> {mv.toZone}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-muted-foreground">{mv.date}</span>
                        <span className="text-[10px] text-muted-foreground">por {mv.movedBy}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        )}

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
