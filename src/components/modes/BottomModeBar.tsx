import { MessageCircle, Sparkles } from "lucide-react";
import { useMode } from "@/contexts/ModeContext";
import { useIsMobile } from "@/hooks/use-mobile";

export function BottomModeBar() {
  const { mode, setMode } = useMode();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t pb-safe">
      <div className="grid grid-cols-2 gap-2 p-3 pb-safe">
        <button
          onClick={() => setMode("learning")}
          className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl transition-all duration-300 min-h-[56px] ${
            mode === "learning"
              ? "bg-gradient-to-br from-[hsl(var(--learning-primary))] to-[hsl(var(--learning-secondary))] text-white scale-105 shadow-lg"
              : "bg-muted/50 text-muted-foreground hover:bg-muted active:scale-95"
          }`}
        >
          <MessageCircle className={`w-6 h-6 ${mode === "learning" ? "animate-bounce-gentle" : ""}`} />
          <span className="text-sm font-semibold">Learning</span>
        </button>
        
        <button
          onClick={() => setMode("story")}
          className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl transition-all duration-300 min-h-[56px] ${
            mode === "story"
              ? "bg-gradient-to-br from-[hsl(var(--story-primary))] to-[hsl(var(--story-secondary))] text-white scale-105 shadow-lg"
              : "bg-muted/50 text-muted-foreground hover:bg-muted active:scale-95"
          }`}
        >
          <Sparkles className={`w-6 h-6 ${mode === "story" ? "animate-pulse-glow" : ""}`} />
          <span className="text-sm font-semibold">Story Time</span>
        </button>
      </div>
    </div>
  );
}
