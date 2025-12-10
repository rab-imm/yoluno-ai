import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Play, Trash2, ToggleLeft, ToggleRight, Mic, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { handleError } from "@/lib/errors";

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

  const { data: clips = [], isLoading, error: fetchError, refetch } = useQuery({
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
      toast.success("Clip deleted successfully");
    },
    onError: (error: unknown) => {
      const errorObj = error as { code?: string };
      if (errorObj?.code === "42501") {
        handleError(error, {
          userMessage: "You don't have permission to delete this clip",
          context: 'VoiceVaultManager.deleteMutation'
        });
      } else {
        handleError(error, {
          userMessage: "Unable to delete the voice clip. Please try again.",
          context: 'VoiceVaultManager.deleteMutation'
        });
      }
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ clipId, isActive }: { clipId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from("voice_vault_clips")
        .update({ is_active: !isActive })
        .eq("id", clipId);

      if (error) throw error;
      return !isActive;
    },
    onSuccess: (newStatus) => {
      queryClient.invalidateQueries({ queryKey: ["voice-vault-clips"] });
      toast.success(newStatus ? "Clip activated" : "Clip deactivated", {
        description: newStatus 
          ? "This clip will now be played as a reward." 
          : "This clip will no longer be played."
      });
    },
    onError: (error: unknown) => {
      handleError(error, {
        userMessage: "Unable to change the clip status. Please try again.",
        context: 'VoiceVaultManager.toggleActiveMutation'
      });
    },
  });

  const playClip = (audioUrl: string, clipId: string) => {
    const audio = new Audio(audioUrl);
    
    audio.onended = () => setPlayingId(null);
    
    audio.onerror = () => {
      setPlayingId(null);
      handleError(new Error("Audio playback failed"), {
        userMessage: "Unable to play this voice clip. The file may be corrupted or unavailable.",
        context: 'VoiceVaultManager.playClip'
      });
    };
    
    audio.play()
      .then(() => setPlayingId(clipId))
      .catch((error) => {
        setPlayingId(null);
        if (error.name === "NotAllowedError") {
          handleError(error, {
            userMessage: "Your browser blocked audio playback. Please click to interact with the page first.",
            context: 'VoiceVaultManager.playClip'
          });
        } else {
          handleError(error, {
            userMessage: "Unable to play this voice clip.",
            context: 'VoiceVaultManager.playClip'
          });
        }
      });
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
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading clips...
      </div>
    );
  }

  if (fetchError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading clips</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>Unable to load your voice clips. Please try again.</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
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
                    {playingId === clip.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
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
                    disabled={toggleActiveMutation.isPending}
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
                    disabled={deleteMutation.isPending}
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
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  deleteMutation.mutate(deleteId);
                  setDeleteId(null);
                }
              }}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
