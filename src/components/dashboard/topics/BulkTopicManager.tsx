import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Plus, Trash2, Download, Package } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BulkTopicManagerProps {
  childId?: string;
  allTopics: string[];
  selectedTopics: string[];
  onSelectionChange: (topics: string[]) => void;
}

export function BulkTopicManager({ 
  childId, 
  allTopics, 
  selectedTopics, 
  onSelectionChange 
}: BulkTopicManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTopics, setActiveTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (childId) {
      loadActiveTopics();
    }
  }, [childId]);

  const loadActiveTopics = async () => {
    if (!childId) return;

    const { data } = await supabase
      .from("child_topics")
      .select("topic")
      .eq("child_id", childId);

    if (data) {
      setActiveTopics(data.map(t => t.topic));
    }
  };

  const filteredTopics = allTopics.filter(topic =>
    topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedTopics.length === filteredTopics.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredTopics);
    }
  };

  const handleToggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      onSelectionChange(selectedTopics.filter(t => t !== topic));
    } else {
      onSelectionChange([...selectedTopics, topic]);
    }
  };

  const handleAddToChild = async () => {
    if (!childId || selectedTopics.length === 0) {
      toast.error("Please select topics to add");
      return;
    }

    setLoading(true);
    try {
      const newTopics = selectedTopics.filter(t => !activeTopics.includes(t));
      
      if (newTopics.length === 0) {
        toast.info("All selected topics are already added");
        setLoading(false);
        return;
      }

      const topicsToInsert = newTopics.map(topic => ({
        child_id: childId,
        topic: topic,
      }));

      const { error } = await supabase
        .from("child_topics")
        .insert(topicsToInsert);

      if (error) throw error;

      toast.success(`Added ${newTopics.length} topics!`);
      loadActiveTopics();
      onSelectionChange([]);
    } catch (error: any) {
      toast.error("Failed to add topics");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromChild = async () => {
    if (!childId || selectedTopics.length === 0) {
      toast.error("Please select topics to remove");
      return;
    }

    if (!confirm(`Remove ${selectedTopics.length} topics from this child's profile?`)) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("child_topics")
        .delete()
        .eq("child_id", childId)
        .in("topic", selectedTopics);

      if (error) throw error;

      toast.success(`Removed ${selectedTopics.length} topics!`);
      loadActiveTopics();
      onSelectionChange([]);
    } catch (error: any) {
      toast.error("Failed to remove topics");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePack = () => {
    if (selectedTopics.length === 0) {
      toast.error("Please select topics to create a pack");
      return;
    }
    
    // This could open the TopicPackEditor with pre-filled topics
    toast.info("Opening pack creator...");
  };

  const handleExportCSV = () => {
    if (selectedTopics.length === 0) {
      toast.error("Please select topics to export");
      return;
    }

    const csv = selectedTopics.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `topics-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Topics exported!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Topic Operations</CardTitle>
          <CardDescription>
            Select multiple topics to perform batch operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleSelectAll}
              disabled={filteredTopics.length === 0}
            >
              {selectedTopics.length === filteredTopics.length ? "Deselect All" : "Select All"}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {childId && (
              <>
                <Button
                  onClick={handleAddToChild}
                  disabled={loading || selectedTopics.length === 0}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add to Child ({selectedTopics.length})
                </Button>
                <Button
                  onClick={handleRemoveFromChild}
                  disabled={loading || selectedTopics.length === 0}
                  variant="destructive"
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove from Child ({selectedTopics.length})
                </Button>
              </>
            )}
            <Button
              onClick={handleCreatePack}
              disabled={selectedTopics.length === 0}
              variant="outline"
              className="gap-2"
            >
              <Package className="w-4 h-4" />
              Create Pack
            </Button>
            <Button
              onClick={handleExportCSV}
              disabled={selectedTopics.length === 0}
              variant="outline"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>

          <ScrollArea className="h-[500px] border rounded-md p-4">
            {filteredTopics.length === 0 ? (
              <p className="text-muted-foreground">No topics found</p>
            ) : (
              <div className="space-y-2">
                {filteredTopics.map((topic) => {
                  const isActive = activeTopics.includes(topic);
                  const isSelected = selectedTopics.includes(topic);

                  return (
                    <div
                      key={topic}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        isSelected ? "bg-primary/10 border-primary" : "hover:bg-accent"
                      }`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggleTopic(topic)}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{topic}</p>
                        {childId && (
                          <p className="text-xs text-muted-foreground">
                            {isActive ? "✓ Active in child's profile" : "Not in child's profile"}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
