import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { useNavigate } from "react-router-dom";
import { Target, Award, TrendingUp, Calendar, Heart, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import journeysHeroBg from "@/assets/journeys-hero-updated.jpg";
import journeyProgress from "@/assets/journey-progress.jpg";

const Journeys = () => {
  const navigate = useNavigate();

  const examples = [
    {
      title: "30 Days of Kindness",
      icon: "💚",
      description: "Daily missions: Say thank you, share a toy, help a sibling. Small acts, big hearts.",
      duration: "30 steps"
    },
    {
      title: "100 Steps to Multiplication",
      icon: "✖️",
      description: "One fact per day with playful drills. Mastery through consistency.",
      duration: "100 steps"
    },
    {
      title: "Reading Habit",
      icon: "📚",
      description: "10 minutes daily + bedtime story callback. Build a love of books.",
      duration: "10/30 steps"
    },
    {
      title: "Chores Made Cheerful",
      icon: "✨",
      description: "Simple, achievable tasks with praise. No guilt, just encouragement.",
      duration: "Custom"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={journeysHeroBg} 
            alt="Growth journey path"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/70 to-background/80" />
        </div>
        <div className="container mx-auto max-w-6xl text-center space-y-5 relative z-10">
          <div className="inline-block p-3 bg-gradient-to-br from-[hsl(var(--growth-primary))] to-[hsl(var(--growth-secondary))] rounded-3xl mb-4">
            <Target className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold bg-gradient-to-r from-[hsl(var(--growth-primary))] to-[hsl(var(--growth-secondary))] bg-clip-text text-transparent">
            AI helps your child grow—one personalized step at a time.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            From brushing teeth to mastering multiplication, AI generates personalized daily missions and celebrates progress—then reinforces it with AI-generated bedtime stories.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg bg-gradient-to-r from-[hsl(var(--growth-primary))] to-[hsl(var(--growth-secondary))] hover:opacity-90">
              <Target className="mr-2 h-5 w-5" />
              Start a Journey
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/marketplace")}>
              Browse Templates
            </Button>
          </div>
        </div>
      </section>

      {/* How Journeys Work */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-10">How Journeys Work</h2>
          <div className="grid md:grid-cols-5 gap-6">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-[hsl(var(--growth-primary))] text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">1</div>
              <h3 className="font-semibold mb-2">Choose a Goal</h3>
              <p className="text-sm text-muted-foreground">Kindness, reading, math, chores, gratitude...</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-[hsl(var(--growth-primary))] text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">2</div>
              <h3 className="font-semibold mb-2">Set Duration</h3>
              <p className="text-sm text-muted-foreground">10, 30, or 100 steps—your choice</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-[hsl(var(--growth-primary))] text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">3</div>
              <h3 className="font-semibold mb-2">AI-Generated Daily Mission</h3>
              <p className="text-sm text-muted-foreground">AI creates light, age-appropriate actions tailored to your child</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-[hsl(var(--growth-primary))] text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">4</div>
              <h3 className="font-semibold mb-2">AI-Powered Positive Reinforcement</h3>
              <p className="text-sm text-muted-foreground">AI generates personalized stickers, badges, and praise</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-[hsl(var(--growth-primary))] text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">5</div>
              <h3 className="font-semibold mb-2">AI Story Reinforcement</h3>
              <p className="text-sm text-muted-foreground">AI-generated bedtime stories echo the day's mission</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Example Journeys */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-10">Example Journeys</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {examples.map((example) => (
              <Card key={example.title} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{example.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-heading font-semibold mb-2">{example.title}</h3>
                    <p className="text-muted-foreground mb-3">{example.description}</p>
                    <div className="flex items-center gap-2 text-sm text-[hsl(var(--growth-primary))] font-medium">
                      <Calendar className="h-4 w-4" />
                      {example.duration}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Parent Dashboard Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={journeyProgress} 
            alt="Journey progress tracking"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-10">Parent Dashboard</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-[hsl(var(--growth-primary))] mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Progress Charts & Streaks</h3>
              <p className="text-sm text-muted-foreground">See daily completion and streaks at a glance</p>
            </Card>
            <Card className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-[hsl(var(--growth-primary))] mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Mission History</h3>
              <p className="text-sm text-muted-foreground">Review past missions and reflections</p>
            </Card>
            <Card className="p-6 text-center">
              <Award className="h-12 w-12 text-[hsl(var(--growth-primary))] mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Adjust Anytime</h3>
              <p className="text-sm text-muted-foreground">Skip steps, pause, or modify the journey</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Safety Note */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-success/5 to-[hsl(var(--growth-primary))]/5">
        <div className="container mx-auto max-w-4xl text-center space-y-5">
          <Heart className="h-12 w-12 text-[hsl(var(--growth-primary))] mx-auto" />
          <h2 className="text-2xl md:text-3xl font-heading font-bold">AI uses only positive language</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            No negative framing, guilt, or sensitive tracking. AI missions celebrate effort and progress, not perfection.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center space-y-5">
          <h2 className="text-3xl md:text-4xl font-heading font-bold">Start your first journey today</h2>
          <p className="text-xl text-muted-foreground">
            1 active journey included in the free plan. Unlock more with paid plans.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg bg-gradient-to-r from-[hsl(var(--growth-primary))] to-[hsl(var(--growth-secondary))] hover:opacity-90">
            <Target className="mr-2 h-5 w-5" />
            Start a Journey
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Journeys;
