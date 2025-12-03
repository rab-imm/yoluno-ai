import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useChildProfiles } from "@/hooks/dashboard/useChildProfiles";
import { ContentModerationLog } from "@/components/dashboard/ContentModerationLog";
import { ParentAlertsPanel } from "@/components/dashboard/ParentAlertsPanel";
import { GuardrailSettingsPanel } from "@/components/dashboard/GuardrailSettingsPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings, Bell, FileText, Shield } from "lucide-react";

export default function Safety() {
  const { childId } = useParams();
  const { children, isLoading } = useChildProfiles();
  const [parentId, setParentId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setParentId(user.id);
    };
    getUser();
  }, []);

  if (isLoading || !parentId) {
    return <Skeleton className="h-96 w-full" />;
  }

  const child = childId ? children.find((c) => c.id === childId) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Safety Dashboard</h1>
          <p className="text-muted-foreground">
            {child ? `Viewing safety for ${child.name}` : "Configure AI guardrails and view alerts"}
          </p>
        </div>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="log" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Moderation Log</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="mt-6">
          <GuardrailSettingsPanel />
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <ParentAlertsPanel parentId={parentId} />
        </TabsContent>

        <TabsContent value="log" className="mt-6">
          {child ? (
            <ContentModerationLog childId={child.id} childName={child.name} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Select a Child</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Please select a child from the sidebar to view their moderation log.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
