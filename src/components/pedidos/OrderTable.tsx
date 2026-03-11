import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, CreditCard, Banknote, Users } from "lucide-react";
import type { Order, PurchaseType } from "@/lib/orders-data";

const statusColor: Record<string, string> = {
  "Pendiente de correo": "bg-muted text-muted-foreground",
  Proforma: "bg-secondary-light text-foreground",
  "Solicitud empezada": "bg-primary/15 text-primary",
  Factura: "bg-primary/25 text-primary",
  Terminado: "bg-primary text-primary-foreground",
};

const typeIcon: Record<PurchaseType, React.ReactNode> = {
  GEA: <CreditCard className="h-3.5 w-3.5" />,
  Adelantado: <Banknote className="h-3.5 w-3.5" />,
  "A terceros": <Users className="h-3.5 w-3.5" />,
};

interface OrderTableProps {
  orders: Order[];
  onSelect: (order: Order) => void;
}

const OrderTable = ({ orders, onSelect }: OrderTableProps) => (
  <div className="rounded-lg border border-border overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="font-semibold">Pedido</TableHead>
          <TableHead className="font-semibold">Empresa</TableHead>
          <TableHead className="font-semibold">Tipo</TableHead>
          <TableHead className="font-semibold text-right">Total</TableHead>
          <TableHead className="font-semibold">Estado</TableHead>
          <TableHead className="font-semibold">Fecha</TableHead>
          <TableHead className="font-semibold text-center">Docs</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((o) => (
          <TableRow
            key={o.id}
            className="cursor-pointer hover:bg-muted/40 transition-colors"
            onClick={() => onSelect(o)}
          >
            <TableCell>
              <div>
                <span className="font-medium">{o.nombre}</span>
                <span className="block text-xs text-muted-foreground">{o.id}</span>
              </div>
            </TableCell>
            <TableCell className="text-sm">{o.empresa}</TableCell>
            <TableCell>
              <Badge variant="outline" className="gap-1 text-xs font-normal">
                {typeIcon[o.tipoCompra]}
                {o.tipoCompra}
              </Badge>
            </TableCell>
            <TableCell className="text-right font-semibold tabular-nums">
              {o.precioTotal.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
            </TableCell>
            <TableCell>
              <Badge className={`text-xs ${statusColor[o.estado] || ""}`}>
                {o.estado}
              </Badge>
            </TableCell>
            <TableCell className="text-sm">
              {new Date(o.fecha).toLocaleDateString("es-ES")}
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-center gap-1">
                {o.proformaUrl && (
                  <span title="Proforma"><FileText className="h-3.5 w-3.5 text-primary" /></span>
                )}
                {o.geaUrl && (
                  <span title="GEA"><FileText className="h-3.5 w-3.5 text-secondary" /></span>
                )}
                {o.facturaUrl && (
                  <span title="Factura"><FileText className="h-3.5 w-3.5 text-accent" /></span>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
        {orders.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
              No se encontraron pedidos
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);

export default OrderTable;
