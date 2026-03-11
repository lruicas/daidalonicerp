import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { SPONSOR_TYPES, SPONSOR_STATUSES } from "@/lib/sponsors-data";
import type { SponsorType, SponsorStatus } from "@/lib/sponsors-data";

interface SponsorFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  typeFilter: SponsorType | "all";
  onTypeChange: (v: SponsorType | "all") => void;
  statusFilter: SponsorStatus | "all";
  onStatusChange: (v: SponsorStatus | "all") => void;
}

const SponsorFilters = ({ search, onSearchChange, typeFilter, onTypeChange, statusFilter, onStatusChange }: SponsorFiltersProps) => (
  <div className="flex flex-wrap items-center gap-3">
    <div className="relative flex-1 min-w-[220px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input placeholder="Buscar patrocinador…" value={search} onChange={(e) => onSearchChange(e.target.value)} className="pl-9" />
    </div>
    <Select value={typeFilter} onValueChange={(v) => onTypeChange(v as SponsorType | "all")}>
      <SelectTrigger className="w-[200px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos los tipos</SelectItem>
        {SPONSOR_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
      </SelectContent>
    </Select>
    <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as SponsorStatus | "all")}>
      <SelectTrigger className="w-[180px]"><SelectValue placeholder="Estado" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos los estados</SelectItem>
        {SPONSOR_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
      </SelectContent>
    </Select>
  </div>
);

export default SponsorFilters;
