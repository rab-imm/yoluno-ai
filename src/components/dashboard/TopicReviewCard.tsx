import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Star, MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TopicFeedback {
  topic: string;
  rating: number;
  notes: string;
}

interface TopicReviewCardProps {
  topics: string[];
}

export function TopicReviewCard({ topics }: TopicReviewCardProps) {
  const [feedbacks, setFeedbacks] = useState<Map<string, TopicFeedback>>(new Map());
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const currentTopic = topics[currentTopicIndex];

  useEffect(() => {
    loadFeedbacks();
  }, []);

  useEffect(() => {
    // Load feedback for current topic
    const feedback = feedbacks.get(currentTopic);
    if (feedback) {
      setRating(feedback.rating);
      setNotes(feedback.notes);
    } else {
      setRating(0);
      setNotes("");
    }
  }, [currentTopic, feedbacks]);

  const loadFeedbacks = async () => {
    const { data } = await supabase
      .from("topic_feedback")
      .select("*");

    if (data) {
      const feedbackMap = new Map<string, TopicFeedback>();
      data.forEach((fb) => {
        feedbackMap.set(fb.topic, {
          topic: fb.topic,
          rating: fb.rating,
          notes: fb.notes || "",
        });
      });
      setFeedbacks(feedbackMap);
    }
  };

  const handleSaveFeedback = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in");
        return;
      }

      const { error } = await supabase
        .from("topic_feedback")
        .upsert({
          parent_id: user.id,
          topic: currentTopic,
          rating,
          notes: notes.trim() || null,
        });

      if (error) throw error;

      toast.success("Feedback saved!");
      
      // Update local state
      const newFeedbacks = new Map(feedbacks);
      newFeedbacks.set(currentTopic, { topic: currentTopic, rating, notes });
      setFeedbacks(newFeedbacks);

      // Move to next topic
      if (currentTopicIndex < topics.length - 1) {
        setCurrentTopicIndex(currentTopicIndex + 1);
      }
    } catch (error: any) {
      toast.error("Failed to save feedback");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    if (currentTopicIndex < topics.length - 1) {
      setCurrentTopicIndex(currentTopicIndex + 1);
    }
  };

  const reviewedCount = Array.from(feedbacks.values()).filter(f => f.rating > 0).length;
  const progress = (reviewedCount / topics.length) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Topic Review Progress</CardTitle>
              <CardDescription>
                {reviewedCount} of {topics.length} topics reviewed ({Math.round(progress)}%)
              </CardDescription>
            </div>
            <div className="text-2xl font-bold text-primary">
              {currentTopicIndex + 1}/{topics.length}
            </div>
          </div>
          <div className="w-full bg-secondary rounded-full h-2 mt-4">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{currentTopic}</CardTitle>
          <CardDescription>
            Rate this topic and provide feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm font-medium mb-2">Rating</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Notes (Optional)</p>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this topic, suggestions for improvement, or how your child responds to it..."
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSaveFeedback}
              disabled={saving || rating === 0}
              className="flex-1"
            >
              {saving ? "Saving..." : "Save & Next"}
            </Button>
            <Button
              onClick={handleSkip}
              variant="outline"
              disabled={currentTopicIndex >= topics.length - 1}
            >
              Skip
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Feedback Summary</CardTitle>
          <CardDescription>
            Topics you've reviewed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {reviewedCount === 0 ? (
              <p className="text-muted-foreground">No reviews yet. Start rating topics above!</p>
            ) : (
              <div className="space-y-3">
                {Array.from(feedbacks.values())
                  .filter(f => f.rating > 0)
                  .map((feedback) => (
                    <div
                      key={feedback.topic}
                      className="flex items-start justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{feedback.topic}</p>
                        {feedback.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {feedback.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(feedback.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
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
