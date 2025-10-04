import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ParentDashboard from "./pages/ParentDashboard";
import JourneyMarketplace from "./pages/JourneyMarketplace";
import ChildChat from "./pages/ChildChat";
import KidsLauncher from "./pages/KidsLauncher";
import Stories from "./pages/Stories";
import Journeys from "./pages/Journeys";
import Learning from "./pages/Learning";
import Safety from "./pages/Safety";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="/marketplace" element={<JourneyMarketplace />} />
          <Route path="/kids" element={<KidsLauncher />} />
          <Route path="/child/:id" element={<ChildChat />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/journeys" element={<Journeys />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
