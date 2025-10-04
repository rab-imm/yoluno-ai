import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Check, X, Eye, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { CustomContentEditor } from "./CustomContentEditor";

interface ContentLibraryProps {
  childId: string;
  childName: string;
}

interface TopicContent {
  id: string;
  topic: string;
  question: string;
  answer: string;
  age_range: string;
  difficulty_level: string;
  keywords: string[];
  is_reviewed: boolean;
  isApproved?: boolean;
  isCustom?: boolean;
}

export const ContentLibrary = ({ childId, childName }: ContentLibraryProps) => {
  const [content, setContent] = useState<TopicContent[]>([]);
  const [customContent, setCustomContent] = useState<TopicContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedAge, setSelectedAge] = useState<string>("all");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [previewItem, setPreviewItem] = useState<TopicContent | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadContent();
  }, [childId]);

  const loadContent = async () => {
    setLoading(true);
    try {
      // Get child's age to filter content
      const { data: childData } = await supabase
        .from('child_profiles')
        .select('age, parent_id')
        .eq('id', childId)
        .single();

      if (!childData) return;

      const ageRange = childData.age <= 7 ? '5-7' : childData.age <= 10 ? '8-10' : '11-12';

      // Get pre-written content for appropriate age
      const { data: topicContent, error: contentError } = await supabase
        .from('topic_content')
        .select('*')
        .eq('age_range', ageRange)
        .eq('is_reviewed', true)
        .order('topic')
        .order('question');

      if (contentError) throw contentError;

      // Get approval status for this parent
      const { data: approvals } = await supabase
        .from('parent_approved_content')
        .select('content_id')
        .eq('parent_id', childData.parent_id)
        .or(`child_id.eq.${childId},child_id.is.null`);

      const approvedIds = new Set(approvals?.map(a => a.content_id) || []);
      const approvalMap: Record<string, boolean> = {};
      
      const contentWithApproval = (topicContent || []).map(item => {
        const isApproved = approvedIds.has(item.id);
        approvalMap[item.id] = isApproved;
        return { ...item, isApproved };
      });

      setContent(contentWithApproval);
      setApprovalStatus(approvalMap);

      // Get custom content
      const { data: custom } = await supabase
        .from('custom_content')
        .select('*')
        .eq('parent_id', childData.parent_id)
        .or(`child_id.eq.${childId},child_id.is.null`);

      setCustomContent((custom || []).map(item => ({ 
        ...item, 
        difficulty_level: 'beginner',
        is_reviewed: true,
        isCustom: true, 
        isApproved: true 
      })));

    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load content library');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (contentId: string) => {
    try {
      const { data: childData } = await supabase
        .from('child_profiles')
        .select('parent_id')
        .eq('id', childId)
        .single();

      if (!childData) return;

      const { error } = await supabase
        .from('parent_approved_content')
        .insert({
          parent_id: childData.parent_id,
          content_id: contentId,
          child_id: childId
        });

      if (error) throw error;

      setApprovalStatus(prev => ({ ...prev, [contentId]: true }));
      setContent(prev => prev.map(item => 
        item.id === contentId ? { ...item, isApproved: true } : item
      ));
      
      toast.success('Content approved!');
    } catch (error: any) {
      console.error('Error approving content:', error);
      if (error.code === '23505') {
        toast.info('Content already approved');
      } else {
        toast.error('Failed to approve content');
      }
    }
  };

  const handleReject = async (contentId: string) => {
    try {
      const { data: childData } = await supabase
        .from('child_profiles')
        .select('parent_id')
        .eq('id', childId)
        .single();

      if (!childData) return;

      const { error } = await supabase
        .from('parent_approved_content')
        .delete()
        .eq('parent_id', childData.parent_id)
        .eq('content_id', contentId)
        .eq('child_id', childId);

      if (error) throw error;

      setApprovalStatus(prev => ({ ...prev, [contentId]: false }));
      setContent(prev => prev.map(item => 
        item.id === contentId ? { ...item, isApproved: false } : item
      ));
      
      toast.success('Content approval removed');
    } catch (error) {
      console.error('Error rejecting content:', error);
      toast.error('Failed to remove approval');
    }
  };

  const handleBulkApprove = async () => {
    const items = Array.from(selectedItems);
    for (const id of items) {
      await handleApprove(id);
    }
    setSelectedItems(new Set());
    toast.success(`Approved ${items.length} items`);
  };

  const filteredContent = [...content, ...customContent].filter(item => {
    const matchesSearch = 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTopic = selectedTopic === "all" || item.topic === selectedTopic;
    const matchesAge = selectedAge === "all" || item.age_range === selectedAge;
    
    return matchesSearch && matchesTopic && matchesAge;
  });

  const topics = Array.from(new Set(content.map(c => c.topic))).sort();
  const approvedCount = filteredContent.filter(c => c.isApproved).length;
  const pendingCount = filteredContent.filter(c => !c.isApproved).length;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Content Library for {childName}</h2>
        <p className="text-muted-foreground">
          Review and approve educational content before it's shown to your child
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions, answers, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedTopic} onValueChange={setSelectedTopic}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Topics" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            {topics.map(topic => (
              <SelectItem key={topic} value={topic}>{topic}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedAge} onValueChange={setSelectedAge}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="All Ages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ages</SelectItem>
            <SelectItem value="5-7">Ages 5-7</SelectItem>
            <SelectItem value="8-10">Ages 8-10</SelectItem>
            <SelectItem value="11-12">Ages 11-12</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            All ({filteredContent.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedCount})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingCount})
          </TabsTrigger>
          <TabsTrigger value="custom">
            <Plus className="w-4 h-4 mr-2" />
            Create Custom
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {selectedItems.size > 0 && (
            <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
              <span className="text-sm">{selectedItems.size} items selected</span>
              <Button onClick={handleBulkApprove} size="sm">
                <Check className="w-4 h-4 mr-2" />
                Approve Selected
              </Button>
              <Button onClick={() => setSelectedItems(new Set())} variant="outline" size="sm">
                Clear Selection
              </Button>
            </div>
          )}
          <ContentList 
            items={filteredContent}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            onApprove={handleApprove}
            onReject={handleReject}
            onPreview={setPreviewItem}
          />
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <ContentList 
            items={filteredContent.filter(c => c.isApproved)}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            onApprove={handleApprove}
            onReject={handleReject}
            onPreview={setPreviewItem}
          />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <ContentList 
            items={filteredContent.filter(c => !c.isApproved)}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            onApprove={handleApprove}
            onReject={handleReject}
            onPreview={setPreviewItem}
          />
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <CustomContentEditor 
            childId={childId} 
            onContentAdded={loadContent}
          />
        </TabsContent>
      </Tabs>

      {previewItem && (
        <ContentPreview item={previewItem} onClose={() => setPreviewItem(null)} />
      )}
    </div>
  );
};

