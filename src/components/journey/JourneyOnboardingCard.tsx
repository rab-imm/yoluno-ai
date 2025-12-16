import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Sparkles, TrendingUp } from "lucide-react";

interface JourneyOnboardingCardProps {
  onStartJourney: () => void;
  onBrowseMarketplace: () => void;
}

export function JourneyOnboardingCard({ onStartJourney, onBrowseMarketplace }: JourneyOnboardingCardProps) {
  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary rounded-full">
            <Target className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle>New: Goal Journeys! 🎯</CardTitle>
            <CardDescription>
              Help your child build positive habits, one fun step at a time
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Create personalized goal journeys with daily missions that teach kindness, reading, math, healthy routines, and more. 
          Track progress, earn badges, and even have habits woven into bedtime stories!
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={onStartJourney} className="w-full">
            <Sparkles className="h-4 w-4 mr-2" />
            Start Journey
          </Button>
          <Button variant="outline" onClick={onBrowseMarketplace} className="w-full">
            <TrendingUp className="h-4 w-4 mr-2" />
            Browse Templates
          </Button>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <span className="font-semibold">✓</span>
            <span>Daily missions</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">✓</span>
            <span>Progress tracking</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">✓</span>
            <span>Story reinforcement</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
