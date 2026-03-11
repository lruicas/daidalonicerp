import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import InventoryFilters from "@/components/inventario/InventoryFilters";
import InventoryTable from "@/components/inventario/InventoryTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import type { InventoryItem, InventoryStatus } from "@/lib/inventory-data";
import type { Section } from "@/lib/budget-data";
import { mockInventory } from "@/lib/inventory-data";

const Inventario = () => {
  const { canEdit } = useRole();
  const [items, setItems] = useState<InventoryItem[]>(mockInventory);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InventoryStatus | "all">("all");
  const [sectionFilter, setSectionFilter] = useState<Section | "all">("all");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        item.nombre.toLowerCase().includes(q) ||
        item.ubicacion.toLowerCase().includes(q) ||
        item.responsable.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || item.estado === statusFilter;
      const matchesSection = sectionFilter === "all" || item.seccion === sectionFilter;
      return matchesSearch && matchesStatus && matchesSection;
    });
  }, [items, search, statusFilter, sectionFilter]);

  const handleUpdate = (updated: InventoryItem) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  const handleAdd = () => {
    const newId = `INV-${String(items.length + 1).padStart(3, "0")}`;
    const newItem: InventoryItem = {
      id: newId,
      nombre: "Nuevo elemento",
      unidades: 1,
      ubicacion: "",
      responsable: "",
      estado: "Nuevo",
      seccion: "E-Hardware",
      enlace: "",
      observaciones: "",
      fecha: new Date().toISOString().slice(0, 10),
      fotoUrl: "",
      presupuestoId: "",
    };
    setItems((prev) => [newItem, ...prev]);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Inventario</h1>
            <p className="text-sm text-muted-foreground">
              {filtered.length} elemento{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          {canEdit && (
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo elemento
            </Button>
          )}
        </div>

        <InventoryFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          sectionFilter={sectionFilter}
          onSectionChange={setSectionFilter}
        />

        <InventoryTable items={filtered} onUpdate={handleUpdate} />
      </div>
    </AppLayout>
  );
};

export default Inventario;
