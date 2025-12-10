import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertCircle, TrendingUp } from "lucide-react";

export function SessionMonitoringDashboard({ childId }: { childId: string }) {
  const { data: sessions = [] } = useQuery({
    queryKey: ["session-metrics", childId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_session_metrics")
        .select("*")
        .eq("child_id", childId)
        .order("session_start", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  const activeSession = sessions.find((s) => !s.session_end);

  return (
    <div className="space-y-4">
      {activeSession && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary animate-pulse" />
              Active Session
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Messages</p>
                <p className="text-2xl font-bold">{activeSession.total_messages}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Flagged</p>
                <p className="text-2xl font-bold">{activeSession.flagged_messages}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Anomaly Score</p>
                <p className="text-2xl font-bold">{activeSession.anomaly_score}</p>
              </div>
            </div>
            {activeSession.anomaly_score >= 6 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                High anomaly detected
              </Badge>
            )}
            <div className="flex flex-wrap gap-1">
              {activeSession.topics_discussed?.map((topic: string) => (
                <Badge key={topic} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recent Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {new Date(session.session_start).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session.total_messages} messages, {session.flagged_messages} flagged
                  </p>
                </div>
                {session.anomaly_score >= 6 && (
                  <Badge variant="destructive">Alert</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
