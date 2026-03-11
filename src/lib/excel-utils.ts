import * as XLSX from "xlsx";
import { toast } from "sonner";

/**
 * Export an array of objects as an .xlsx file.
 */
export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  columns: { key: keyof T; header: string }[],
  fileName: string
) {
  const rows = data.map((item) =>
    columns.reduce((acc, col) => {
      acc[col.header] = item[col.key] as unknown;
      return acc;
    }, {} as Record<string, unknown>)
  );
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Datos");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
  toast.success(`Archivo "${fileName}.xlsx" descargado`);
}

/**
 * Import an .xlsx file and return parsed rows mapped to T keys.
 */
export function importFromExcel<T>(
  file: File,
  columns: { key: keyof T; header: string }[],
  onData: (rows: T[]) => void
) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const wb = XLSX.read(data, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);

      const mapped = rawRows.map((raw) => {
        const obj = {} as Record<string, unknown>;
        columns.forEach((col) => {
          obj[col.key as string] = raw[col.header] ?? "";
        });
        return obj as T;
      });

      onData(mapped);
      toast.success(`${mapped.length} registros importados`);
    } catch {
      toast.error("Error al leer el archivo Excel");
    }
  };
  reader.readAsArrayBuffer(file);
}
