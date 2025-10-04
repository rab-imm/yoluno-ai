import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, LogOut, Settings, Users } from "lucide-react";
import { toast } from "sonner";
import { ChildProfileCard } from "@/components/dashboard/ChildProfileCard";
import { CreateChildDialog } from "@/components/dashboard/CreateChildDialog";
import { TopicManager } from "@/components/dashboard/TopicManager";

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<any[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchChildren();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setLoading(false);
  };

  const fetchChildren = async () => {
    const { data, error } = await supabase
      .from("child_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load child profiles");
      return;
    }

    setChildren(data || []);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Parent Dashboard</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Child Profiles</CardTitle>
              <CardDescription>
                Create and manage profiles for your children
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {children.map((child) => (
                  <ChildProfileCard
                    key={child.id}
                    child={child}
                    onRefresh={fetchChildren}
                  />
                ))}
                <Card
                  className="border-dashed cursor-pointer hover:border-primary transition-colors"
                  onClick={() => setShowCreateDialog(true)}
                >
                  <CardContent className="flex flex-col items-center justify-center min-h-[200px] gap-2">
                    <Plus className="h-12 w-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Add Child Profile</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {children.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Topic Management</CardTitle>
                <CardDescription>
                  Select approved topics for your children
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TopicManager childId={children[0]?.id} />
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <CreateChildDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={fetchChildren}
      />
    </div>
  );
}
