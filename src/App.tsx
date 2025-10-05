import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ParentDashboard from "./pages/ParentDashboard";
import ChildChat from "./pages/ChildChat";
import KidsLauncher from "./pages/KidsLauncher";
import Features from "./pages/Features";
import StoriesFeature from "./pages/features/Stories";
import JourneysFeature from "./pages/features/JourneysFeature";
import LearningFeature from "./pages/features/LearningFeature";
import FamilyFeature from "./pages/features/FamilyFeature";
import Safety from "./pages/Safety";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Support from "./pages/Support";
import Blog from "./pages/Blog";
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import COPPA from "./pages/legal/COPPA";
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
          <Route path="/kids" element={<KidsLauncher />} />
          <Route path="/child/:id" element={<ChildChat />} />
          <Route path="/features" element={<Features />} />
          <Route path="/features/stories" element={<StoriesFeature />} />
          <Route path="/features/journeys" element={<JourneysFeature />} />
          <Route path="/features/learning" element={<LearningFeature />} />
          <Route path="/features/family" element={<FamilyFeature />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/coppa" element={<COPPA />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
