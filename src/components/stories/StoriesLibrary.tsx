import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Heart, Trash2, Eye, Moon, Calendar, Filter } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { BedtimeMode } from "./BedtimeMode";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Story {
  id: string;
  title: string;
  content: string;
  is_favorite: boolean;
  created_at: string;
  theme?: string;
  mood?: string;
  illustrations?: any;
  audio_content?: string;
  duration_seconds?: number;
  bedtime_ready?: boolean;
}

interface StoriesLibraryProps {
  childId: string;
  childName: string;
}

export function StoriesLibrary({ childId, childName }: StoriesLibraryProps) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [bedtimeStory, setBedtimeStory] = useState<Story | null>(null);
  const [filterTheme, setFilterTheme] = useState<string>("all");
  const [filterFavorites, setFilterFavorites] = useState(false);

  useEffect(() => {
    loadStories();
  }, [childId]);

  const loadStories = async () => {
    let query = supabase
      .from("child_stories")
      .select("*")
      .eq("child_id", childId);

    if (filterTheme !== "all") {
      query = query.eq("theme", filterTheme);
    }

    if (filterFavorites) {
      query = query.eq("is_favorite", true);
    }

    const { data } = await query.order("created_at", { ascending: false });

    if (data) {
      setStories(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStories();
  }, [filterTheme, filterFavorites]);

  const toggleFavorite = async (storyId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("child_stories")
      .update({ is_favorite: !currentStatus })
      .eq("id", storyId);

    if (error) {
      toast.error("Failed to update favorite");
      return;
    }

    setStories(stories.map(s => 
      s.id === storyId ? { ...s, is_favorite: !currentStatus } : s
    ));
    toast.success(!currentStatus ? "Added to favorites! ⭐" : "Removed from favorites");
  };

  const deleteStory = async (storyId: string) => {
    const { error } = await supabase
      .from("child_stories")
      .delete()
      .eq("id", storyId);

    if (error) {
      toast.error("Failed to delete story");
      return;
    }

    setStories(stories.filter(s => s.id !== storyId));
    toast.success("Story deleted");
    if (selectedStory?.id === storyId) {
      setSelectedStory(null);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  if (stories.length === 0) {
    return (
      <Card className="p-8 text-center">
        <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Stories Yet</h3>
        <p className="text-sm text-muted-foreground">
          Create your first story to see it here!
        </p>
      </Card>
    );
  }

  const uniqueThemes = Array.from(new Set(stories.map(s => s.theme).filter(Boolean)));

  const launchBedtimeMode = (story: Story) => {
    if (story.audio_content && story.illustrations && story.duration_seconds) {
      setBedtimeStory(story);
    } else {
      toast.error("This story doesn't have audio narration yet");
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {childName}'s Story Collection ({stories.length})
          </h3>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={filterTheme} onValueChange={setFilterTheme}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Themes</SelectItem>
                {uniqueThemes.map(theme => (
                  <SelectItem key={theme} value={theme!}>{theme}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={filterFavorites ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterFavorites(!filterFavorites)}
            >
              <Heart className={`w-4 h-4 mr-2 ${filterFavorites ? "fill-current" : ""}`} />
              Favorites
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {stories.map((story) => (
            <Card
              key={story.id}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer relative overflow-hidden"
              onClick={() => setSelectedStory(story)}
            >
              {/* Thumbnail */}
              {story.illustrations?.[0]?.imageUrl && (
                <div className="mb-3">
                  <img
                    src={story.illustrations[0].imageUrl}
                    alt={story.title}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              )}

              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-base mb-1">{story.title}</h4>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {story.theme && (
                      <Badge variant="secondary" className="text-xs">
                        {story.theme}
                      </Badge>
                    )}
                    {story.mood && (
                      <Badge variant="outline" className="text-xs">
                        {story.mood}
                      </Badge>
                    )}
                    {story.duration_seconds && (
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        {Math.ceil(story.duration_seconds / 60)}min
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(story.id, story.is_favorite);
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      story.is_favorite ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {story.content}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {new Date(story.created_at).toLocaleDateString()}
                </span>
                <div className="flex gap-1">
                  {story.bedtime_ready && story.audio_content && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        launchBedtimeMode(story);
                      }}
                      style={{ 
                        backgroundColor: 'hsl(var(--story-bedtime))',
                        color: 'white'
                      }}
                      className="hover:opacity-90 transition-opacity"
                    >
                      <Moon className="h-4 w-4 mr-1" />
                      Bedtime
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStory(story);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Read
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Delete this story?")) {
                        deleteStory(story.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedStory?.title}</DialogTitle>
          </DialogHeader>
          <Textarea
            value={selectedStory?.content || ""}
            readOnly
            className="min-h-[400px] text-base leading-relaxed resize-none border-0 focus-visible:ring-0"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                if (selectedStory) {
                  toggleFavorite(selectedStory.id, selectedStory.is_favorite);
                }
              }}
            >
              <Heart
                className={`h-4 w-4 mr-2 ${
                  selectedStory?.is_favorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
              {selectedStory?.is_favorite ? "Unfavorite" : "Favorite"}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedStory && confirm("Delete this story?")) {
                  deleteStory(selectedStory.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bedtime Mode */}
      {bedtimeStory && (
        <BedtimeMode
          story={bedtimeStory}
          childName={childName}
          onClose={() => setBedtimeStory(null)}
        />
      )}
    </>
  );
}
