import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SECTIONS } from "@/lib/budget-data";
import { MEMBER_STATUSES } from "@/lib/members-data";
import type { Section } from "@/lib/budget-data";
import type { MemberStatus } from "@/lib/members-data";

interface MemberFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  sectionFilter: Section | "all";
  onSectionChange: (v: Section | "all") => void;
  statusFilter: MemberStatus | "all";
  onStatusChange: (v: MemberStatus | "all") => void;
}

const MemberFilters = ({ search, onSearchChange, sectionFilter, onSectionChange, statusFilter, onStatusChange }: MemberFiltersProps) => (
  <div className="flex flex-wrap items-center gap-3">
    <div className="relative flex-1 min-w-[220px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input placeholder="Buscar miembro…" value={search} onChange={(e) => onSearchChange(e.target.value)} className="pl-9" />
    </div>
    <Select value={sectionFilter} onValueChange={(v) => onSectionChange(v as Section | "all")}>
      <SelectTrigger className="w-[190px]"><SelectValue placeholder="Sección" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas las secciones</SelectItem>
        {SECTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
      </SelectContent>
    </Select>
    <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as MemberStatus | "all")}>
      <SelectTrigger className="w-[210px]"><SelectValue placeholder="Estatus" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos los estatus</SelectItem>
        {MEMBER_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
      </SelectContent>
    </Select>
  </div>
);

export default MemberFilters;
