import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Shield, Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ModerationLog {
  id: string;
  message_content: string;
  flag_reason: string;
  severity: 'low' | 'medium' | 'high';
  created_at: string;
}

interface ContentModerationLogProps {
  childId: string;
  childName: string;
}

export const ContentModerationLog = ({ childId, childName }: ContentModerationLogProps) => {
  const [logs, setLogs] = useState<ModerationLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, [childId]);

  const loadLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('content_moderation_logs')
        .select('*')
        .eq('child_id', childId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setLogs((data || []) as ModerationLog[]);
    } catch (error) {
      console.error('Error loading moderation logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'low':
        return <Info className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Content Safety Log
          </CardTitle>
          <CardDescription>Loading safety logs for {childName}...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Content Safety Log
          </CardTitle>
          <CardDescription>
            All conversations with {childName} are safe! 🎉
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>No Concerns Detected</AlertTitle>
            <AlertDescription>
              The AI buddy is keeping conversations appropriate and on-topic.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Content Safety Log
        </CardTitle>
        <CardDescription>
          Monitoring conversations with {childName} for safety
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex gap-3 p-4 rounded-lg border bg-card"
              >
                <div className="flex-shrink-0 mt-1">
                  {getSeverityIcon(log.severity)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={getSeverityColor(log.severity)}>
                      {log.severity.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.created_at).toLocaleDateString()} at{' '}
                      {new Date(log.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{log.flag_reason}</p>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                    "{log.message_content}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {logs.some(log => log.severity === 'high') && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>High Severity Alert</AlertTitle>
            <AlertDescription>
              Some conversations contained concerning content. The AI blocked these
              automatically, but you may want to discuss appropriate topics with {childName}.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
