import { Badge } from "@/components/ui/badge";
import { Package, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { InventoryItem } from "@/lib/inventory-data";

interface ClonedInventoryItemsProps {
  items: InventoryItem[];
}

const ClonedInventoryItems = ({ items }: ClonedInventoryItemsProps) => {
  const navigate = useNavigate();

  if (!items.length) return null;

  return (
    <div className="space-y-2 mt-4">
      <label className="text-xs font-medium" style={{ color: "hsl(174 60% 51%)" }}>
        Elementos clonados a inventario
      </label>
      <div className="rounded-lg border bg-muted/20 divide-y">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2 min-w-0">
              <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-sm truncate">{item.nombre}</span>
              <Badge variant="outline" className="text-[10px] shrink-0">{item.seccion}</Badge>
              <span className="text-xs text-muted-foreground">×{item.unidades}</span>
            </div>
            <button
              onClick={() => navigate(`/inventario?highlight=${item.id}`)}
              className="flex items-center gap-1 text-xs text-primary hover:underline shrink-0 ml-2"
            >
              Ver en inventario
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClonedInventoryItems;
