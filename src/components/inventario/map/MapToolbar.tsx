import { Search, Flame, Pencil, Save, Plus, Type, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { INVENTORY_STATUSES, MEMBERS } from "@/lib/inventory-data";
import type { InventoryStatus } from "@/lib/inventory-data";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilters: Set<InventoryStatus>;
  onToggleStatus: (s: InventoryStatus) => void;
  responsableFilter: string;
  onResponsableChange: (v: string) => void;
  heatMap: boolean;
  onToggleHeatMap: () => void;
  editMode: boolean;
  onToggleEditMode: () => void;
  onAddZone: () => void;
  onAddSubzone: () => void;
  onAddLabel: () => void;
  canEdit: boolean;
}

const MapToolbar = ({
  search, onSearchChange,
  statusFilters, onToggleStatus,
  responsableFilter, onResponsableChange,
  heatMap, onToggleHeatMap,
  editMode, onToggleEditMode,
  onAddZone, onAddSubzone, onAddLabel,
  canEdit,
}: Props) => (
  <div className="flex flex-wrap items-center gap-2">
    {/* Search */}
    <div className="relative flex-1 min-w-[180px] max-w-xs">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input placeholder="Buscar objeto…" value={search} onChange={e => onSearchChange(e.target.value)} className="pl-9 h-9" />
    </div>

    {/* Status filter */}
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs h-9">
          <Layers className="h-3.5 w-3.5" />
          Estado
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-3 space-y-2" align="start">
        {INVENTORY_STATUSES.map(s => (
          <div key={s} className="flex items-center gap-2">
            <Checkbox
              id={`st-${s}`}
              checked={statusFilters.has(s)}
              onCheckedChange={() => onToggleStatus(s)}
            />
            <Label htmlFor={`st-${s}`} className="text-sm cursor-pointer">{s}</Label>
          </div>
        ))}
      </PopoverContent>
    </Popover>

    {/* Responsable filter */}
    <Select value={responsableFilter} onValueChange={onResponsableChange}>
      <SelectTrigger className="w-[160px] h-9 text-xs">
        <SelectValue placeholder="Responsable" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos</SelectItem>
        {MEMBERS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
      </SelectContent>
    </Select>

    {/* Heat map */}
    <Button
      variant={heatMap ? "default" : "outline"}
      size="sm"
      className="gap-1.5 text-xs h-9"
      onClick={onToggleHeatMap}
    >
      <Flame className="h-3.5 w-3.5" />
      Calor
    </Button>

    {/* Edit mode tools */}
    {canEdit && (
      <>
        <div className="h-6 w-px bg-border mx-1" />
        {editMode ? (
          <>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-9" onClick={onAddZone}>
              <Plus className="h-3.5 w-3.5" />Zona
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-9" onClick={onAddSubzone}>
              <Plus className="h-3.5 w-3.5" />Subzona
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-9" onClick={onAddLabel}>
              <Type className="h-3.5 w-3.5" />Texto
            </Button>
            <Button size="sm" className="gap-1.5 text-xs h-9" onClick={onToggleEditMode}>
              <Save className="h-3.5 w-3.5" />Guardar
            </Button>
          </>
        ) : (
          <Button size="sm" variant="outline" className="gap-1.5 text-xs h-9" onClick={onToggleEditMode}>
            <Pencil className="h-3.5 w-3.5" />Editar mapa
          </Button>
        )}
      </>
    )}
  </div>
);

export default MapToolbar;
