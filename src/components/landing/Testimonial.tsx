import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  avatarFallback: string;
  avatarImage?: string;
}

export const Testimonial = ({ quote, author, role, avatarFallback, avatarImage }: TestimonialProps) => {
  return (
    <Card className="p-6 bg-card hover:shadow-md transition-shadow relative">
      <Quote className="h-8 w-8 text-accent/20 absolute top-4 right-4" />
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="h-12 w-12 border-2 border-accent/20">
          {avatarImage && <AvatarImage src={avatarImage} alt={author} />}
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-foreground">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
      <p className="text-muted-foreground italic leading-relaxed">"{quote}"</p>
    </Card>
  );
};
