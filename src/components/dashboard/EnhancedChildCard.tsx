import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, BookOpen, Target, Rocket, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChildActivities } from "@/hooks/dashboard/useChildActivities";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { BuddyAvatar } from "@/components/chat/BuddyAvatar";

interface EnhancedChildCardProps {
  child: any;
  index: number;
}

export function EnhancedChildCard({ child, index }: EnhancedChildCardProps) {
  const navigate = useNavigate();
  const { data: activities, isLoading } = useChildActivities(child.id);

  const totalActivities = (activities?.totalMessages || 0) + (activities?.totalStories || 0) + (activities?.activeJourneys || 0);
  const progressPercentage = Math.min((totalActivities / 10) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/40 bg-gradient-to-br from-card to-card/50 overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex items-center gap-4">
            {/* Enhanced Avatar */}
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.15, rotate: 5 }}
                className="relative"
              >
                <BuddyAvatar
                  avatar={child.avatar || "👦"}
                  customAvatarUrl={child.custom_avatar_url}
                  avatarLibraryId={child.use_library_avatar ? child.avatar_library_id : undefined}
                  size="xl"
                  expression="neutral"
                />
              </motion.div>
              {child.streak_days > 0 && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -bottom-2 -right-2"
                >
                  <Badge className="shadow-lg bg-gradient-to-r from-orange-500 to-red-500 text-white border-2 border-white px-2 py-1">
                    🔥 {child.streak_days}
                  </Badge>
                </motion.div>
              )}
            </div>

            {/* Name and Info */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{child.name}</h3>
              <p className="text-sm text-muted-foreground font-medium">Age {child.age}</p>
              <Badge variant="outline" className="mt-2 text-xs font-semibold border-primary/30">
                {child.personality_mode.replace(/_/g, " ")}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* Activity Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Activity Level</span>
                  <span className="font-semibold text-primary">{totalActivities} interactions</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 rounded-xl bg-gradient-to-br from-muted/80 to-muted/40 p-5 border border-primary/10">
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
                  >
                    {activities?.totalMessages || 0}
                  </motion.div>
                  <div className="text-xs text-muted-foreground font-medium mt-1">Messages</div>
                </div>
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent"
                  >
                    {activities?.totalStories || 0}
                  </motion.div>
                  <div className="text-xs text-muted-foreground font-medium mt-1">Stories</div>
                </div>
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent"
                  >
                    {activities?.activeJourneys || 0}
                  </motion.div>
                  <div className="text-xs text-muted-foreground font-medium mt-1">Journeys</div>
                </div>
              </div>

              {/* Last Active */}
              {activities?.lastActive && (
                <div className="text-center text-sm text-muted-foreground pt-3 border-t font-medium">
                  Last active {formatDistanceToNow(new Date(activities.lastActive), { addSuffix: true })}
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 pt-3">
                <Button
                  size="sm"
                  onClick={() => navigate(`/child/${child.id}`)}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-md hover:shadow-lg hover:scale-105"
                >
                  <Rocket className="mr-2 h-4 w-4" />
                  Launch Chat
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/dashboard/insights/${child.id}`)}
                  className="hover:bg-primary hover:text-primary-foreground transition-all border-2 hover:scale-105"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Insights
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/dashboard/stories/${child.id}`)}
                  className="hover:bg-primary hover:text-primary-foreground transition-all border-2 hover:scale-105"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Stories
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/dashboard/journeys/${child.id}`)}
                  className="hover:bg-primary hover:text-primary-foreground transition-all border-2 hover:scale-105"
                >
                  <Target className="mr-2 h-4 w-4" />
                  Journeys
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
