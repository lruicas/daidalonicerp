import AppLayout from "@/components/AppLayout";
import { LayoutDashboard } from "lucide-react";
import KpiCard from "@/components/dashboard/KpiCard";
import PriorityDonut from "@/components/dashboard/PriorityDonut";
import OrdersBySection from "@/components/dashboard/OrdersBySection";
import BudgetEvolution from "@/components/dashboard/BudgetEvolution";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import YearSelector from "@/components/dashboard/YearSelector";

const Index = () => {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-5 w-5 text-primary" strokeWidth={1.5} />
            <h2 className="text-xl font-semibold text-foreground">Dashboard</h2>
          </div>
          <YearSelector />
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Dinero disponible año actual"
            value="12.450 €"
            variant="primary"
            trend={{ value: "+3.2% vs mes anterior", positive: true }}
          />
          <KpiCard
            title="Dinero por eventos"
            value="32.800 €"
            variant="secondary"
            trend={{ value: "+12.5% acumulado", positive: true }}
          />
          <KpiCard
            title="Pedidos pendientes"
            value="8"
            variant="accent"
            trend={{ value: "2 urgentes", positive: false }}
          />
          <KpiCard title="Presupuestos por prioridad" value="" variant="primary">
            <PriorityDonut />
          </KpiCard>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <OrdersBySection />
          <BudgetEvolution />
          <UpcomingEvents />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
