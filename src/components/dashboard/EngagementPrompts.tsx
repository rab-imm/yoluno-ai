import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const tips = [
  {
    id: "story-tip",
    emoji: "💡",
    title: "Pro Tip",
    message: "Record a 30-second voice message before bedtime stories to add a personal touch!",
    action: "Create Story",
    route: "/dashboard/stories",
  },
  {
    id: "journey-tip",
    emoji: "🎯",
    title: "Popular Choice",
    message: "Try creating a 'kindness journey' - it's our most popular template!",
    action: "Browse Journeys",
    route: "/journeys",
  },
  {
    id: "learning-tip",
    emoji: "📚",
    title: "Did You Know?",
    message: "Kids who hear stories 3+ times per week show 40% better emotional vocabulary",
    action: "Learn More",
    route: "/learning",
  },
  {
    id: "insight-tip",
    emoji: "🔍",
    title: "Stay Connected",
    message: "Check your weekly insights to see what your children are learning about",
    action: "View Insights",
    route: "/dashboard/insights",
  },
];

export function EngagementPrompts() {
  const navigate = useNavigate();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [dismissed, setDismissed] = useState(() => {
    const saved = localStorage.getItem("engagementPromptsDismissed");
    return saved === "true";
  });

  useEffect(() => {
    if (dismissed) return;
    
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 10000); // Rotate every 10 seconds

    return () => clearInterval(interval);
  }, [dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("engagementPromptsDismissed", "true");
  };

  if (dismissed) return null;

  const currentTip = tips[currentTipIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTip.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
                  {currentTip.emoji}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">{currentTip.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{currentTip.message}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDismiss}
                      className="hover:bg-muted -mt-1"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(currentTip.route)}
                    className="hover:bg-primary hover:text-primary-foreground"
                  >
                    {currentTip.action}
                  </Button>
                </div>
              </div>
              
              {/* Progress dots */}
              <div className="flex justify-center gap-2 mt-4">
                {tips.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTipIndex(index)}
                    className={`h-2 w-2 rounded-full transition-all ${
                      index === currentTipIndex
                        ? "bg-primary w-6"
                        : "bg-primary/30 hover:bg-primary/50"
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
