import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  custom_avatar_url: string | null;
}

export default function KidsLauncher() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<ChildProfile[]>([]);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("child_profiles")
        .select("id, name, age, avatar, custom_avatar_url")
        .eq("parent_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setChildren(data || []);
    } catch (error) {
      console.error("Error fetching children:", error);
      toast.error("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  const selectChild = (childId: string) => {
    navigate(`/child/${childId}`, { state: { fromLauncher: true } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(var(--learning-primary))] via-[hsl(var(--story-primary))] to-[hsl(var(--learning-secondary))]">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[hsl(var(--learning-primary))] via-[hsl(var(--story-primary))] to-[hsl(var(--learning-secondary))] p-4">
        <div className="text-center text-white space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold animate-bounce-gentle">👋</h1>
          <h2 className="text-2xl md:text-3xl font-bold">No profiles yet!</h2>
          <p className="text-lg">Ask your parent to create a profile for you.</p>
          <button
            onClick={() => navigate("/parent")}
            className="mt-6 px-6 py-3 bg-white text-primary rounded-full font-semibold hover-scale"
          >
            Go to Parent Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--learning-primary))] via-[hsl(var(--story-primary))] to-[hsl(var(--learning-secondary))] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-bounce-gentle">
            👋 Hi! Who are you?
          </h1>
          <p className="text-xl md:text-2xl text-white/90">
            Tap your profile to start!
          </p>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {children.map((child, index) => (
            <Card
              key={child.id}
              onClick={() => selectChild(child.id)}
              className="group cursor-pointer bg-white/95 backdrop-blur-sm border-4 border-white/50 hover:border-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover-scale p-8 md:p-10"
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: "fade-in 0.5s ease-out forwards",
                opacity: 0,
              }}
            >
              <div className="text-center space-y-4">
                {/* Avatar */}
                <div className="relative inline-block">
                  {child.custom_avatar_url ? (
                    <img
                      src={child.custom_avatar_url}
                      alt={child.name}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary/20 group-hover:border-primary/40 transition-all"
                    />
                  ) : (
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[hsl(var(--learning-primary))] to-[hsl(var(--story-primary))] flex items-center justify-center text-5xl md:text-6xl border-4 border-primary/20 group-hover:border-primary/40 transition-all">
                      {child.avatar}
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl">✨</span>
                  </div>
                </div>

                {/* Name */}
                <h2 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {child.name}
                </h2>

                {/* Age Badge */}
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-[hsl(var(--learning-primary))] to-[hsl(var(--story-primary))] text-white rounded-full font-semibold">
                  Age {child.age}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/parent")}
            className="text-white/80 hover:text-white underline text-sm md:text-base"
          >
            Parent Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}
