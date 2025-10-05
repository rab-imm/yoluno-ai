import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, LogOut, Users, BookOpen, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { ChildProfileCard } from "@/components/dashboard/ChildProfileCard";
import { CreateChildDialog } from "@/components/dashboard/CreateChildDialog";
import { TopicManager } from "@/components/dashboard/TopicManager";
import { ParentInsights } from "@/components/dashboard/ParentInsights";
import { WelcomeDialog } from "@/components/dashboard/WelcomeDialog";
import { ContentModerationLog } from "@/components/dashboard/ContentModerationLog";
import { TopicLibrary } from "@/components/dashboard/TopicLibrary";
import { ContentLibrary } from "@/components/dashboard/ContentLibrary";
import { StoryLibrary } from "@/components/dashboard/StoryLibrary";
import { GoalJourneyManager } from "@/components/dashboard/GoalJourneyManager";
import { JourneyOnboardingCard } from "@/components/journey/JourneyOnboardingCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedStoryBuilder } from "@/components/stories/EnhancedStoryBuilder";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FamilyHistoryManager } from "@/components/dashboard/FamilyHistoryManager";

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<any[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showStoryWizard, setShowStoryWizard] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchChildren();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    
    // Check if this is first login
    const isFirstLogin = localStorage.getItem("hasSeenWelcome") !== "true";
    if (isFirstLogin) {
      setShowWelcome(true);
    }
    
    setLoading(false);
  };

  const handleWelcomeComplete = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    setShowWelcome(false);
    if (children.length === 0) {
      setShowCreateDialog(true);
    }
  };

  const fetchChildren = async () => {
    const { data, error } = await supabase
      .from("child_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load child profiles");
      return;
    }

    setChildren(data || []);
    if (data && data.length > 0 && !selectedChildId) {
      setSelectedChildId(data[0].id);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Parent Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/marketplace")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Browse Journeys
            </Button>
            <Button size="sm" onClick={() => navigate("/kids")} className="bg-gradient-to-r from-[hsl(var(--learning-primary))] to-[hsl(var(--story-primary))]">
              <Sparkles className="h-4 w-4 mr-2" />
              Launch Kids Mode
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Story Buddy Hero Section */}
          {children.length > 0 && selectedChildId && (
            <Card className="border-0 overflow-hidden relative" style={{ background: 'var(--gradient-story)' }}>
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-3 text-white">
                  <BookOpen className="h-8 w-8" />
                  <div>
                    <CardTitle className="text-2xl text-white">🌙 Tonight's Bedtime Story</CardTitle>
                    <CardDescription className="text-white/90">
                      Create a magical story for {children.find(c => c.id === selectedChildId)?.name} in just 2 minutes
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  onClick={() => setShowStoryWizard(true)}
                  className="bg-white hover:bg-white/90 shadow-lg"
                  style={{ color: 'hsl(var(--story-magic))' }}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Story Wizard
                </Button>
              </CardContent>
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-4 right-4 text-6xl">✨</div>
                <div className="absolute bottom-4 left-4 text-5xl">📖</div>
                <div className="absolute top-1/2 right-1/4 text-4xl">🌙</div>
              </div>
            </Card>
          )}

          {/* Journey Onboarding Card - shown if child exists */}
          {children.length > 0 && selectedChildId && (
            <JourneyOnboardingCard
              onStartJourney={() => {
                // Navigate to journeys tab
                const journeysSection = document.querySelector('[value="journeys"]');
                if (journeysSection) {
                  (journeysSection as HTMLElement).click();
                }
              }}
              onBrowseMarketplace={() => navigate("/marketplace")}
            />
          )}

          <Card>
            <CardHeader>
              <CardTitle>Child Profiles</CardTitle>
              <CardDescription>
                Create and manage profiles for your children
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {children.map((child) => (
                  <ChildProfileCard
                    key={child.id}
                    child={child}
                    onRefresh={fetchChildren}
                  />
                ))}
                <Card
                  className="border-dashed cursor-pointer hover:border-primary transition-colors"
                  onClick={() => setShowCreateDialog(true)}
                >
                  <CardContent className="flex flex-col items-center justify-center min-h-[200px] gap-2">
                    <Plus className="h-12 w-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Add Child Profile</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {children.length > 0 && selectedChildId && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Child Management</CardTitle>
                  <CardDescription>
                    View insights, manage topics, and monitor safety for each child
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={selectedChildId} onValueChange={setSelectedChildId}>
                    <TabsList className="grid w-full mb-6" style={{ gridTemplateColumns: `repeat(${children.length}, 1fr)` }}>
                      {children.map((child) => (
                        <TabsTrigger key={child.id} value={child.id}>
                          {child.avatar} {child.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {children.map((child) => {
                      const selectedChild = children.find(c => c.id === selectedChildId);
                      if (child.id !== selectedChildId || !selectedChild) return null;
                      
                      return (
                        <div key={child.id}>
                          <Tabs defaultValue="insights" className="w-full">
                            <TabsList className="grid w-full grid-cols-8">
                              <TabsTrigger value="insights">Learning Insights</TabsTrigger>
                              <TabsTrigger value="topics">Topics</TabsTrigger>
                              <TabsTrigger value="library">Topic Library</TabsTrigger>
                              <TabsTrigger value="journeys">Goal Journeys</TabsTrigger>
                              <TabsTrigger value="stories">Story Library</TabsTrigger>
                              <TabsTrigger value="family">Family History</TabsTrigger>
                              <TabsTrigger value="content">Content Review</TabsTrigger>
                              <TabsTrigger value="safety">Safety Monitor</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="insights" className="space-y-4 mt-4">
                              <ParentInsights childId={selectedChild.id} childName={selectedChild.name} />
                            </TabsContent>
                            
                            <TabsContent value="topics" className="space-y-4 mt-4">
                              <TopicManager childId={selectedChild.id} />
                            </TabsContent>

                            <TabsContent value="library" className="space-y-4 mt-4">
                              <TopicLibrary childId={selectedChild.id} />
                            </TabsContent>

                            <TabsContent value="journeys" className="space-y-4 mt-4">
                              <GoalJourneyManager 
                                childId={selectedChild.id} 
                                childName={selectedChild.name}
                                childAge={selectedChild.age}
                              />
                            </TabsContent>

                            <TabsContent value="stories" className="space-y-4 mt-4">
                              <StoryLibrary childId={selectedChild.id} childName={selectedChild.name} />
                            </TabsContent>

                            <TabsContent value="family" className="space-y-4 mt-4">
                              <FamilyHistoryManager />
                            </TabsContent>

                            <TabsContent value="content" className="space-y-4 mt-4">
                              <ContentLibrary childId={selectedChild.id} childName={selectedChild.name} />
                            </TabsContent>
                            
                            <TabsContent value="safety" className="space-y-4 mt-4">
                              <ContentModerationLog 
                                childId={selectedChild.id} 
                                childName={selectedChild.name}
                              />
                            </TabsContent>
                          </Tabs>
                        </div>
                      );
                    })}
                  </Tabs>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      <CreateChildDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={fetchChildren}
      />

      <WelcomeDialog open={showWelcome} onComplete={handleWelcomeComplete} />

      <Dialog open={showStoryWizard} onOpenChange={setShowStoryWizard}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {selectedChildId && (
            <EnhancedStoryBuilder
              childId={selectedChildId}
              childName={children.find(c => c.id === selectedChildId)?.name || ""}
              childAge={children.find(c => c.id === selectedChildId)?.age || 8}
              onComplete={() => {
                setShowStoryWizard(false);
                toast.success("Story created successfully! 🎉");
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
