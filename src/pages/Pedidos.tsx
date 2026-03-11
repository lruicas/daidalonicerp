import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import OrderFilters from "@/components/pedidos/OrderFilters";
import OrderTable from "@/components/pedidos/OrderTable";
import OrderDetailDialog from "@/components/pedidos/OrderDetailDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import type { Order, OrderStatus, PurchaseType } from "@/lib/orders-data";
import { mockOrders } from "@/lib/orders-data";

const Pedidos = () => {
  const { canEdit } = useRole();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<PurchaseType | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        o.nombre.toLowerCase().includes(q) ||
        o.empresa.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || o.estado === statusFilter;
      const matchesType = typeFilter === "all" || o.tipoCompra === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [orders, search, statusFilter, typeFilter]);

  const handleUpdate = (updated: Order) => {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    setSelectedOrder(updated);
  };

  const handleAdd = () => {
    const newId = `PED-${String(orders.length + 1).padStart(3, "0")}`;
    const newOrder: Order = {
      id: newId,
      nombre: "Nuevo pedido",
      empresa: "",
      tipoCompra: "GEA",
      precioTotal: 0,
      estado: "Pendiente de correo",
      fecha: new Date().toISOString().slice(0, 10),
      eventos: [],
      envio: "No enviado",
      proformaUrl: "",
      geaUrl: "",
      facturaUrl: "",
      observaciones: "",
      observacionesTramite: "",
    };
    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrder(newOrder);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Pedidos</h1>
            <p className="text-sm text-muted-foreground">
              {filtered.length} pedido{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          {canEdit && (
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo pedido
            </Button>
          )}
        </div>

        <OrderFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
        />

        <OrderTable orders={filtered} onSelect={setSelectedOrder} />

        <OrderDetailDialog
          order={selectedOrder}
          open={!!selectedOrder}
          onOpenChange={(open) => !open && setSelectedOrder(null)}
          onUpdate={handleUpdate}
        />
      </div>
    </AppLayout>
  );
};

export default Pedidos;
