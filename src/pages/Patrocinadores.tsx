import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import SponsorFilters from "@/components/patrocinadores/SponsorFilters";
import SponsorTable from "@/components/patrocinadores/SponsorTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { mockSponsors } from "@/lib/sponsors-data";
import type { Sponsor, SponsorType, SponsorStatus } from "@/lib/sponsors-data";

const Patrocinadores = () => {
  const { role } = useRole();
  const canEdit = role === "Presidente";
  const [items, setItems] = useState<Sponsor[]>(mockSponsors);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<SponsorType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<SponsorStatus | "all">("all");

  const filtered = useMemo(() => {
    return items.filter((s) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || s.nombre.toLowerCase().includes(q) || s.descripcion.toLowerCase().includes(q) || s.correo.toLowerCase().includes(q);
      const matchesType = typeFilter === "all" || s.tipo === typeFilter;
      const matchesStatus = statusFilter === "all" || s.estado === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [items, search, typeFilter, statusFilter]);

  const handleUpdate = (updated: Sponsor) => setItems((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));

  const handleAdd = () => {
    const newId = `PAT-${String(items.length + 1).padStart(3, "0")}`;
    const newItem: Sponsor = {
      id: newId, nombre: "Nuevo patrocinador", descripcion: "", tipo: "Empresa", estado: "Vigente",
      correo: "", telefono: "", condiciones: "", observaciones: "", documentacion: "",
      fechaInicio: new Date().toISOString().slice(0, 10),
    };
    setItems((prev) => [newItem, ...prev]);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Patrocinadores / Colaboradores</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} registro{filtered.length !== 1 ? "s" : ""}</p>
          </div>
          {canEdit && (
            <Button onClick={handleAdd} className="gap-2"><Plus className="h-4 w-4" />Añadir patrocinador</Button>
          )}
        </div>
        <SponsorFilters search={search} onSearchChange={setSearch} typeFilter={typeFilter} onTypeChange={setTypeFilter} statusFilter={statusFilter} onStatusChange={setStatusFilter} />
        <SponsorTable items={filtered} onUpdate={handleUpdate} />
      </div>
    </AppLayout>
  );
};

export default Patrocinadores;
