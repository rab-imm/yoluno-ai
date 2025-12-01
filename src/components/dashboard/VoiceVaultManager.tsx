import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Play, Trash2, ToggleLeft, ToggleRight, Mic } from "lucide-react";
import { toast } from "sonner";

interface VoiceClip {
  id: string;
  clip_name: string;
  audio_url: string;
  duration_ms: number;
  category: string;
  is_active: boolean;
  play_count: number;
  created_at: string;
}

interface VoiceVaultManagerProps {
  onRecordNew: () => void;
}

export function VoiceVaultManager({ onRecordNew }: VoiceVaultManagerProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const queryClient = useQueryClient();

  const { data: clips = [], isLoading } = useQuery({
    queryKey: ["voice-vault-clips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("voice_vault_clips")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as VoiceClip[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (clipId: string) => {
      const { error } = await supabase
        .from("voice_vault_clips")
        .delete()
        .eq("id", clipId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voice-vault-clips"] });
      toast.success("Clip deleted");
    },
    onError: () => {
      toast.error("Failed to delete clip");
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ clipId, isActive }: { clipId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from("voice_vault_clips")
        .update({ is_active: !isActive })
        .eq("id", clipId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voice-vault-clips"] });
    },
    onError: () => {
      toast.error("Failed to toggle clip status");
    },
  });

  const playClip = (audioUrl: string, clipId: string) => {
    const audio = new Audio(audioUrl);
    audio.onended = () => setPlayingId(null);
    audio.play();
    setPlayingId(clipId);
  };

  const filteredClips = clips.filter((clip) => {
    if (filter === "all") return true;
    return clip.category === filter;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "encouragement":
        return "bg-blue-500/10 text-blue-500";
      case "praise":
        return "bg-green-500/10 text-green-500";
      case "celebration":
        return "bg-purple-500/10 text-purple-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading clips...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "encouragement" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("encouragement")}
          >
            Encouragement
          </Button>
          <Button
            variant={filter === "praise" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("praise")}
          >
            Praise
          </Button>
          <Button
            variant={filter === "celebration" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("celebration")}
          >
            Celebration
          </Button>
        </div>

        <Button onClick={onRecordNew} size="sm">
          <Mic className="mr-2 h-4 w-4" />
          Record New
        </Button>
      </div>

      {/* Clips Grid */}
      {filteredClips.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <Mic className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">No voice clips yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Record short voice messages to reward your child when they complete tasks
                </p>
                <Button onClick={onRecordNew}>
                  <Mic className="mr-2 h-4 w-4" />
                  Record Your First Clip
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClips.map((clip) => (
            <Card key={clip.id} className={!clip.is_active ? "opacity-50" : ""}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold truncate">{clip.clip_name}</h4>
                    <p className="text-xs text-muted-foreground">
                      Played {clip.play_count} times
                    </p>
                  </div>
                  <Badge variant="secondary" className={getCategoryColor(clip.category)}>
                    {clip.category}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => playClip(clip.audio_url, clip.id)}
                    disabled={playingId === clip.id}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {playingId === clip.id ? "Playing..." : "Play"}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      toggleActiveMutation.mutate({
                        clipId: clip.id,
                        isActive: clip.is_active,
                      })
                    }
                  >
                    {clip.is_active ? (
                      <ToggleRight className="h-4 w-4 text-primary" />
                    ) : (
                      <ToggleLeft className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(clip.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Voice Clip?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the voice clip.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  deleteMutation.mutate(deleteId);
                  setDeleteId(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
