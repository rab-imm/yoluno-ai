import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Users, Trash2, User, Grid3x3, Network } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FamilyTreeFlow } from "./family/FamilyTreeFlow";
import { MemberDetailDialog } from "./family/MemberDetailDialog";
import { PhotoLibraryPanel } from "./family/PhotoLibraryPanel";
import { PhotoUploader } from "./family/PhotoUploader";

interface FamilyMember {
  id: string;
  name: string;
  relationship?: string;
  birth_date?: string;
  location?: string;
  bio?: string;
  photo_url?: string;
}

interface FamilyRelationship {
  id: string;
  person_id: string;
  related_person_id: string;
  relationship_type: string;
}

const relationshipTypes = [
  { value: "parent", label: "Parent" },
  { value: "child", label: "Child" },
  { value: "spouse", label: "Spouse/Partner" },
  { value: "sibling", label: "Sibling" },
  { value: "grandparent", label: "Grandparent" },
  { value: "grandchild", label: "Grandchild" },
  { value: "aunt_uncle", label: "Aunt/Uncle" },
  { value: "niece_nephew", label: "Niece/Nephew" },
  { value: "cousin", label: "Cousin" },
];

export const FamilyTreeBuilder = () => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [relationships, setRelationships] = useState<FamilyRelationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [memberDetailOpen, setMemberDetailOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [viewMode, setViewMode] = useState<"tree" | "grid">("tree");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [croppedArea, setCroppedArea] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    birth_date: "",
    location: "",
    bio: "",
  });

  useEffect(() => {
    fetchMembers();
    fetchRelationships();
  }, []);

  const fetchMembers = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("family_members")
      .select("*")
      .eq("parent_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load family members");
      return;
    }

    setMembers(data || []);
    setLoading(false);
  };

  const fetchRelationships = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("family_relationships")
      .select("*")
      .eq("parent_id", user.id);

    if (error) {
      console.error("Failed to load relationships");
      return;
    }

    setRelationships(data || []);
  };

  const handleAddMember = async () => {
    if (!formData.name) {
      toast.error("Please enter a name");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    let photoUrl = null;

    // Upload photo if provided
    if (photoFile) {
      const fileExt = photoFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("family_photos")
        .upload(fileName, photoFile);

      if (uploadError) {
        toast.error("Failed to upload photo");
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("family_photos")
        .getPublicUrl(fileName);

      photoUrl = publicUrl;
    }

    const { error } = await supabase.from("family_members").insert({
      parent_id: user.id,
      name: formData.name,
      relationship: formData.relationship || null,
      birth_date: formData.birth_date || null,
      location: formData.location || null,
      bio: formData.bio || null,
      photo_url: photoUrl,
    });

    if (error) {
      toast.error("Failed to add family member");
      return;
    }

    toast.success("Family member added!");
    setDialogOpen(false);
    setFormData({ name: "", relationship: "", birth_date: "", location: "", bio: "" });
    setPhotoFile(null);
    setCroppedArea(null);
    fetchMembers();
  };

  const handleDeleteMember = async (memberId: string) => {
    const { error } = await supabase
      .from("family_members")
      .delete()
      .eq("id", memberId);

    if (error) {
      toast.error("Failed to remove family member");
      return;
    }

    toast.success("Family member removed");
    fetchMembers();
    fetchRelationships();
  };

  const handleMemberClick = (member: FamilyMember) => {
    setSelectedMember(member);
    setMemberDetailOpen(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Tree Area */}
      <div className="lg:col-span-2 space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Family Tree</h3>
                <p className="text-sm text-muted-foreground">
                  {members.length} family member{members.length !== 1 ? "s" : ""}
                </p>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Family Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Family Member</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Photo</Label>
                      <PhotoUploader
                        onPhotoSelected={(file, croppedAreaPixels) => {
                          setPhotoFile(file);
                          setCroppedArea(croppedAreaPixels);
                        }}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Full name"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="relationship">Relationship</Label>
                      <Select
                        value={formData.relationship}
                        onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          {relationshipTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="birth_date">Birth Date</Label>
                      <Input
                        id="birth_date"
                        type="date"
                        value={formData.birth_date}
                        onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="City, Country"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="bio">Biography</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Share memories and stories..."
                        rows={4}
                      />
                    </div>

                    <Button onClick={handleAddMember} disabled={!formData.name}>
                      Add Member
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "tree" | "grid")}>
              <TabsList>
                <TabsTrigger value="tree">
                  <Network className="w-4 h-4 mr-2" />
                  Tree View
                </TabsTrigger>
                <TabsTrigger value="grid">
                  <Grid3x3 className="w-4 h-4 mr-2" />
                  Grid View
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tree" className="mt-6">
                {members.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Users className="w-16 h-16 text-muted-foreground mb-4" />
                      <p className="text-lg font-medium mb-2">No family members yet</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Start building your family tree
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <FamilyTreeFlow
                    members={members}
                    relationships={relationships}
                    onMemberClick={handleMemberClick}
                  />
                )}
              </TabsContent>

              <TabsContent value="grid" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {members.map((member) => (
                    <Card
                      key={member.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleMemberClick(member)}
                    >
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          {member.photo_url ? (
                            <img
                              src={member.photo_url}
                              alt={member.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                              {member.name.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1">
                            <CardTitle className="flex items-center justify-between">
                              <span>{member.name}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteMember(member.id);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </CardTitle>
                            {member.relationship && (
                              <CardDescription>{member.relationship}</CardDescription>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {member.birth_date && (
                          <p className="text-sm text-muted-foreground mb-2">
                            Born: {new Date(member.birth_date).toLocaleDateString()}
                          </p>
                        )}
                        {member.location && (
                          <p className="text-sm text-muted-foreground mb-2">
                            📍 {member.location}
                          </p>
                        )}
                        {member.bio && (
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {member.bio}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      {/* Photo Library Sidebar */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardContent className="pt-6">
            <PhotoLibraryPanel members={members} />
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Member Detail Dialog */}
      <MemberDetailDialog
        member={selectedMember}
        open={memberDetailOpen}
        onClose={() => {
          setMemberDetailOpen(false);
          setSelectedMember(null);
        }}
        onUpdate={fetchMembers}
      />
    </div>
  );
};
