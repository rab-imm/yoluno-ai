import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { useNavigate } from "react-router-dom";
import { BookOpen, Headphones, Sparkles, Heart, Library, Mic } from "lucide-react";
import { Card } from "@/components/ui/card";

const StoryBuddy = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: "Personalized Every Time",
      description: "Stories crafted with your child's name, their favorite characters, and your family values woven throughout."
    },
    {
      icon: Headphones,
      title: "Beautiful Narration",
      description: "Gentle, child-friendly voices bring each story to life with warmth and emotion."
    },
    {
      icon: Sparkles,
      title: "AI-Crafted Illustrations",
      description: "Every story comes with beautiful storybook-style artwork that captures the magic."
    },
    {
      icon: Mic,
      title: "Your Voice Intro",
      description: "Record a short greeting: 'Hi Sara, Daddy misses you — here's tonight's story.'"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-br from-[hsl(var(--story-magic-light))] via-background to-accent/5">
        <div className="container mx-auto max-w-6xl text-center space-y-6">
          <div className="inline-block p-4 bg-gradient-to-br from-[hsl(var(--story-magic))] to-[hsl(var(--story-bedtime))] rounded-3xl mb-4 animate-float">
            <BookOpen className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[hsl(var(--story-magic))] to-[hsl(var(--story-bedtime))] bg-clip-text text-transparent">
            Bring bedtime to life
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every night, from you. Your child's name, their favorite toy, your values — woven into a personalized story. 
            Narrated with gentle voices, brought to life with illustrations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg bg-gradient-to-r from-[hsl(var(--story-magic))] to-[hsl(var(--story-bedtime))] hover:opacity-90">
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
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="p-8 hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 text-[hsl(var(--story-magic))] mb-4" />
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stay Close Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <Heart className="h-16 w-16 text-accent mx-auto animate-pulse-glow" />
          <h2 className="text-4xl font-bold">Stay close, even away</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Traveling for work? Record a short greeting for your child. They'll hear your voice before every story, 
            making bedtime feel like you're right there with them.
          </p>
          <p className="text-lg text-muted-foreground italic">
            "Even when I travel, my daughter hears a story I made just for her. It feels like I'm still tucking her in."
          </p>
        </div>
      </section>

      {/* Story Library */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl text-center space-y-6">
          <Library className="h-16 w-16 text-primary mx-auto" />
          <h2 className="text-4xl font-bold">Your Family's Story Library</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every story is saved. Replay favorites, print them as bedtime books, or create a beautiful hardcover keepsake 
            of your child's adventures.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 pt-8">
            {["The Dragon Who Made Friends", "Sofia's Space Adventure", "Counting with Dinosaurs"].map((title, i) => (
              <Card key={i} className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
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

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-child-primary/10 to-child-secondary/10">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-4xl font-bold">Make bedtime magical tonight</h2>
          <p className="text-xl text-muted-foreground">
            Start with 2 free stories. No credit card required.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg">
            <Sparkles className="mr-2 h-5 w-5" />
            Create Your First Story
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StoryBuddy;
