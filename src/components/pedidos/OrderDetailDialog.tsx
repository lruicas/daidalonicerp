import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";
import { toast } from "sonner";
import { useRole } from "@/contexts/RoleContext";
import { useInventory } from "@/contexts/InventoryContext";
import OrderProgressBar from "./OrderProgressBar";
import OcrScanner from "./OcrScanner";
import ClonedInventoryItems from "./ClonedInventoryItems";
import type { Order, OrderStatus, ShippingStatus, PurchaseType } from "@/lib/orders-data";
import { ORDER_STEPS, SHIPPING_STATUSES, PURCHASE_TYPES } from "@/lib/orders-data";
import { EVENTS } from "@/lib/budget-data";
import type { InventoryItem } from "@/lib/inventory-data";

interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updated: Order) => void;
}

/** Simulated products that would come from budget/order line items */
const SIMULATED_PRODUCTS: Record<string, { nombre: string; unidades: number; seccion: string }[]> = {
  "PED-001": [
    { nombre: "Licencia Adobe CC (anual)", unidades: 10, seccion: "E-Software" },
    { nombre: "Licencia Adobe Fonts", unidades: 10, seccion: "E-Software" },
  ],
  "PED-002": [
    { nombre: "Monitor 4K 27\"", unidades: 3, seccion: "E-Hardware" },
  ],
  "PED-003": [
    { nombre: "Hosting AWS (1 año)", unidades: 1, seccion: "E-Software" },
  ],
  "PED-004": [
    { nombre: "Servicio catering Gala (200 pax)", unidades: 1, seccion: "RRPP-Corporativa" },
  ],
  "PED-005": [
    { nombre: "Teclado mecánico Cherry MX", unidades: 10, seccion: "E-Hardware" },
  ],
  "PED-006": [
    { nombre: "Camisetas corporativas", unidades: 100, seccion: "RRPP-Marketing" },
    { nombre: "Tazas corporativas", unidades: 50, seccion: "RRPP-Marketing" },
  ],
};

