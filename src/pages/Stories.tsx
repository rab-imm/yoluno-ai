import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { useNavigate } from "react-router-dom";
import { BookOpen, Headphones, Sparkles, Heart, Library, Mic, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import storiesHeroBg from "@/assets/stories-hero-bg.jpg";

const StoryBuddy = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: "You Control the AI",
      description: "Choose themes, characters, values, and tone. AI creates a unique personalized story every time."
    },
    {
      icon: Headphones,
      title: "AI-Generated Narration",
      description: "Choose from soothing AI voices. Perfect for winding down or listening while reading."
    },
    {
      icon: Sparkles,
      title: "AI-Crafted Illustrations",
      description: "AI generates soft, age-appropriate visuals that match the story and spark imagination."
    },
    {
      icon: Mic,
      title: "Your Voice + AI",
      description: "Record a short greeting: 'Hi Sara, Daddy misses you' — then AI tells tonight's story."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={storiesHeroBg} 
            alt="Child reading magical storybook"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/70 to-background/80" />
        </div>
        <div className="container mx-auto max-w-6xl text-center space-y-5 relative z-10">
          <div className="inline-block p-3 bg-gradient-to-br from-[hsl(var(--imagination-primary))] to-[hsl(var(--imagination-secondary))] rounded-3xl mb-4">
            <BookOpen className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold bg-gradient-to-r from-[hsl(var(--imagination-primary))] to-[hsl(var(--imagination-secondary))] bg-clip-text text-transparent">
            AI-generated stories that bring bedtime to life — every night, from you.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            AI crafts personalized stories with your child's name, your values, and their world—narrated with gentle AI voices and illustrated with AI-generated visuals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg bg-gradient-to-r from-[hsl(var(--imagination-primary))] to-[hsl(var(--imagination-secondary))] hover:opacity-90">
              <Sparkles className="mr-2 h-5 w-5" />
              Create Tonight's Story
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              View Sample Stories
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="p-6 hover:shadow-md transition-shadow">
                <feature.icon className="h-12 w-12 text-[hsl(var(--imagination-primary))] mb-4" />
                <h3 className="text-xl md:text-2xl font-heading font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stay Close Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="container mx-auto max-w-4xl text-center space-y-5">
          <Heart className="h-12 w-12 text-accent mx-auto" />
          <h2 className="text-3xl md:text-4xl font-heading font-bold">Stay close, even away</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Traveling for work? Record a short greeting for your child. They'll hear your voice before every story, 
            making bedtime feel like you're right there with them.
          </p>
          <p className="text-lg text-muted-foreground italic">
            "Even when I travel, my daughter hears a story I made just for her. It feels like I'm still tucking her in."
          </p>
        </div>
      </section>

      {/* Library & Keepsakes */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl text-center space-y-5">
          <Library className="h-12 w-12 text-[hsl(var(--imagination-primary))] mx-auto" />
          <h2 className="text-3xl md:text-4xl font-heading font-bold">Library & Keepsakes</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Save stories to a family library. Replay favorites. Export to PDF or print a hardcover "Month of Stories" keepsake.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 pt-8">
            {["The Dragon Who Made Friends", "Sofia's Space Adventure", "Counting with Dinosaurs"].map((title, i) => (
              <Card key={i} className="p-6 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BookOpen className="h-12 w-12 text-primary" />
                </div>
                <p className="font-medium">{title}</p>
                <p className="text-sm text-muted-foreground mt-1">5 min read</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Note */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-success/5 to-[hsl(var(--imagination-primary))]/5">
        <div className="container mx-auto max-w-4xl text-center space-y-5">
          <Shield className="h-12 w-12 text-[hsl(var(--imagination-primary))] mx-auto" />
          <h2 className="text-2xl md:text-3xl font-heading font-bold">Safe by design</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            All story content is generated within your approved themes. No religion/politics/medical topics.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center space-y-5">
          <h2 className="text-3xl md:text-4xl font-heading font-bold">Make bedtime magical tonight</h2>
          <p className="text-xl text-muted-foreground">
            Start with 2 free stories. No credit card required.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg bg-gradient-to-r from-[hsl(var(--imagination-primary))] to-[hsl(var(--imagination-secondary))] hover:opacity-90">
            <Sparkles className="mr-2 h-5 w-5" />
            Create Tonight's Story
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StoryBuddy;
