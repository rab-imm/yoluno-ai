import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Testimonial } from "@/components/landing/Testimonial";
import { TrustBadge } from "@/components/landing/TrustBadge";
import { VideoEmbed } from "@/components/landing/VideoEmbed";
import { useNavigate } from "react-router-dom";
import { Shield, Sparkles, BookOpen, Target, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import imaginationImg from "@/assets/imagination-pillar.jpg";
import growthImg from "@/assets/growth-pillar.jpg";
import curiosityImg from "@/assets/curiosity-pillar.jpg";
import heroBackground from "@/assets/homepage-hero-bg.jpg";
import familyConnection from "@/assets/family-connection.jpg";
import howItWorks from "@/assets/how-it-works.jpg";
import testimonialsBg from "@/assets/testimonials-bg.jpg";
import ctaBackground from "@/assets/cta-background.jpg";

const Index = () => {
  const navigate = useNavigate();

  const pillars = [
    {
      icon: BookOpen,
      title: "Imagination",
      subtitle: "AI-generated stories that sound like love",
      description: "AI creates nightly stories where your child is the hero—narrated with AI-generated gentle voices and beautiful art. Parent chooses themes, AI creates & narrates, save favorites.",
      color: "from-[hsl(var(--imagination-primary))] to-[hsl(var(--imagination-secondary))]",
      cta: "Make Tonight's Story",
      path: "/stories",
      image: imaginationImg
    },
    {
      icon: Target,
      title: "Growth",
      subtitle: "AI creates good habits, one tiny step at a time",
      description: "AI generates personalized daily missions that build big habits—kindness, reading, responsibility. AI sends missions + positive reinforcement, AI-generated bedtime stories reinforce progress.",
      color: "from-[hsl(var(--growth-primary))] to-[hsl(var(--growth-secondary))]",
      cta: "Start a Journey",
      path: "/journeys",
      image: growthImg
    },
    {
      icon: Lightbulb,
      title: "Curiosity",
      subtitle: "AI answers you can trust",
      description: "Safe AI-powered exploration in parent-curated topics. You choose topics & packs, AI answers only within your approved sandbox—no web access, ever. Parent can view & manage all Q&A logs.",
      color: "from-[hsl(var(--curiosity-secondary))] to-[hsl(var(--curiosity-primary))]",
      cta: "Add a Learning Pack",
      path: "/learning",
      image: curiosityImg
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0">
          <img 
            src={heroBackground} 
            alt="Magical bedtime scene"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/50 to-background/60" />
        </div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-5">
            <div className="inline-block p-3 bg-gradient-to-br from-primary to-accent rounded-3xl mb-4">
              <Shield className="h-12 w-12 text-white" />
            </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Safe AI-powered companion for your child — imagination, growth, and curiosity.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            AI generates personalized bedtime stories, creates guided habit journeys, and answers questions safely—always within the boundaries you choose.
          </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button size="lg" onClick={() => navigate("/auth")}>
                <Sparkles className="mr-2 h-5 w-5" />
                Start Free
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/about")}>
                Watch Demo
              </Button>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 pt-6">
              <TrustBadge icon={Shield} text="No ads" />
              <TrustBadge icon={Shield} text="No data resale" />
              <TrustBadge icon={Shield} text="Cancel anytime" />
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars - Equal Weight */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-3">
            Three ways Buddy helps your child thrive.
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-10 max-w-3xl mx-auto">
            One safe AI buddy for stories, habits, and learning—all in your control.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((pillar) => (
              <Card key={pillar.title} className="p-6 text-center hover:shadow-md transition-shadow overflow-hidden group">
                <div className="relative mb-4 rounded-xl overflow-hidden h-48">
                  <img 
                    src={pillar.image} 
                    alt={`${pillar.title} illustration`}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-20`} />
                  <div className={`absolute bottom-3 right-3 p-3 bg-gradient-to-br ${pillar.color} rounded-xl`}>
                    <pillar.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-semibold mb-2">{pillar.title}</h3>
                <p className="text-base font-medium text-muted-foreground mb-2 italic">{pillar.subtitle}</p>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{pillar.description}</p>
                <Button 
                  onClick={() => navigate(pillar.path)}
                  className={`bg-gradient-to-r ${pillar.color} hover:opacity-90`}
                >
                  {pillar.cta}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={howItWorks} 
            alt="How it works process"
            className="w-full h-full object-cover opacity-15"
          />
        </div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-3">How It Works</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            Applies to all three pillars: Stories, Journeys, and Learning
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">1</div>
              <h3 className="font-semibold text-lg mb-2">You Choose</h3>
              <p className="text-muted-foreground">What the AI knows: themes, topics, goals—all parent-approved.</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">2</div>
              <h3 className="font-semibold text-lg mb-2">AI Generates</h3>
              <p className="text-muted-foreground">Stories, missions, or safe answers—AI works only within your approved sandbox. No web access.</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">3</div>
              <h3 className="font-semibold text-lg mb-2">Your Child Connects</h3>
              <p className="text-muted-foreground">Listens, learns, and grows every day—powered by safe AI.</p>
            </Card>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8 italic">
            AI generates content only from parent-approved sources. Every answer cites its source. No web browsing. No freestyle AI generation.
          </p>
        </div>
      </section>

      {/* Safety & Trust */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={familyConnection} 
            alt="Family connection"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-10">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">AI with Guardrails</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every AI interaction—Stories, Journeys, Learning—flows through our safety pipeline.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">🔒 Locked AI Sandbox—No Web Access</h3>
              <p className="text-muted-foreground">AI can't browse the internet or access external sites. Only your approved packs.</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">👤 Parent-Controlled AI Knowledge</h3>
              <p className="text-muted-foreground">Allowlist topics, remove packs any time, control what AI knows.</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">😊 AI-Generated Gentle Language</h3>
              <p className="text-muted-foreground">AI uses age-appropriate tone with built-in refusal templates for sensitive topics.</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">👁️ Transparent AI Logs</h3>
              <p className="text-muted-foreground">Every AI answer cites its source. Parents can view & manage all AI interactions.</p>
            </Card>
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" onClick={() => navigate("/safety")}>
              See How Safety Works
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Video */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <VideoEmbed 
            title="See Paliyo AI in Action"
            description="Watch how parents create personalized bedtime stories, set up habit journeys, and curate safe learning environments"
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={testimonialsBg} 
            alt="Happy families testimonials"
            className="w-full h-full object-cover opacity-15"
          />
        </div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-10">What Parents Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Testimonial
              quote="Stories kept our bedtime ritual alive while I traveled. It feels like I'm still tucking her in."
              author="Michael Chen"
              role="Parent of 2, San Francisco"
              avatarFallback="MC"
            />
            <Testimonial
              quote="Our 30-day kindness journey changed the vibe at home. Small steps, big impact."
              author="Sarah Martinez"
              role="Homeschooling Parent, Austin"
              avatarFallback="SM"
            />
            <Testimonial
              quote="Finally, a learning tool I trust. He learns, but never wanders into unsafe answers."
              author="David Kim"
              role="Parent & Teacher, Seattle"
              avatarFallback="DK"
            />
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center space-y-5">
          <h2 className="text-3xl md:text-4xl font-heading font-bold">Simple plans. Family-friendly pricing.</h2>
          <p className="text-lg text-muted-foreground">
            Free to start. Cancel anytime. No ads. No data resale.
          </p>
          <Button size="lg" variant="outline" onClick={() => navigate("/pricing")}>
            View Plans
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={ctaBackground} 
            alt="Start your journey"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/80 to-background/85" />
        </div>
        <div className="container mx-auto max-w-4xl text-center space-y-5 relative z-10">
          <h2 className="text-3xl md:text-4xl font-heading font-bold">Safe AI that makes bedtime magical, builds great habits, and keeps learning protected.</h2>
          <p className="text-lg text-muted-foreground">
            Start with 2 free AI-generated stories, 1 AI-guided journey, and 50 AI-powered learning questions. No credit card required.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg">
            <Sparkles className="mr-2 h-5 w-5" />
            Start Free Today
          </Button>
          <p className="text-sm text-muted-foreground">
            No ads · No data resale · Cancel anytime
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
