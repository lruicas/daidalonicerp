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
import { RELACIONES_UPV } from "@/lib/companies-data";
import type { Section } from "@/lib/budget-data";
import type { RelacionUPV } from "@/lib/companies-data";

interface CompanyFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  sectionFilter: Section | "all";
  onSectionChange: (v: Section | "all") => void;
  relacionFilter: RelacionUPV | "all";
  onRelacionChange: (v: RelacionUPV | "all") => void;
}

const CompanyFilters = ({
  search,
  onSearchChange,
  sectionFilter,
  onSectionChange,
  relacionFilter,
  onRelacionChange,
}: CompanyFiltersProps) => (
  <div className="flex flex-wrap items-center gap-3">
    <div className="relative flex-1 min-w-[220px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar empresa…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9"
      />
    </div>

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

    <Select value={relacionFilter} onValueChange={(v) => onRelacionChange(v as RelacionUPV | "all")}>
      <SelectTrigger className="w-[210px]">
        <SelectValue placeholder="Relación UPV" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas las relaciones</SelectItem>
        {RELACIONES_UPV.map((r) => (
          <SelectItem key={r} value={r}>{r}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default CompanyFilters;
