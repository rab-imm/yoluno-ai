import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { BuddyAvatar } from "@/components/chat/BuddyAvatar";

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
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <ChatInterface childId={id!} childName={child.name} childAvatar={child.avatar} />
      </main>
    </div>
  );
}