interface ContentListProps {
  items: TopicContent[];
  selectedItems: Set<string>;
  setSelectedItems: (items: Set<string>) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onPreview: (item: TopicContent) => void;
}

const ContentList = ({ items, selectedItems, setSelectedItems, onApprove, onReject, onPreview }: ContentListProps) => {
  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedItems(newSet);
  };

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        No content found matching your filters
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-3">
        {items.map(item => (
          <Card key={item.id} className="p-4">
            <div className="flex items-start gap-3">
              {!item.isCustom && (
                <Checkbox
                  checked={selectedItems.has(item.id)}
                  onCheckedChange={() => toggleSelection(item.id)}
                />
              )}
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{item.topic}</Badge>
                      <Badge variant="secondary">{item.age_range}</Badge>
                      <Badge>{item.difficulty_level}</Badge>
                      {item.isCustom && <Badge variant="default">Custom</Badge>}
                      {item.isApproved && <Badge className="bg-green-500">✓ Approved</Badge>}
                    </div>
                    <h4 className="font-semibold">{item.question}</h4>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.answer}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onPreview(item)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  {!item.isApproved ? (
                    <Button
                      size="sm"
                      onClick={() => onApprove(item.id)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onReject(item.id)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Remove Approval
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

interface ContentPreviewProps {
  item: TopicContent;
  onClose: () => void;
}

const ContentPreview = ({ item, onClose }: ContentPreviewProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{item.topic}</Badge>
                <Badge variant="secondary">{item.age_range}</Badge>
                <Badge>{item.difficulty_level}</Badge>
              </div>
              <h3 className="text-xl font-bold">{item.question}</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">Answer:</h4>
            <p className="text-muted-foreground whitespace-pre-wrap">{item.answer}</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Keywords:</h4>
            <div className="flex flex-wrap gap-2">
              {item.keywords.map(keyword => (
                <Badge key={keyword} variant="outline">{keyword}</Badge>
              ))}
            </div>
          </div>

          <Button onClick={onClose} className="w-full">Close</Button>
        </div>
      </Card>
    </div>
  );
};
