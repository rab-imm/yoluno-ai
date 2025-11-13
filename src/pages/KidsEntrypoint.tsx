import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Play, Heart } from "lucide-react";

export default function KidsEntrypoint() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-child-primary/20 via-child-secondary/20 to-background overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
              y: [null, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            <Sparkles className="w-8 h-8 text-child-primary" />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <motion.div
          className="text-center space-y-8 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo/Mascot Area */}
          <motion.div
            className="mx-auto w-32 h-32 rounded-full bg-gradient-to-br from-child-primary to-child-secondary flex items-center justify-center shadow-2xl"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Heart className="w-16 h-16 text-white" fill="currentColor" />
          </motion.div>

          {/* Welcome Text */}
          <div className="space-y-4">
            <motion.h1
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-child-primary via-child-secondary to-child-primary bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 100%",
              }}
            >
              Welcome to Paliyo!
            </motion.h1>
            
            <p className="text-2xl md:text-3xl text-foreground font-medium">
              Your AI Friend is Waiting 🌟
            </p>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
              Chat, learn, and create amazing stories together!
            </p>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <Button
              onClick={() => navigate("/play/select")}
              size="lg"
              className="h-20 px-12 text-2xl font-bold bg-gradient-to-r from-child-primary to-child-secondary hover:scale-110 transition-all shadow-2xl hover:shadow-child-primary/50"
            >
              <Play className="w-8 h-8 mr-3" fill="currentColor" />
              Let's Play!
            </Button>
          </motion.div>

          {/* Fun Facts */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { emoji: "📚", text: "Learn New Things" },
              { emoji: "🎨", text: "Create Stories" },
              { emoji: "🎮", text: "Fun Missions" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="p-4 rounded-2xl bg-card/50 backdrop-blur-sm border-2 border-border"
                whileHover={{ scale: 1.05, borderColor: "hsl(var(--child-primary))" }}
              >
                <div className="text-4xl mb-2">{item.emoji}</div>
                <p className="text-lg font-semibold text-foreground">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Parent Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="pt-8"
          >
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              Are you a parent? Click here
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
