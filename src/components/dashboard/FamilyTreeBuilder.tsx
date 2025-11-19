import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Users, Trash2, User, Grid3x3, Network, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FamilyTreeFlow } from "./family/FamilyTreeFlow";
import { MemberDetailDialog } from "./family/MemberDetailDialog";
import { PhotoLibraryPanel } from "./family/PhotoLibraryPanel";
import { PhotoUploader } from "./family/PhotoUploader";
import { CreateRelationshipDialog } from "./family/CreateRelationshipDialog";
import { ReactFlowProvider } from "@xyflow/react";
import { TreeExportPanel } from "./family/TreeExportPanel";
import { TreeImportDialog } from "./family/TreeImportDialog";
import { TreeSearch } from "./family/TreeSearch";

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
  const [relationshipDialogOpen, setRelationshipDialogOpen] = useState(false);
  const [memberDetailOpen, setMemberDetailOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [viewMode, setViewMode] = useState<"tree" | "grid">("tree");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [croppedArea, setCroppedArea] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    specific_label: "",
    birth_date: "",
    location: "",
    bio: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [relationshipFilter, setRelationshipFilter] = useState<string | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  useEffect(() => {
    fetchMembers();
    fetchRelationships();
  }, []);

  const fetchMembers = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setUser(user);

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
    setFormData({ name: "", relationship: "", specific_label: "", birth_date: "", location: "", bio: "" });
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

  const exportFamilyData = () => {
    const exportData = {
      members,
      relationships,
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(exportData, null, 2);
  };

  // Filter members based on search query and relationship filter
  const filteredMembers = useMemo(() => {
    let filtered = members;

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(query) ||
          member.relationship?.toLowerCase().includes(query) ||
          member.bio?.toLowerCase().includes(query) ||
          member.location?.toLowerCase().includes(query)
      );
    }

    // Apply relationship type filter
    if (relationshipFilter) {
      filtered = filtered.filter(
        (member) => member.relationship === relationshipFilter
      );
    }

    return filtered;
  }, [members, searchQuery, relationshipFilter]);

  // Filter relationships to only show those connected to filtered members
  const filteredRelationships = useMemo(() => {
    if (!searchQuery && !relationshipFilter) return relationships;
    
    const filteredMemberIds = new Set(filteredMembers.map(m => m.id));
    return relationships.filter(
      (rel) =>
        filteredMemberIds.has(rel.person_id) &&
        filteredMemberIds.has(rel.related_person_id)
    );
  }, [relationships, filteredMembers, searchQuery, relationshipFilter]);

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
              
              <div className="flex items-center gap-2">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Member
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
                      <Label htmlFor="specific_label">Specific Label (Optional)</Label>
                      <Input
                        id="specific_label"
                        value={formData.specific_label}
                        onChange={(e) => setFormData({ ...formData, specific_label: e.target.value })}
                        placeholder={
                          formData.relationship === 'parent' ? 'e.g., Dad, Mom, Papa, Mama' :
                          formData.relationship === 'grandparent' ? 'e.g., Grandma, Grandpa, Nana' :
                          formData.relationship === 'aunt_uncle' ? 'e.g., Aunt Sarah, Uncle John' :
                          formData.relationship === 'sibling' ? 'e.g., Brother, Sister' :
                          'e.g., Uncle Tom'
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        This helps the AI understand who's who when your child asks questions
                      </p>
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
              
              <Button 
                onClick={() => setRelationshipDialogOpen(true)}
                variant="outline"
                disabled={members.length < 2}
              >
                <Network className="w-4 h-4 mr-2" />
                Add Relationship
              </Button>
              
              <Button 
                onClick={() => setImportDialogOpen(true)}
                variant="outline"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
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

              <TabsContent value="tree" className="mt-6 space-y-4">
                {members.length > 0 && (
                  <TreeSearch 
                    onSearchChange={setSearchQuery}
                    onRelationshipFilter={setRelationshipFilter}
                    searchQuery={searchQuery}
                    relationshipFilter={relationshipFilter}
                  />
                )}
                
                {members.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16 px-6">
                      <div className="rounded-full bg-primary/10 p-6 mb-6">
                        <Users className="w-16 h-16 text-primary" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-2">Start Your Family Tree</h3>
                      <p className="text-muted-foreground text-center max-w-md mb-6">
                        Begin by adding family members. Once you have at least two members, 
                        you can create relationships between them to build your family tree.
                      </p>
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground text-left bg-muted/50 p-4 rounded-lg max-w-md">
                        <p className="font-semibold text-foreground mb-1">Getting Started:</p>
                        <p>1. Click "Add Member" to add family members</p>
                        <p>2. Add photos and details for each person</p>
                        <p>3. Use "Add Relationship" to connect family members</p>
                        <p>4. Explore the tree and grid views</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : relationships.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 px-6">
                      <div className="rounded-full bg-chart-2/10 p-6 mb-6">
                        <Network className="w-12 h-12 text-chart-2" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Add Relationships</h3>
                      <p className="text-muted-foreground text-center max-w-md mb-4">
                        You have {members.length} family member{members.length !== 1 ? 's' : ''}, 
                        but no relationships yet. Click "Add Relationship" to connect them!
                      </p>
                      <Button 
                        onClick={() => setRelationshipDialogOpen(true)}
                        className="mt-2"
                      >
                        <Network className="w-4 h-4 mr-2" />
                        Add Your First Relationship
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div id="family-tree-export">
                    <ReactFlowProvider>
                      <FamilyTreeFlow
                        members={filteredMembers}
                        relationships={filteredRelationships}
                        onMemberClick={handleMemberClick}
                      />
                    </ReactFlowProvider>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="grid" className="mt-6">
                {members.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16 px-6">
                      <div className="rounded-full bg-primary/10 p-6 mb-6">
                        <Grid3x3 className="w-16 h-16 text-primary" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-2">No Family Members Yet</h3>
                      <p className="text-muted-foreground text-center max-w-md mb-4">
                        Add your first family member to get started with your family tree.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredMembers.map((member) => (
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
                            {member.specific_label ? (
                              <CardDescription>
                                <span className="font-semibold">{member.specific_label}</span>
                                {member.relationship && (
                                  <span className="text-xs ml-1">({member.relationship})</span>
                                )}
                              </CardDescription>
                            ) : (
                              member.relationship && (
                                <CardDescription>{member.relationship}</CardDescription>
                              )
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
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      {/* Photo Library Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="sticky top-6">
          <CardContent className="pt-6">
            <PhotoLibraryPanel members={members} />
          </CardContent>
        </Card>
        
        {members.length > 0 && (
          <TreeExportPanel 
            treeElementId="family-tree-export"
            exportData={exportFamilyData}
          />
        )}
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

      {/* Create Relationship Dialog */}
      <CreateRelationshipDialog
        open={relationshipDialogOpen}
        onClose={() => setRelationshipDialogOpen(false)}
        members={members}
        relationships={relationships}
        onRelationshipCreated={() => {
          fetchRelationships();
          toast.success("Relationship created!");
        }}
      />

      {/* Tree Import Dialog */}
      <TreeImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImportComplete={() => {
          fetchMembers();
          fetchRelationships();
        }}
        parentId={user?.id || ""}
      />
    </div>
  );
};
