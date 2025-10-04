import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Testimonial } from "@/components/landing/Testimonial";
import { TrustBadge } from "@/components/landing/TrustBadge";
import { VideoEmbed } from "@/components/landing/VideoEmbed";
import { useNavigate } from "react-router-dom";
import { Shield, Sparkles, BookOpen, Target, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";

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
      path: "/stories"
    },
    {
      icon: Target,
      title: "Growth",
      subtitle: "AI creates good habits, one tiny step at a time",
      description: "AI generates personalized daily missions that build big habits—kindness, reading, responsibility. AI sends missions + positive reinforcement, AI-generated bedtime stories reinforce progress.",
      color: "from-[hsl(var(--growth-primary))] to-[hsl(var(--growth-secondary))]",
      cta: "Start a Journey",
      path: "/journeys"
    },
    {
      icon: Lightbulb,
      title: "Curiosity",
      subtitle: "AI answers you can trust",
      description: "Safe AI-powered exploration in parent-curated topics. You choose topics & packs, AI answers only within your approved sandbox—no web access, ever. Parent can view & manage all Q&A logs.",
      color: "from-[hsl(var(--curiosity-secondary))] to-[hsl(var(--curiosity-primary))]",
      cta: "Add a Learning Pack",
      path: "/learning"
    }
  ];

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
            Safe AI-powered companion for your child — imagination, growth, and curiosity.
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            AI generates personalized bedtime stories, creates guided habit journeys, and answers questions safely—always within the boundaries you choose.
          </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" onClick={() => navigate("/auth")} className="text-lg">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Free
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/about")} className="text-lg">
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
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Three ways Buddy helps your child thrive.
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            One safe AI buddy for stories, habits, and learning—all in your control.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar) => (
              <Card key={pillar.title} className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className={`inline-block p-4 bg-gradient-to-br ${pillar.color} rounded-2xl mb-4`}>
                  <pillar.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">{pillar.title}</h3>
                <p className="text-lg font-medium text-muted-foreground mb-3 italic">{pillar.subtitle}</p>
                <p className="text-muted-foreground mb-6 leading-relaxed">{pillar.description}</p>
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
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
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
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">AI with Guardrails</h2>
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
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <VideoEmbed 
            title="See Safe AI Buddy in Action"
            description="Watch how parents create personalized bedtime stories, set up habit journeys, and curate safe learning environments"
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">What Parents Are Saying</h2>
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
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-4xl font-bold">Simple plans. Family-friendly pricing.</h2>
          <p className="text-xl text-muted-foreground">
            Free to start. Cancel anytime. No ads. No data resale.
          </p>
          <Button size="lg" variant="outline" onClick={() => navigate("/pricing")}>
            View Plans
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-child-primary/10 to-child-secondary/10">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-4xl font-bold">Safe AI that makes bedtime magical, builds great habits, and keeps learning protected.</h2>
          <p className="text-xl text-muted-foreground">
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
