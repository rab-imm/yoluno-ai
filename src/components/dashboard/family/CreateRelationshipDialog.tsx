import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateRelationship, getInverseRelationship } from "@/lib/relationshipValidation";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FamilyMember {
  id: string;
  name: string;
  relationship?: string;
}

interface FamilyRelationship {
  id: string;
  person_id: string;
  related_person_id: string;
  relationship_type: string;
}

interface CreateRelationshipDialogProps {
  open: boolean;
  onClose: () => void;
  members: FamilyMember[];
  relationships: FamilyRelationship[];
  onRelationshipCreated: () => void;
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

export const CreateRelationshipDialog = ({
  open,
  onClose,
  members,
  relationships,
  onRelationshipCreated,
}: CreateRelationshipDialogProps) => {
  const [person1Id, setPerson1Id] = useState("");
  const [person2Id, setPerson2Id] = useState("");
  const [relationshipType, setRelationshipType] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setPerson1Id("");
      setPerson2Id("");
      setRelationshipType("");
      setValidationError(null);
    }
  }, [open]);

  // Validate relationship when selections change
  useEffect(() => {
    if (person1Id && person2Id && relationshipType) {
      const error = validateRelationship(
        person1Id,
        person2Id,
        relationshipType,
        relationships
      );
      setValidationError(error);
    } else {
      setValidationError(null);
    }
  }, [person1Id, person2Id, relationshipType, relationships]);

  const handleCreate = async () => {
    if (!person1Id || !person2Id || !relationshipType) {
      toast.error("Please fill all fields");
      return;
    }

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in");
      setLoading(false);
      return;
    }

    // Create the primary relationship
    const { error: error1 } = await supabase.from("family_relationships").insert({
      parent_id: user.id,
      person_id: person1Id,
      related_person_id: person2Id,
      relationship_type: relationshipType,
    });

    if (error1) {
      toast.error("Failed to create relationship");
      setLoading(false);
      return;
    }

    // Create the inverse relationship
    const inverseType = getInverseRelationship(relationshipType);
    if (inverseType) {
      const { error: error2 } = await supabase.from("family_relationships").insert({
        parent_id: user.id,
        person_id: person2Id,
        related_person_id: person1Id,
        relationship_type: inverseType,
      });

      if (error2) {
        console.error("Failed to create inverse relationship");
      }
    }

    setLoading(false);
    toast.success("Relationship created successfully");
    onRelationshipCreated();
    onClose();
  };

  const person1 = members.find(m => m.id === person1Id);
  const person2 = members.find(m => m.id === person2Id);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Relationship</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {members.length < 2 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You need at least 2 family members to create relationships.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="person1">First Person</Label>
            <Select value={person1Id} onValueChange={setPerson1Id}>
              <SelectTrigger id="person1">
                <SelectValue placeholder="Select person..." />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship Type</Label>
            <Select value={relationshipType} onValueChange={setRelationshipType}>
              <SelectTrigger id="relationship">
                <SelectValue placeholder="Select relationship..." />
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

          <div className="space-y-2">
            <Label htmlFor="person2">Second Person</Label>
            <Select value={person2Id} onValueChange={setPerson2Id}>
              <SelectTrigger id="person2">
                <SelectValue placeholder="Select person..." />
              </SelectTrigger>
              <SelectContent>
                {members
                  .filter(m => m.id !== person1Id)
                  .map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {person1 && person2 && relationshipType && (
            <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
              <strong>Preview:</strong> {person1.name} is the{" "}
              <strong>{relationshipTypes.find(t => t.value === relationshipType)?.label}</strong>{" "}
              of {person2.name}
              {getInverseRelationship(relationshipType) && (
                <div className="mt-1">
                  {person2.name} will be the{" "}
                  <strong>
                    {relationshipTypes.find(t => t.value === getInverseRelationship(relationshipType))?.label}
                  </strong>{" "}
                  of {person1.name}
                </div>
              )}
            </div>
          )}

          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!person1Id || !person2Id || !relationshipType || !!validationError || loading || members.length < 2}
          >
            {loading ? "Creating..." : "Create Relationship"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
