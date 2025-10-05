import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Testimonial } from "@/components/landing/Testimonial";
import { TrustBadge } from "@/components/landing/TrustBadge";
import { useNavigate } from "react-router-dom";
import { Shield, Sparkles, Heart, Sun, Home, Eye, Settings, BarChart, Lock, CheckCircle, XCircle, MessageCircle, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import heroBackground from "@/assets/homepage-hero-bg.jpg";
import testimonialsBg from "@/assets/testimonials-bg.jpg";
import ctaBackground from "@/assets/cta-background.jpg";

const Index = () => {
  const navigate = useNavigate();

  const kidsFeatures = [
    {
      icon: Sparkles,
      title: "Stories",
      description: "Bedtime tales crafted just for them, where they're the brave explorer or clever inventor. Narrated in soothing voices, with pauses for their input—ending in dreams, not screens.",
      color: "text-purple-500",
      path: "/features/stories"
    },
    {
      icon: Heart,
      title: "Journeys",
      description: "Bite-sized daily missions to nurture habits like kindness or tidying up. Earn badges, track streaks, and celebrate wins with virtual high-fives that build real confidence.",
      color: "text-pink-500",
      path: "/features/journeys"
    },
    {
      icon: Sun,
      title: "Learning",
      description: "Endless 'why' and 'how' answered safely. From 'Why do stars twinkle?' to 'How do plants grow?'—pulled from curated packs you approve, with fun facts and follow-up questions.",
      color: "text-amber-500",
      path: "/features/learning"
    },
    {
      icon: Home,
      title: "Family",
      description: "Chat with echoes of your family's past. 'Tell me about Grandma's adventures'—and Paliyo shares stories from your uploaded memories, keeping heritage alive in their voice.",
      color: "text-emerald-500",
      path: "/features/family",
      premium: true
    }
  ];

  const parentFeatures = [
    {
      icon: Settings,
      title: "Control Center",
      description: "Curate content on the fly—approve topics, block sensitivities, upload family lore, or design custom journeys. It's your dashboard, your rules.",
      color: "text-blue-500"
    },
    {
      icon: Eye,
      title: "Transparency Hub",
      description: "Dive into detailed logs of every chat. See questions asked, answers given, and emotional tones flagged—empowering you to guide without guessing.",
      color: "text-indigo-500"
    },
    {
      icon: Heart,
      title: "Connection Tools",
      description: "Busy day? Record a voice intro for tonight's story, or schedule ritual reminders. Paliyo keeps the warmth of home flowing, even from afar.",
      color: "text-rose-500"
    },
    {
      icon: BarChart,
      title: "Support Suite",
      description: "Weekly digest reports on progress (e.g., 'Your kid nailed 3 kindness missions!'), auto-generated family journals, and habit analytics to spot patterns and celebrate growth.",
      color: "text-cyan-500"
    }
  ];

  const testimonials = [
    {
      quote: "Finally, an AI I trust my 5-year-old with. I set the topics on dinosaurs and emotions—Paliyo weaves them into stories that spark her imagination. Game-changer for solo evenings.",
      author: "Sarah T.",
      role: "Mom of Two",
      avatarFallback: "ST"
    },
    {
      quote: "Traveling for work used to mean missing bedtime. Now, my daughter hears my voice in Paliyo's tales, and I get the recap. It's like I'm there.",
      author: "Mike R.",
      role: "Dad on the Road",
      avatarFallback: "MR"
    },
    {
      quote: "The kindness journeys? Transformative. My kids went from 'mine!' to sharing stickers. Plus, the reports help me reinforce at dinner.",
      author: "Lena K.",
      role: "Family of Four",
      avatarFallback: "LK"
    }
  ];

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
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/85 to-background/90" />
        </div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <div className="inline-block p-3 bg-gradient-to-br from-primary to-accent rounded-3xl mb-4 animate-bounce-gentle">
              <Shield className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              One Safe AI Companion for Your Child—
              <br className="hidden md:block" />
              and a Co-Pilot for You as a Parent
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
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
            <p className="text-sm text-muted-foreground pt-4 italic">
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
                  <Sparkles className="h-16 w-16 text-purple-500 animate-pulse-glow" />
                </div>
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center">
                  <Sun className="h-16 w-16 text-amber-500" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 flex items-center justify-center">
                  <Heart className="h-16 w-16 text-pink-500" />
                </div>
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center">
                  <Home className="h-16 w-16 text-emerald-500" />
                </div>
              </div>
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
                <Card key={feature.title} className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 relative group">
                  {feature.premium && (
                    <span className="absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      Premium
                    </span>
                  )}
                  <IconComponent className={`h-12 w-12 mb-4 ${feature.color} group-hover:scale-110 transition-transform`} />
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
                <Card key={feature.title} className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`h-6 w-6 ${feature.color}`} />
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

      {/* Safety First Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Safety First: AI That Doesn't Wander</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              We built Paliyo with one non-negotiable: Your child's safety is sacred. No black boxes here—just crystal-clear guardrails designed with pediatric experts and parents like you.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
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
            <Card className="p-6 flex gap-4">
              <XCircle className="h-8 w-8 text-amber-500 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2">Gentle Refusals</h3>
                <p className="text-sm text-muted-foreground">Off-topic? Paliyo pivots gracefully: "That's a big question—let's ask Mom/Dad first!" No scolding, just redirection.</p>
              </div>
            </Card>
          </div>
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="flex items-start gap-4">
              <Eye className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Full Conversation Logs</h3>
                <p className="text-muted-foreground mb-4">Review, export, or share anytime. Plus, automatic alerts for any flagged moments.</p>
                <p className="text-sm text-muted-foreground italic">Our Safety Charter outlines it all—audited annually for COPPA and KOSA compliance. Because safe today means confident tomorrow.</p>
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

      {/* Testimonials Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={testimonialsBg} 
            alt="Happy families"
            className="w-full h-full object-cover opacity-10"
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
                  role={testimonial.role}
                  avatarFallback={testimonial.avatarFallback}
                />
                <Button variant="link" className="w-full" onClick={() => navigate("/auth")}>
                  Like {testimonial.author.split(' ')[0]}? Start Free Like Them →
                </Button>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button size="lg" onClick={() => navigate("/auth")} className="shadow-xl">
              Join These Families: Start Free Today
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Limited spots in beta—claim yours! 🎉
            </p>
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto max-w-5xl text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">One Paliyo. Two Audiences. Endless Benefits.</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
            <Card className="p-6">
              <Sparkles className="h-8 w-8 text-purple-500 mb-3" />
              <h3 className="text-xl font-bold mb-2">For Children:</h3>
              <p className="text-muted-foreground">A safe, magical companion who turns ordinary moments into extraordinary memories.</p>
            </Card>
            <Card className="p-6">
              <Shield className="h-8 w-8 text-blue-500 mb-3" />
              <h3 className="text-xl font-bold mb-2">For Parents:</h3>
              <p className="text-muted-foreground">A reliable, supportive assistant who lightens the load and deepens the joy.</p>
            </Card>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Together? A family stronger, closer, and ready for whatever comes next.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8 py-6 shadow-xl">
              <Sparkles className="mr-2 h-5 w-5" />
              Start Free Today
            </Button>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">Join 10,000+ Families Already Paliyo-ing</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={ctaBackground} 
            alt="Start your journey"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/85 to-background/90" />
        </div>
        <div className="container mx-auto max-w-4xl text-center space-y-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold">
            Safe AI that makes bedtime magical, builds great habits, and keeps learning protected.
          </h2>
          <p className="text-lg text-muted-foreground">
            Start with unlimited conversations, personalized stories, and parent-controlled learning. No credit card required.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8 py-6 shadow-2xl hover:shadow-3xl transition-all">
            <Sparkles className="mr-2 h-6 w-6" />
            Start Free Today
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
