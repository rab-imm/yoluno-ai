import { Sparkles } from "lucide-react";

interface StoryModeHeaderProps {
  title: string;
  description?: string;
}

export function StoryModeHeader({ title, description }: StoryModeHeaderProps) {
  return (
    <div className="text-center mb-6 animate-fade-in">
      <div className="inline-flex items-center gap-2 mb-2">
        <Sparkles 
          className="w-8 h-8 animate-pulse-glow" 
          style={{ color: "hsl(var(--story-primary))" }}
        />
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[hsl(var(--story-primary))] to-[hsl(var(--story-secondary))] bg-clip-text text-transparent">
          {title}
        </h2>
        <Sparkles 
          className="w-8 h-8 animate-pulse-glow" 
          style={{ color: "hsl(var(--story-secondary))", animationDelay: "0.5s" }}
        />
      </div>
      {description && (
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
