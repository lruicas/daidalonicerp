import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoleProvider } from "@/contexts/RoleContext";
import { BudgetProvider } from "@/contexts/BudgetContext";
import Index from "./pages/Index.tsx";
import Presupuestos from "./pages/Presupuestos.tsx";
import EventosEconomicos from "./pages/EventosEconomicos.tsx";
import Pedidos from "./pages/Pedidos.tsx";
import Inventario from "./pages/Inventario.tsx";
import Empresas from "./pages/Empresas.tsx";
import Patrocinadores from "./pages/Patrocinadores.tsx";
import Miembros from "./pages/Miembros.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RoleProvider>
    <BudgetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/presupuestos" element={<Presupuestos />} />
            <Route path="/eventos-economicos" element={<EventosEconomicos />} />
            <Route path="/pedidos-orders" element={<Pedidos />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/empresas" element={<Empresas />} />
            <Route path="/patrocinadores" element={<Patrocinadores />} />
            <Route path="/miembros" element={<Miembros />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </BudgetProvider>
    </RoleProvider>
  </QueryClientProvider>
);

export default App;
