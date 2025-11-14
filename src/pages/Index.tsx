import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Testimonial } from "@/components/landing/Testimonial";
import { TrustBadge } from "@/components/landing/TrustBadge";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Shield, Sparkles, Heart, Lock, Play, Eye, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { FirstTimePrompt } from "@/components/kids/FirstTimePrompt";
import { NetflixProfileSelector } from "@/components/kids/NetflixProfileSelector";
import heroBackground from "@/assets/homepage-hero-bg.jpg";
import testimonialsBg from "@/assets/testimonials-bg.jpg";
import ctaBackground from "@/assets/cta-background.jpg";
import controlCenterDashboard from "@/assets/control-center-dashboard.jpg";
import testimonialSarah from "@/assets/testimonial-sarah-t.jpg";
import testimonialMike from "@/assets/testimonial-mike-r.jpg";
import testimonialLena from "@/assets/testimonial-lena-k.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isParentLoggedIn, setIsParentLoggedIn] = useState(false);
  const [showKidsMode, setShowKidsMode] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // Check for kids mode parameter
    const kidsParam = searchParams.get("kids");
    
    // Check parent session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsParentLoggedIn(!!session);
      setCheckingSession(false);
      
      // If kids mode is requested
      if (kidsParam === "true") {
        setShowKidsMode(true);
      }
      
      // Store last mode preference
      if (kidsParam === "true") {
        localStorage.setItem("last_mode", "kids");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsParentLoggedIn(!!session);
      }
    );

    return () => subscription.unsubscribe();
  }, [searchParams]);

  const testimonials = [
    {
      quote: "Finally, an AI I trust my 5-year-old with. I set the topics on dinosaurs and emotions—Yoluno weaves them into stories that spark her imagination. Game-changer for solo evenings.",
      author: "Sarah T.",
      role: "Mom of Two",
      avatarFallback: "ST",
      image: testimonialSarah
    },
    {
      quote: "Traveling for work used to mean missing bedtime. Now, my daughter hears my voice in Yoluno's tales, and I get the recap. It's like I'm there.",
      author: "Mike R.",
      role: "Dad on the Road",
      avatarFallback: "MR",
      image: testimonialMike
    },
    {
      quote: "The kindness journeys? Transformative. My kids went from 'mine!' to sharing stickers. Plus, the reports help me reinforce at dinner.",
      author: "Lena K.",
      role: "Family of Four",
      avatarFallback: "LK",
      image: testimonialLena
    }
  ];

  // Loading state while checking session
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show Kids Mode if requested
  if (showKidsMode) {
    // If parent is logged in, show Netflix profile selector
    if (isParentLoggedIn) {
      return <NetflixProfileSelector />;
    }
    // If parent is NOT logged in, show first-time prompt
    return <FirstTimePrompt />;
  }

  // Default: Show marketing page
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 px-4">
        <div className="absolute inset-0">
          <img 
            src={heroBackground} 
            alt="Magical bedtime scene"
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
        </div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <div className="inline-block p-3 bg-gradient-to-br from-primary to-accent rounded-3xl mb-4 animate-bounce-gentle">
              <Shield className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight drop-shadow-lg">
              One Safe AI Companion for Your Child—
              <br className="hidden md:block" />
              and a Co-Pilot for You as a Parent
            </h1>
            <p className="text-lg md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
              From bedtime stories where your little one stars as the hero, to daily habit missions that build quiet confidence, to unlocking family memories with a simple question—Paliyo handles it all. Safe, conversational, and always under your watchful eye.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Free Today (No Card Needed)
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/features")} className="text-lg px-8 py-6">
                <Play className="mr-2 h-5 w-5" />
                Watch the 2-Min Demo
              </Button>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 pt-8">
              <TrustBadge icon={Shield} text="No ads, ever" />
              <TrustBadge icon={Shield} text="Parent-controlled" />
              <TrustBadge icon={Shield} text="COPPA certified" />
              <TrustBadge icon={Shield} text="Cancel anytime" />
            </div>

            {/* Split-screen preview note */}
            <p className="text-sm text-white/80 pt-4 italic drop-shadow">
              <span className="font-semibold">For Kids:</span> Magic Awaits · <span className="font-semibold">For Parents:</span> Control & Insights
            </p>
          </div>
        </div>
      </section>

      {/* Why Paliyo? Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold">Why Paliyo?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                In a world of wandering AIs that promise the moon but deliver risks, Paliyo is different. We're not just another app—we're the bridge between your child's wonder and your peace of mind.
              </p>
              <div className="space-y-4">
                <Card className="p-4 flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">For Kids:</p>
                    <p className="text-sm text-muted-foreground">A true companion who listens without judgment, responds with kindness, and grows alongside their curiosities. No ads, no distractions—just pure, magical connection.</p>
                  </div>
                </Card>
                <Card className="p-4 flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">For Parents:</p>
                    <p className="text-sm text-muted-foreground">A trusted assistant that amplifies your intuition. Set boundaries, review every moment, and get insights that make parenting feel collaborative, not overwhelming.</p>
                  </div>
                </Card>
              </div>
              <p className="text-muted-foreground italic">
                Unlike generic chatbots that improvise and expose kids to the unknown, Paliyo stays in your lane. Every story, question, and adventure is drawn from your approved world—parent-vetted, sandboxed, and logged for transparency.
              </p>
              <Button onClick={() => navigate("/auth")} size="lg">
                Start Free Now
              </Button>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={whyPaliyoFeatures} 
                alt="Paliyo's 4 core features - child interacting with AI companion and parent monitoring dashboard"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Paliyo for Kids: Companion Mode */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Paliyo for Kids: Companion Mode</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Unlock a world where learning feels like play and every day sparkles with possibility. Paliyo adapts to your child's age, mood, and pace—turning "What's next?" into "I can't wait!"
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kidsFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card key={feature.title} className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 relative group overflow-hidden">
                  {feature.premium && (
                    <span className="absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white z-10">
                      Premium
                    </span>
                  )}
                  <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4">
                    <img 
                      src={feature.image} 
                      alt={`${feature.title} feature illustration`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex flex-col gap-2 mt-auto">
                    <Button variant="outline" size="sm" onClick={() => navigate(feature.path)}>
                      Learn More
                    </Button>
                    <Button size="sm" onClick={() => navigate("/auth")}>
                      Try Free
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Button size="lg" onClick={() => navigate("/features")} className="shadow-lg">
              <Sparkles className="mr-2 h-5 w-5" />
              Meet Paliyo: Try a Sample Story Now
            </Button>
          </div>
        </div>
      </section>

      {/* Paliyo for Parents: Assistant Mode */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Paliyo for Parents: Assistant Mode</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Parenting is your greatest adventure—Paliyo makes it easier to navigate. With full control at your fingertips, you stay connected without being everywhere at once.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {parentFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card key={feature.title} className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 group overflow-hidden">
                  <div className="aspect-[16/10] rounded-lg overflow-hidden mb-4">
                    <img 
                      src={feature.image} 
                      alt={`${feature.title} dashboard interface`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety First Section - Redesigned */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Designed with Child Psychologists + AI Experts.</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Your family's safety is not a feature.<br />
              <strong className="text-foreground">It's the foundation.</strong>
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 flex gap-4">
              <Lock className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2">Parent Allowlist Only</h3>
                <p className="text-sm text-muted-foreground">Every piece of content starts with your green light. No external web crawls or unvetted data.</p>
              </div>
            </Card>
            <Card className="p-6 flex gap-4">
              <Shield className="h-8 w-8 text-emerald-500 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2">Closed Knowledge Sandbox</h3>
                <p className="text-sm text-muted-foreground">Responses drawn exclusively from your approved library—think 1,000+ safe sources on science, stories, and values.</p>
              </div>
            </Card>
            <Card className="p-6 flex gap-4">
              <CheckCircle className="h-8 w-8 text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2">Child-Safe Tone & Filters</h3>
                <p className="text-sm text-muted-foreground">Warm, age-appropriate language with built-in empathy. Paliyo models kindness in every reply.</p>
              </div>
            </Card>
          </div>
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="flex items-start gap-4">
              <Eye className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Full Conversation Logs</h3>
                <p className="text-muted-foreground mb-4">Review, export, or share anytime. Plus, automatic alerts for any flagged moments.</p>
                <p className="text-sm text-muted-foreground italic">Our Safety Charter outlines it all—audited annually for COPPA compliance.</p>
              </div>
            </div>
          </Card>
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" onClick={() => navigate("/safety")}>
              Read Our Safety Charter
            </Button>
          </div>
        </div>
      </section>

      {/* Join the Founding Families */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary via-accent to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="container mx-auto max-w-5xl text-center space-y-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">Join the Founding Families</h2>
          <p className="text-xl text-white/90 drop-shadow">Early access comes with:</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 bg-white/95 backdrop-blur">
              <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Lifetime Loyalty Discount</h3>
              <p className="text-sm text-muted-foreground">Lock in special pricing forever</p>
            </Card>
            <Card className="p-6 bg-white/95 backdrop-blur">
              <Sparkles className="h-8 w-8 text-amber-500 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Exclusive "Founding Seedling" Badge</h3>
              <p className="text-sm text-muted-foreground">Digital collectible for early adopters</p>
            </Card>
            <Card className="p-6 bg-white/95 backdrop-blur">
              <Heart className="h-8 w-8 text-rose-500 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Priority Feature Requests</h3>
              <p className="text-sm text-muted-foreground">Shape the future of Yoluno</p>
            </Card>
          </div>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-10 py-7 shadow-2xl bg-white text-primary hover:bg-white/90 font-bold">
            <Sparkles className="mr-2 h-6 w-6" />
            Claim Your Spot
          </Button>
          <p className="text-white/80 text-sm">Limited spots available</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={testimonialsBg} 
            alt="Happy families"
            className="w-full h-full object-cover opacity-10"
            loading="lazy"
          />
        </div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">What Families Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="space-y-4">
                <Testimonial
                  quote={testimonial.quote}
                  author={testimonial.author}
                  avatarImage={testimonial.image}
                  role={testimonial.role}
                  avatarFallback={testimonial.avatarFallback}
                />
                <Button variant="link" className="w-full" onClick={() => navigate("/auth")}>
                  Like {testimonial.author.split(' ')[0]}? Get Early Access →
                </Button>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button size="lg" onClick={() => navigate("/auth")} className="shadow-xl">
              Join These Families: Get Early Access
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Limited spots in beta—claim yours! 🎉
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={ctaBackground} 
            alt="Start your journey"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/85 to-background/90" />
        </div>
        <div className="container mx-auto max-w-4xl text-center space-y-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold">
            Safe AI that nurtures growing minds.
          </h2>
          <p className="text-lg text-muted-foreground">
            Start with personalized stories, gentle guidance, and parent-controlled learning. No credit card required.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8 py-6 shadow-2xl hover:shadow-3xl transition-all">
            <Sparkles className="mr-2 h-6 w-6" />
            Get Early Access
          </Button>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <TrustBadge icon={Shield} text="No ads" />
            <TrustBadge icon={Shield} text="No data resale" />
            <TrustBadge icon={Shield} text="Cancel anytime" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
