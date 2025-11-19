import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Calendar, MapPin, Image, BookOpen, Trash2 } from "lucide-react";
import { NarrativeEditor } from "./NarrativeEditor";
import { format } from "date-fns";

interface FamilyMember {
  id: string;
  name: string;
  relationship?: string;
  specific_label?: string;
  birth_date?: string;
  location?: string;
  bio?: string;
  photo_url?: string;
}

interface Narrative {
  id: string;
  title: string;
  content: string;
  story_date?: string;
  created_at: string;
}

interface MemberDetailDialogProps {
  member: FamilyMember | null;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const MemberDetailDialog = ({ member, open, onClose, onUpdate }: MemberDetailDialogProps) => {
  const [narratives, setNarratives] = useState<Narrative[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [showNarrativeEditor, setShowNarrativeEditor] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member && open) {
      fetchNarratives();
      fetchPhotos();
    }
  }, [member, open]);

  const fetchNarratives = async () => {
    if (!member) return;
    
    const { data, error } = await supabase
      .from("family_narratives")
      .select("*")
      .eq("member_id", member.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load stories");
      return;
    }

    setNarratives(data || []);
  };

  const fetchPhotos = async () => {
    if (!member) return;

    const { data, error } = await supabase
      .from("family_photos")
      .select("*")
      .contains("linked_member_ids", [member.id]);

    if (error) {
      toast.error("Failed to load photos");
      return;
    }

    setPhotos(data || []);
  };

  const handleSaveNarrative = async (data: { title: string; content: string; storyDate?: string }) => {
    if (!member) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("You must be logged in");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("family_narratives").insert({
      parent_id: user.id,
      member_id: member.id,
      title: data.title,
      content: data.content,
      story_date: data.storyDate || null,
    });

    setLoading(false);

    if (error) {
      toast.error("Failed to save story");
      return;
    }

    toast.success("Story saved!");
    setShowNarrativeEditor(false);
    fetchNarratives();
  };

  const handleDeleteNarrative = async (narrativeId: string) => {
    const { error } = await supabase
      .from("family_narratives")
      .delete()
      .eq("id", narrativeId);

    if (error) {
      toast.error("Failed to delete story");
      return;
    }

    toast.success("Story deleted");
    fetchNarratives();
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            {member.photo_url ? (
              <img
                src={member.photo_url}
                alt={member.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-primary"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
                {member.name.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="text-2xl">{member.name}</h2>
              {member.specific_label ? (
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">{member.specific_label}</span>
                  {member.relationship && (
                    <span className="text-xs ml-1">({member.relationship})</span>
                  )}
                </p>
              ) : (
                member.relationship && (
                  <p className="text-sm text-muted-foreground">{member.relationship}</p>
                )
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="stories">
              Stories ({narratives.length})
            </TabsTrigger>
            <TabsTrigger value="photos">
              Photos ({photos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-3">
                {member.birth_date && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Born: {format(new Date(member.birth_date), "MMMM d, yyyy")}</span>
                  </div>
                )}
                {member.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{member.location}</span>
                  </div>
                )}
                {member.bio && (
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stories" className="space-y-4">
            {!showNarrativeEditor && (
              <Button onClick={() => setShowNarrativeEditor(true)} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add New Story
              </Button>
            )}

            {showNarrativeEditor && (
              <Card>
                <CardContent className="pt-6">
                  <NarrativeEditor
                    onSave={handleSaveNarrative}
                    onCancel={() => setShowNarrativeEditor(false)}
                  />
                </CardContent>
              </Card>
            )}

            {narratives.map((narrative) => (
              <Card key={narrative.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        {narrative.title}
                      </CardTitle>
                      {narrative.story_date && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {format(new Date(narrative.story_date), "MMMM d, yyyy")}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteNarrative(narrative.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: narrative.content }}
                  />
                </CardContent>
              </Card>
            ))}

            {narratives.length === 0 && !showNarrativeEditor && (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No stories yet. Add one to preserve memories!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="photos" className="space-y-4">
            {photos.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="aspect-square rounded-lg overflow-hidden border">
                    <img
                      src={photo.image_url}
                      alt={photo.ai_caption || "Family photo"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No photos linked to this person yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
