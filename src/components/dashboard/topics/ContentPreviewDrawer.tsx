import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ContentItem {
  id: string;
  topic: string;
  question: string;
  answer: string;
  age_range: string;
  keywords: string[];
  is_custom?: boolean;
}

interface ContentPreviewDrawerProps {
  topics: string[];
  packName: string;
}

export function ContentPreviewDrawer({ topics, packName }: ContentPreviewDrawerProps) {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, [topics]);

  const loadContent = async () => {
    setLoading(true);
    try {
      // Fetch system content
      const { data: systemContent } = await supabase
        .from("topic_content")
        .select("*")
        .in("topic", topics)
        .eq("is_reviewed", true);

      // Fetch custom content
      const { data: customContent } = await supabase
        .from("custom_content")
        .select("*")
        .in("topic", topics);

      const allContent = [
        ...(systemContent || []),
        ...(customContent?.map(c => ({ ...c, is_custom: true })) || [])
      ];

      setContent(allContent);
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupedContent = topics.reduce((acc, topic) => {
    acc[topic] = content.filter(c => c.topic === topic);
    return acc;
  }, {} as Record<string, ContentItem[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalContent = content.length;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-2xl font-bold">{packName}</h3>
        <p className="text-muted-foreground">
          {totalContent} Q&A pairs across {topics.length} topics
        </p>
      </div>

      {totalContent === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No content available for these topics yet.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Create custom content or wait for system content to be added.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[500px]">
          <div className="space-y-4 pr-4">
            {topics.map((topic) => {
              const topicContent = groupedContent[topic] || [];
              if (topicContent.length === 0) return null;

              return (
                <Card key={topic}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{topic}</CardTitle>
                      <Badge variant="secondary">{topicContent.length} Q&A</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {topicContent.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 border rounded-lg space-y-2 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-sm">{item.question}</p>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-xs">
                              {item.age_range}
                            </Badge>
                            {item.is_custom && (
                              <Badge variant="default" className="text-xs">
                                Custom
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.answer}</p>
                        {item.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.keywords.map((keyword) => (
                              <span
                                key={keyword}
                                className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
