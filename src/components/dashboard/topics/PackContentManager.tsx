import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Check, X, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContentItem {
  id: string;
  topic: string;
  question: string;
  answer: string;
  age_range: string;
  keywords: string[];
  is_custom?: boolean;
}

interface PackContentManagerProps {
  topics: string[];
}

export function PackContentManager({ topics }: PackContentManagerProps) {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state for adding/editing
  const [formData, setFormData] = useState({
    topic: "",
    question: "",
    answer: "",
    age_range: "5-7",
    keywords: [] as string[],
    newKeyword: "",
  });

  useEffect(() => {
    loadContent();
  }, [topics]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const { data: systemContent } = await supabase
        .from("topic_content")
        .select("*")
        .in("topic", topics);

      const { data: customContent } = await supabase
        .from("custom_content")
        .select("*")
        .in("topic", topics);

      const allContent = [
        ...(systemContent || []),
        ...(customContent?.map(c => ({ ...c, is_custom: true })) || [])
      ];

      setContent(allContent);
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddKeyword = () => {
    if (!formData.newKeyword.trim()) return;
    setFormData({
      ...formData,
      keywords: [...formData.keywords, formData.newKeyword.trim()],
      newKeyword: "",
    });
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword),
    });
  };

  const handleSaveContent = async () => {
    if (!formData.topic || !formData.question.trim() || !formData.answer.trim()) {
      toast.error("Topic, question, and answer are required");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in");
        return;
      }

      if (editingId) {
        // Update existing custom content
        const { error } = await supabase
          .from("custom_content")
          .update({
            question: formData.question,
            answer: formData.answer,
            age_range: formData.age_range,
            keywords: formData.keywords,
          })
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Content updated!");
      } else {
        // Create new custom content
        const { error } = await supabase
          .from("custom_content")
          .insert({
            parent_id: user.id,
            topic: formData.topic,
            question: formData.question,
            answer: formData.answer,
            age_range: formData.age_range,
            keywords: formData.keywords,
          });

        if (error) throw error;
        toast.success("Content added!");
      }

      // Reset form
      setFormData({
        topic: "",
        question: "",
        answer: "",
        age_range: "5-7",
        keywords: [],
        newKeyword: "",
      });
      setEditingId(null);
      loadContent();
    } catch (error: any) {
      toast.error("Failed to save content");
      console.error(error);
    }
  };

  const handleEditContent = (item: ContentItem) => {
    if (!item.is_custom) {
      toast.error("System content cannot be edited");
      return;
    }
    setEditingId(item.id);
    setFormData({
      topic: item.topic,
      question: item.question,
      answer: item.answer,
      age_range: item.age_range,
      keywords: item.keywords,
      newKeyword: "",
    });
  };

  const handleDeleteContent = async (id: string, isCustom: boolean) => {
    if (!isCustom) {
      toast.error("System content cannot be deleted");
      return;
    }

    if (!confirm("Delete this content?")) return;

    try {
      const { error } = await supabase
        .from("custom_content")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Content deleted");
      loadContent();
    } catch (error) {
      toast.error("Failed to delete content");
      console.error(error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      topic: "",
      question: "",
      answer: "",
      age_range: "5-7",
      keywords: [],
      newKeyword: "",
    });
  };

  const contentByTopic = topics.reduce((acc, topic) => {
    acc[topic] = content.filter(c => c.topic === topic);
    return acc;
  }, {} as Record<string, ContentItem[]>);

  const filteredContent = selectedTopic
    ? content.filter(c => c.topic === selectedTopic)
    : content;

  if (topics.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Add topics first to manage content</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Content Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Content Overview</CardTitle>
          <CardDescription>Q&A pairs available for each topic</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {topics.map((topic) => {
              const count = contentByTopic[topic]?.length || 0;
              return (
                <div
                  key={topic}
                  className="p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedTopic(selectedTopic === topic ? "" : topic)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{topic}</span>
                    <Badge variant={count > 0 ? "default" : "secondary"}>
                      {count} Q&A
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Content Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Content" : "Add New Content"}</CardTitle>
          <CardDescription>
            Create custom Q&A pairs for topics in this pack
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Topic</Label>
            <Select
              value={formData.topic}
              onValueChange={(v) => setFormData({ ...formData, topic: v })}
              disabled={!!editingId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))
                }
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Question</Label>
            <Input
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="What is the child asking about?"
            />
          </div>

          <div className="space-y-2">
            <Label>Answer</Label>
            <Textarea
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Age-appropriate answer..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Age Range</Label>
            <Select
              value={formData.age_range}
              onValueChange={(v) => setFormData({ ...formData, age_range: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5-7">5-7 years</SelectItem>
                <SelectItem value="8-10">8-10 years</SelectItem>
                <SelectItem value="11-13">11-13 years</SelectItem>
                <SelectItem value="14+">14+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Keywords</Label>
            <div className="flex gap-2">
              <Input
                value={formData.newKeyword}
                onChange={(e) => setFormData({ ...formData, newKeyword: e.target.value })}
                onKeyPress={(e) => e.key === "Enter" && handleAddKeyword()}
                placeholder="Add keyword..."
              />
              <Button onClick={handleAddKeyword} size="icon" variant="secondary">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {formData.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="gap-1">
                    {keyword}
                    <button
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="hover:bg-destructive/20 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {editingId && (
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
            )}
            <Button onClick={handleSaveContent} className="gap-2">
              {editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingId ? "Update Content" : "Add Content"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Content List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Existing Content</CardTitle>
              <CardDescription>
                {selectedTopic ? `Showing ${filteredContent.length} items for ${selectedTopic}` : `${content.length} total items`}
              </CardDescription>
            </div>
            {selectedTopic && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedTopic("")}>
                Show All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredContent.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No content available yet
            </p>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3 pr-4">
                {filteredContent.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border rounded-lg space-y-2 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">{item.topic}</Badge>
                          <Badge variant="outline" className="text-xs">{item.age_range}</Badge>
                          {item.is_custom && (
                            <Badge variant="default" className="text-xs">Custom</Badge>
                          )}
                        </div>
                        <p className="font-medium text-sm">{item.question}</p>
                        <p className="text-sm text-muted-foreground mt-1">{item.answer}</p>
                        {item.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.keywords.map((keyword) => (
                              <span
                                key={keyword}
                                className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full"
                              >
                                {keyword}
                              </span>
                            ))
                            }
                          </div>
                        )}
                      </div>
                      {item.is_custom && (
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEditContent(item)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteContent(item.id, item.is_custom)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
