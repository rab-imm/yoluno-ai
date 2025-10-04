import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, Moon } from "lucide-react";
import { toast } from "sonner";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { BuddyAvatar } from "@/components/chat/BuddyAvatar";
import { BadgeDisplay } from "@/components/gamification/BadgeDisplay";
import { StreakDisplay } from "@/components/gamification/StreakDisplay";
import { EnhancedStoryBuilder } from "@/components/stories/EnhancedStoryBuilder";
import { StoriesLibrary } from "@/components/stories/StoriesLibrary";
import { AvatarCustomizer } from "@/components/dashboard/AvatarCustomizer";
import { AccessoriesManager } from "@/components/dashboard/AccessoriesManager";
import { BedtimeMode } from "@/components/stories/BedtimeMode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PersonalitySelector } from "@/components/chat/PersonalitySelector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeProvider } from "@/contexts/ModeContext";
import { BottomModeBar } from "@/components/modes/BottomModeBar";
import { DesktopModeSwitcher } from "@/components/modes/DesktopModeSwitcher";
import { LearningMode } from "@/components/modes/LearningMode";
import { StoryTimeMode } from "@/components/modes/StoryTimeMode";
import { StoryModeHeader } from "@/components/stories/StoryModeHeader";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ChildChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState<any>(null);
  const [bedtimeStory, setBedtimeStory] = useState<any>(null);
  const [showBedtime, setShowBedtime] = useState(false);
  const [storyView, setStoryView] = useState<"create" | "library">("create");

  useEffect(() => {
    loadChild();
    loadBedtimeStory();
  }, [id]);

  const loadChild = async () => {
    if (!id) {
      navigate("/parent");
      return;
    }

    const { data, error } = await supabase
      .from("child_profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      toast.error("Child profile not found");
      navigate("/parent");
      return;
    }

    setChild(data);
    setLoading(false);
  };

  const loadBedtimeStory = async () => {
    if (!id) return;

    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from("child_stories")
      .select("*")
      .eq("child_id", id)
      .eq("bedtime_ready", true)
      .gte("created_at", today)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setBedtimeStory(data);
    }
  };

  const updatePersonality = async (mode: string) => {
    const { error } = await supabase
      .from("child_profiles")
      .update({ personality_mode: mode })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update personality");
      return;
    }

    setChild({ ...child, personality_mode: mode });
    toast.success("Buddy personality updated! 🎉");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-child-bg">
        <div className="animate-pulse text-child-primary text-xl">Loading your buddy...</div>
      </div>
    );
  }

  return (
    <ModeProvider>
      <div className="min-h-screen bg-gradient-to-br from-child-bg via-child-primary/5 to-child-secondary/5">
        <header className="bg-gradient-to-r from-child-primary to-child-secondary p-3 md:p-4 shadow-lg sticky top-0 z-40">
          <div className="container mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/parent")}
              className="text-white hover:bg-white/20 shrink-0"
            >
              <ArrowLeft className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Back</span>
            </Button>
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <BuddyAvatar 
                size="sm" 
                avatar={child.avatar} 
                customAvatarUrl={child.custom_avatar_url}
                expression="happy"
              />
              <div className="text-white min-w-0">
                <h1 className="text-base md:text-xl font-bold truncate">Hi {child.name}! 👋</h1>
                <p className="text-xs md:text-sm opacity-90 truncate">Your AI Buddy</p>
              </div>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 shrink-0">
                  <Settings className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-xl">
                <SheetHeader>
                  <SheetTitle>Buddy Settings</SheetTitle>
                  <SheetDescription>
                    Customize your buddy's personality and appearance
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-120px)] mt-6">
                  <div className="space-y-6 pr-4">
                    <AvatarCustomizer
                      childId={id!}
                      childName={child.name}
                      currentAvatar={child.avatar}
                      customAvatarUrl={child.custom_avatar_url}
                      onAvatarGenerated={(url) => {
                        setChild({ ...child, custom_avatar_url: url });
                      }}
                    />
                    <AccessoriesManager
                      childId={id!}
                      streakDays={child.streak_days || 0}
                    />
                    <PersonalitySelector
                      selectedMode={child.personality_mode || "curious_explorer"}
                      onModeChange={updatePersonality}
                    />
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <main className="container mx-auto px-2 md:px-4 py-4 md:py-6 space-y-4 md:space-y-6">
          {/* Bedtime Story Card */}
          {bedtimeStory && (
            <Card className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="w-6 h-6" />
                  Tonight's Bedtime Story
                </CardTitle>
                <CardDescription className="text-white/90">
                  Your parent made a special story just for you!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <img
                    src={bedtimeStory.illustrations?.[0]?.imageUrl || ""}
                    alt={bedtimeStory.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{bedtimeStory.title}</h3>
                    <p className="text-sm text-white/80">
                      {Math.ceil(bedtimeStory.duration_seconds / 60)} minute story
                    </p>
                  </div>
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => setShowBedtime(true)}
                    className="bg-white text-purple-600 hover:bg-white/90"
                  >
                    <Moon className="w-5 h-5 mr-2" />
                    Listen Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!isMobile && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StreakDisplay streakDays={child.streak_days || 0} childName={child.name} />
              <BadgeDisplay childId={id!} childName={child.name} />
            </div>
          )}

          <DesktopModeSwitcher />

          {/* Learning Mode Content */}
          <LearningMode>
            <div className="space-y-6">
              {isMobile && (
                <div className="grid grid-cols-2 gap-3">
                  <StreakDisplay streakDays={child.streak_days || 0} childName={child.name} />
                  <BadgeDisplay childId={id!} childName={child.name} />
                </div>
              )}
              <ChatInterface childId={id!} childName={child.name} childAvatar={child.avatar} />
            </div>
          </LearningMode>

          {/* Story Time Mode Content */}
          <StoryTimeMode>
            <div className="space-y-6">
              <StoryModeHeader 
                title="Story Time Magic"
                description="Create wonderful stories and explore your collection"
              />
              
              {isMobile && (
                <div className="flex gap-2 mb-4">
                  <Button
                    onClick={() => setStoryView("create")}
                    className="flex-1 transition-all"
                    style={storyView === "create" ? {
                      background: "linear-gradient(135deg, hsl(var(--story-primary)), hsl(var(--story-secondary)))",
                      color: "white"
                    } : undefined}
                    variant={storyView === "create" ? "default" : "outline"}
                  >
                    ✨ Create Story
                  </Button>
                  <Button
                    onClick={() => setStoryView("library")}
                    className="flex-1 transition-all"
                    style={storyView === "library" ? {
                      background: "linear-gradient(135deg, hsl(var(--story-primary)), hsl(var(--story-secondary)))",
                      color: "white"
                    } : undefined}
                    variant={storyView === "library" ? "default" : "outline"}
                  >
                    📖 My Stories
                  </Button>
                </div>
              )}

              {!isMobile ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <EnhancedStoryBuilder
                      childId={id!}
                      childName={child.name}
                      childAge={child.age || 8}
                      onComplete={() => setStoryView("library")}
                    />
                  </div>
                  <div>
                    <StoriesLibrary childId={id!} childName={child.name} />
                  </div>
                </div>
              ) : storyView === "create" ? (
                <EnhancedStoryBuilder
                  childId={id!}
                  childName={child.name}
                  childAge={child.age || 8}
                  onComplete={() => setStoryView("library")}
                />
              ) : (
                <StoriesLibrary childId={id!} childName={child.name} />
              )}
            </div>
          </StoryTimeMode>
        </main>

        <BottomModeBar />

        {/* Bedtime Mode Overlay */}
        {showBedtime && bedtimeStory && (
          <BedtimeMode
            story={bedtimeStory}
            childName={child.name}
            onClose={() => setShowBedtime(false)}
          />
        )}
      </div>
    </ModeProvider>
  );
}