const OrderDetailDialog = ({ order, open, onOpenChange, onUpdate }: OrderDetailDialogProps) => {
  const { canEdit } = useRole();
  const { clonedByOrder, registerCloned, items: inventoryItems } = useInventory();
  const cloningRef = useRef<Set<string>>(new Set());

  if (!order) return null;

  const clonedItems = clonedByOrder[order.id] || [];

  const update = (patch: Partial<Order>) => {
    const updated = { ...order, ...patch };

    // Detect status change to "Terminado"
    if (
      patch.estado === "Terminado" &&
      order.estado !== "Terminado" &&
      !clonedByOrder[order.id] &&
      !cloningRef.current.has(order.id)
    ) {
      cloningRef.current.add(order.id);
      toast("✅ Pedido terminado. Generando elementos en inventario...", {
        duration: 3000,
      });

      const products = SIMULATED_PRODUCTS[order.id] || [
        { nombre: order.nombre, unidades: 1, seccion: "E-Hardware" },
      ];

      setTimeout(() => {
        const baseIndex = inventoryItems.length;
        const newItems: InventoryItem[] = products.map((p, i) => ({
          id: `INV-${String(baseIndex + i + 1).padStart(3, "0")}`,
          nombre: p.nombre,
          unidades: p.unidades,
          ubicacion: "",
          responsable: "",
          estado: "Nuevo" as const,
          seccion: p.seccion as InventoryItem["seccion"],
          enlace: "",
          observaciones: `Proveniente del pedido: ${order.nombre}`,
          fecha: new Date().toISOString().slice(0, 10),
          fotoUrl: "",
          presupuestoId: "",
        }));

        registerCloned(order.id, newItems);
        toast.success("Datos clonados al inventario correctamente.", { duration: 4000 });
      }, 1500);
    }

    onUpdate(updated);
  };

  const FileField = ({ label, value, field }: { label: string; value: string; field: keyof Order }) => (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {value ? (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1.5 truncate max-w-full">
            <FileText className="h-3 w-3 shrink-0" />
            <span className="truncate">{value}</span>
          </Badge>
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-destructive hover:text-destructive shrink-0"
              onClick={() => update({ [field]: "" } as Partial<Order>)}
            >
              Quitar
            </Button>
          )}
        </div>
      ) : (
        <div>
          {canEdit ? (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1 w-full"
              onClick={() => update({ [field]: `${label.toLowerCase().replace(/ /g, "_")}_${order.id}.pdf` } as Partial<Order>)}
            >
              <Upload className="h-3 w-3" />
              Subir {label}
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground">Sin archivo</span>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{order.nombre}</DialogTitle>
        </DialogHeader>

        <OrderProgressBar currentStatus={order.estado} />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Empresa</label>
            {canEdit ? (
              <Input value={order.empresa} onChange={(e) => update({ empresa: e.target.value })} />
            ) : (
              <p className="text-sm">{order.empresa}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Tipo de compra</label>
            {canEdit ? (
              <Select value={order.tipoCompra} onValueChange={(v) => update({ tipoCompra: v as PurchaseType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PURCHASE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm">{order.tipoCompra}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Precio total</label>
            {canEdit ? (
              <Input
                type="number"
                value={order.precioTotal}
                onChange={(e) => update({ precioTotal: parseFloat(e.target.value) || 0 })}
              />
            ) : (
              <p className="text-sm font-semibold">
                {order.precioTotal.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Estado del pedido</label>
            {canEdit ? (
              <Select value={order.estado} onValueChange={(v) => update({ estado: v as OrderStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ORDER_STEPS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm">{order.estado}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Fecha</label>
            {canEdit ? (
              <Input type="date" value={order.fecha} onChange={(e) => update({ fecha: e.target.value })} />
            ) : (
              <p className="text-sm">
                {new Date(order.fecha).toLocaleDateString("es-ES")}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Envío</label>
            {canEdit ? (
              <Select value={order.envio} onValueChange={(v) => update({ envio: v as ShippingStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SHIPPING_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm">{order.envio}</p>
            )}
          </div>

          <div className="col-span-2 space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Eventos económicos</label>
            <div className="flex flex-wrap gap-1.5">
              {order.eventos.length > 0 ? (
                order.eventos.map((ev) => (
                  <Badge key={ev} variant="outline" className="text-xs">{ev}</Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">Sin eventos asociados</span>
              )}
            </div>
            {canEdit && (
              <Select onValueChange={(v) => {
                if (!order.eventos.includes(v)) update({ eventos: [...order.eventos, v] });
              }}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Añadir evento…" /></SelectTrigger>
                <SelectContent>
                  {EVENTS.filter((e) => !order.eventos.includes(e)).map((e) => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* File uploads */}
        <div className="grid grid-cols-3 gap-4 mt-2">
          <FileField label="Proforma" value={order.proformaUrl} field="proformaUrl" />
          <FileField label="GEA" value={order.geaUrl} field="geaUrl" />
          <FileField label="Factura" value={order.facturaUrl} field="facturaUrl" />
        </div>

        {/* OCR Scanner */}
        {canEdit && <OcrScanner order={order} onUpdate={(patch) => update(patch)} />}

        {/* Cloned inventory items */}
        <ClonedInventoryItems items={clonedItems} />

        {/* Observaciones */}
        <div className="space-y-3 mt-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Observaciones</label>
            {canEdit ? (
              <Textarea value={order.observaciones} onChange={(e) => update({ observaciones: e.target.value })} rows={2} />
            ) : (
              <p className="text-sm">{order.observaciones || "—"}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Observaciones del trámite</label>
            {canEdit ? (
              <Textarea value={order.observacionesTramite} onChange={(e) => update({ observacionesTramite: e.target.value })} rows={2} />
            ) : (
              <p className="text-sm">{order.observacionesTramite || "—"}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
