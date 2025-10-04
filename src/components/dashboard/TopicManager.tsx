import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

const PREDEFINED_TOPICS = [
  "Space & Astronomy",
  "Dinosaurs",
  "Animals & Nature",
  "Math & Numbers",
  "Reading & Stories",
  "Science Experiments",
  "History",
  "Geography",
  "Art & Creativity",
  "Music",
];

interface TopicManagerProps {
  childId: string;
}

export function TopicManager({ childId }: TopicManagerProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
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
      setSelectedTopics(data.map((t) => t.topic));
    }
  };

  const toggleTopic = async (topic: string) => {
    setLoading(true);

    if (selectedTopics.includes(topic)) {
      // Remove topic
      const { error } = await supabase
        .from("child_topics")
        .delete()
        .eq("child_id", childId)
        .eq("topic", topic);

      if (error) {
        toast.error("Failed to remove topic");
      } else {
        setSelectedTopics(selectedTopics.filter((t) => t !== topic));
        toast.success("Topic removed");
      }
    } else {
      // Add topic
      const { error } = await supabase
        .from("child_topics")
        .insert({ child_id: childId, topic });

      if (error) {
        toast.error("Failed to add topic");
      } else {
        setSelectedTopics([...selectedTopics, topic]);
        toast.success("Topic added");
      }
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select topics your child can talk about with their AI buddy
      </p>
      <div className="flex flex-wrap gap-2">
        {PREDEFINED_TOPICS.map((topic) => {
          const isSelected = selectedTopics.includes(topic);
          return (
            <Badge
              key={topic}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all px-4 py-2 ${
                isSelected
                  ? "bg-success hover:bg-success/90"
                  : "hover:border-primary"
              }`}
              onClick={() => toggleTopic(topic)}
            >
              {isSelected && <Check className="h-3 w-3 mr-1" />}
              {topic}
            </Badge>
          );
        })}
      </div>
      {selectedTopics.length === 0 && (
        <p className="text-sm text-warning">
          ⚠️ Please select at least one topic for your child to chat about
        </p>
      )}
    </div>
  );
}
