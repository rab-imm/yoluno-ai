import { ReactNode } from "react";
import { useMode } from "@/contexts/ModeContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface StoryTimeModeProps {
  children: ReactNode;
}

export function StoryTimeMode({ children }: StoryTimeModeProps) {
  const isMobile = useIsMobile();

  return (
    <div 
      className={`${isMobile ? "pb-24 min-h-[80vh]" : ""} transition-all duration-500 animate-fade-in`}
      style={{
        background: isMobile 
          ? "linear-gradient(180deg, hsl(var(--story-bg)) 0%, hsl(var(--background)) 100%)"
          : "transparent"
      }}
    >
      <div className={isMobile ? "px-1" : ""}>
        {children}
      </div>
    </div>
  );
}
