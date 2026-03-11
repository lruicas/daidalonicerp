import { useState } from "react";
import { Camera, CheckCircle, Loader2 } from "lucide-react";
import type { Order } from "@/lib/orders-data";

interface OcrScannerProps {
  order: Order;
  onUpdate: (patch: Partial<Order>) => void;
  disabled?: boolean;
}

const SIMULATED_DATA = {
  precioTotal: 2847.5,
  empresa: "TechCorp S.L.",
  numFactura: "FAC-2026-04821",
};

type ScanState = "idle" | "processing" | "done";

const OcrScanner = ({ order, onUpdate, disabled }: OcrScannerProps) => {
  const [state, setState] = useState<ScanState>("idle");

  const handleScan = () => {
    if (disabled || state === "processing") return;
    setState("processing");

    setTimeout(() => {
      const today = new Date().toLocaleDateString("es-ES");
      const obsLine = `Factura escaneada el ${today}. Nº factura: ${SIMULATED_DATA.numFactura}`;
      const newObs = order.observaciones
        ? `${order.observaciones}\n${obsLine}`
        : obsLine;

      onUpdate({
        precioTotal: SIMULATED_DATA.precioTotal,
        empresa: SIMULATED_DATA.empresa,
        facturaUrl: `factura_${order.id}.pdf`,
        observaciones: newObs,
      });

      setState("done");
      setTimeout(() => setState("idle"), 4000);
    }, 2200);
  };

  return (
    <div className="space-y-2 mt-4">
      <label className="text-xs font-medium" style={{ color: "hsl(174 60% 51%)" }}>
        Escaneo inteligente de factura (OCR)
      </label>

      {state === "done" ? (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          <CheckCircle className="h-4 w-4 shrink-0" />
          Datos de factura sincronizados correctamente.
        </div>
      ) : (
        <button
          type="button"
          onClick={handleScan}
          disabled={disabled || state === "processing"}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-6 text-center transition-colors hover:border-primary/40 hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-50"
        >
          {state === "processing" ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: "hsl(174 60% 51%)" }} />
              <span className="text-sm font-medium text-muted-foreground">Procesando factura…</span>
            </>
          ) : (
            <>
              <Camera className="h-8 w-8 text-muted-foreground/60" />
              <span className="text-sm text-muted-foreground">
                Arrastra aquí la factura o haz clic para subirla
              </span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default OcrScanner;
