import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, User, Edit2, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface FamilyMember {
  id: string;
  name: string;
  relationship: string | null;
  birth_date: string | null;
  location: string | null;
  bio: string | null;
  photo_url: string | null;
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
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [viewMode, setViewMode] = useState<"tree" | "grid">("tree");
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    birth_date: "",
    location: "",
    bio: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
    fetchRelationships();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('parent_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({
        title: "Error",
        description: "Failed to load family members",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRelationships = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('family_relationships')
        .select('*')
        .eq('parent_id', user.id);

      if (error) throw error;
      setRelationships(data || []);
    } catch (error) {
      console.error('Error fetching relationships:', error);
    }
  };

  const handleAddMember = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('family_members')
        .insert({
          parent_id: user.id,
          name: formData.name,
          relationship: formData.relationship || null,
          birth_date: formData.birth_date || null,
          location: formData.location || null,
          bio: formData.bio || null
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Family member added successfully"
      });

      setDialogOpen(false);
      setFormData({ name: "", relationship: "", birth_date: "", location: "", bio: "" });
      fetchMembers();
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: "Error",
        description: "Failed to add family member",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Family member removed"
      });

      fetchMembers();
      fetchRelationships();
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: "Error",
        description: "Failed to remove family member",
        variant: "destructive"
      });
    }
  };

  const getRelatedMembers = (memberId: string) => {
    return relationships
      .filter(r => r.person_id === memberId || r.related_person_id === memberId)
      .map(r => {
        const relatedId = r.person_id === memberId ? r.related_person_id : r.person_id;
        const member = members.find(m => m.id === relatedId);
        return { ...member, relationshipType: r.relationship_type };
      })
      .filter(Boolean);
  };

  const renderTreeView = () => {
    // Group members by generation/relationship
    const generations = {
      grandparents: members.filter(m => m.relationship?.toLowerCase().includes('grandparent')),
      parents: members.filter(m => m.relationship?.toLowerCase().includes('parent') && !m.relationship?.toLowerCase().includes('grand')),
      current: members.filter(m => !m.relationship || ['spouse', 'partner', 'sibling'].some(r => m.relationship?.toLowerCase().includes(r))),
      children: members.filter(m => m.relationship?.toLowerCase().includes('child') && !m.relationship?.toLowerCase().includes('grand')),
      grandchildren: members.filter(m => m.relationship?.toLowerCase().includes('grandchild')),
    };

    return (
      <div className="space-y-8">
        {Object.entries(generations).map(([generation, genMembers]) => {
          if (genMembers.length === 0) return null;
          
          return (
            <div key={generation} className="space-y-4">
              <h3 className="text-lg font-semibold capitalize text-center">
                {generation === 'current' ? 'Current Generation' : generation}
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {genMembers.map((member) => (
                  <Card 
                    key={member.id} 
                    className="p-4 w-48 hover:shadow-xl transition-all cursor-pointer hover-scale group relative"
                    onClick={() => setSelectedMember(member)}
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Family Member</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove {member.name} from the family tree?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteMember(member.id)}>
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                        {member.photo_url ? (
                          <img 
                            src={member.photo_url} 
                            alt={member.name} 
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-10 h-10 text-primary" />
                        )}
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold text-sm">{member.name}</h4>
                        {member.relationship && (
                          <p className="text-xs text-muted-foreground">{member.relationship}</p>
                        )}
                        {member.birth_date && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(member.birth_date).getFullYear()}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading family tree...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            {members.length} family member{members.length !== 1 ? 's' : ''} in your tree
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Organize by generation or view as a grid
          </p>
        </div>
        
        <div className="flex gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "tree" | "grid")} className="w-auto">
            <TabsList>
              <TabsTrigger value="tree">Tree View</TabsTrigger>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Family Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Grandma Rose"
                  />
                </div>
                <div>
                  <Label htmlFor="relationship">Relationship</Label>
                  <Select
                    value={formData.relationship}
                    onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {relationshipTypes.map((type) => (
                        <SelectItem key={type.value} value={type.label}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="birth_date">Birth Date</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Boston, MA"
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Biography</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Share something special about this person..."
                    rows={3}
                  />
                </div>
                <Button onClick={handleAddMember} className="w-full" disabled={!formData.name}>
                  Add Member
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {members.length === 0 ? (
        <Card className="p-12 text-center animate-fade-in">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Users className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">Start Your Family Tree</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Build a visual family tree that your children can explore. Add family members and organize them by generation.
          </p>
          <Button onClick={() => setDialogOpen(true)} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Add First Family Member
          </Button>
        </Card>
      ) : (
        <div className="animate-fade-in">
          {viewMode === "tree" ? renderTreeView() : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <Card 
                  key={member.id} 
                  className="p-6 hover:shadow-xl transition-all cursor-pointer hover-scale group relative"
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Family Member</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {member.name} from the family tree?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteMember(member.id)}>
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {member.photo_url ? (
                        <img 
                          src={member.photo_url} 
                          alt={member.name} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      {member.relationship && (
                        <p className="text-sm text-muted-foreground">{member.relationship}</p>
                      )}
                      {member.birth_date && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Born: {new Date(member.birth_date).toLocaleDateString()}
                        </p>
                      )}
                      {member.bio && (
                        <p className="text-sm mt-2 line-clamp-2">{member.bio}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Member Detail Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-2xl">
          {selectedMember && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    {selectedMember.photo_url ? (
                      <img 
                        src={selectedMember.photo_url} 
                        alt={selectedMember.name} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="text-2xl">{selectedMember.name}</div>
                    {selectedMember.relationship && (
                      <div className="text-sm font-normal text-muted-foreground">
                        {selectedMember.relationship}
                      </div>
                    )}
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {selectedMember.birth_date && (
                  <div>
                    <Label className="text-muted-foreground">Birth Date</Label>
                    <p className="text-lg">{new Date(selectedMember.birth_date).toLocaleDateString()}</p>
                  </div>
                )}
                
                {selectedMember.location && (
                  <div>
                    <Label className="text-muted-foreground">Location</Label>
                    <p className="text-lg">{selectedMember.location}</p>
                  </div>
                )}
                
                {selectedMember.bio && (
                  <div>
                    <Label className="text-muted-foreground">Biography</Label>
                    <p className="text-base leading-relaxed">{selectedMember.bio}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
