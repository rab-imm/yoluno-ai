import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Testimonial } from "@/components/landing/Testimonial";
import { TrustBadge } from "@/components/landing/TrustBadge";
import { VideoEmbed } from "@/components/landing/VideoEmbed";
import { useNavigate } from "react-router-dom";
import { Shield, Heart, Lock, Sparkles, BookOpen, Brain } from "lucide-react";
import { Card } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6 mb-12">
            <div className="inline-block p-4 bg-gradient-to-br from-primary to-accent rounded-3xl mb-4 animate-float">
              <Shield className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              One AI Buddy. Safe, personal, and parent-approved.
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Bedtime stories, learning adventures, and curiosity — all within the boundaries <em>you</em> set.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" onClick={() => navigate("/auth")} className="text-lg bg-gradient-to-r from-[hsl(var(--story-magic))] to-[hsl(var(--story-bedtime))] hover:opacity-90">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Free – Create Your First Story
              </Button>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 pt-6">
              <TrustBadge icon={Lock} text="Locked Sandbox" />
              <TrustBadge icon={Heart} text="Parent-Curated" />
              <TrustBadge icon={Shield} text="Age-Appropriate" />
            </div>
          </div>
        </div>
      </section>

      {/* Emotional Hook */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Because bedtime isn't just a story.<br />It's a connection.
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="inline-block p-4 bg-gradient-to-br from-[hsl(var(--story-magic))] to-[hsl(var(--story-bedtime))] rounded-2xl mb-4">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Bedtime Stories</h3>
              <p className="text-muted-foreground">Magical, nightly tales with your child as the hero.</p>
            </Card>
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="inline-block p-4 bg-gradient-to-br from-[hsl(var(--learning-primary))] to-[hsl(var(--learning-secondary))] rounded-2xl mb-4">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Safe Learning</h3>
              <p className="text-muted-foreground">Daytime discovery in parent-approved topics.</p>
            </Card>
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="inline-block p-4 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Parent Control</h3>
              <p className="text-muted-foreground">You decide what Buddy can talk about.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Video */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <VideoEmbed 
            title="See Safe AI Buddy in Action"
            description="Watch how parents create personalized bedtime stories and set up safe learning environments"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">1</div>
              <h3 className="font-semibold text-lg mb-2">Choose</h3>
              <p className="text-muted-foreground">Pick a theme, characters, and values.</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">2</div>
              <h3 className="font-semibold text-lg mb-2">Create</h3>
              <p className="text-muted-foreground">Buddy builds a safe story or learning adventure.</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">3</div>
              <h3 className="font-semibold text-lg mb-2">Connect</h3>
              <p className="text-muted-foreground">Your child listens, learns, and dreams.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">What Parents Are Saying</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Testimonial
              quote="Even when I travel, my daughter hears a story I made just for her. It feels like I'm still tucking her in."
              author="Michael Chen"
              role="Parent of 2, San Francisco"
              avatarFallback="MC"
            />
            <Testimonial
              quote="Finally, an AI I trust with my son. He learns, but never wanders into unsafe answers."
              author="Sarah Martinez"
              role="Homeschooling Parent, Austin"
              avatarFallback="SM"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-child-primary/10 to-child-secondary/10">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-4xl font-bold">Make bedtime magical. Make learning safe. Start tonight.</h2>
          <p className="text-xl text-muted-foreground">
            Start with 2 free stories. No credit card required.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg">
            <Sparkles className="mr-2 h-5 w-5" />
            Start Free Today
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
