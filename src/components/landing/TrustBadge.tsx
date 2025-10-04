import { LucideIcon } from "lucide-react";

interface TrustBadgeProps {
  icon: LucideIcon;
  text: string;
}

export const TrustBadge = ({ icon: Icon, text }: TrustBadgeProps) => {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full border border-border/50">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-sm font-medium text-foreground">{text}</span>
    </div>
  );
};
