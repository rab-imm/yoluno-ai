import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Check, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

export function ParentAlertsPanel({ parentId }: { parentId: string }) {
  const queryClient = useQueryClient();

  const { data: alerts = [] } = useQuery({
    queryKey: ["parent-alerts", parentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("parent_alerts")
        .select("*")
        .eq("parent_id", parentId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from("parent_alerts")
        .update({ is_read: true })
        .eq("id", alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parent-alerts"] });
    },
  });

  const dismissAlert = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from("parent_alerts")
        .update({ is_dismissed: true })
        .eq("id", alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parent-alerts"] });
      toast.success("Alert dismissed");
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("parent-alerts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "parent_alerts",
          filter: `parent_id=eq.${parentId}`,
        },
        (payload) => {
          toast.warning((payload.new as any).title);
          queryClient.invalidateQueries({ queryKey: ["parent-alerts"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [parentId, queryClient]);

  const unreadCount = alerts.filter((a) => !a.is_read && !a.is_dismissed).length;
  const activeAlerts = alerts.filter((a) => !a.is_dismissed);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Safety Alerts
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeAlerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No alerts</p>
        ) : (
          activeAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={!alert.is_read ? "border-primary" : ""}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      {alert.severity === "high" && (
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                      )}
                      <p className="font-semibold">{alert.title}</p>
                      <Badge variant={getSeverityColor(alert.severity) as any}>
                        {alert.severity}
                      </Badge>
                      {!alert.is_read && (
                        <Badge variant="outline">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {alert.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {!alert.is_read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsRead.mutate(alert.id)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dismissAlert.mutate(alert.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}
