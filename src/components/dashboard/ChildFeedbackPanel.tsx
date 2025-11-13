import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface Feedback {
  id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  child_profiles: {
    name: string;
    avatar: string;
    custom_avatar_url?: string;
  } | null;
}

export const ChildFeedbackPanel = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedback();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('child_feedback_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'child_feedback'
        },
        () => {
          loadFeedback();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from("child_feedback")
        .select(`
          id,
          message,
          is_read,
          created_at,
          child_profiles (
            name,
            avatar,
            custom_avatar_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFeedback(data || []);
    } catch (error) {
      console.error("Error loading feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("child_feedback")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;
      toast.success("Marked as read");
      loadFeedback();
    } catch (error) {
      console.error("Error marking as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  const deleteFeedback = async (id: string) => {
    try {
      const { error } = await supabase
        .from("child_feedback")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Message deleted");
      loadFeedback();
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Failed to delete message");
    }
  };

  const unreadCount = feedback.filter(f => !f.is_read).length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages from Kids
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">Loading messages...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages from Kids
          </CardTitle>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} new</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {feedback.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <div className="text-4xl mb-2">📬</div>
            <p className="text-muted-foreground">
              No messages yet. Kids can send you messages from the profile selector!
            </p>
          </div>
        ) : (
          feedback.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg border ${
                item.is_read ? "bg-muted/30" : "bg-primary/5 border-primary/20"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {item.child_profiles && (
                    <>
                      {item.child_profiles.custom_avatar_url ? (
                        <img
                          src={item.child_profiles.custom_avatar_url}
                          alt={item.child_profiles.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">{item.child_profiles.avatar}</span>
                      )}
                      <span className="font-semibold">{item.child_profiles.name}</span>
                    </>
                  )}
                  {!item.is_read && (
                    <Badge variant="secondary" className="text-xs">New</Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                </span>
              </div>
              
              <p className="text-sm mb-3 whitespace-pre-wrap">{item.message}</p>
              
              <div className="flex gap-2">
                {!item.is_read && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markAsRead(item.id)}
                  >
                    <Check className="mr-2 h-3 w-3" />
                    Mark as Read
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteFeedback(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
