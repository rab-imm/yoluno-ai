import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { VideoEmbed } from "@/components/landing/VideoEmbed";
import { TrustBadge } from "@/components/landing/TrustBadge";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Eye, UserCheck, Ban, FileCheck, Heart, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import safetyHeroBg from "@/assets/safety-hero-bg.jpg";
import parentDashboard from "@/assets/parent-dashboard.jpg";
import safetyPipeline from "@/assets/safety-pipeline.jpg";
import trustCare from "@/assets/trust-care.jpg";
import ctaBackground from "@/assets/cta-background.jpg";
import moderationDashboard from "@/assets/moderation-dashboard.jpg";
import safetyFlowchart from "@/assets/safety-pipeline-flowchart.jpg";

const Safety = () => {
  const navigate = useNavigate();

  const pillars = [
    {
      icon: Lock,
      title: "Locked Sandbox AI—No Web Access",
      description: "AI only talks about what you allow. No internet access, no random answers, no surprises. Every AI response comes from parent-approved content packs. AI can't browse the web.",
      color: "from-primary to-primary/70"
    },
    {
      icon: UserCheck,
      title: "AI-Generated Age-Appropriate Content",
      description: "AI stories and answers filtered for gentle tone and simple readability. AI simplifies complex topics, blocks scary content, and always uses kind language.",
      color: "from-accent to-accent/70"
    },
    {
      icon: Eye,
      title: "Transparent AI Logs",
      description: "Every AI-generated story and answer cites its source pack. Parents can see all AI conversation logs, review AI-generated content, and remove anything instantly.",
      color: "from-[hsl(var(--learning-primary))] to-[hsl(var(--learning-secondary))]"
    },
    {
      icon: Heart,
      title: "Privacy Matters",
      description: "No ads. No data resale. Your family's conversations stay private. Cancel anytime, and your data is deleted.",
      color: "from-child-primary to-child-secondary"
    }
  ];

  const safetyFeatures = [
    { icon: Ban, text: "No Internet Access" },
    { icon: Lock, text: "Parent-Curated Only" },
    { icon: Eye, text: "Full Transparency" },
    { icon: FileCheck, text: "Content Filtering" },
    { icon: Shield, text: "Age-Appropriate" },
    { icon: UserCheck, text: "Gentle Refusals" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={safetyHeroBg} 
            alt="Protective safety shield"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/70 to-background/80" />
        </div>
        <div className="container mx-auto max-w-6xl text-center space-y-5 relative z-10">
          <div className="inline-block p-3 bg-gradient-to-br from-primary to-success rounded-3xl mb-4">
            <Shield className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
            AI safety isn't a setting. It's the system.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Every AI interaction—stories, journeys, learning—flows through our six-layer AI safety pipeline.
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {safetyFeatures.map((feature) => (
              <TrustBadge key={feature.text} icon={feature.icon} text={feature.text} />
            ))}
          </div>
        </div>
      </section>

      {/* The 4 Pillars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">Our Safety Pillars</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {pillars.map((pillar) => (
              <Card key={pillar.title} className="p-6 hover:shadow-md transition-shadow">
                <div className={`inline-block p-3 bg-gradient-to-br ${pillar.color} rounded-2xl mb-4`}>
                  <pillar.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-semibold mb-4">{pillar.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{pillar.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* The Safety Pipeline */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-3">The AI Safety Pipeline</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            For AI-generated Stories, Journeys, and Learning—same protective AI system
          </p>
          
          <div className="rounded-2xl overflow-hidden shadow-xl mb-8">
            <img 
              src={safetyFlowchart} 
              alt="6-layer AI safety pipeline flowchart showing Intent Analysis, Context Check, Content Filter, Tone Guard, Parent Override, and Audit Trail"
              className="w-full h-auto"
            />
          </div>
          <div className="space-y-6">
            <Card className="p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Parent Allowlist Controls AI Knowledge</h3>
                <p className="text-muted-foreground">You choose topics, packs, and goals. The AI learns only from what you approve—nothing else gets through.</p>
              </div>
            </Card>
            <Card className="p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Locked Knowledge Base—No Web Access</h3>
                <p className="text-muted-foreground">AI works only from your approved content library. It can't browse the web, access external sites, or freestyle generate from unknown sources.</p>
              </div>
            </Card>
            <Card className="p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">AI Generation Guardrails</h3>
                <p className="text-muted-foreground">Age-appropriate tone enforced. AI blocked from generating sensitive content (religion, politics, medical advice, violence).</p>
              </div>
            </Card>
            <Card className="p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Grounded AI with Source Citations</h3>
                <p className="text-muted-foreground">Every AI answer cites its approved source. Toxicity & PII filters active on all AI outputs.</p>
              </div>
            </Card>
            <Card className="p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">5</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">AI Refusals for Out-of-Scope Questions</h3>
                <p className="text-muted-foreground">When asked about unapproved topics, AI gently redirects: "That's not in our topics. Let's pick from dinosaurs, space, or math!"</p>
              </div>
            </Card>
            <Card className="p-6 flex items-start gap-4 border-2 border-success">
              <div className="flex-shrink-0 w-10 h-10 bg-success text-success-foreground rounded-full flex items-center justify-center font-bold">6</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Full AI Auditability</h3>
                <p className="text-muted-foreground">Parent logs show every AI interaction. Export or delete all AI-generated data anytime.</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Video */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <VideoEmbed 
            title="See Our Safety Features in Action"
            description="Watch how parents control content and review conversations"
            placeholderText="Demo video showcasing safety features"
          />
        </div>
      </section>

      {/* Safety Charter */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={trustCare} 
            alt="Trust and care"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto max-w-4xl text-center space-y-5 relative z-10">
          <FileCheck className="h-12 w-12 text-primary mx-auto" />
          <h2 className="text-3xl md:text-4xl font-heading font-bold">Our Safety Charter</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We've published a detailed Safety Charter outlining our commitments, technical safeguards, and privacy practices.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" variant="outline" onClick={() => navigate("/coppa")}>
              Read Full Charter
            </Button>
            <Button size="lg" onClick={() => navigate("/auth")}>
              Start Safe Trial
            </Button>
          </div>
        </div>
      </section>

      {/* Transparency in Action Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4">Transparency in Action</h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Full logs with timestamps, sentiment analysis, and export tools. Plus, proactive alerts: "New topic suggested—approve?"
          </p>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  What You See
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    <span>Every question your child asks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    <span>Every AI-generated response with source citations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    <span>Sentiment analysis (happy, curious, confused)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    <span>Timestamp and duration of each session</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    <span>Topics discussed and packs referenced</span>
                  </li>
                </ul>
              </Card>
              <Button size="lg" className="w-full" onClick={() => navigate("/auth")}>
                View Real Logs: Free Demo
              </Button>
            </div>
            <div className="space-y-6">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={moderationDashboard} 
                  alt="Content moderation dashboard showing conversation logs and safety indicators"
                  className="w-full h-auto"
                />
              </div>
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="space-y-4">
                <div className="flex items-start gap-3 pb-4 border-b">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                    C
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold">Child</span>
                      <span className="text-xs text-muted-foreground">7:32 PM</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Curious</span>
                    </div>
                    <p className="text-sm">"Why do stars twinkle?"</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-xs font-bold">
                    P
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold">Paliyo</span>
                      <span className="text-xs text-muted-foreground">7:32 PM</span>
                    </div>
                    <p className="text-sm mb-2">
                      "Great question! Stars twinkle because their light passes through Earth's atmosphere, which is always moving. It's like looking at something through water—the light bends and shimmers!"
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="h-3 w-3" />
                      <span>Source: Space Basics Pack</span>
                    </div>
                  </div>
                </div>
                </div>
                <div className="mt-4 pt-4 border-t text-center">
                  <p className="text-xs text-muted-foreground italic">Sample conversation log (redacted for demo)</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Parent Controls Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-10">Parent Controls Dashboard</h2>
          <Card className="p-12 relative overflow-hidden">
            <div className="absolute inset-0">
              <img 
                src={parentDashboard} 
                alt="Parent dashboard preview"
                className="w-full h-full object-cover opacity-30"
              />
            </div>
            <div className="relative z-10 text-center">
              <Eye className="h-16 w-16 text-primary mx-auto mb-6" />
            <p className="text-xl text-muted-foreground mb-6">
              Full visibility into conversations, content packs, and usage patterns
            </p>
            <Button variant="outline" size="lg" onClick={() => navigate("/auth")}>
              See Dashboard
            </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={ctaBackground} 
            alt="Try risk-free"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/80 to-background/85" />
        </div>
        <div className="container mx-auto max-w-4xl text-center space-y-5 relative z-10">
          <h2 className="text-3xl md:text-4xl font-heading font-bold">Try it risk-free</h2>
          <p className="text-xl text-muted-foreground">
            Start with our free plan. See our safety features in action. No credit card required.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg">
            <Shield className="mr-2 h-5 w-5" />
            Start Free Today
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Safety;
