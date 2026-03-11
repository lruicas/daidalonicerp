import AppLayout from "@/components/AppLayout";
import { Wallet } from "lucide-react";
import BudgetToolbar from "@/components/presupuestos/BudgetToolbar";
import BudgetFilters from "@/components/presupuestos/BudgetFilters";
import BudgetTable from "@/components/presupuestos/BudgetTable";
import { useState } from "react";
import { mockBudgets, BudgetRow, Section, Priority } from "@/lib/budget-data";

const Presupuestos = () => {
  const [budgets, setBudgets] = useState<BudgetRow[]>(mockBudgets);
  const [search, setSearch] = useState("");
  const [filterSection, setFilterSection] = useState<Section | "all">("all");
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");

  const filtered = budgets.filter((b) => {
    const matchSearch =
      !search ||
      b.nombre.toLowerCase().includes(search.toLowerCase()) ||
      b.empresa.toLowerCase().includes(search.toLowerCase()) ||
      b.referencia.toLowerCase().includes(search.toLowerCase());
    const matchSection = filterSection === "all" || b.seccion === filterSection;
    const matchPriority = filterPriority === "all" || b.prioridad === filterPriority;
    return matchSearch && matchSection && matchPriority;
  });

  const updateRow = (id: string, updates: Partial<BudgetRow>) => {
    setBudgets((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const handleImport = (rows: BudgetRow[]) => {
    setBudgets((prev) => [...prev, ...rows]);
  };

  return (
    <AppLayout>
      <div className="max-w-[1600px] mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <Wallet className="h-5 w-5 text-primary" strokeWidth={1.5} />
          <h2 className="text-xl font-semibold text-foreground">Presupuestos</h2>
        </div>

        <BudgetToolbar budgets={budgets} onImport={handleImport} />
        <BudgetFilters
          search={search}
          onSearchChange={setSearch}
          filterSection={filterSection}
          onSectionChange={setFilterSection}
          filterPriority={filterPriority}
          onPriorityChange={setFilterPriority}
        />
        <BudgetTable rows={filtered} onUpdateRow={updateRow} />
      </div>
    </AppLayout>
  );
};

export default Presupuestos;
