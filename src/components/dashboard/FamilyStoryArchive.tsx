import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FileText, Mic, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FamilyStoryRecorder } from "./FamilyStoryRecorder";
import { FamilyDocumentUploader } from "./FamilyDocumentUploader";

interface FamilyStory {
  id: string;
  title: string;
  story_type: 'text' | 'audio' | 'document';
  content: string | null;
  ai_summary: string | null;
  keywords: string[] | null;
  created_at: string;
}

export const FamilyStoryArchive = () => {
  const [stories, setStories] = useState<FamilyStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [textStoryTitle, setTextStoryTitle] = useState("");
  const [textStoryContent, setTextStoryContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('family_stories')
        .select('*')
        .eq('parent_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast({
        title: "Error",
        description: "Failed to load stories",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTextStory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('family_stories')
        .insert({
          parent_id: user.id,
          title: textStoryTitle,
          story_type: 'text',
          content: textStoryContent
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Story added successfully"
      });

      setDialogOpen(false);
      setTextStoryTitle("");
      setTextStoryContent("");
      fetchStories();
    } catch (error) {
      console.error('Error adding story:', error);
      toast({
        title: "Error",
        description: "Failed to add story",
        variant: "destructive"
      });
    }
  };

  const getStoryIcon = (type: string) => {
    switch (type) {
      case 'audio':
        return <Mic className="w-5 h-5" />;
      case 'document':
        return <FileUp className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading stories...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          {stories.length} stor{stories.length !== 1 ? 'ies' : 'y'} in your archive
        </p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Story
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Family Story</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="text">Write</TabsTrigger>
                <TabsTrigger value="audio">Record</TabsTrigger>
                <TabsTrigger value="document">Upload</TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="title">Story Title *</Label>
                  <Input
                    id="title"
                    value={textStoryTitle}
                    onChange={(e) => setTextStoryTitle(e.target.value)}
                    placeholder="e.g., Grandma's Apple Pie Recipe"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Story *</Label>
                  <Textarea
                    id="content"
                    value={textStoryContent}
                    onChange={(e) => setTextStoryContent(e.target.value)}
                    placeholder="Write the story here..."
                    rows={8}
                  />
                </div>
                <Button 
                  onClick={handleAddTextStory} 
                  className="w-full"
                  disabled={!textStoryTitle || !textStoryContent}
                >
                  Save Story
                </Button>
              </TabsContent>

              <TabsContent value="audio" className="mt-4">
                <FamilyStoryRecorder onComplete={() => { setDialogOpen(false); fetchStories(); }} />
              </TabsContent>

              <TabsContent value="document" className="mt-4">
                <FamilyDocumentUploader onComplete={() => { setDialogOpen(false); fetchStories(); }} />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {stories.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Stories Yet</h3>
          <p className="text-muted-foreground mb-6">
            Start preserving your family's memories by writing stories, recording audio, or uploading documents.
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Story
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stories.map((story) => (
            <Card key={story.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {getStoryIcon(story.story_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1">{story.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {new Date(story.created_at).toLocaleDateString()} • {story.story_type}
                  </p>
                  {story.ai_summary && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {story.ai_summary}
                    </p>
                  )}
                  {story.keywords && story.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {story.keywords.slice(0, 3).map((keyword, i) => (
                        <span key={i} className="text-xs bg-primary/5 text-primary px-2 py-1 rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
