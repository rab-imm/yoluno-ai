import { Card } from "@/components/ui/card";
import { PlayCircle } from "lucide-react";

interface VideoEmbedProps {
  title?: string;
  description?: string;
  placeholderText?: string;
}

export const VideoEmbed = ({ 
  title = "See Safe AI Buddy in Action",
  description = "Watch how parents create safe, personalized experiences for their children",
  placeholderText = "Demo video coming soon"
}: VideoEmbedProps) => {
  return (
    <div className="space-y-4">
      {title && <h3 className="text-2xl font-bold text-center">{title}</h3>}
      {description && <p className="text-muted-foreground text-center max-w-2xl mx-auto">{description}</p>}
      
      <Card className="aspect-video w-full max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center border-2 border-dashed border-border relative overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors">
        <div className="text-center space-y-4 z-10">
          <PlayCircle className="h-20 w-20 text-primary mx-auto group-hover:scale-110 transition-transform" />
          <p className="text-lg font-medium text-muted-foreground">{placeholderText}</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Card>
    </div>
  );
};
