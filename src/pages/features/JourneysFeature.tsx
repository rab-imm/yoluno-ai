import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { useNavigate } from "react-router-dom";
import { Heart, Trophy, Star } from "lucide-react";

const JourneysFeature = () => {
  const navigate = useNavigate();

  const journeys = [
    {
      title: "Confidence Builder",
      description: "Daily affirmations paired with age-appropriate challenges that boost self-esteem and courage.",
      mission: "Today's Mission: Say something kind about yourself in the mirror and share it with Paliyo!"
    },
    {
      title: "Kindness Quest",
      description: "Empathy prompts with sibling-friendly twists that turn sharing and caring into adventures.",
      mission: "Today's Mission: Help a sibling or friend with something they find tricky—then celebrate together!"
    },
    {
      title: "Routine Hero",
      description: "Transform bedtime or homework flows into heroic quests with rewards and streak tracking.",
      mission: "Today's Mission: Complete your bedtime routine 10 minutes early and earn a bonus star!"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 bg-gradient-to-br from-pink-50 to-amber-50 dark:from-pink-950/20 dark:to-amber-950/20">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Turn Everyday Habits into Epic Quests
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Brushing teeth? A dragon-defying mission. Sharing toys? A teamwork triumph. Paliyo's journeys make growth fun, trackable, and oh-so-rewarding.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="text-lg px-8 py-6"
          >
            <Heart className="mr-2 h-5 w-5" />
            Build a Journey: Start Free & Customize
          </Button>
        </div>
      </section>

      {/* Key Journeys Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Journeys</h2>
          <Accordion type="single" collapsible className="space-y-4">
            {journeys.map((journey, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-xl font-bold hover:no-underline">
                  {journey.title}
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4">
                  <p className="text-muted-foreground">{journey.description}</p>
                  <Card className="p-4 bg-gradient-to-r from-pink-50 to-amber-50 dark:from-pink-950/20 dark:to-amber-950/20">
                    <p className="font-semibold mb-2">Sample Mission:</p>
                    <p className="text-sm">{journey.mission}</p>
                  </Card>
                  <Button variant="outline" onClick={() => navigate("/auth")}>
                    Start This Quest Free
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Parent Tools Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Parent Dashboard Tools</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <Card className="p-6">
                <Trophy className="h-8 w-8 text-amber-500 mb-3" />
                <h3 className="text-xl font-bold mb-3">Customize Missions</h3>
                <p className="text-muted-foreground">
                  Adjust difficulty, frequency, and themes. Design journeys that fit your family's unique goals.
                </p>
              </Card>
              <Card className="p-6">
                <Star className="h-8 w-8 text-pink-500 mb-3" />
                <h3 className="text-xl font-bold mb-3">Streak Tracking</h3>
                <p className="text-muted-foreground">
                  Watch your child's 7-day win rate climb! Get insights on what's working and nudge reminders for consistency.
                </p>
              </Card>
              <Card className="p-6">
                <Heart className="h-8 w-8 text-red-500 mb-3" />
                <h3 className="text-xl font-bold mb-3">Celebration Moments</h3>
                <p className="text-muted-foreground">
                  Automatic notifications when milestones are hit. Virtual high-fives from Paliyo, real hugs from you!
                </p>
              </Card>
            </div>
            <Card className="p-8 bg-gradient-to-br from-pink-100 to-amber-100 dark:from-pink-900/20 dark:to-amber-900/20">
              <p className="text-center text-muted-foreground mb-4">Interactive Dashboard Preview</p>
              <div className="space-y-4">
                <div className="h-4 bg-gradient-to-r from-pink-300 to-amber-300 rounded-full" style={{ width: '85%' }}></div>
                <p className="text-sm font-semibold text-center">Average Completion Rate: 85%</p>
                <p className="text-xs text-center text-muted-foreground">Your child is crushing their kindness goals!</p>
              </div>
              <Button className="w-full mt-6" onClick={() => navigate("/auth")}>
                View Full Dashboard: Free Trial
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-8 bg-gradient-to-r from-pink-50 to-amber-50 dark:from-pink-950/20 dark:to-amber-950/20">
            <h3 className="text-2xl font-bold mb-4">Progress Stats</h3>
            <p className="text-lg text-muted-foreground mb-6">
              Families using Journeys report an average 85% mission completion rate and measurable improvements in target habits within 2 weeks.
            </p>
            <Button size="lg" onClick={() => navigate("/auth")}>
              Build Your First Journey Free
            </Button>
          </Card>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-pink-600 to-amber-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your First Journey Today</h2>
          <p className="text-lg mb-6 opacity-90">
            Transform daily routines into celebrated wins—all within your free trial.
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
            Build Your First Journey Free
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default JourneysFeature;
