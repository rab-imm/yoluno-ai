import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { X, Plus, Save, ArrowLeft, Edit2, Check, Grid3x3, List, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackContentManager } from "./PackContentManager";

interface TopicPack {
  id: string;
  name: string;
  description: string;
  emoji: string;
  topics: string[];
  is_custom?: boolean;
}

interface TopicPackEditorProps {
  pack?: TopicPack | null;
  onClose: () => void;
}

export function TopicPackEditor({ pack, onClose }: TopicPackEditorProps) {
  const [name, setName] = useState(pack?.name || "");
  const [description, setDescription] = useState(pack?.description || "");
  const [emoji, setEmoji] = useState(pack?.emoji || "📚");
  const [topics, setTopics] = useState<string[]>(pack?.topics || []);
  const [newTopic, setNewTopic] = useState("");
  const [bulkTopics, setBulkTopics] = useState("");
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "badge">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"alpha-asc" | "alpha-desc" | "recent">("alpha-asc");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [editingTopic, setEditingTopic] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAddTopic = () => {
    if (!newTopic.trim()) return;
    
    if (topics.includes(newTopic.trim())) {
      toast.error("Topic already exists in this pack");
      return;
    }

    setTopics([...topics, newTopic.trim()]);
    setNewTopic("");
  };

  const handleRemoveTopic = (topic: string) => {
    setTopics(topics.filter(t => t !== topic));
    setSelectedTopics(selectedTopics.filter(t => t !== topic));
  };

  const handleBulkAdd = () => {
    if (!bulkTopics.trim()) return;
    
    const newTopics = bulkTopics
      .split(/[\n,]+/)
      .map(t => t.trim())
      .filter(t => t && !topics.includes(t));
    
    if (newTopics.length === 0) {
      toast.error("No new topics to add");
      return;
    }

    setTopics([...topics, ...newTopics]);
    setBulkTopics("");
    toast.success(`Added ${newTopics.length} topic(s)`);
  };

  const handleDeleteSelected = () => {
    if (selectedTopics.length === 0) return;
    
    setTopics(topics.filter(t => !selectedTopics.includes(t)));
    setSelectedTopics([]);
    toast.success(`Deleted ${selectedTopics.length} topic(s)`);
  };

  const handleToggleSelect = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleSelectAll = () => {
    setSelectedTopics(filteredAndSortedTopics);
  };

  const handleDeselectAll = () => {
    setSelectedTopics([]);
  };

  const handleEditTopic = (topic: string) => {
    setEditingTopic(topic);
    setEditValue(topic);
  };

  const handleSaveEdit = () => {
    if (!editValue.trim() || !editingTopic) return;
    
    if (topics.includes(editValue.trim()) && editValue.trim() !== editingTopic) {
      toast.error("Topic already exists");
      return;
    }

    setTopics(topics.map(t => t === editingTopic ? editValue.trim() : t));
    setEditingTopic(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingTopic(null);
    setEditValue("");
  };

  // Filter and sort topics
  const filteredAndSortedTopics = topics
    .filter(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "alpha-asc") return a.localeCompare(b);
      if (sortBy === "alpha-desc") return b.localeCompare(a);
      return 0; // recent keeps original order
    });

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Pack name is required");
      return;
    }

    if (topics.length === 0) {
      toast.error("At least one topic is required");
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in");
        return;
      }

      if (pack?.is_custom && pack.id) {
        // Update existing custom pack
        const { error } = await supabase
          .from("custom_topic_packs")
          .update({
            name,
            description,
            emoji,
            topics,
          })
          .eq("id", pack.id);

        if (error) throw error;
        toast.success("Pack updated successfully!");
      } else {
        // Create new custom pack (including clones)
        const { error } = await supabase
          .from("custom_topic_packs")
          .insert({
            parent_id: user.id,
            name,
            description,
            emoji,
            topics,
          });

        if (error) throw error;
        toast.success("Pack created successfully!");
      }

      onClose();
    } catch (error: any) {
      toast.error("Failed to save pack");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!pack?.is_custom) return;

    if (!confirm("Are you sure you want to delete this pack? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("custom_topic_packs")
        .delete()
        .eq("id", pack.id);

      if (error) throw error;
      toast.success("Pack deleted successfully!");
      onClose();
    } catch (error: any) {
      toast.error("Failed to delete pack");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {pack?.id ? "Edit Topic Pack" : pack ? "Clone Topic Pack" : "Create Topic Pack"}
          </h2>
          <p className="text-muted-foreground">
            {pack?.id ? "Modify your custom pack" : pack ? "Customize your cloned pack" : "Create a new custom topic pack"}
          </p>
        </div>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Pack Details</TabsTrigger>
          <TabsTrigger value="topics">Topics ({topics.length})</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
        <CardHeader>
          <CardTitle>Pack Details</CardTitle>
          <CardDescription>
            Configure your topic pack information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emoji">Emoji</Label>
            <Input
              id="emoji"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="📚"
              maxLength={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Pack Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Custom Pack"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A collection of topics about..."
              rows={3}
            />
          </div>
        </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Topics 
                <Badge variant="secondary">{topics.length}</Badge>
              </CardTitle>
              <CardDescription>
                Add and manage topics in this pack
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-accent" : ""}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode("badge")}
                className={viewMode === "badge" ? "bg-accent" : ""}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Add */}
          <div className="flex gap-2">
            <Input
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddTopic()}
              placeholder="Enter a topic..."
            />
            <Button onClick={handleAddTopic} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Bulk Add */}
          <div className="space-y-2">
            <Label htmlFor="bulk-topics">Bulk Add (comma or line separated)</Label>
            <div className="flex gap-2">
              <Textarea
                id="bulk-topics"
                value={bulkTopics}
                onChange={(e) => setBulkTopics(e.target.value)}
                placeholder="planets, stars, galaxies&#10;or one per line..."
                rows={3}
                className="flex-1"
              />
              <Button onClick={handleBulkAdd} variant="secondary">
                Add All
              </Button>
            </div>
          </div>

          {/* Search and Sort */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics..."
                className="pl-9"
              />
            </div>
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alpha-asc">A → Z</SelectItem>
                <SelectItem value="alpha-desc">Z → A</SelectItem>
                <SelectItem value="recent">Recently Added</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {topics.length > 0 && (
            <div className="flex gap-2 items-center">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                Deselect All
              </Button>
              {selectedTopics.length > 0 && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleDeleteSelected}
                  className="ml-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected ({selectedTopics.length})
                </Button>
              )}
            </div>
          )}

          {/* Topics Display */}
          <div className="border rounded-md p-2 max-h-96 overflow-y-auto">
            {topics.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No topics added yet
              </p>
            ) : viewMode === "badge" ? (
              <div className="flex flex-wrap gap-2">
                {filteredAndSortedTopics.map((topic) => (
                  <Badge key={topic} variant="secondary" className="gap-1">
                    {topic}
                    <button
                      onClick={() => handleRemoveTopic(topic)}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAndSortedTopics.map((topic) => (
                  <div
                    key={topic}
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox
                      checked={selectedTopics.includes(topic)}
                      onCheckedChange={() => handleToggleSelect(topic)}
                    />
                    
                    {editingTopic === topic ? (
                      <>
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSaveEdit()}
                          className="flex-1"
                          autoFocus
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleSaveEdit}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleCancelEdit}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-sm">{topic}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditTopic(topic)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveTopic(topic)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <PackContentManager topics={topics} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-between sticky bottom-0 bg-background pt-4 border-t">
        <div>
          {pack?.is_custom && pack.id && (
            <Button variant="destructive" onClick={handleDelete}>
              Delete Pack
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Pack"}
          </Button>
        </div>
      </div>
    </div>
  );
}
