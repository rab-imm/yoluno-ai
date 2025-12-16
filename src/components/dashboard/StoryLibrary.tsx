import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Trash2, Eye, Moon, Search, Calendar, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { useStories } from "@/hooks/dashboard/useStories";

interface Story {
  id: string;
  title: string;
  content: string;
  theme: string | null;
  mood: string | null;
  is_favorite: boolean;
  bedtime_ready: boolean;
  duration_seconds: number | null;
  illustrations: any;
  created_at: string;
}

interface StoryLibraryProps {
  childId: string;
  childName: string;
}

export function StoryLibrary({ childId, childName }: StoryLibraryProps) {
  const { stories, isLoading, toggleFavorite, deleteStory } = useStories(childId);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTheme, setFilterTheme] = useState<string>("all");
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null);

  // Memoized filtering for performance
  const filteredStories = useMemo(() => {
    let filtered = [...stories];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (story) =>
          story.title.toLowerCase().includes(query) ||
          story.content.toLowerCase().includes(query)
      );
    }

    if (filterTheme !== "all") {
      filtered = filtered.filter((story) => story.theme === filterTheme);
    }

    if (filterFavorites) {
      filtered = filtered.filter((story) => story.is_favorite);
    }

    return filtered;
  }, [stories, searchQuery, filterTheme, filterFavorites]);

  const themes = useMemo(
    () => Array.from(new Set(stories.map((s) => s.theme).filter(Boolean))),
    [stories]
  );

  const handleToggleFavorite = (storyId: string, currentValue: boolean) => {
    toggleFavorite({ storyId, currentValue });
  };

  const handleDeleteStory = () => {
    if (!storyToDelete) return;
    deleteStory(storyToDelete.id);
    setStoryToDelete(null);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading stories...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Story Library for {childName}</h2>
        <p className="text-muted-foreground">
          Manage and view all stories ({stories.length} total)
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterTheme} onValueChange={setFilterTheme}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Themes</SelectItem>
            {themes.map((theme) => (
              <SelectItem key={theme} value={theme!}>
                {theme}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant={filterFavorites ? "default" : "outline"}
          onClick={() => setFilterFavorites(!filterFavorites)}
          className="w-full md:w-auto"
        >
          <Heart className={`w-4 h-4 mr-2 ${filterFavorites ? "fill-current" : ""}`} />
          Favorites
        </Button>
      </div>

      {/* Story Grid */}
      {filteredStories.length === 0 ? (
        <Card className="p-8 text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No stories found</h3>
          <p className="text-muted-foreground">
            {searchQuery || filterTheme !== "all" || filterFavorites
              ? "Try adjusting your filters"
              : "Create your first story in Story Time mode"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStories.map((story) => (
            <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Thumbnail */}
              {story.illustrations?.[0]?.imageUrl && (
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                  <img
                    src={story.illustrations[0].imageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                  {story.bedtime_ready && (
                    <Badge className="absolute top-2 right-2 bg-purple-500">
                      <Moon className="w-3 h-3 mr-1" />
                      Bedtime
                    </Badge>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold line-clamp-2 mb-1">{story.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(story.created_at), "MMM d, yyyy")}
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {story.theme && (
                    <Badge variant="secondary">{story.theme}</Badge>
                  )}
                  {story.mood && (
                    <Badge variant="outline">{story.mood}</Badge>
                  )}
                  {story.duration_seconds && (
                    <Badge variant="outline">
                      {Math.ceil(story.duration_seconds / 60)}min
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedStory(story)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Read
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFavorite(story.id, story.is_favorite)}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        story.is_favorite ? "fill-current text-red-500" : ""
                      }`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStoryToDelete(story)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Story Preview Dialog */}
      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedStory?.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 pr-4">
              {selectedStory?.illustrations?.map((illustration: any, idx: number) => (
                <img
                  key={idx}
                  src={illustration.imageUrl}
                  alt={illustration.description || `Illustration ${idx + 1}`}
                  className="w-full rounded-lg"
                />
              ))}
              <p className="whitespace-pre-wrap">{selectedStory?.content}</p>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!storyToDelete} onOpenChange={() => setStoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Story?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{storyToDelete?.title}"? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStory}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
