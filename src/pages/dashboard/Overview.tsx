import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useChildProfiles } from "@/hooks/dashboard/useChildProfiles";
import { CreateChildDialog } from "@/components/dashboard/CreateChildDialog";
import { WelcomeDialog } from "@/components/dashboard/WelcomeDialog";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { ProductExplainerPanel } from "@/components/dashboard/ProductExplainerPanel";
import { EnhancedChildCard } from "@/components/dashboard/EnhancedChildCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { EngagementPrompts } from "@/components/dashboard/EngagementPrompts";
import { motion } from "framer-motion";


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
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-muted/50 py-16 px-4"
        >
          <div className="text-center space-y-4 max-w-md">
            <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
            <h2 className="text-3xl font-bold">Let's Get Started!</h2>
            <p className="text-muted-foreground text-lg">
              Create your first child profile to unlock the magic of personalized learning, stories, and growth journeys.
            </p>
            <Button onClick={() => setShowCreateDialog(true)} size="lg" className="mt-4">
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Child
            </Button>
          </div>
        </motion.div>

        <CreateChildDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onSuccess={refreshProfiles} />
        <WelcomeDialog open={showWelcome} onComplete={handleWelcomeComplete} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
      <DashboardHero />

      {/* Product Explainer - Show for first week */}
      <ProductExplainerPanel />

      {/* Add Child Button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowCreateDialog(true)} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Child
        </Button>
      </div>

      {/* Enhanced Child Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map((child, index) => (
          <EnhancedChildCard key={child.id} child={child} index={index} />
        ))}
      </div>

      {/* Two Column Layout for Activity Feed and Engagement Prompts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
