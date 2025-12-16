import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Sparkles } from "lucide-react";

interface Badge {
  badge_name: string;
  earned_at: string;
}

interface BadgeDisplayProps {
  childId: string;
  childName: string;
}

export function BadgeDisplay({ childId, childName }: BadgeDisplayProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBadges();
  }, [childId]);

  const loadBadges = async () => {
    const { data } = await supabase
      .from("child_badges")
      .select("badge_name, earned_at")
      .eq("child_id", childId)
      .order("earned_at", { ascending: false });

    if (data) {
      setBadges(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Card className="p-4 animate-pulse">
        <div className="h-4 bg-muted rounded w-1/3 mb-3"></div>
        <div className="flex gap-2">
          <div className="h-12 w-12 bg-muted rounded-lg"></div>
          <div className="h-12 w-12 bg-muted rounded-lg"></div>
        </div>
      </Card>
    );
  }

  if (badges.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-r from-child-primary/5 to-child-secondary/5">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="w-5 h-5 text-child-primary" />
          <h3 className="font-semibold">Achievements</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Keep chatting to earn your first badge! 🌟
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-child-primary/5 to-child-secondary/5">
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="w-5 h-5 text-child-primary" />
        <h3 className="font-semibold">{childName}'s Achievements</h3>
      </div>
      <div className="flex flex-wrap gap-3">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            title={`Earned ${new Date(badge.earned_at).toLocaleDateString()}`}
          >
            <div className="text-3xl">{badge.badge_name.split(" ").pop()}</div>
            <span className="text-xs font-medium text-center">
              {badge.badge_name.replace(/\s*[^\w\s]+\s*$/, "")}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
