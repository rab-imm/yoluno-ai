import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, X, Sparkles, BookOpen, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const tips = [
  {
    id: "story-tip",
    icon: BookOpen,
    emoji: "💡",
    title: "Pro Tip: Story Magic",
    message: "Record a 30-second voice message before bedtime stories to add a personal touch!",
    action: "Create Story",
    route: "/marketplace",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "journey-tip",
    icon: Target,
    emoji: "🎯",
    title: "Popular Choice",
    message: "Try creating a 'kindness journey' - it's our most popular template!",
    action: "Browse Journeys",
    route: "/marketplace",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "learning-tip",
    icon: Sparkles,
    emoji: "📚",
    title: "Did You Know?",
    message: "Kids who hear stories 3+ times per week show 40% better emotional vocabulary",
    action: "Explore Features",
    route: "/features",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    id: "insight-tip",
    icon: Lightbulb,
    emoji: "🔍",
    title: "Stay Connected",
    message: "Check your weekly insights to see what your children are learning about",
    action: "Learn More",
    route: "/about",
    gradient: "from-emerald-500 to-teal-500",
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
      className="sticky top-4"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTip.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-card to-card/50 shadow-lg hover:shadow-xl transition-all overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${currentTip.gradient} opacity-10`} />
            
            <CardContent className="p-6 relative">
              <div className="flex items-start gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${currentTip.gradient} text-white shadow-lg flex-shrink-0`}>
                  <currentTip.icon className="h-7 w-7" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-3xl">{currentTip.emoji}</span>
                        <span className="text-base font-bold">{currentTip.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed font-medium">{currentTip.message}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDismiss}
                      className="hover:bg-muted rounded-full h-8 w-8 p-0 -mt-1 ml-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => navigate(currentTip.route)}
                    className={`w-full bg-gradient-to-r ${currentTip.gradient} hover:opacity-90 text-white font-semibold shadow-md hover:shadow-lg transition-all`}
                  >
                    {currentTip.action}
                  </Button>
                </div>
              </div>
              
              {/* Progress dots */}
              <div className="flex justify-center gap-2 mt-5 pt-4 border-t">
                {tips.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTipIndex(index)}
                    className={`h-2.5 rounded-full transition-all hover:scale-110 ${
                      index === currentTipIndex
                        ? `bg-gradient-to-r ${currentTip.gradient} w-8 shadow-sm`
                        : "bg-muted hover:bg-muted-foreground/30 w-2.5"
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
