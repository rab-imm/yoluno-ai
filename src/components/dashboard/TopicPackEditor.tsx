import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { X, Plus, Save, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const [saving, setSaving] = useState(false);

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
  };

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

      if (pack?.is_custom) {
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
        // Create new custom pack
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">
            {pack ? "Edit Topic Pack" : "Create Topic Pack"}
          </h2>
          <p className="text-muted-foreground">
            {pack ? "Modify your custom pack" : "Create a new custom topic pack"}
          </p>
        </div>
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle>Topics ({topics.length})</CardTitle>
          <CardDescription>
            Add and manage topics in this pack
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="flex flex-wrap gap-2 max-h-80 overflow-y-auto p-2 border rounded-md">
            {topics.length === 0 ? (
              <p className="text-sm text-muted-foreground">No topics added yet</p>
            ) : (
              topics.map((topic) => (
                <Badge key={topic} variant="secondary" className="gap-1">
                  {topic}
                  <button
                    onClick={() => handleRemoveTopic(topic)}
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <div>
          {pack?.is_custom && (
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
