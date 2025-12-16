import { Card } from "@/components/ui/card";
import { PlayCircle } from "lucide-react";
import videoPlaceholder from "@/assets/video-demo-placeholder.jpg";

interface VideoEmbedProps {
  title?: string;
  description?: string;
  placeholderText?: string;
}

export const VideoEmbed = ({ 
  title = "See Yoluno AI in Action",
  description = "Watch how parents create safe, personalized experiences for their children",
  placeholderText = "Demo video coming soon"
}: VideoEmbedProps) => {
  return (
    <div className="space-y-3">
      {title && <h3 className="text-xl md:text-2xl font-heading font-bold text-center">{title}</h3>}
      {description && <p className="text-muted-foreground text-center max-w-2xl mx-auto">{description}</p>}
      
      <Card className="aspect-video w-full max-w-4xl mx-auto bg-gradient-to-br from-primary/3 to-accent/3 flex items-center justify-center border-2 border-dashed border-border relative overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors">
        <img 
          src={videoPlaceholder} 
          alt="Parent and child using Yoluno AI together"
          className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-opacity"
        />
        <div className="text-center space-y-4 z-10">
          <PlayCircle className="h-20 w-20 text-primary mx-auto group-hover:scale-110 transition-transform drop-shadow-lg" />
          <p className="text-lg font-medium text-foreground drop-shadow-md">{placeholderText}</p>
        </div>
      </Card>
    </div>
  );
};
