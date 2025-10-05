import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { useNavigate } from "react-router-dom";
import { Heart, Shield, Users, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import aboutHeroBg from "@/assets/about-hero-bg.jpg";
import missionValues from "@/assets/mission-values.jpg";
import whatWeBuilt from "@/assets/what-we-built.jpg";
import founderTeam from "@/assets/founder-team-photo.jpg";
import productDashboard from "@/assets/product-dashboard-overview.jpg";
import productMobile from "@/assets/product-mobile-view.jpg";

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
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={aboutHeroBg} 
            alt="Diverse families together"
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/70 to-background/80" />
        </div>
        <div className="container mx-auto max-w-4xl text-center space-y-5 relative z-10">
          <div className="inline-block p-3 bg-gradient-to-br from-primary to-child-primary rounded-3xl mb-4">
            <Heart className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold">Meet the Team Behind Paliyo: Parents, Builders, Dreamers</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Founded by a mom of three and an AI ethicist, we're on a mission to make tech a family ally—not a wildcard. Backed by xAI-inspired tech for smarts, powered by heart for safety.
          </p>
          <Button size="lg" onClick={() => navigate("/features")} className="shadow-lg">
            <Sparkles className="mr-2 h-5 w-5" />
            Meet Us in Action: Start Free Demo
          </Button>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={founderTeam} 
                alt="Paliyo founding team - parents and builders working together"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
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
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={missionValues} 
            alt="Mission and values"
            className="w-full h-full object-cover opacity-20"
            loading="lazy"
          />
        </div>
        <div className="container mx-auto max-w-4xl text-center space-y-5 relative z-10">
          <h2 className="text-3xl md:text-4xl font-heading font-bold">Our Mission</h2>
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
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-heading font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What We Built */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={whatWeBuilt} 
            alt="What we built together"
            className="w-full h-full object-cover opacity-20"
            loading="lazy"
          />
        </div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-10">What We Built</h2>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img 
                src={productDashboard} 
                alt="Paliyo product dashboard showing parent controls and features"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-xl flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
              <img 
                src={productMobile} 
                alt="Paliyo mobile app showing child-friendly interface"
                className="w-2/3 h-auto"
                loading="lazy"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl md:text-2xl font-heading font-semibold mb-3 flex items-center gap-3">
                <Shield className="h-7 w-7 text-primary" />
                Safe by default
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Locked sandbox AI that only references parent-approved content. No internet access, no surprises.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl md:text-2xl font-heading font-semibold mb-3 flex items-center gap-3">
                <Users className="h-7 w-7 text-accent" />
                Parent-controlled
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                You choose the topics. You review the conversations. You decide what stays and what goes.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl md:text-2xl font-heading font-semibold mb-3 flex items-center gap-3">
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto max-w-4xl text-center space-y-5">
          <h2 className="text-3xl md:text-4xl font-heading font-bold">Get Involved: Beta Test New Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our community of parents shaping the future of safe AI for children. Early access, exclusive features, and direct impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg shadow-lg">
              <Users className="mr-2 h-5 w-5" />
              Start Free Today
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/support")} className="text-lg">
              Join Beta Program
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Free trial includes all features · No credit card required
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
