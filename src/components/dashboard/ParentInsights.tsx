import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, MessageCircle, Clock } from "lucide-react";

interface InsightData {
  topic: string;
  message_count: number;
}

interface ParentInsightsProps {
  childId: string;
  childName: string;
}

export function ParentInsights({ childId, childName }: ParentInsightsProps) {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [totalMessages, setTotalMessages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, [childId]);

  const loadInsights = async () => {
    setLoading(true);
    
    // Get total message count
    const { count } = await supabase
      .from("chat_messages")
      .select("*", { count: "exact", head: true })
      .eq("child_id", childId)
      .eq("role", "user");

    setTotalMessages(count || 0);

    // Get topic breakdown from stats
    const { data } = await supabase
      .from("conversation_stats")
      .select("topic, message_count")
      .eq("child_id", childId)
      .order("message_count", { ascending: false })
      .limit(5);

    if (data) {
      setInsights(data);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-3 bg-muted rounded"></div>
          <div className="h-3 bg-muted rounded w-5/6"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-child-primary" />
        <h3 className="font-semibold">Learning Insights for {childName}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-child-primary/5 rounded-lg">
          <MessageCircle className="w-8 h-8 text-child-primary" />
          <div>
            <p className="text-2xl font-bold">{totalMessages}</p>
            <p className="text-sm text-muted-foreground">Questions Asked</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-child-secondary/5 rounded-lg">
          <Clock className="w-8 h-8 text-child-secondary" />
          <div>
            <p className="text-2xl font-bold">{insights.length}</p>
            <p className="text-sm text-muted-foreground">Topics Explored</p>
          </div>
        </div>
      </div>

      {insights.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground">Top Topics</h4>
          {insights.map((insight) => (
            <div key={insight.topic} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="font-medium">{insight.topic}</span>
              <span className="text-sm text-muted-foreground">
                {insight.message_count} {insight.message_count === 1 ? "question" : "questions"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>Start chatting to see insights! 🌟</p>
        </div>
      )}
    </Card>
  );
}
