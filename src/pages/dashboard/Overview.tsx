import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Target, TrendingUp, Sparkles } from "lucide-react";
import { useChildProfiles } from "@/hooks/dashboard/useChildProfiles";
import { ChildProfileCard } from "@/components/dashboard/ChildProfileCard";
import { CreateChildDialog } from "@/components/dashboard/CreateChildDialog";
import { JourneyOnboardingCard } from "@/components/journey/JourneyOnboardingCard";
import { WelcomeDialog } from "@/components/dashboard/WelcomeDialog";
import { useEffect } from "react";

export default function Overview() {
  const navigate = useNavigate();
  const { children, refreshProfiles, isLoading } = useChildProfiles();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const isFirstLogin = localStorage.getItem("hasSeenWelcome") !== "true";
    if (isFirstLogin && !isLoading) {
      setShowWelcome(true);
    }
  }, [isLoading]);

  const handleWelcomeComplete = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    setShowWelcome(false);
    if (children.length === 0) {
      setShowCreateDialog(true);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Hero Cards */}
      {children.length > 0 && (
        <>
          <Card className="border-0 overflow-hidden" style={{ background: 'var(--gradient-story)' }}>
            <CardHeader>
              <div className="flex items-center gap-3 text-white">
                <BookOpen className="h-8 w-8" />
                <div>
                  <CardTitle className="text-2xl text-white">Create Tonight's Story</CardTitle>
                  <CardDescription className="text-white/90">
                    Magical bedtime stories personalized for your children
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate(`/dashboard/stories/${children[0].id}`)}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Story Wizard
              </Button>
            </CardContent>
          </Card>

          <JourneyOnboardingCard
            onStartJourney={() => navigate(`/dashboard/journeys/${children[0].id}`)}
            onBrowseMarketplace={() => navigate("/marketplace")}
          />
        </>
      )}

      {/* Child Profiles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Child Profiles</span>
            <Button onClick={() => setShowCreateDialog(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Child
            </Button>
          </CardTitle>
          <CardDescription>
            Manage profiles and view activity for each child
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {children.map((child) => (
              <ChildProfileCard
                key={child.id}
                child={child}
                onRefresh={refreshProfiles}
              />
            ))}
            {children.length === 0 && (
              <Card
                className="border-dashed cursor-pointer hover:border-primary transition-colors"
                onClick={() => setShowCreateDialog(true)}
              >
                <CardContent className="flex flex-col items-center justify-center min-h-[200px] gap-2">
                  <Plus className="h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Create your first child profile</p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {children.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/dashboard/insights/${children[0].id}`)}>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Learning Insights</CardTitle>
              <CardDescription>View progress and conversation topics</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/dashboard/journeys/${children[0].id}`)}>
            <CardHeader>
              <Target className="h-8 w-8 text-growth-primary mb-2" />
              <CardTitle className="text-lg">Goal Journeys</CardTitle>
              <CardDescription>Create and manage habit journeys</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/dashboard/stories/${children[0].id}`)}>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-story-primary mb-2" />
              <CardTitle className="text-lg">Stories</CardTitle>
              <CardDescription>Create and browse story library</CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}

      <CreateChildDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={refreshProfiles}
      />

      <WelcomeDialog open={showWelcome} onComplete={handleWelcomeComplete} />
    </div>
  );
}
