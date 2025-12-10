import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

interface TopicPack {
  id: string;
  name: string;
  description: string;
  emoji: string;
  topics: string[];
}

interface ContentPackSelectorProps {
  childId: string;
  selectedTopics: string[];
  onTopicsChange: () => void;
}

export function ContentPackSelector({ childId, selectedTopics, onTopicsChange }: ContentPackSelectorProps) {
  const [packs, setPacks] = useState<TopicPack[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPacks();
  }, []);

  const loadPacks = async () => {
    const { data } = await supabase
      .from("topic_packs")
      .select("*")
      .order("name");
    
    if (data) {
      setPacks(data);
    }
  };

  const addPack = async (pack: TopicPack) => {
    setLoading(true);
    try {
      // Add all topics from the pack that aren't already selected
      const newTopics = pack.topics.filter(topic => !selectedTopics.includes(topic));
      
      if (newTopics.length === 0) {
        toast.info("All topics from this pack are already added!");
        setLoading(false);
        return;
      }

      const topicsToInsert = newTopics.map(topic => ({
        child_id: childId,
        topic: topic,
      }));

      const { error } = await supabase
        .from("child_topics")
        .insert(topicsToInsert);

      if (error) throw error;

      toast.success(`Added ${pack.name}! 🎉`);
      onTopicsChange();
    } catch (error: any) {
      toast.error("Failed to add pack");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-child-primary" />
        <h3 className="font-semibold">Quick Add: Content Packs</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {packs.map((pack) => {
          const hasAllTopics = pack.topics.every(topic => selectedTopics.includes(topic));
          
          return (
            <Card
              key={pack.id}
              className={`p-4 transition-all duration-200 ${
                hasAllTopics ? "opacity-60" : "hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{pack.emoji}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-1">{pack.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{pack.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {pack.topics.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className="text-xs px-2 py-0.5 bg-child-primary/10 text-child-primary rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                    {pack.topics.length > 3 && (
                      <span className="text-xs px-2 py-0.5 text-muted-foreground">
                        +{pack.topics.length - 3} more
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => addPack(pack)}
                    disabled={loading || hasAllTopics}
                    variant={hasAllTopics ? "secondary" : "playful"}
                    className="w-full"
                  >
                    {hasAllTopics ? "Already Added" : `Add All ${pack.topics.length} Topics`}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
