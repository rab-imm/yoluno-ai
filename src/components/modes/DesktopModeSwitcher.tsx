import { MessageCircle, Sparkles } from "lucide-react";
import { useMode } from "@/contexts/ModeContext";
import { useIsMobile } from "@/hooks/use-mobile";

export function DesktopModeSwitcher() {
  const { mode, setMode } = useMode();
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <div className="flex gap-3 mb-6">
      <button
        onClick={() => setMode("learning")}
        className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-2xl transition-all duration-300 ${
          mode === "learning"
            ? "bg-gradient-to-br from-[hsl(var(--learning-primary))] to-[hsl(var(--learning-secondary))] text-white shadow-xl scale-105"
            : "bg-muted/50 text-muted-foreground hover:bg-muted hover:scale-102"
        }`}
      >
        <MessageCircle className={`w-7 h-7 ${mode === "learning" ? "animate-bounce-gentle" : ""}`} />
        <div className="text-left">
          <div className="text-lg font-bold">Learning Mode</div>
          <div className="text-sm opacity-90">Chat about topics</div>
        </div>
      </button>
      
      <button
        onClick={() => setMode("story")}
        className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-2xl transition-all duration-300 ${
          mode === "story"
            ? "bg-gradient-to-br from-[hsl(var(--story-primary))] to-[hsl(var(--story-secondary))] text-white shadow-xl scale-105"
            : "bg-muted/50 text-muted-foreground hover:bg-muted hover:scale-102"
        }`}
      >
        <Sparkles className={`w-7 h-7 ${mode === "story" ? "animate-pulse-glow" : ""}`} />
        <div className="text-left">
          <div className="text-lg font-bold">Story Time</div>
          <div className="text-sm opacity-90">Create magical stories</div>
        </div>
      </button>
    </div>
  );
}
