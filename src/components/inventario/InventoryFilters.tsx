import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SECTIONS } from "@/lib/budget-data";
import { INVENTORY_STATUSES } from "@/lib/inventory-data";
import type { Section } from "@/lib/budget-data";
import type { InventoryStatus } from "@/lib/inventory-data";

interface InventoryFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: InventoryStatus | "all";
  onStatusChange: (v: InventoryStatus | "all") => void;
  sectionFilter: Section | "all";
  onSectionChange: (v: Section | "all") => void;
}

const InventoryFilters = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sectionFilter,
  onSectionChange,
}: InventoryFiltersProps) => (
  <div className="flex flex-wrap items-center gap-3">
    <div className="relative flex-1 min-w-[220px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar en inventario…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9"
      />
    </div>

    <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as InventoryStatus | "all")}>
      <SelectTrigger className="w-[170px]">
        <SelectValue placeholder="Estado" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos los estados</SelectItem>
        {INVENTORY_STATUSES.map((s) => (
          <SelectItem key={s} value={s}>{s}</SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Select value={sectionFilter} onValueChange={(v) => onSectionChange(v as Section | "all")}>
      <SelectTrigger className="w-[190px]">
        <SelectValue placeholder="Sección" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas las secciones</SelectItem>
        {SECTIONS.map((s) => (
          <SelectItem key={s} value={s}>{s}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default InventoryFilters;
