import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Plus, TrendingUp, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TopicPackEditor } from "./TopicPackEditor";
import { TopicAnalytics } from "./TopicAnalytics";
import { TopicReviewCard } from "./TopicReviewCard";
import { BulkTopicManager } from "./BulkTopicManager";

interface TopicPack {
  id: string;
  name: string;
  description: string;
  emoji: string;
  topics: string[];
  is_custom?: boolean;
}

interface TopicLibraryProps {
  childId?: string;
}

export function TopicLibrary({ childId }: TopicLibraryProps) {
  const [packs, setPacks] = useState<TopicPack[]>([]);
  const [customPacks, setCustomPacks] = useState<TopicPack[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showEditor, setShowEditor] = useState(false);
  const [editingPack, setEditingPack] = useState<TopicPack | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  useEffect(() => {
    loadPacks();
    loadCustomPacks();
  }, []);

  const loadPacks = async () => {
    const { data } = await supabase
      .from("topic_packs")
      .select("*")
      .order("name");
    
    if (data) {
      setPacks(data);
    }
    setLoading(false);
  };

  const loadCustomPacks = async () => {
    const { data } = await supabase
      .from("custom_topic_packs")
      .select("*")
      .order("name");
    
    if (data) {
      setCustomPacks(data.map(pack => ({ ...pack, is_custom: true })));
    }
  };

  const allPacks = [...packs, ...customPacks];
  const allTopics = allPacks.flatMap(pack => pack.topics);
  const uniqueTopics = Array.from(new Set(allTopics));

  const filteredPacks = allPacks.filter(pack => {
    const matchesSearch = 
      pack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pack.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pack.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedCategory === "all") return matchesSearch;
    if (selectedCategory === "custom") return matchesSearch && pack.is_custom;
    if (selectedCategory === "system") return matchesSearch && !pack.is_custom;
    
    return matchesSearch;
  });

  const categories = [
    { value: "all", label: "All Topics", count: allPacks.length },
    { value: "system", label: "System Packs", count: packs.length },
    { value: "custom", label: "Custom Packs", count: customPacks.length },
  ];

  const handleCreatePack = () => {
    setEditingPack(null);
    setShowEditor(true);
  };

  const handleEditPack = (pack: TopicPack) => {
    setEditingPack(pack);
    setShowEditor(true);
  };

  const handleClonePack = async (pack: TopicPack) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("custom_topic_packs")
      .insert({
        parent_id: user.id,
        name: `${pack.name} (Copy)`,
        description: pack.description,
        emoji: pack.emoji,
        topics: pack.topics,
      });

    if (error) {
      toast.error("Failed to clone pack");
      console.error(error);
    } else {
      toast.success("Pack cloned successfully!");
      loadCustomPacks();
    }
  };

  if (showEditor) {
    return (
      <TopicPackEditor
        pack={editingPack}
        onClose={() => {
          setShowEditor(false);
          loadCustomPacks();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Topic Library</h2>
          <p className="text-muted-foreground">
            Browse, search, and manage {uniqueTopics.length} educational topics across {allPacks.length} packs
          </p>
        </div>
        <Button onClick={handleCreatePack} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Custom Pack
        </Button>
      </div>

      <Tabs defaultValue="library" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="review">Review Topics</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Manager</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search topics, packs, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.value)}
                size="sm"
              >
                {cat.label} ({cat.count})
              </Button>
            ))}
          </div>

          <ScrollArea className="h-[600px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
              {loading ? (
                <p>Loading...</p>
              ) : filteredPacks.length === 0 ? (
                <p className="text-muted-foreground col-span-2">No packs found matching your search.</p>
              ) : (
                filteredPacks.map((pack) => (
                  <Card key={pack.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl">{pack.emoji}</span>
                          <div>
                            <CardTitle className="text-lg">{pack.name}</CardTitle>
                            <CardDescription className="text-xs">
                              {pack.topics.length} topics
                              {pack.is_custom && " • Custom Pack"}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{pack.description}</p>
                      <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                        {pack.topics.slice(0, 5).map((topic) => (
                          <span
                            key={topic}
                            className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                          >
                            {topic}
                          </span>
                        ))}
                        {pack.topics.length > 5 && (
                          <span className="text-xs px-2 py-1 text-muted-foreground">
                            +{pack.topics.length - 5} more
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {pack.is_custom ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditPack(pack)}
                            className="flex-1"
                          >
                            Edit Pack
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleClonePack(pack)}
                            className="flex-1"
                          >
                            Clone & Customize
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="analytics">
          <TopicAnalytics childId={childId} />
        </TabsContent>

        <TabsContent value="review">
          <TopicReviewCard topics={uniqueTopics} />
        </TabsContent>

        <TabsContent value="bulk">
          <BulkTopicManager 
            childId={childId} 
            allTopics={uniqueTopics}
            selectedTopics={selectedTopics}
            onSelectionChange={setSelectedTopics}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
