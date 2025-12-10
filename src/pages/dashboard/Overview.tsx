import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useChildProfiles } from "@/hooks/dashboard/useChildProfiles";
import { CreateChildDialog, EnhancedChildCard } from "@/components/dashboard/children";
import { WelcomeDialog } from "@/components/dashboard/WelcomeDialog";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { ProductExplainerPanel } from "@/components/dashboard/ProductExplainerPanel";
import { ActivityFeed, EngagementPrompts, ChildFeedbackPanel } from "@/components/dashboard/analytics";


export default function Overview() {
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
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="space-y-8 animate-fade-in">
        <DashboardHero />
        <ProductExplainerPanel />
        
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-muted/50 py-12 md:py-16 px-4 animate-fade-in">
          <div className="text-center space-y-3 md:space-y-4 max-w-md">
            <div className="text-5xl md:text-6xl mb-3 md:mb-4">👨‍👩‍👧‍👦</div>
            <h2 className="text-2xl md:text-3xl font-bold">Let's Get Started!</h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Create your first child profile to unlock the magic of personalized learning, stories, and growth journeys.
            </p>
            <Button onClick={() => setShowCreateDialog(true)} size="lg" className="mt-4 min-h-[44px]">
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Child
            </Button>
          </div>
        </div>

        <CreateChildDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onSuccess={refreshProfiles} />
        <WelcomeDialog open={showWelcome} onComplete={handleWelcomeComplete} />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-8">
      {/* Hero Section */}
      <DashboardHero />

      {/* Product Explainer - Show for first week */}
      <ProductExplainerPanel />

      {/* Messages from Kids */}
      <ChildFeedbackPanel />

      {/* Add Child Button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowCreateDialog(true)} size="lg" className="min-h-[44px]">
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Add Child</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Enhanced Child Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {children.map((child, index) => (
          <EnhancedChildCard key={child.id} child={child} index={index} />
        ))}
      </div>

      {/* Two Column Layout for Activity Feed and Engagement Prompts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
        <div>
          <EngagementPrompts />
        </div>
      </div>

      <CreateChildDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={refreshProfiles}
      />

      <WelcomeDialog open={showWelcome} onComplete={handleWelcomeComplete} />
    </div>
  );
}
