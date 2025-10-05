import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Lightbulb, Target, Heart, ChevronDown, ChevronUp, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const modes = [
  {
    icon: BookOpen,
    title: "Stories Mode",
    emoji: "🌙",
    description: "Create personalized bedtime tales where your child is the hero",
    gradient: "from-purple-500 to-pink-500",
    action: "Create Your First Story",
    route: "/dashboard/stories",
    stat: "10,000+ stories created",
  },
  {
    icon: Lightbulb,
    title: "Learning Mode",
    emoji: "🌟",
    description: "Answer endless 'why' questions safely from curated topic packs",
    gradient: "from-amber-500 to-orange-500",
    action: "Manage Topics",
    route: "/dashboard/topics",
    stat: "500+ topics available",
  },
  {
    icon: Target,
    title: "Journeys Mode",
    emoji: "🎯",
    description: "Build character with daily missions and habit tracking",
    gradient: "from-blue-500 to-cyan-500",
    action: "Start New Journey",
    route: "/dashboard/journeys",
    stat: "50+ journey templates",
  },
  {
    icon: Heart,
    title: "Family Mode",
    emoji: "🏠",
    description: "Keep heritage alive by uploading family stories and photos",
    gradient: "from-emerald-500 to-teal-500",
    action: "Explore Family History",
    route: "/dashboard/family",
    stat: "Premium feature",
    isPremium: true,
  },
];

export function ProductExplainerPanel() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("productExplainerCollapsed");
    return saved === "true";
  });

  const [isDismissed, setIsDismissed] = useState(() => {
    const saved = localStorage.getItem("productExplainerDismissed");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("productExplainerCollapsed", isCollapsed.toString());
  }, [isCollapsed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("productExplainerDismissed", "true");
  };

  if (isDismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">What You Can Do with Paliyo</h3>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hover:bg-muted"
              >
                {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {modes.map((mode, index) => (
                  <motion.div
                    key={mode.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative overflow-hidden rounded-xl border bg-card p-5 hover:shadow-lg transition-shadow"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                    
                    <div className="relative space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`rounded-lg bg-gradient-to-br ${mode.gradient} p-2 text-white shadow-md`}>
                            <mode.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold flex items-center gap-2">
                              {mode.emoji} {mode.title}
                              {mode.isPremium && <Badge variant="secondary" className="text-xs">Premium</Badge>}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">{mode.stat}</p>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{mode.description}</p>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(mode.route)}
                        className="w-full hover:bg-muted"
                      >
                        {mode.action}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
