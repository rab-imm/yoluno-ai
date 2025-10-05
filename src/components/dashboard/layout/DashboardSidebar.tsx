import { NavLink, useParams } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  TrendingUp,
  Library,
  Target,
  BookOpen,
  Users,
  FileText,
  Shield,
  Sparkles,
  LogOut,
} from "lucide-react";
import { ChildSwitcher } from "./ChildSwitcher";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useChildProfiles } from "@/hooks/dashboard/useChildProfiles";

const sections = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, noChildId: true },
    ],
  },
  {
    label: "Learning",
    items: [
      { title: "Insights", url: "/dashboard/insights", icon: TrendingUp },
      { title: "Topics", url: "/dashboard/topics", icon: Library },
      { title: "Content Library", url: "/dashboard/library", icon: FileText },
    ],
  },
  {
    label: "Growth",
    items: [
      { title: "Goal Journeys", url: "/dashboard/journeys", icon: Target },
    ],
  },
  {
    label: "Stories",
    items: [
      { title: "Story Library", url: "/dashboard/stories", icon: BookOpen },
    ],
  },
  {
    label: "Family",
    items: [
      { title: "Family History", url: "/dashboard/family", icon: Users, noChildId: true },
    ],
  },
  {
    label: "Safety",
    items: [
      { title: "Content Review", url: "/dashboard/content", icon: FileText },
      { title: "Safety Monitor", url: "/dashboard/safety", icon: Shield },
    ],
  },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const { childId } = useParams();
  const { children } = useChildProfiles();
  const navigate = useNavigate();
  const isCollapsed = state === "collapsed";

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "";

  // Use first child as fallback if no childId in URL
  const activeChildId = childId || children[0]?.id;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <ChildSwitcher />
      </SidebarHeader>

      <SidebarContent>
        {sections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  // For items that need childId, use activeChildId or disable
                  const url = item.noChildId 
                    ? item.url 
                    : activeChildId 
                    ? `${item.url}/${activeChildId}`
                    : item.url; // Fallback to base URL if no children
                  
                  const isDisabled = !item.noChildId && !activeChildId;
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild disabled={isDisabled}>
                        <NavLink to={url} end className={getNavClassName}>
                          <item.icon className="h-4 w-4" />
                          {!isCollapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/kids")}
          className="w-full justify-start"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {!isCollapsed && "Kids Mode"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="w-full justify-start"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {!isCollapsed && "Sign Out"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
