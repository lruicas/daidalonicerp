import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_STEPS, PURCHASE_TYPES } from "@/lib/orders-data";
import type { OrderStatus, PurchaseType } from "@/lib/orders-data";

interface OrderFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: OrderStatus | "all";
  onStatusChange: (v: OrderStatus | "all") => void;
  typeFilter: PurchaseType | "all";
  onTypeChange: (v: PurchaseType | "all") => void;
}

const OrderFilters = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
}: OrderFiltersProps) => (
  <div className="flex flex-wrap items-center gap-3">
    <div className="relative flex-1 min-w-[220px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar pedidos…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9"
      />
    </div>

    <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as OrderStatus | "all")}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Estado" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos los estados</SelectItem>
        {ORDER_STEPS.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Select value={typeFilter} onValueChange={(v) => onTypeChange(v as PurchaseType | "all")}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Tipo de compra" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos los tipos</SelectItem>
        {PURCHASE_TYPES.map((t) => (
          <SelectItem key={t} value={t}>
            {t}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default OrderFilters;
