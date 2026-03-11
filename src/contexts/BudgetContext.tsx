import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { BudgetRow, mockBudgets } from "@/lib/budget-data";

interface BudgetContextType {
  budgets: BudgetRow[];
  updateRow: (id: string, updates: Partial<BudgetRow>) => void;
  importRows: (rows: BudgetRow[]) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
  const [budgets, setBudgets] = useState<BudgetRow[]>(mockBudgets);

  const updateRow = useCallback((id: string, updates: Partial<BudgetRow>) => {
    setBudgets((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  }, []);

  const importRows = useCallback((rows: BudgetRow[]) => {
    setBudgets((prev) => [...prev, ...rows]);
  }, []);

  return (
    <BudgetContext.Provider value={{ budgets, updateRow, importRows }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgets = () => {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error("useBudgets must be used within BudgetProvider");
  return ctx;
};
