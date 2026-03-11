import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import InventoryFilters from "@/components/inventario/InventoryFilters";
import InventoryTable from "@/components/inventario/InventoryTable";
import InventoryMap from "@/components/inventario/InventoryMap";
import ExcelToolbar from "@/components/ExcelToolbar";
import { Button } from "@/components/ui/button";
import { Plus, List, Map } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { useInventory } from "@/contexts/InventoryContext";
import type { InventoryItem, InventoryStatus } from "@/lib/inventory-data";
import type { Section } from "@/lib/budget-data";
import { exportToExcel, importFromExcel } from "@/lib/excel-utils";

const INV_COLUMNS: { key: keyof InventoryItem; header: string }[] = [
  { key: "id", header: "ID" },
  { key: "nombre", header: "Nombre" },
  { key: "unidades", header: "Unidades" },
  { key: "ubicacion", header: "Ubicación" },
  { key: "responsable", header: "Responsable" },
  { key: "estado", header: "Estado" },
  { key: "seccion", header: "Sección" },
  { key: "enlace", header: "Enlace" },
  { key: "observaciones", header: "Observaciones" },
  { key: "fecha", header: "Fecha" },
];

const Inventario = () => {
  const { canEditInventario: canEdit } = useRole();
  const { items, setItems } = useInventory();
  const [view, setView] = useState<"table" | "map">("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InventoryStatus | "all">("all");
  const [sectionFilter, setSectionFilter] = useState<Section | "all">("all");
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get("highlight");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || item.nombre.toLowerCase().includes(q) || item.ubicacion.toLowerCase().includes(q) || item.responsable.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
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
      id: newId, nombre: "Nuevo elemento", unidades: 1, ubicacion: "", responsable: "",
      estado: "Nuevo", seccion: "E-Hardware", enlace: "", observaciones: "",
      fecha: new Date().toISOString().slice(0, 10), fotoUrl: "", presupuestoId: "",
    };
    setItems((prev) => [newItem, ...prev]);
  };

  const handleExport = () => exportToExcel(filtered, INV_COLUMNS, "inventario");

  const handleImport = (file: File) => {
    importFromExcel<InventoryItem>(file, INV_COLUMNS, (rows) => {
      const withIds = rows.map((r, i) => ({
        ...r,
        id: r.id || `INV-imp-${Date.now()}-${i}`,
        unidades: Number(r.unidades) || 0,
        fotoUrl: "",
        presupuestoId: "",
      }));
      setItems((prev) => [...prev, ...withIds]);
    });
  };

  return (
    <AppLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Inventario</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} elemento{filtered.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <ExcelToolbar onExport={handleExport} onImport={handleImport} disabled={!canEdit} />
            <div className="flex items-center rounded-md border bg-muted/30 p-0.5">
              <button
                onClick={() => setView("table")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  view === "table" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="h-3.5 w-3.5" />
                Lista
              </button>
              <button
                onClick={() => setView("map")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  view === "map" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Map className="h-3.5 w-3.5" />
                Mapa
              </button>
            </div>
            {canEdit && (
              <Button onClick={handleAdd} size="sm" className="gap-2"><Plus className="h-4 w-4" />Nuevo elemento</Button>
            )}
          </div>
        </div>

        {view === "table" ? (
          <>
            <InventoryFilters search={search} onSearchChange={setSearch} statusFilter={statusFilter} onStatusChange={setStatusFilter} sectionFilter={sectionFilter} onSectionChange={setSectionFilter} />
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[700px] px-4 sm:px-0">
                <InventoryTable items={filtered} onUpdate={handleUpdate} highlightId={highlightId} />
              </div>
            </div>
          </>
        ) : (
          <InventoryMap items={filtered} onUpdate={handleUpdate} />
        )}
      </div>
    </AppLayout>
  );
};

export default Inventario;
