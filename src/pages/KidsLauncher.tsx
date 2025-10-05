import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BuddyAvatar } from "@/components/chat/BuddyAvatar";
import { motion } from "framer-motion";

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  custom_avatar_url: string | null;
  avatar_library_id: string | null;
  use_library_avatar: boolean;
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
        .select("id, name, age, avatar, custom_avatar_url, avatar_library_id, use_library_avatar")
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
            <motion.div
              key={child.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card
                onClick={() => selectChild(child.id)}
                className="group cursor-pointer bg-white/95 backdrop-blur-sm border-4 border-white/50 hover:border-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 p-8 md:p-10"
              >
                <div className="text-center space-y-4">
                  {/* Avatar with Pixar Character */}
                  <div className="relative inline-block">
                    <BuddyAvatar
                      avatar={child.avatar}
                      customAvatarUrl={child.custom_avatar_url}
                      avatarLibraryId={child.use_library_avatar ? child.avatar_library_id : undefined}
                      size="xl"
                      expression="happy"
                      className="mx-auto group-hover:scale-110 transition-transform"
                    />
                    <motion.div 
                      className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-2xl">✨</span>
                    </motion.div>
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
            </motion.div>
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
