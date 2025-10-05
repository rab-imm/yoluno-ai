import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, Target, MessageSquare, Loader2 } from "lucide-react";
import { useChildProfiles } from "@/hooks/dashboard/useChildProfiles";
import { useChildActivities } from "@/hooks/dashboard/useChildActivities";
import { CreateChildDialog } from "@/components/dashboard/CreateChildDialog";
import { WelcomeDialog } from "@/components/dashboard/WelcomeDialog";
import { formatDistanceToNow } from "date-fns";

function ChildOverviewCard({ child }: { child: any }) {
  const navigate = useNavigate();
  const { data: activities, isLoading } = useChildActivities(child.id);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="text-4xl">{child.avatar}</div>
          <div className="flex-1">
            <CardTitle>{child.name}</CardTitle>
            <CardDescription>Age {child.age}</CardDescription>
          </div>
          {child.streak_days > 0 && (
            <Badge variant="secondary">
              🔥 {child.streak_days}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <div className="text-2xl font-bold text-primary">{activities?.totalMessages || 0}</div>
                <div className="text-xs text-muted-foreground">Messages</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{activities?.totalStories || 0}</div>
                <div className="text-xs text-muted-foreground">Stories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{activities?.activeJourneys || 0}</div>
                <div className="text-xs text-muted-foreground">Journeys</div>
              </div>
            </div>

            {activities?.lastActive && (
              <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                Last active {formatDistanceToNow(new Date(activities.lastActive), { addSuffix: true })}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/dashboard/insights/${child.id}`)}
                className="flex flex-col h-auto py-2 px-1"
              >
                <MessageSquare className="w-4 h-4 mb-1" />
                <span className="text-xs">Insights</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/dashboard/stories/${child.id}`)}
                className="flex flex-col h-auto py-2 px-1"
              >
                <BookOpen className="w-4 h-4 mb-1" />
                <span className="text-xs">Stories</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/dashboard/journeys/${child.id}`)}
                className="flex flex-col h-auto py-2 px-1"
              >
                <Target className="w-4 h-4 mb-1" />
                <span className="text-xs">Journeys</span>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

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
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Welcome to Your Dashboard</h2>
          <p className="text-muted-foreground">Get started by adding your first child profile</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Child Profile
        </Button>
        <CreateChildDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onSuccess={refreshProfiles} />
        <WelcomeDialog open={showWelcome} onComplete={handleWelcomeComplete} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">View and manage your children's profiles</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Child
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children.map((child) => (
          <ChildOverviewCard key={child.id} child={child} />
        ))}
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
