import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGlobalActivity } from "@/hooks/dashboard/useGlobalActivity";
import { Loader2, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ActivityFeed() {
  const { data: activities, isLoading } = useGlobalActivity();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No recent activity yet. Start exploring with your children! ✨
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Activity className="h-6 w-6 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-4 rounded-xl border-2 bg-gradient-to-br from-card to-card/50 p-4 hover:shadow-lg transition-all hover:scale-[1.02] hover:border-primary/30"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-2xl shadow-md flex-shrink-0">
                    {activity.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-relaxed">
                      <span className="text-primary font-bold">{activity.childName}</span>
                      {" "}
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">{activity.relativeTime}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}
