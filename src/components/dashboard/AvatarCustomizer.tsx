import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BuddyAvatar } from "@/components/chat/BuddyAvatar";

interface AvatarCustomizerProps {
  childId: string;
  currentAvatar: string;
  customAvatarUrl?: string;
  onAvatarGenerated: (url: string) => void;
}

export function AvatarCustomizer({
  childId,
  currentAvatar,
  customAvatarUrl,
  onAvatarGenerated,
}: AvatarCustomizerProps) {
  const [generating, setGenerating] = useState(false);

  const generateCustomAvatar = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-avatar", {
        body: {
          emoji: currentAvatar,
          childId,
        },
      });

      if (error) throw error;

      if (data.imageUrl) {
        // Save to database
        const { error: updateError } = await supabase
          .from("child_profiles")
          .update({ custom_avatar_url: data.imageUrl })
          .eq("id", childId);

        if (updateError) throw updateError;

        onAvatarGenerated(data.imageUrl);
        toast.success("✨ Custom avatar generated!");
      }
    } catch (error: any) {
      console.error("Avatar generation error:", error);
      toast.error("Failed to generate custom avatar");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-child-primary" />
        Custom Avatar
      </h3>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-3">
            Generate a unique AI avatar based on {currentAvatar}
          </p>
          <Button
            onClick={generateCustomAvatar}
            disabled={generating}
            variant="playful"
            className="w-full"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Custom Avatar
              </>
            )}
          </Button>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs text-muted-foreground">Preview</div>
          <BuddyAvatar
            size="md"
            avatar={currentAvatar}
            customAvatarUrl={customAvatarUrl}
            expression="happy"
          />
        </div>
      </div>
    </Card>
  );
}