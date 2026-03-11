import { Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BudgetRow, COLUMNS } from "@/lib/budget-data";
import { useRole } from "@/contexts/RoleContext";
import { useRef } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

interface Props {
  budgets: BudgetRow[];
  onImport?: (rows: BudgetRow[]) => void;
}

const BudgetToolbar = ({ budgets, onImport }: Props) => {
  const { canEditPresupuestos: canEdit } = useRole();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDownload = () => {
    const data = budgets.map((b) => ({
      Nombre: b.nombre,
      Descripción: b.descripcion,
      Sección: b.seccion,
      Empresa: b.empresa,
      Referencia: b.referencia,
      Enlace: b.enlace,
      Unidades: b.unidades,
      "Precio unit. (IVA)": b.precioUnitario,
      "Precio total (IVA)": b.precioTotal,
      Inventariable: b.inventariable ? "Sí" : "No",
      "Comentario coordinador": b.comentarioCoordinador,
      Prioridad: b.prioridad,
      Pedido: b.pedido,
      "Estado pedido": b.estadoPedido,
      "Evento económico": b.eventoEconomico.join(", "),
      Fecha: b.fecha,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Presupuestos");
    XLSX.writeFile(wb, "presupuestos.xlsx");
    toast.success("Archivo descargado correctamente");
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const wb = XLSX.read(data, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);
      const rows: BudgetRow[] = json.map((row, i) => ({
        id: `imp-${Date.now()}-${i}`,
        nombre: String(row["Nombre"] ?? ""),
        descripcion: String(row["Descripción"] ?? ""),
        seccion: (row["Sección"] as BudgetRow["seccion"]) ?? "E-Software",
        empresa: String(row["Empresa"] ?? ""),
        referencia: String(row["Referencia"] ?? ""),
        enlace: String(row["Enlace"] ?? ""),
        unidades: Number(row["Unidades"] ?? 0),
        precioUnitario: Number(row["Precio unit. (IVA)"] ?? 0),
        precioTotal: Number(row["Precio total (IVA)"] ?? 0),
        inventariable: row["Inventariable"] === "Sí",
        comentarioCoordinador: String(row["Comentario coordinador"] ?? ""),
        prioridad: (row["Prioridad"] as BudgetRow["prioridad"]) ?? "Media",
        pedido: String(row["Pedido"] ?? ""),
        estadoPedido: (row["Estado pedido"] as BudgetRow["estadoPedido"]) ?? "Pendiente",
        eventoEconomico: String(row["Evento económico"] ?? "").split(",").map((s) => s.trim()).filter(Boolean),
        fecha: String(row["Fecha"] ?? ""),
      }));
      onImport(rows);
      toast.success(`${rows.length} filas importadas`);
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
        <Download className="h-4 w-4" strokeWidth={1.5} />
        Descargar plantilla Excel
      </Button>
      {canEdit && (
        <>
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="gap-2">
            <Upload className="h-4 w-4" strokeWidth={1.5} />
            Subir plantilla Excel
          </Button>
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleUpload} />
        </>
      )}
    </div>
  );
};

export default BudgetToolbar;
