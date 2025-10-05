import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AvatarSelector } from "./AvatarSelector";

interface CreateChildDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateChildDialog({ open, onOpenChange, onSuccess }: CreateChildDialogProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [avatarLibraryId, setAvatarLibraryId] = useState("");
  const [avatarData, setAvatarData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("child_profiles").insert({
      parent_id: user.id,
      name,
      age: parseInt(age),
      avatar: avatarData?.character_slug || "robot-pup",
      avatar_library_id: avatarLibraryId || null,
      use_library_avatar: !!avatarLibraryId,
      personality_mode: "curious",
    });

    if (error) {
      toast.error("Failed to create profile");
      setLoading(false);
      return;
    }

    toast.success(`Created profile for ${name}! 🎉`);
    setName("");
    setAge("");
    setAvatarLibraryId("");
    setAvatarData(null);
    onSuccess();
    onOpenChange(false);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Child Profile</DialogTitle>
          <DialogDescription>
            Add a new profile for your child
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AvatarSelector 
            selectedAvatarId={avatarLibraryId} 
            onSelect={(id, data) => {
              setAvatarLibraryId(id);
              setAvatarData(data);
            }} 
          />
          
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter child's name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min="3"
              max="18"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              placeholder="Enter child's age"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading} variant="playful">
            {loading ? "Creating..." : "Create Profile"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
