import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { useNavigate } from "react-router-dom";
import { Heart, Shield, Users, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Shield,
      title: "Safety by Default",
      description: "We build with locked sandbox AI. No internet, no surprises, complete parent control from day one."
    },
    {
      icon: Heart,
      title: "Transparent Design",
      description: "Every answer cites its source. Every story shows its origin. Parents see everything, always."
    },
    {
      icon: Users,
      title: "Family-First Approach",
      description: "No ads, no data resale, no dark patterns. We make money from subscriptions, not from your privacy."
    },
    {
      icon: Sparkles,
      title: "Magical Experiences",
      description: "Safety doesn't mean boring. We create wonder, curiosity, and connection through technology."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-child-primary/5">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-block p-4 bg-gradient-to-br from-primary to-child-primary rounded-3xl mb-4 animate-float">
            <Heart className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold">Why we built Safe AI Buddy</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We're parents too. We saw our kids exploring AI tools that weren't built for them. 
            Unsafe, unfiltered, unpredictable. That wasn't good enough.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <p className="text-xl leading-relaxed">
              Like many parents, we watched our children grow up surrounded by technology. We saw the wonder in their eyes 
              when they discovered something new, the questions that never stopped, the bedtime stories that sparked their imagination.
            </p>
            <p className="text-xl leading-relaxed">
              But when AI assistants became mainstream, we felt uneasy. These tools were powerful, but they weren't designed 
              for children. No filters. No boundaries. No way for parents to control what their kids were exposed to.
            </p>
            <p className="text-xl leading-relaxed">
              So we built something different. An AI companion designed from the ground up for children, with parents in complete control.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-4xl font-bold">Our Mission</h2>
          <Card className="p-12 bg-gradient-to-br from-primary/5 to-accent/5">
            <p className="text-2xl font-medium leading-relaxed">
              AI you can trust with your children.
            </p>
            <p className="text-xl text-muted-foreground mt-4">
              Safe by default. Parent-controlled. Magical for kids.
            </p>
          </Card>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value) => (
              <Card key={value.title} className="p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What We Built */}
      <section className="py-20 px-4 bg-gradient-to-br from-[hsl(var(--story-magic-light))] via-background to-[hsl(var(--learning-bg))]">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12">What We Built</h2>
          <div className="space-y-6">
            <Card className="p-8">
              <h3 className="text-2xl font-semibold mb-3 flex items-center gap-3">
                <Shield className="h-7 w-7 text-primary" />
                Safe by default
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Locked sandbox AI that only references parent-approved content. No internet access, no surprises.
              </p>
            </Card>
            <Card className="p-8">
              <h3 className="text-2xl font-semibold mb-3 flex items-center gap-3">
                <Users className="h-7 w-7 text-accent" />
                Parent-controlled
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                You choose the topics. You review the conversations. You decide what stays and what goes.
              </p>
            </Card>
            <Card className="p-8">
              <h3 className="text-2xl font-semibold mb-3 flex items-center gap-3">
                <Sparkles className="h-7 w-7 text-child-primary" />
                Magical for kids
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Bedtime stories where they're the hero. Learning through curiosity. Connection through technology.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-4xl font-bold">Join our mission</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help us create a safer, more magical digital childhood. Start with our free plan today.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg">
            <Users className="mr-2 h-5 w-5" />
            Start Free Today
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
