import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TrainingLayout from "./components/layout/TrainingLayout";
import SuperiaMarketsLayout from "./components/layout/SuperiaMarketsLayout";
import GeneralTraining from "./pages/GeneralTraining";
import AllEmployeesTraining from "./pages/AllEmployeesTraining";
import ManagerTraining from "./pages/ManagerTraining";
import PurchaserTraining from "./pages/PurchaserTraining";
import SalesTraining from "./pages/SalesTraining";
import PreparerTraining from "./pages/PreparerTraining";
import CarsForSale from "./pages/CarsForSale";
import CarDetail from "./pages/CarDetail";
import Cart from "./pages/Cart";
import SuperiaMarketsWelcome from "./pages/SuperiaMarketsWelcome";
import PurchaseCarForm from "./pages/PurchaseCarForm";
import SoldCars from "./pages/SoldCars";
import ReturnedCars from "./pages/ReturnedCars";
import Reporting from "./pages/Reporting";
import IJustGotPaid from "./pages/IJustGotPaid";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient(); // Initialized

// Route configuration
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TrainingLayout />}>
            <Route index element={<GeneralTraining />} />
            <Route path="alle-ansatte" element={<AllEmployeesTraining />} />
            <Route path="daglig-leder" element={<ManagerTraining />} />
            <Route path="innkjoper" element={<PurchaserTraining />} />
            <Route path="selger" element={<SalesTraining />} />
            <Route path="klargjorer" element={<PreparerTraining />} />
            <Route path="handlekurv" element={<Cart />} />
          </Route>
          <Route path="/superia-markets" element={<SuperiaMarketsLayout />}>
            <Route index element={<SuperiaMarketsWelcome />} />
            <Route path="innkjop-av-bil" element={<PurchaseCarForm />} />
            <Route path="biler-til-salgs" element={<CarsForSale />} />
            <Route path="biler-til-salgs/:id" element={<CarDetail />} />
            <Route path="solgte-biler" element={<SoldCars />} />
            <Route path="tilbakeleverte-biler" element={<ReturnedCars />} />
            <Route path="i-just-got-paid" element={<IJustGotPaid />} />
            <Route path="reporting" element={<Reporting />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
