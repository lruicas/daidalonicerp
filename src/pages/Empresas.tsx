import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import CompanyFilters from "@/components/empresas/CompanyFilters";
import CompanyTable from "@/components/empresas/CompanyTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { mockCompanies } from "@/lib/companies-data";
import type { Company, RelacionUPV } from "@/lib/companies-data";
import type { Section } from "@/lib/budget-data";

const Empresas = () => {
  const { role } = useRole();
  const canEdit = role === "Presidente";
  const [items, setItems] = useState<Company[]>(mockCompanies);
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState<Section | "all">("all");
  const [relacionFilter, setRelacionFilter] = useState<RelacionUPV | "all">("all");

  const filtered = useMemo(() => {
    return items.filter((c) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        c.nombre.toLowerCase().includes(q) ||
        c.descripcion.toLowerCase().includes(q) ||
        c.cif.toLowerCase().includes(q) ||
        c.correo.toLowerCase().includes(q);
      const matchesSection = sectionFilter === "all" || c.seccion === sectionFilter;
      const matchesRelacion = relacionFilter === "all" || c.relacion === relacionFilter;
      return matchesSearch && matchesSection && matchesRelacion;
    });
  }, [items, search, sectionFilter, relacionFilter]);

  const handleUpdate = (updated: Company) => {
    setItems((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleAdd = () => {
    const newId = `EMP-${String(items.length + 1).padStart(3, "0")}`;
    const newItem: Company = {
      id: newId,
      nombre: "Nueva empresa",
      descripcion: "",
      cif: "",
      seccion: "E-Software",
      relacion: "No alta - España",
      pago: "Al tercero",
      correo: "",
      telefono: "",
      web: "",
      facturar: "Factura",
      valoracion: 0,
      observaciones: "",
      documentacion: "",
      fecha: new Date().toISOString().slice(0, 10),
    };
    setItems((prev) => [newItem, ...prev]);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Empresas</h1>
            <p className="text-sm text-muted-foreground">
              {filtered.length} empresa{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          {canEdit && (
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Añadir empresa
            </Button>
          )}
        </div>

        <CompanyFilters
          search={search}
          onSearchChange={setSearch}
          sectionFilter={sectionFilter}
          onSectionChange={setSectionFilter}
          relacionFilter={relacionFilter}
          onRelacionChange={setRelacionFilter}
        />

        <CompanyTable items={filtered} onUpdate={handleUpdate} />
      </div>
    </AppLayout>
  );
};

export default Empresas;
