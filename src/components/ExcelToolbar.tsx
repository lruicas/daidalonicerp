import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";

interface ExcelToolbarProps {
  onExport: () => void;
  onImport: (file: File) => void;
  disabled?: boolean;
}

const ExcelToolbar = ({ onExport, onImport, disabled }: ExcelToolbarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = "";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="gap-2" onClick={onExport}>
        <Download className="h-3.5 w-3.5" />
        Descargar Excel
      </Button>
      {!disabled && (
        <>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => inputRef.current?.click()}>
            <Upload className="h-3.5 w-3.5" />
            Subir Excel
          </Button>
          <input ref={inputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFile} />
        </>
      )}
    </div>
  );
};

export default ExcelToolbar;
