import { createContext, useContext, useState, type ReactNode } from "react";
import type { InventoryItem } from "@/lib/inventory-data";
import { mockInventory } from "@/lib/inventory-data";

interface InventoryContextType {
  items: InventoryItem[];
  setItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  addItems: (newItems: InventoryItem[]) => void;
  clonedByOrder: Record<string, InventoryItem[]>;
  registerCloned: (orderId: string, items: InventoryItem[]) => void;
}

const InventoryContext = createContext<InventoryContextType | null>(null);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<InventoryItem[]>(mockInventory);
  const [clonedByOrder, setClonedByOrder] = useState<Record<string, InventoryItem[]>>({});

  const addItems = (newItems: InventoryItem[]) => {
    setItems((prev) => [...newItems, ...prev]);
  };

  const registerCloned = (orderId: string, cloned: InventoryItem[]) => {
    setClonedByOrder((prev) => ({ ...prev, [orderId]: cloned }));
    addItems(cloned);
  };

  return (
    <InventoryContext.Provider value={{ items, setItems, addItems, clonedByOrder, registerCloned }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used within InventoryProvider");
  return ctx;
};
