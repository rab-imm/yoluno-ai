import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { useNavigate } from "react-router-dom";
import { Sparkles, Volume2 } from "lucide-react";
import storyStep1 from "@/assets/story-step-1-setup.jpg";
import storyStep2 from "@/assets/story-step-2-interaction.jpg";
import storyStep3 from "@/assets/story-step-3-narration.jpg";

const StoriesFeature = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bedtime, Reimagined
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Personalized Tales That Last a Lifetime. Imagine your child as the star—slaying dragons or solving mysteries—all in a voice that feels like home.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="text-lg px-8 py-6"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Craft Your First Story: Start Free
          </Button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Parent Sets the Scene",
                description: "Choose themes like 'Beach adventure with sea creatures' or let Yoluno suggest from your child's favorites.",
                cta: "Set Your Scene",
                image: storyStep1
              },
              {
                step: "2",
                title: "Child Co-Creates",
                description: "During the tale, Yoluno pauses: 'What happens next?' Your child's imagination drives the story forward.",
                cta: "See Interaction",
                image: storyStep2
              },
              {
                step: "3",
                title: "Magic Unfolds",
                description: "5-10 min narrated audio with evolving illustrations. Save, replay, or export as a keepsake.",
                cta: "See It in Action—Free Demo",
                image: storyStep3
              }
            ].map((step) => (
              <Card key={step.step} className="p-6 text-center hover:shadow-lg transition-all overflow-hidden group">
                <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4">
                  <img 
                    src={step.image} 
                    alt={`${step.title} interface`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground mb-4">{step.description}</p>
                <Button variant="link" onClick={() => navigate("/auth")}>
                  {step.cta} →
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Experience the Magic</h2>
          <Card className="p-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Volume2 className="h-8 w-8 text-purple-500" />
              <p className="text-lg font-semibold">Sample Story: "The Lost Treasure of Tidytown"</p>
            </div>
            <p className="text-muted-foreground mb-6">
              Listen to how Yoluno weaves your child's name and choices into an engaging bedtime adventure.
            </p>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-8 mb-6">
              <p className="text-sm italic">Audio player would be embedded here</p>
            </div>
            <Button size="lg" onClick={() => navigate("/auth")}>
              Loved This Tale? Unlock Unlimited Stories Free
            </Button>
          </Card>
        </div>
      </section>

      {/* Parent Perks Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Parent Perks</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-3">Preview & Customize</h3>
                <p className="text-muted-foreground">
                  Review story drafts before bedtime. Add your voiceover intro for a personal touch.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-3">Emotional Insights</h3>
                <p className="text-muted-foreground">
                  Detailed logs capture emotional tones: "Giggles detected!" or "Thoughtful moment noted."
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-3">Export as Keepsakes</h3>
                <p className="text-muted-foreground">
                  Premium: Turn favorite stories into printable books with illustrations.
                </p>
              </Card>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-8 aspect-video flex items-center justify-center">
              <p className="text-muted-foreground">Dashboard screenshot preview</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Button size="lg" onClick={() => navigate("/pricing")}>
              Add Voiceovers: Upgrade Now
            </Button>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Unlock Stories in Your Free Trial</h2>
          <p className="text-lg mb-6 opacity-90">
            Start crafting personalized bedtime magic tonight—no credit card needed.
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
            Start Free Trial
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StoriesFeature;
