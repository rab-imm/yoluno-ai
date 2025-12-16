import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TreeImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
  parentId: string;
}

interface ImportData {
  members: Array<{
    name: string;
    bio?: string;
    birth_date?: string;
    location?: string;
    photo_url?: string;
    relationship?: string;
  }>;
  relationships: Array<{
    person_id: string;
    related_person_id: string;
    relationship_type: string;
  }>;
}

export const TreeImportDialog = ({
  open,
  onOpenChange,
  onImportComplete,
  parentId,
}: TreeImportDialogProps) => {
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const text = await file.text();
      const data: ImportData = JSON.parse(text);

      // Validate data structure
      if (!data.members || !Array.isArray(data.members)) {
        throw new Error("Invalid import format: missing members array");
      }

      // Create a map to store old ID to new ID mapping
      const idMap = new Map<string, string>();

      // Import members
      for (const member of data.members) {
        const { data: newMember, error } = await supabase
          .from("family_members")
          .insert({
            parent_id: parentId,
            name: member.name,
            bio: member.bio,
            birth_date: member.birth_date,
            location: member.location,
            photo_url: member.photo_url,
            relationship: member.relationship,
          })
          .select()
          .single();

        if (error) throw error;
        if (newMember) {
          // Store the mapping from old name to new ID for relationships
          idMap.set(member.name, newMember.id);
        }
      }

      // Import relationships if they exist
      if (data.relationships && Array.isArray(data.relationships)) {
        for (const rel of data.relationships) {
          const personId = idMap.get(rel.person_id);
          const relatedPersonId = idMap.get(rel.related_person_id);

          if (personId && relatedPersonId) {
            const { error } = await supabase
              .from("family_relationships")
              .insert({
                parent_id: parentId,
                person_id: personId,
                related_person_id: relatedPersonId,
                relationship_type: rel.relationship_type,
              });

            if (error) throw error;
          }
        }
      }

      toast({
        title: "Import successful",
        description: `Imported ${data.members.length} family members`,
      });

      onImportComplete();
      onOpenChange(false);
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import family tree",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      // Reset the input
      event.target.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Family Tree</DialogTitle>
          <DialogDescription>
            Upload a previously exported JSON file to import family members and relationships.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              Select a JSON file to import
            </p>
            <label htmlFor="file-upload">
              <Button variant="outline" disabled={isImporting} asChild>
                <span>
                  {isImporting ? "Importing..." : "Choose File"}
                </span>
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isImporting}
            />
          </div>

          <div className="text-xs text-muted-foreground space-y-2">
            <p className="font-medium">Import Notes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Only JSON files exported from this app are supported</li>
              <li>Imported members will be added to your existing tree</li>
              <li>Photos must be re-uploaded separately</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
