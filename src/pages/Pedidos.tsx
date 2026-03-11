import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import OrderFilters from "@/components/pedidos/OrderFilters";
import OrderTable from "@/components/pedidos/OrderTable";
import OrderDetailDialog from "@/components/pedidos/OrderDetailDialog";
import OrderTimeline from "@/components/pedidos/OrderTimeline";
import ExcelToolbar from "@/components/ExcelToolbar";
import { Button } from "@/components/ui/button";
import { Plus, List, GanttChart } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import type { Order, OrderStatus, PurchaseType } from "@/lib/orders-data";
import { mockOrders } from "@/lib/orders-data";
import { exportToExcel, importFromExcel } from "@/lib/excel-utils";

const ORDER_COLUMNS: { key: keyof Order; header: string }[] = [
  { key: "id", header: "ID" },
  { key: "nombre", header: "Nombre" },
  { key: "empresa", header: "Empresa" },
  { key: "tipoCompra", header: "Tipo Compra" },
  { key: "precioTotal", header: "Precio Total" },
  { key: "estado", header: "Estado" },
  { key: "fecha", header: "Fecha" },
  { key: "envio", header: "Envío" },
  { key: "observaciones", header: "Observaciones" },
  { key: "observacionesTramite", header: "Obs. Trámite" },
];

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
      const matchesSearch = !q || o.nombre.toLowerCase().includes(q) || o.empresa.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
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
      id: newId, nombre: "Nuevo pedido", empresa: "", tipoCompra: "GEA", precioTotal: 0,
      estado: "Pendiente de correo", fecha: new Date().toISOString().slice(0, 10),
      eventos: [], envio: "No enviado", proformaUrl: "", geaUrl: "", facturaUrl: "",
      observaciones: "", observacionesTramite: "",
    };
    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrder(newOrder);
  };

  const handleExport = () => exportToExcel(filtered, ORDER_COLUMNS, "pedidos");

  const handleImport = (file: File) => {
    importFromExcel<Order>(file, ORDER_COLUMNS, (rows) => {
      const withIds = rows.map((r, i) => ({
        ...r,
        id: r.id || `PED-imp-${Date.now()}-${i}`,
        precioTotal: Number(r.precioTotal) || 0,
        eventos: [],
        proformaUrl: "",
        geaUrl: "",
        facturaUrl: "",
      }));
      setOrders((prev) => [...prev, ...withIds]);
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Pedidos</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} pedido{filtered.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex items-center gap-3">
            <ExcelToolbar onExport={handleExport} onImport={handleImport} disabled={!canEdit} />
            {canEdit && (
              <Button onClick={handleAdd} className="gap-2"><Plus className="h-4 w-4" />Nuevo pedido</Button>
            )}
          </div>
        </div>

        <OrderFilters search={search} onSearchChange={setSearch} statusFilter={statusFilter} onStatusChange={setStatusFilter} typeFilter={typeFilter} onTypeChange={setTypeFilter} />
        <OrderTable orders={filtered} onSelect={setSelectedOrder} />
        <OrderDetailDialog order={selectedOrder} open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)} onUpdate={handleUpdate} />
      </div>
    </AppLayout>
  );
};

export default Pedidos;
