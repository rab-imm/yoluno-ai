import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { VideoEmbed } from "@/components/landing/VideoEmbed";
import { TrustBadge } from "@/components/landing/TrustBadge";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Eye, UserCheck, Ban, FileCheck, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";

const Safety = () => {
  const navigate = useNavigate();

  const pillars = [
    {
      icon: Lock,
      title: "Locked Sandbox AI",
      description: "Buddy only talks about what you allow. No internet access, no random answers, no surprises. Every response comes from parent-approved content packs.",
      color: "from-primary to-primary/70"
    },
    {
      icon: UserCheck,
      title: "Always Age-Appropriate",
      description: "Stories and answers filtered for gentle tone and simple readability. Complex topics are simplified, scary content is blocked, and language is always kind.",
      color: "from-accent to-accent/70"
    },
    {
      icon: Eye,
      title: "Transparent by Design",
      description: "Every story and answer cites its source pack. Parents can see conversation logs, review content, and remove anything instantly.",
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
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-success/5">
        <div className="container mx-auto max-w-6xl text-center space-y-6">
          <div className="inline-block p-4 bg-gradient-to-br from-primary to-success rounded-3xl mb-4 animate-float">
            <Shield className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
            Safety isn't a setting. It's the system.
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every pillar—Stories, Journeys, Learning—operates within your controlled environment. Here's how.
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3 pt-6">
            {safetyFeatures.map((feature) => (
              <TrustBadge key={feature.text} icon={feature.icon} text={feature.text} />
            ))}
          </div>
        </div>
      </section>

      {/* The 4 Pillars */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">Our Safety Pillars</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {pillars.map((pillar) => (
              <Card key={pillar.title} className="p-8 hover:shadow-lg transition-shadow">
                <div className={`inline-block p-3 bg-gradient-to-br ${pillar.color} rounded-2xl mb-4`}>
                  <pillar.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{pillar.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{pillar.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* The Safety Pipeline */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-center mb-4">The Safety Pipeline</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            For Stories, Journeys, and Learning—same protective system
          </p>
          <div className="space-y-6">
            <Card className="p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Parent Allowlist</h3>
                <p className="text-muted-foreground">You choose topics & packs—stories, learning content, journey templates—all approved by you first.</p>
              </div>
            </Card>
            <Card className="p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Closed Knowledge Sandbox</h3>
                <p className="text-muted-foreground">No web access, only approved content. Buddy can't search the internet or pull random information.</p>
              </div>
            </Card>
            <Card className="p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Generation Guards</h3>
                <p className="text-muted-foreground">Age-appropriate tone, no sensitive topics (religion, politics, medical advice).</p>
              </div>
            </Card>
            <Card className="p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Grounding & Filters</h3>
                <p className="text-muted-foreground">Answers cite sources. Toxicity & PII filters prevent harmful or private information.</p>
              </div>
            </Card>
            <Card className="p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">5</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Refusals</h3>
                <p className="text-muted-foreground">Gentle redirects for out-of-scope questions: "That's not in our topics. Let's pick from dinosaurs, space, or math!"</p>
              </div>
            </Card>
            <Card className="p-6 flex items-start gap-4 border-2 border-success">
              <div className="flex-shrink-0 w-10 h-10 bg-success text-success-foreground rounded-full flex items-center justify-center font-bold">6</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Auditability</h3>
                <p className="text-muted-foreground">Full parent logs. Review all conversations, see source citations, remove content with one click.</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Video */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <VideoEmbed 
            title="See Our Safety Features in Action"
            description="Watch how parents control content and review conversations"
            placeholderText="Demo video showcasing safety features"
          />
        </div>
      </section>

      {/* Safety Charter */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <FileCheck className="h-16 w-16 text-primary mx-auto" />
          <h2 className="text-4xl font-bold">Our Safety Charter</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We've published a detailed Safety Charter outlining our commitments, technical safeguards, and privacy practices.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="outline">
              Read Full Charter
            </Button>
            <Button size="lg" onClick={() => navigate("/auth")}>
              Start Free Trial
            </Button>
          </div>
        </div>
      </section>

      {/* Parent Controls Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-center mb-12">Parent Controls Dashboard</h2>
          <Card className="p-12 bg-gradient-to-br from-secondary/50 to-muted/30 text-center">
            <Eye className="h-20 w-20 text-primary mx-auto mb-6" />
            <p className="text-xl text-muted-foreground mb-6">
              Full visibility into conversations, content packs, and usage patterns
            </p>
            <Button variant="outline" size="lg" onClick={() => navigate("/auth")}>
              See Dashboard
            </Button>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-child-primary/10 to-child-secondary/10">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-4xl font-bold">Try it risk-free</h2>
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
