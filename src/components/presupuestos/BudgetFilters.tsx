import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SECTIONS, PRIORITIES, Section, Priority } from "@/lib/budget-data";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  filterSection: Section | "all";
  onSectionChange: (v: Section | "all") => void;
  filterPriority: Priority | "all";
  onPriorityChange: (v: Priority | "all") => void;
}

const BudgetFilters = ({ search, onSearchChange, filterSection, onSectionChange, filterPriority, onPriorityChange }: Props) => (
  <div className="flex flex-wrap items-center gap-3">
    <div className="relative flex-1 min-w-[220px] max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
      <Input
        placeholder="Buscar por nombre, empresa o referencia…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9"
      />
    </div>

    <Select value={filterSection} onValueChange={(v) => onSectionChange(v as Section | "all")}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sección" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas las secciones</SelectItem>
        {SECTIONS.map((s) => (
          <SelectItem key={s} value={s}>{s}</SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Select value={filterPriority} onValueChange={(v) => onPriorityChange(v as Priority | "all")}>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Prioridad" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas las prioridades</SelectItem>
        {PRIORITIES.map((p) => (
          <SelectItem key={p} value={p}>{p}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default BudgetFilters;
