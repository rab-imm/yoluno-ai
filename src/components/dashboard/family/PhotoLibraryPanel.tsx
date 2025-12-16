import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Image as ImageIcon, Tag, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface Photo {
  id: string;
  image_url: string;
  ai_caption?: string;
  date_taken?: string;
  linked_member_ids?: string[];
}

interface FamilyMember {
  id: string;
  name: string;
  photo_url?: string;
}

interface PhotoLibraryPanelProps {
  members: FamilyMember[];
  onPhotoClick?: (photo: Photo) => void;
}

export const PhotoLibraryPanel = ({ members, onPhotoClick }: PhotoLibraryPanelProps) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [taggedMembers, setTaggedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("family_photos")
      .select("*")
      .eq("parent_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load photos");
      return;
    }

    setPhotos(data || []);
  };

  const openTagDialog = (photo: Photo) => {
    setSelectedPhoto(photo);
    setTaggedMembers(photo.linked_member_ids || []);
    setShowTagDialog(true);
  };

  const handleToggleMemberTag = (memberId: string) => {
    setTaggedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSaveTags = async () => {
    if (!selectedPhoto) return;

    setLoading(true);
    const { error } = await supabase
      .from("family_photos")
      .update({ linked_member_ids: taggedMembers })
      .eq("id", selectedPhoto.id);

    setLoading(false);

    if (error) {
      toast.error("Failed to save tags");
      return;
    }

    toast.success("Tags updated!");
    setShowTagDialog(false);
    fetchPhotos();
  };

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Photo Library</h3>
        
        {photos.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {photos.map((photo) => (
              <Card
                key={photo.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onPhotoClick?.(photo)}
              >
                <CardContent className="p-2">
                  <div className="aspect-square rounded overflow-hidden mb-2">
                    <img
                      src={photo.image_url}
                      alt={photo.ai_caption || "Family photo"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {photo.ai_caption && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {photo.ai_caption}
                    </p>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      openTagDialog(photo);
                    }}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    Tag People ({photo.linked_member_ids?.length || 0})
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <ImageIcon className="w-16 h-16 mx-auto mb-3 opacity-50" />
            <p>No photos in library yet.</p>
            <p className="text-sm">Upload photos from the Photos tab.</p>
          </div>
        )}
      </div>

      <Dialog open={showTagDialog} onOpenChange={setShowTagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Tag Family Members
            </DialogTitle>
          </DialogHeader>
          
          {selectedPhoto && (
            <div className="space-y-4">
              <img
                src={selectedPhoto.image_url}
                alt="Photo to tag"
                className="w-full rounded-lg"
              />
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg"
                  >
                    <Checkbox
                      checked={taggedMembers.includes(member.id)}
                      onCheckedChange={() => handleToggleMemberTag(member.id)}
                    />
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                        {member.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm">{member.name}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowTagDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTags} disabled={loading}>
                  Save Tags
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
