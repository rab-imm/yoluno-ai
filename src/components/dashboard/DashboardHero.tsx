import { Button } from "@/components/ui/button";
import { Sparkles, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboardGreeting } from "@/hooks/dashboard/useDashboardGreeting";
import heroBackground from "@/assets/dashboard-hero-bg.jpg";

export function DashboardHero() {
  const navigate = useNavigate();
  const { greeting, message, emoji } = useDashboardGreeting();

  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-2xl animate-fade-in"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-accent/90 backdrop-blur-sm" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 h-32 w-32 animate-pulse rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-10 right-10 h-40 w-40 animate-pulse rounded-full bg-white blur-3xl animation-delay-2000" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4 md:gap-6 md:flex-row md:items-center md:justify-between p-4 sm:p-6 md:p-8">
        <div className="flex-1 space-y-2 md:space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg animate-fade-in">
            {greeting}! {emoji}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/95 drop-shadow-md max-w-2xl animate-fade-in">
            {message}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-shrink-0 animate-fade-in">
          <Button
            size="lg"
            onClick={() => navigate("/kids")}
            className="bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all hover:scale-105 font-semibold min-h-[44px]"
          >
            <Rocket className="mr-2 h-5 w-5" />
            Launch Kids Mode
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/marketplace")}
            className="border-white/50 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm font-semibold hover:scale-105 transition-all min-h-[44px]"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Browse Journeys
          </Button>
        </div>
      </div>
    </div>
  );
}
