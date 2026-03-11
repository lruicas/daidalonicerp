import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Printer } from "lucide-react";
import type { MapZone } from "@/lib/zone-data";

interface Props {
  open: boolean;
  onClose: () => void;
  zone: MapZone | null;
}

const QRDialog = ({ open, onClose, zone }: Props) => {
  if (!zone) return null;

  // Simulated QR code as SVG pattern
  const qrId = `QR-${zone.id}-${zone.name.replace(/\s/g, "")}`;

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="sm:max-w-sm text-center">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            Código QR — {zone.name}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          {/* Simulated QR code */}
          <div className="w-48 h-48 bg-white border-2 border-foreground/10 rounded-lg flex items-center justify-center p-4">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Simple QR-like pattern */}
              <rect x="5" y="5" width="25" height="25" fill="hsl(var(--foreground))" rx="2" />
              <rect x="70" y="5" width="25" height="25" fill="hsl(var(--foreground))" rx="2" />
              <rect x="5" y="70" width="25" height="25" fill="hsl(var(--foreground))" rx="2" />
              <rect x="10" y="10" width="15" height="15" fill="white" rx="1" />
              <rect x="75" y="10" width="15" height="15" fill="white" rx="1" />
              <rect x="10" y="75" width="15" height="15" fill="white" rx="1" />
              <rect x="14" y="14" width="7" height="7" fill="hsl(var(--foreground))" rx="1" />
              <rect x="79" y="14" width="7" height="7" fill="hsl(var(--foreground))" rx="1" />
              <rect x="14" y="79" width="7" height="7" fill="hsl(var(--foreground))" rx="1" />
              {/* Data pattern */}
              {Array.from({ length: 8 }, (_, r) =>
                Array.from({ length: 8 }, (_, c) => {
                  const filled = ((r * 7 + c * 3 + zone.id.charCodeAt(0)) % 3) !== 0;
                  if (!filled) return null;
                  const x = 35 + c * 4;
                  const y = 35 + r * 4;
                  if (x > 65 && y < 30) return null;
                  return <rect key={`${r}-${c}`} x={x} y={y} width="3" height="3" fill="hsl(var(--foreground))" />;
                })
              )}
            </svg>
          </div>
          <p className="text-xs text-muted-foreground font-mono">{qrId}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}>
              <Printer className="h-3.5 w-3.5" />
              Imprimir
            </Button>
            <Button size="sm" className="gap-1.5" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRDialog;
