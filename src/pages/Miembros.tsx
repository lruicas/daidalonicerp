import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import MemberFilters from "@/components/miembros/MemberFilters";
import MemberTable from "@/components/miembros/MemberTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { mockMembers } from "@/lib/members-data";
import type { Member, MemberStatus } from "@/lib/members-data";
import type { Section } from "@/lib/budget-data";

const Miembros = () => {
  const { role } = useRole();
  const canEdit = role === "Presidente";
  const [items, setItems] = useState<Member[]>(mockMembers);
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState<Section | "all">("all");
  const [statusFilter, setStatusFilter] = useState<MemberStatus | "all">("all");

  const filtered = useMemo(() => {
    return items.filter((m) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || `${m.nombre} ${m.apellidos}`.toLowerCase().includes(q) || m.correoUpv.toLowerCase().includes(q) || m.correoPersonal.toLowerCase().includes(q);
      const matchesSection = sectionFilter === "all" || m.seccion === sectionFilter;
      const matchesStatus = statusFilter === "all" || m.estatus === statusFilter;
      return matchesSearch && matchesSection && matchesStatus;
    });
  }, [items, search, sectionFilter, statusFilter]);

  const handleUpdate = (updated: Member) => setItems((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));

  const handleAdd = () => {
    const newId = `MBR-${String(items.length + 1).padStart(3, "0")}`;
    const newItem: Member = {
      id: newId, nombre: "Nuevo", apellidos: "Miembro", seccion: "E-Software", estatus: "Miembro",
      titulacion: "", centro: "", anioUniversitario: 1, telefono: "", correoUpv: "", correoPersonal: "",
      cumpleanos: "", tipoId: "DNI/NIF", numeroId: "", fechaEntrada: new Date().toISOString().slice(0, 10), fechaSalida: "",
    };
    setItems((prev) => [newItem, ...prev]);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Miembros</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} miembro{filtered.length !== 1 ? "s" : ""}</p>
          </div>
          {canEdit && (
            <Button onClick={handleAdd} className="gap-2"><Plus className="h-4 w-4" />Añadir miembro</Button>
          )}
        </div>
        <MemberFilters search={search} onSearchChange={setSearch} sectionFilter={sectionFilter} onSectionChange={setSectionFilter} statusFilter={statusFilter} onStatusChange={setStatusFilter} />
        <MemberTable items={filtered} onUpdate={handleUpdate} />
      </div>
    </AppLayout>
  );
};

export default Miembros;
