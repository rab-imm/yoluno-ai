import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock, Plus, Settings, Play, Shield, LogOut, AlertTriangle, ChevronRight, MessageSquare, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { useChildProfiles } from "@/hooks/dashboard/useChildProfiles";
import { KidsPINDialog } from "@/components/kids/KidsPINDialog";
import { useKidsAuth } from "@/contexts/KidsAuthContext";
import { BuddyAvatar } from "@/components/chat/BuddyAvatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const NetflixProfileSelector = () => {
  const navigate = useNavigate();
  const { children, isLoading } = useChildProfiles();
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [showPINDialog, setShowPINDialog] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [sendingFeedback, setSendingFeedback] = useState(false);
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

  const handleParentLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('last_mode');
      toast.success("Parent logged out successfully");
      setShowLogoutDialog(false);
      setShowSidebar(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackMessage.trim()) {
      toast.error("Please write a message");
      return;
    }

    try {
      setSendingFeedback(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("child_feedback")
        .insert({
          parent_id: user.id,
          message: feedbackMessage,
          child_id: children[0]?.id || null
        });

      if (error) throw error;

      toast.success("Message sent to parents! 📬");
      setFeedbackMessage("");
      setShowSidebar(false);
    } catch (error) {
      console.error("Error sending feedback:", error);
      toast.error("Failed to send message");
    } finally {
      setSendingFeedback(false);
    }
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
          
          <Sheet open={showSidebar} onOpenChange={setShowSidebar}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Settings className="mr-2 h-4 w-4" />
                Options
              </Button>
            </SheetTrigger>
            
            <SheetContent className="w-80">
        <SheetHeader>
          <SheetTitle>Options</SheetTitle>
        </SheetHeader>
              
              <div className="mt-6 space-y-4">
                {/* Navigation */}
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate("/dashboard");
                      setShowSidebar(false);
                    }}
                  >
                    <ChevronRight className="mr-2 h-4 w-4" />
                    View Dashboard
            </Button>
          </div>

          <Separator className="my-6" />

          {/* Send a Message Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Send a Message</h3>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Need to tell your parents something? Write them a message!
            </p>
            
            <Textarea
              placeholder="Hi Mom and Dad! I want to tell you..."
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{feedbackMessage.length}/500 characters</span>
            </div>
            
            <Button
              onClick={handleSubmitFeedback}
              disabled={sendingFeedback || !feedbackMessage.trim()}
              className="w-full"
            >
              {sendingFeedback ? (
                <>Sending...</>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send to Parents
                </>
              )}
            </Button>
          </div>

          <Separator className="my-6" />
                
                {/* Danger Zone */}
                <div className="rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <h3 className="font-semibold text-red-600">Danger Zone</h3>
                  </div>
                  
                  <p className="text-sm text-red-600/80 mb-3">
                    Logging out will return you to the main page and require re-authentication.
                  </p>
                  
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setShowLogoutDialog(true)}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out Parent
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-7xl text-center space-y-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-12">
            Pick Your Profile!
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
        <div className="flex flex-wrap justify-center gap-12 md:gap-16 max-w-5xl mx-auto px-4">
                {children.map((child, index) => {
                  return (
                    <motion.div
                      key={child.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group cursor-pointer w-80 md:w-96"
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
                                size="5xl"
                                expression="happy"
                                className="!w-full !h-full !rounded-lg"
                              />
                              {/* Overlay on hover */}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center rounded-lg">
                                <Play className="h-32 w-32 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                      <h3 className="text-3xl md:text-4xl text-white text-center mt-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300 font-medium">
                        {child.name}
                      </h3>
                    </motion.div>
                  );
                })}
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

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out parent account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will end your parent session. You'll need to log in again to manage profiles or access parent controls.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleParentLogout} className="bg-destructive hover:bg-destructive/90">
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
