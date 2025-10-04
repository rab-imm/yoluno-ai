import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings } from "lucide-react";
import { toast } from "sonner";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { BuddyAvatar } from "@/components/chat/BuddyAvatar";
import { BadgeDisplay } from "@/components/gamification/BadgeDisplay";
import { StreakDisplay } from "@/components/gamification/StreakDisplay";
import { StoryMode } from "@/components/stories/StoryMode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PersonalitySelector } from "@/components/chat/PersonalitySelector";

export default function ChildChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState<any>(null);

  useEffect(() => {
    loadChild();
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
            <BuddyAvatar size="sm" avatar={child.avatar} />
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
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Buddy Settings</SheetTitle>
                <SheetDescription>
                  Customize your buddy's personality
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <PersonalitySelector
                  selectedMode={child.personality_mode || "curious_explorer"}
                  onModeChange={updatePersonality}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StreakDisplay streakDays={child.streak_days || 0} childName={child.name} />
          <BadgeDisplay childId={id!} childName={child.name} />
        </div>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">💬 Chat</TabsTrigger>
            <TabsTrigger value="stories">📚 Story Time</TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="mt-6">
            <ChatInterface childId={id!} childName={child.name} childAvatar={child.avatar} />
          </TabsContent>
          <TabsContent value="stories" className="mt-6">
            <StoryMode childId={id!} childName={child.name} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
