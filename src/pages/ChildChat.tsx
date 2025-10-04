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
import { StoryMode } from "@/components/stories/StoryMode";
import { StoriesLibrary } from "@/components/stories/StoriesLibrary";
import { AvatarCustomizer } from "@/components/dashboard/AvatarCustomizer";
import { AccessoriesManager } from "@/components/dashboard/AccessoriesManager";
import { BedtimeMode } from "@/components/stories/BedtimeMode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function ChildChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState<any>(null);
  const [bedtimeStory, setBedtimeStory] = useState<any>(null);
  const [showBedtime, setShowBedtime] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-child-bg via-child-primary/5 to-child-secondary/5">
      <header className="bg-gradient-to-r from-child-primary to-child-secondary p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/parent")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <BuddyAvatar 
              size="sm" 
              avatar={child.avatar} 
              customAvatarUrl={child.custom_avatar_url}
              expression="happy"
            />
            <div className="text-white">
              <h1 className="text-xl font-bold">Hi {child.name}! 👋</h1>
              <p className="text-sm opacity-90">Your AI Buddy</p>
            </div>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
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

      <main className="container mx-auto px-4 py-6 space-y-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StreakDisplay streakDays={child.streak_days || 0} childName={child.name} />
          <BadgeDisplay childId={id!} childName={child.name} />
        </div>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat">💬 Chat</TabsTrigger>
            <TabsTrigger value="stories">📚 Create Story</TabsTrigger>
            <TabsTrigger value="library">📖 My Stories</TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="mt-6">
            <ChatInterface childId={id!} childName={child.name} childAvatar={child.avatar} />
          </TabsContent>
          <TabsContent value="stories" className="mt-6">
            <StoryMode childId={id!} childName={child.name} />
          </TabsContent>
          <TabsContent value="library" className="mt-6">
            <StoriesLibrary childId={id!} childName={child.name} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Bedtime Mode Overlay */}
      {showBedtime && bedtimeStory && (
        <BedtimeMode
          story={bedtimeStory}
          childName={child.name}
          onClose={() => setShowBedtime(false)}
        />
      )}
    </div>
  );
}
