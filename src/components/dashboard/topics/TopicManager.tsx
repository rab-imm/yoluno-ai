import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { handleError } from "@/lib/errors";
import { AlertCircle, Plus } from "lucide-react";
import { ContentPackSelector } from "./ContentPackSelector";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PREDEFINED_TOPICS = [
  "Space",
  "Animals",
  "Science",
  "Math",
  "Reading",
  "Art",
  "Music",
  "Sports",
  "History",
  "Geography",
  "Technology",
  "Nature",
  "Cooking",
  "Games",
];

interface TopicManagerProps {
  childId: string;
}

export function TopicManager({ childId }: TopicManagerProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTopics();
  }, [childId]);

  const loadTopics = async () => {
    const { data } = await supabase
      .from("child_topics")
      .select("topic")
      .eq("child_id", childId);

    if (data) {
      setSelectedTopics(data.map((item) => item.topic));
    }
  };

  const toggleTopic = async (topic: string) => {
    const isSelected = selectedTopics.includes(topic);

    if (isSelected) {
      const { error } = await supabase
        .from("child_topics")
        .delete()
        .eq("child_id", childId)
        .eq("topic", topic);

      if (error) {
        handleError(error, {
          userMessage: "Failed to remove topic",
          context: 'TopicManager.toggleTopic'
        });
        return;
      }

      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
      toast.success(`Removed ${topic}`);
    } else {
      const { error } = await supabase.from("child_topics").insert({
        child_id: childId,
        topic,
      });

      if (error) {
        handleError(error, {
          userMessage: "Failed to add topic",
          context: 'TopicManager.toggleTopic'
        });
        return;
      }

      setSelectedTopics([...selectedTopics, topic]);
      toast.success(`Added ${topic}`);
    }
  };

  const addCustomTopic = async () => {
    if (!customTopic.trim()) return;
    
    if (selectedTopics.includes(customTopic.trim())) {
      toast.error("This topic is already added");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("child_topics").insert({
      child_id: childId,
      topic: customTopic.trim(),
    });

    if (error) {
      handleError(error, {
        userMessage: "Failed to add custom topic",
        context: 'TopicManager.addCustomTopic'
      });
      setLoading(false);
      return;
    }

    setSelectedTopics([...selectedTopics, customTopic.trim()]);
    toast.success(`Added ${customTopic}`);
    setCustomTopic("");
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <ContentPackSelector 
        childId={childId} 
        selectedTopics={selectedTopics}
        onTopicsChange={loadTopics}
      />

      <div className="space-y-3">
        <h3 className="font-semibold">Individual Topics</h3>
        <div className="flex flex-wrap gap-2">
          {PREDEFINED_TOPICS.map((topic) => (
            <Badge
              key={topic}
              variant={selectedTopics.includes(topic) ? "default" : "outline"}
              className="cursor-pointer text-base px-4 py-2 hover:scale-105 transition-transform"
              onClick={() => toggleTopic(topic)}
            >
              {topic}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Add Custom Topic</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Enter a custom topic..."
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addCustomTopic()}
            disabled={loading}
          />
          <Button
            onClick={addCustomTopic}
            disabled={loading || !customTopic.trim()}
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {selectedTopics.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground">Active Topics ({selectedTopics.length})</h3>
          <div className="flex flex-wrap gap-2">
            {selectedTopics.map((topic) => (
              <Badge
                key={topic}
                variant="default"
                className="cursor-pointer px-3 py-1"
                onClick={() => toggleTopic(topic)}
              >
                {topic} ×
              </Badge>
            ))}
          </div>
        </div>
      )}

      {selectedTopics.length === 0 && (
        <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <p className="text-sm text-amber-600">
            Please select at least one topic for your child's buddy to discuss!
          </p>
        </div>
      )}
    </div>
  );
}
