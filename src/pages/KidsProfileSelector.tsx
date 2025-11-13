import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, Loader2 } from "lucide-react";
import { KidsPINDialog } from "@/components/kids/KidsPINDialog";
import { useKidsAuth } from "@/contexts/KidsAuthContext";
import { toast } from "sonner";

interface ChildProfile {
  id: string;
  name: string;
  avatar: string;
  custom_avatar_url?: string;
  avatar_library_id?: string;
  use_library_avatar?: boolean;
  pin_enabled: boolean;
}

export default function KidsProfileSelector() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useKidsAuth();
  
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [showPINDialog, setShowPINDialog] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const inviteCode = searchParams.get("invite");
      
      let query = supabase
        .from("child_profiles")
        .select("id, name, avatar, custom_avatar_url, avatar_library_id, use_library_avatar, pin_enabled");

      // If invite code provided, filter to specific child
      if (inviteCode) {
        const { data: invite } = await supabase
          .from("kids_invites")
          .select("child_id")
          .eq("invite_code", inviteCode)
          .eq("is_active", true)
          .single();

        if (invite) {
          query = query.eq("id", invite.child_id);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error("Error loading profiles:", error);
      toast.error("Could not load profiles");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileClick = (child: ChildProfile) => {
    setSelectedChild(child);
    
    if (child.pin_enabled) {
      setShowPINDialog(true);
    } else {
      // No PIN required, login directly
      handleLogin(child.id, "");
    }
  };

  const handleLogin = async (childId: string, pin: string) => {
    const success = await login(childId, pin);
    
    if (success) {
      toast.success("Welcome back!");
      navigate(`/play/${childId}`);
    }
    
    return success;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-child-primary/20 via-child-secondary/20 to-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-child-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-child-primary/20 via-child-secondary/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate("/play")}
            variant="ghost"
            size="lg"
            className="text-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        </div>

        {/* Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-child-primary to-child-secondary bg-clip-text text-transparent mb-4">
            Who's Playing Today?
          </h1>
          <p className="text-xl text-muted-foreground">
            Pick your profile to get started!
          </p>
        </motion.div>

        {/* Profiles Grid */}
        {profiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">
              No profiles found. Ask your parent to create one!
            </p>
            <Button onClick={() => navigate("/")} size="lg">
              Go to Parent Dashboard
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {profiles.map((child, index) => (
              <motion.button
                key={child.id}
                onClick={() => handleProfileClick(child)}
                className="group relative p-8 rounded-3xl bg-card border-4 border-border hover:border-child-primary transition-all hover:scale-105 hover:shadow-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Avatar */}
                <div className="mb-4">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-child-primary/20 to-child-secondary/20 flex items-center justify-center text-6xl border-4 border-child-primary/30 group-hover:border-child-primary transition-all">
                    {child.custom_avatar_url ? (
                      <img
                        src={child.custom_avatar_url}
                        alt={child.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span>{child.avatar}</span>
                    )}
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {child.name}
                </h3>

                {/* PIN Indicator */}
                {child.pin_enabled && (
                  <div className="flex items-center justify-center gap-2 text-child-primary">
                    <Lock className="w-5 h-5" />
                    <span className="text-sm font-medium">PIN Required</span>
                  </div>
                )}

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-child-primary/0 to-child-secondary/0 group-hover:from-child-primary/10 group-hover:to-child-secondary/10 transition-all pointer-events-none" />
              </motion.button>
            ))}
          </div>
        )}

        {/* Parent Link */}
        <div className="text-center mt-12">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            size="lg"
          >
            Parent Dashboard
          </Button>
        </div>
      </div>

      {/* PIN Dialog */}
      {selectedChild && (
        <KidsPINDialog
          open={showPINDialog}
          onClose={() => {
            setShowPINDialog(false);
            setSelectedChild(null);
          }}
          onSubmit={(pin) => handleLogin(selectedChild.id, pin)}
          childName={selectedChild.name}
        />
      )}
    </div>
  );
}
