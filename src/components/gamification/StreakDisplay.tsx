import { Card } from "@/components/ui/card";
import { Flame } from "lucide-react";

interface StreakDisplayProps {
  streakDays: number;
  childName: string;
}

export function StreakDisplay({ streakDays, childName }: StreakDisplayProps) {
  const getStreakMessage = () => {
    if (streakDays === 0) return "Start your streak today!";
    if (streakDays === 1) return "Great start!";
    if (streakDays < 7) return "Keep it going!";
    if (streakDays < 30) return "Awesome streak!";
    return "Incredible dedication!";
  };

  const getFlameColor = () => {
    if (streakDays === 0) return "text-gray-400";
    if (streakDays < 7) return "text-orange-500";
    if (streakDays < 30) return "text-red-500";
    return "text-purple-500";
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-orange-200 dark:border-orange-800">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Flame className={`w-10 h-10 ${getFlameColor()}`} />
          {streakDays > 0 && (
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-orange-500">
              {streakDays}
            </div>
          )}
        </div>
        <div>
          <p className="font-bold text-lg">{streakDays} Day Streak</p>
          <p className="text-sm text-muted-foreground">{getStreakMessage()}</p>
        </div>
      </div>
    </Card>
  );
}
