import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EVENT_STATUSES, EventStatus } from "@/lib/events-data";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  filterStatus: EventStatus | "all";
  onStatusChange: (v: EventStatus | "all") => void;
}

const EventFilters = ({ search, onSearchChange, filterStatus, onStatusChange }: Props) => (
  <div className="flex flex-wrap items-center gap-3">
    <div className="relative flex-1 min-w-[220px] max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
      <Input
        placeholder="Buscar por nombre o colaborador…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9"
      />
    </div>
    <Select value={filterStatus} onValueChange={(v) => onStatusChange(v as EventStatus | "all")}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Estado" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos los estados</SelectItem>
        {EVENT_STATUSES.map((s) => (
          <SelectItem key={s} value={s}>{s}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default EventFilters;
