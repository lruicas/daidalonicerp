import AppLayout from "@/components/AppLayout";
import { LayoutDashboard, TrendingUp, Users, Package } from "lucide-react";

const statCards = [
  { label: "Presupuesto total", value: "€12,450", icon: TrendingUp, color: "primary" },
  { label: "Miembros activos", value: "24", icon: Users, color: "secondary" },
  { label: "Pedidos pendientes", value: "8", icon: Package, color: "accent" },
];

const Index = () => {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-6 w-6 text-primary" strokeWidth={1.5} />
          <h2 className="text-2xl font-semibold text-foreground">Dashboard</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-xl bg-card border border-border overflow-hidden">
              <div
                className={`px-5 py-3 flex items-center gap-2 text-primary-foreground ${
                  color === "primary"
                    ? "bg-primary"
                    : color === "secondary"
                    ? "bg-secondary"
                    : "bg-accent"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                <span className="text-sm font-medium">{label}</span>
              </div>
              <div className="px-5 py-6">
                <p className="text-3xl font-semibold text-foreground">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-card border border-border p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">Actividad reciente</h3>
          <p className="text-sm text-muted-foreground">
            Aquí se mostrarán los últimos movimientos, eventos económicos y actualizaciones del equipo.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
