import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search, Download, Star, TrendingUp, Users } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface JourneyTemplate {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: string;
  age_range: string;
  duration_days: number;
  download_count: number;
  rating: number | null;
  community_shares_count: number;
  creator_id: string | null;
}

export default function JourneyMarketplace() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<JourneyTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<JourneyTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { value: "all", label: "All", emoji: "🎯" },
    { value: "social", label: "Social", emoji: "💝" },
    { value: "academic", label: "Academic", emoji: "📚" },
    { value: "health", label: "Health", emoji: "💪" },
    { value: "creativity", label: "Creativity", emoji: "🎨" },
    { value: "routine", label: "Routine", emoji: "🌅" },
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchQuery, selectedCategory]);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("journey_templates")
        .select("*")
        .eq("is_public", true)
        .eq("is_positive_habit", true)
        .order("download_count", { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error("Error loading templates:", error);
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = [...templates];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    setFilteredTemplates(filtered);
  };

  const handleUseTemplate = async (template: JourneyTemplate) => {
    try {
      // Increment download count
      await supabase
        .from("journey_templates")
        .update({ download_count: template.download_count + 1 })
        .eq("id", template.id);

      toast.success("Template added! Create your journey from Parent Dashboard");
      navigate("/parent");
    } catch (error) {
      console.error("Error using template:", error);
      toast.error("Failed to use template");
    }
  };

  const getTrendingTemplates = () => {
    return [...templates]
      .sort((a, b) => b.download_count - a.download_count)
      .slice(0, 6);
  };

  const getTopRatedTemplates = () => {
    return [...templates]
      .filter((t) => t.rating !== null)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6);
  };

  const renderTemplateCard = (template: JourneyTemplate) => (
    <Card key={template.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{template.emoji}</span>
            <div>
              <CardTitle className="text-base">{template.name}</CardTitle>
              <CardDescription className="text-xs mt-1">
                {template.duration_days} days • Ages {template.age_range}
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="capitalize text-xs">
            {template.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {template.description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              <span>{template.download_count}</span>
            </div>
            {template.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{template.rating.toFixed(1)}</span>
              </div>
            )}
            {template.community_shares_count > 0 && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{template.community_shares_count} shares</span>
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={() => handleUseTemplate(template)}
          className="w-full"
          size="sm"
        >
          Use This Journey
        </Button>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">Loading marketplace...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/parent")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Journey Marketplace</h1>
              <p className="text-sm text-muted-foreground">
                Discover and share goal journeys with the community
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="discover" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="discover">
              <Search className="h-4 w-4 mr-2" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="trending">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="top-rated">
              <Star className="h-4 w-4 mr-2" />
              Top Rated
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search journey templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <Button
                    key={cat.value}
                    variant={selectedCategory === cat.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.value)}
                  >
                    {cat.emoji} {cat.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No templates found matching your criteria</p>
                </div>
              ) : (
                filteredTemplates.map(renderTemplateCard)
              )}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Journeys</CardTitle>
                <CardDescription>
                  Journeys that families are loving right now
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {getTrendingTemplates().map(renderTemplateCard)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="top-rated" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Highest Rated Journeys</CardTitle>
                <CardDescription>
                  Journeys with the best reviews from parents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {getTopRatedTemplates().length > 0 ? (
                    getTopRatedTemplates().map(renderTemplateCard)
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-muted-foreground">No rated templates yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardHeader>
            <CardTitle>Share Your Journey</CardTitle>
            <CardDescription>
              Have a successful journey? Share it with the community!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Enable sharing for any of your journeys in the Parent Dashboard to help other families discover what works.
            </p>
            <Button onClick={() => navigate("/parent")}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
