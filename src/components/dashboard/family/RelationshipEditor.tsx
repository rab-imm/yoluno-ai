import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit3, Save, X, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RelationshipEditorProps {
  isEditMode: boolean;
  onToggleEditMode: () => void;
  selectedRelationship: {
    id: string;
    type: string;
    from: string;
    to: string;
  } | null;
  onUpdateRelationship: (relationshipId: string, newType: string) => Promise<void>;
  onDeleteRelationship: (relationshipId: string) => Promise<void>;
  onClearSelection: () => void;
}

const relationshipTypes = [
  { value: "parent", label: "Parent", color: "bg-blue-500" },
  { value: "spouse", label: "Spouse", color: "bg-green-500" },
  { value: "sibling", label: "Sibling", color: "bg-orange-500" },
  { value: "grandparent", label: "Grandparent", color: "bg-blue-300" },
  { value: "extended", label: "Extended Family", color: "bg-gray-400" },
];

export const RelationshipEditor = ({
  isEditMode,
  onToggleEditMode,
  selectedRelationship,
  onUpdateRelationship,
  onDeleteRelationship,
  onClearSelection,
}: RelationshipEditorProps) => {
  const [newType, setNewType] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-expand when relationship is selected
  if (selectedRelationship && isCollapsed) {
    setIsCollapsed(false);
  }

  const handleSave = async () => {
    if (!selectedRelationship || !newType) return;
    
    setIsSaving(true);
    try {
      await onUpdateRelationship(selectedRelationship.id, newType);
      setNewType("");
      onClearSelection();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRelationship) return;
    
    setIsSaving(true);
    try {
      await onDeleteRelationship(selectedRelationship.id);
      onClearSelection();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-4 space-y-4 max-w-md">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Edit3 className="w-4 h-4" />
          Relationship Editor
        </h3>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={isEditMode ? "default" : "outline"}
            onClick={onToggleEditMode}
          >
            {isEditMode ? "Exit" : "Edit"}
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="px-2"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {isEditMode && (
        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <p className="font-medium mb-2">Edit Mode Active:</p>
          <ul className="space-y-1 text-xs">
            <li>• Click an edge to edit or delete a relationship</li>
            <li>• Drag nodes to reposition them</li>
            <li>• Right-click nodes for quick actions</li>
          </ul>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Relationship Colors:</p>
        <div className="flex flex-wrap gap-2">
          {relationshipTypes.map((type) => (
            <Badge key={type.value} variant="outline" className="gap-1">
              <div className={`w-3 h-3 rounded-full ${type.color}`} />
              {type.label}
            </Badge>
          ))}
        </div>
      </div>

      {selectedRelationship && (
        <div className="border-t pt-4 space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-medium">Edit Relationship</p>
            <p className="text-xs text-muted-foreground">
              From: <span className="font-medium">{selectedRelationship.from}</span> → 
              To: <span className="font-medium">{selectedRelationship.to}</span>
            </p>
            <p className="text-xs">
              Current: <Badge variant="secondary">{selectedRelationship.type}</Badge>
            </p>
          </div>

          <Select value={newType} onValueChange={setNewType}>
            <SelectTrigger>
              <SelectValue placeholder="Select new relationship type" />
            </SelectTrigger>
            <SelectContent>
              {relationshipTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!newType || isSaving}
            >
              <Save className="w-3 h-3 mr-1" />
              Save
            </Button>
            
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSaving}
            >
              <X className="w-3 h-3 mr-1" />
              Delete
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSelection}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
        </>
      )}
    </Card>
  );
};
