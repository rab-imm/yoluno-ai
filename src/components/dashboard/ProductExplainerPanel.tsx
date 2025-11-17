import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Lightbulb, Target, Heart, ChevronDown, ChevronUp, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useChildProfiles } from "@/hooks/dashboard/useChildProfiles";
import storiesIllustration from "@/assets/stories-mode-illustration.png";
import learningIllustration from "@/assets/learning-mode-illustration.png";
import journeysIllustration from "@/assets/journeys-mode-illustration.png";
import familyIllustration from "@/assets/family-mode-illustration.png";

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
    illustration: storiesIllustration,
    requiresChild: true,
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
    illustration: learningIllustration,
    requiresChild: true,
  },
  {
    icon: Target,
    title: "Journeys Mode",
    emoji: "🎯",
    description: "Build character with daily missions and habit tracking",
    gradient: "from-blue-500 to-cyan-500",
    action: "Browse Journeys",
    route: "/marketplace",
    stat: "50+ journey templates",
    illustration: journeysIllustration,
    requiresChild: false,
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
    illustration: familyIllustration,
    requiresChild: false,
  },
];

export function ProductExplainerPanel() {
  const navigate = useNavigate();
  const { children } = useChildProfiles();
  const firstChildId = children[0]?.id;
  
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

  const handleNavigate = (mode: typeof modes[0]) => {
    if (mode.requiresChild && firstChildId) {
      navigate(`${mode.route}/${firstChildId}`);
    } else {
      navigate(mode.route);
    }
  };

  if (isDismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-card to-card/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">What You Can Do with Yoluno</h3>
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
                    className="group relative overflow-hidden rounded-xl border-2 bg-card p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/30"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                    
                    <div className="relative space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`rounded-xl bg-gradient-to-br ${mode.gradient} p-3 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                              <mode.icon className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg flex items-center gap-2">
                                {mode.emoji} {mode.title}
                                {mode.isPremium && <Badge variant="secondary" className="text-xs">Premium</Badge>}
                              </h4>
                              <p className="text-xs text-muted-foreground">{mode.stat}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                          <img 
                            src={mode.illustration} 
                            alt={mode.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed">{mode.description}</p>
                      
                      <Button
                        size="sm"
                        onClick={() => handleNavigate(mode)}
                        disabled={mode.requiresChild && !firstChildId}
                        className={`w-full bg-gradient-to-r ${mode.gradient} hover:opacity-90 text-white font-semibold shadow-md hover:shadow-lg transition-all`}
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
