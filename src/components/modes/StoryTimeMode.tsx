import { ReactNode } from "react";
import { useMode } from "@/contexts/ModeContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface StoryTimeModeProps {
  children: ReactNode;
}

export function StoryTimeMode({ children }: StoryTimeModeProps) {
  const { mode } = useMode();
  const isMobile = useIsMobile();

  if (isMobile && mode !== "story") return null;

  return (
    <div 
      className={`${isMobile ? "pb-24" : ""} transition-all duration-500 animate-fade-in`}
      style={{
        background: isMobile 
          ? "linear-gradient(180deg, hsl(var(--story-bg)) 0%, hsl(var(--background)) 100%)"
          : "transparent"
      }}
    >
      {children}
    </div>
  );
}
