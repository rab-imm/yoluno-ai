import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, BookOpen, Target, Rocket, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChildActivities } from "@/hooks/dashboard/useChildActivities";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

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
    >
      <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/30">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-4">
            {/* Enhanced Avatar */}
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 p-1 shadow-lg"
              >
                <div className="flex h-full w-full items-center justify-center rounded-full bg-card text-5xl">
                  {child.avatar || "👦"}
                </div>
              </motion.div>
              {child.streak_days > 0 && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -bottom-1 -right-1"
                >
                  <Badge variant="secondary" className="shadow-lg">
                    🔥 {child.streak_days}
                  </Badge>
                </motion.div>
              )}
            </div>

            {/* Name and Info */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{child.name}</h3>
              <p className="text-sm text-muted-foreground">Age {child.age}</p>
              <Badge variant="outline" className="mt-1 text-xs">
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
              <div className="grid grid-cols-3 gap-3 rounded-lg bg-muted/50 p-4">
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="text-3xl font-bold text-primary"
                  >
                    {activities?.totalMessages || 0}
                  </motion.div>
                  <div className="text-xs text-muted-foreground">Messages</div>
                </div>
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="text-3xl font-bold text-primary"
                  >
                    {activities?.totalStories || 0}
                  </motion.div>
                  <div className="text-xs text-muted-foreground">Stories</div>
                </div>
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="text-3xl font-bold text-primary"
                  >
                    {activities?.activeJourneys || 0}
                  </motion.div>
                  <div className="text-xs text-muted-foreground">Journeys</div>
                </div>
              </div>

              {/* Last Active */}
              {activities?.lastActive && (
                <div className="text-center text-sm text-muted-foreground pt-2 border-t">
                  Last active {formatDistanceToNow(new Date(activities.lastActive), { addSuffix: true })}
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/child/${child.id}`)}
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Rocket className="mr-2 h-4 w-4" />
                  Launch Chat
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/dashboard/insights/${child.id}`)}
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Insights
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/dashboard/stories/${child.id}`)}
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Stories
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/dashboard/journeys/${child.id}`)}
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
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
