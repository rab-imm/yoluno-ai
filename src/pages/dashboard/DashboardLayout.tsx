import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/layout/DashboardSidebar";
import { supabase } from "@/integrations/supabase/client";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [navigate]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  // Get page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard Overview";
    if (path.includes("/insights")) return "Learning Insights";
    if (path.includes("/topics")) return "Topic Manager";
    if (path.includes("/library")) return "Content Library";
    if (path.includes("/journeys")) return "Goal Journeys";
    if (path.includes("/stories")) return "Story Library";
    if (path.includes("/family")) return "Family History";
    if (path.includes("/content")) return "Content Review";
    if (path.includes("/safety")) return "Safety Monitor";
    return "Parent Dashboard";
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-3 md:gap-4 px-3 md:px-4">
              <SidebarTrigger className="min-h-[44px] min-w-[44px]" />
              <h1 className="text-base md:text-lg font-semibold truncate">{getPageTitle()}</h1>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
