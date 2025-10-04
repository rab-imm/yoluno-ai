import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, MessageSquare, Calendar, Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TopicStat {
  topic: string;
  message_count: number;
  last_message_at: string;
}

interface TopicAnalytic {
  topic: string;
  message_count: number;
  last_used_at: string;
  engagement_score: number;
}

interface TopicAnalyticsProps {
  childId?: string;
}

export function TopicAnalytics({ childId }: TopicAnalyticsProps) {
  const [stats, setStats] = useState<TopicStat[]>([]);
  const [analytics, setAnalytics] = useState<TopicAnalytic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    loadAnalytics();
  }, [childId]);

  const loadStats = async () => {
    let query = supabase
      .from("conversation_stats")
      .select("*")
      .order("message_count", { ascending: false });

    if (childId) {
      query = query.eq("child_id", childId);
    }

    const { data } = await query;
    if (data) {
      setStats(data);
    }
    setLoading(false);
  };

  const loadAnalytics = async () => {
    let query = supabase
      .from("topic_analytics")
      .select("*")
      .order("engagement_score", { ascending: false });

    if (childId) {
      query = query.eq("child_id", childId);
    }

    const { data } = await query;
    if (data) {
      setAnalytics(data);
    }
  };

  const topTopics = stats.slice(0, 10);
  const totalMessages = stats.reduce((sum, stat) => sum + stat.message_count, 0);
  const activeTopics = stats.filter(s => s.message_count > 0).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              Across all topics
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Topics</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTopics}</div>
            <p className="text-xs text-muted-foreground">
              Topics with conversations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Messages/Topic</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeTopics > 0 ? Math.round(totalMessages / activeTopics) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Engagement per topic
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Topics</CardTitle>
          <CardDescription>
            Most discussed topics ranked by message count
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : topTopics.length === 0 ? (
              <p className="text-muted-foreground">No topic data available yet. Start chatting to see analytics!</p>
            ) : (
              <div className="space-y-4">
                {topTopics.map((stat, index) => (
                  <div
                    key={stat.topic}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{stat.topic}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MessageSquare className="w-3 h-3" />
                          {stat.message_count} messages
                          <Calendar className="w-3 h-3 ml-2" />
                          {formatDate(stat.last_message_at)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, (stat.message_count / topTopics[0].message_count) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
