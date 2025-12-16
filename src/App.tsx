import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { KidsAuthProvider } from "./contexts/KidsAuthContext";

// Load landing pages immediately
import Index from "./pages/Index";
import Auth from "./pages/Auth";

// Lazy load all other pages
const ChildChat = lazy(() => import("./pages/ChildChat"));
const KidsLauncher = lazy(() => import("./pages/KidsLauncher"));
const KidsEntrypoint = lazy(() => import("./pages/KidsEntrypoint"));
const KidsProfileSelector = lazy(() => import("./pages/KidsProfileSelector"));
const Features = lazy(() => import("./pages/Features"));
const StoriesFeature = lazy(() => import("./pages/features/Stories"));
const JourneysFeature = lazy(() => import("./pages/features/JourneysFeature"));
const LearningFeature = lazy(() => import("./pages/features/LearningFeature"));
const FamilyFeature = lazy(() => import("./pages/features/FamilyFeature"));
const Safety = lazy(() => import("./pages/Safety"));
const Pricing = lazy(() => import("./pages/Pricing"));
const About = lazy(() => import("./pages/About"));
const Support = lazy(() => import("./pages/Support"));
const Blog = lazy(() => import("./pages/Blog"));
const Privacy = lazy(() => import("./pages/legal/Privacy"));
const Terms = lazy(() => import("./pages/legal/Terms"));
const COPPA = lazy(() => import("./pages/legal/COPPA"));
const NotFound = lazy(() => import("./pages/NotFound"));
const JourneyMarketplace = lazy(() => import("./pages/JourneyMarketplace"));

// Dashboard routes - lazy loaded
const DashboardLayout = lazy(() => import("./pages/dashboard/DashboardLayout"));
const Overview = lazy(() => import("./pages/dashboard/Overview"));
const Insights = lazy(() => import("./pages/dashboard/Insights"));
const Topics = lazy(() => import("./pages/dashboard/Topics"));
const Library = lazy(() => import("./pages/dashboard/Library"));
const Journeys = lazy(() => import("./pages/dashboard/Journeys"));
const Stories = lazy(() => import("./pages/dashboard/Stories"));
const Family = lazy(() => import("./pages/dashboard/Family"));
const Content = lazy(() => import("./pages/dashboard/Content"));
const DashboardSafety = lazy(() => import("./pages/dashboard/Safety"));
const GenerateAvatars = lazy(() => import("./pages/dashboard/GenerateAvatars"));
const VoiceVault = lazy(() => import("./pages/dashboard/VoiceVault"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center p-8">
    <div className="space-y-4 w-full max-w-2xl">
      <Skeleton className="h-12 w-64" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes cache time
      refetchOnWindowFocus: false,
      retry: 1, // Only retry failed queries once
      refetchOnMount: true, // Always fetch fresh data on mount
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ErrorBoundary>
          <KidsAuthProvider>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Dashboard Routes with Nested Layout */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="insights/:childId" element={<Insights />} />
            <Route path="topics/:childId" element={<Topics />} />
            <Route path="library/:childId" element={<Library />} />
            <Route path="journeys/:childId" element={<Journeys />} />
            <Route path="stories/:childId" element={<Stories />} />
            <Route path="family" element={<Family />} />
            <Route path="voice-vault" element={<VoiceVault />} />
            <Route path="content/:childId" element={<Content />} />
            <Route path="safety/:childId" element={<DashboardSafety />} />
            <Route path="generate-avatars" element={<GenerateAvatars />} />
          </Route>

          {/* Legacy redirect */}
          <Route path="/parent" element={<Navigate to="/dashboard" replace />} />

          <Route path="/marketplace" element={<JourneyMarketplace />} />
          <Route path="/kids" element={<KidsLauncher />} />
          <Route path="/child/:id" element={<ChildChat />} />
          
          {/* Independent Kids Mode Routes */}
          <Route path="/play" element={<KidsEntrypoint />} />
          <Route path="/play/select" element={<KidsProfileSelector />} />
          <Route path="/play/:childId" element={<ChildChat />} />
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
            </Suspense>
          </KidsAuthProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
