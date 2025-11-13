import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock, Plus, Settings, Play, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useChildProfiles } from "@/hooks/dashboard/useChildProfiles";
import { KidsPINDialog } from "@/components/kids/KidsPINDialog";
import { useKidsAuth } from "@/contexts/KidsAuthContext";
import { BuddyAvatar } from "@/components/chat/BuddyAvatar";

export const NetflixProfileSelector = () => {
  const navigate = useNavigate();
  const { children, isLoading } = useChildProfiles();
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [showPINDialog, setShowPINDialog] = useState(false);
  const { login } = useKidsAuth();

  const handleProfileClick = (child: any) => {
    if (child.pin_enabled) {
      setSelectedChild(child);
      setShowPINDialog(true);
    } else {
      handleDirectLogin(child.id);
    }
  };

  const handleDirectLogin = async (childId: string) => {
    // For profiles without PIN, use empty PIN
    const success = await login(childId, "");
    if (success) {
      navigate(`/play/${childId}`);
    }
  };

  const handlePINSubmit = async (pin: string) => {
    if (!selectedChild) return false;
    const success = await login(selectedChild.id, pin);
    if (success) {
      setShowPINDialog(false);
      navigate(`/play/${selectedChild.id}`);
    }
    return success;
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
          <p className="text-white text-xl">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-y-auto">
      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        {/* Header */}
        <div className="w-full max-w-7xl mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl">Paliyo</span>
          </button>
          
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Settings className="mr-2 h-4 w-4" />
            Manage Profiles
          </Button>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-7xl text-center space-y-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-12">
            Who's Playing?
          </h1>

          {children.length === 0 ? (
            <div className="space-y-6">
              <p className="text-white/80 text-xl">
                No profiles yet. Let's create one!
              </p>
              <Button
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="shadow-xl text-lg px-8 py-6"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create First Profile
              </Button>
            </div>
          ) : (
            <>
              {/* Profile Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                {children.map((child, index) => {
                  return (
                    <motion.div
                      key={child.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group cursor-pointer"
                      onClick={() => handleProfileClick(child)}
                    >
                      <div className="relative">
                        {/* Avatar */}
                        <div className="relative w-full aspect-square">
                          <div className="absolute inset-0 rounded-lg overflow-hidden border-4 border-transparent group-hover:border-white transition-all duration-300 shadow-xl group-hover:shadow-2xl">
                            <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-300">
                              <BuddyAvatar
                                avatar={child.avatar || "👦"}
                                customAvatarUrl={child.custom_avatar_url}
                                avatarLibraryId={child.use_library_avatar ? child.avatar_library_id : undefined}
                                size="xl"
                                expression="happy"
                                className="!w-full !h-full !rounded-lg"
                              />
                              {/* Overlay on hover */}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center rounded-lg">
                                <Play className="h-16 w-16 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* PIN Badge */}
                        {child.pin_enabled && (
                          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full p-2 z-10">
                            <Lock className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Name */}
                      <h3 className="text-xl md:text-2xl text-white text-center mt-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300 font-medium">
                        {child.name}
                      </h3>
                    </motion.div>
                  );
                })}

                {/* Add Profile Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: children.length * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => navigate("/dashboard")}
                >
                  <div className="w-full aspect-square rounded-lg border-4 border-dashed border-white/30 group-hover:border-white transition-all duration-300 flex items-center justify-center bg-white/5 group-hover:bg-white/10 shadow-xl group-hover:shadow-2xl group-hover:scale-105">
                    <Plus className="h-16 w-16 text-white/50 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl md:text-2xl text-white text-center mt-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300 font-medium">
                    Add Profile
                  </h3>
                </motion.div>
              </div>

              {/* Back to Dashboard Link */}
              <div className="pt-8">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/dashboard")}
                  className="text-white/60 hover:text-white hover:bg-white/10"
                >
                  Back to Parent Dashboard
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* PIN Dialog */}
      {selectedChild && (
        <KidsPINDialog
          open={showPINDialog}
          onClose={() => setShowPINDialog(false)}
          onSubmit={handlePINSubmit}
          childName={selectedChild.name}
        />
      )}
    </div>
  );
};
