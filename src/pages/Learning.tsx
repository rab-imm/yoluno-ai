import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { useNavigate } from "react-router-dom";
import { Brain, Package, Upload, Eye, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import learningHeroBg from "@/assets/learning-hero-bg.jpg";
import learningPacks from "@/assets/learning-packs.jpg";
import qaTransparency from "@/assets/qa-transparency.jpg";
import ctaBackground from "@/assets/cta-background.jpg";

const LearningBuddy = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Package,
      title: "You Control the AI Knowledge",
      description: "Dinosaurs, space, math drills, nature — all chosen by you. AI only knows what you approve.",
      color: "text-[hsl(var(--curiosity-secondary))]"
    },
    {
      icon: Upload,
      title: "Add Your Own Content",
      description: "Upload worksheets, folktales, or custom lessons. AI learns only from your approved materials.",
      color: "text-[hsl(var(--curiosity-primary))]"
    },
    {
      icon: Eye,
      title: "Grounded AI Answers",
      description: "AI cites its source with every answer. No web access. Review all Q&A logs anytime.",
      color: "text-primary"
    }
  ];

  const packs = [
    { name: "Space Explorers", icon: "🚀", topics: "Planets, Stars, Rockets" },
    { name: "Dinosaur World", icon: "🦕", topics: "T-Rex, Fossils, Paleontology" },
    { name: "Ocean Adventures", icon: "🐋", topics: "Marine Life, Coral Reefs" },
    { name: "Math Fun", icon: "➕", topics: "Counting, Shapes, Patterns" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={learningHeroBg} 
            alt="Child learning and exploring"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/70 to-background/80" />
        </div>
        <div className="container mx-auto max-w-6xl text-center space-y-5 relative z-10">
          <div className="inline-block p-3 bg-gradient-to-br from-[hsl(var(--curiosity-secondary))] to-[hsl(var(--curiosity-primary))] rounded-3xl mb-4">
            <Brain className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold bg-gradient-to-r from-[hsl(var(--curiosity-secondary))] to-[hsl(var(--curiosity-primary))] bg-clip-text text-transparent">
            AI-powered curiosity, safely guided.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            AI answers questions only within the topics you approve—no open web, no surprises, no unsafe AI generation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg bg-gradient-to-r from-[hsl(var(--curiosity-secondary))] to-[hsl(var(--curiosity-primary))] hover:opacity-90">
              <Sparkles className="mr-2 h-5 w-5" />
              Add a Learning Pack
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/marketplace")}>
              Browse All Packs
            </Button>
          </div>
        </div>
      </section>

      {/* Parent Controls */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-10">Parent Controls</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="p-6 hover:shadow-md transition-shadow text-center">
                <feature.icon className={`h-12 w-12 mx-auto mb-4 ${feature.color}`} />
                <h3 className="text-xl md:text-2xl font-heading font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={qaTransparency} 
            alt="Question and answer transparency"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-10">Transparency</h2>
          <div className="space-y-6 mb-8">
            <Card className="p-6 border-l-4 border-l-[hsl(var(--curiosity-secondary))]">
              <p className="text-lg font-medium mb-2">Child asks:</p>
              <p className="text-2xl text-muted-foreground italic">"Why do stars twinkle?"</p>
            </Card>
            <Card className="p-6 bg-[hsl(var(--curiosity-light))] border-l-4 border-l-[hsl(var(--curiosity-primary))]">
              <p className="text-lg font-medium mb-2">AI responds (grounded in approved content):</p>
              <p className="text-xl leading-relaxed">
                "Because the air around Earth bends starlight as it travels to your eyes! It's like looking at something underwater — 
                it wiggles a little bit. <span className="inline-flex items-center gap-1 px-2 py-1 bg-[hsl(var(--curiosity-secondary))]/20 rounded text-sm font-semibold">📦 Space Pack (AI Source)</span>"
              </p>
            </Card>
          </div>
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-4">
              Every AI answer cites the pack/source used. AI never accesses the web. Parent logs show every Q&A.
            </p>
            <Button variant="outline" onClick={() => navigate("/safety")}>
              See How It's Safe
            </Button>
          </div>
        </div>
      </section>

      {/* Sample Packs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={learningPacks} 
            alt="Learning content packs"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-10">Popular Learning Packs</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packs.map((pack) => (
              <Card key={pack.name} className="p-6 hover:shadow-md transition-shadow cursor-pointer group text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{pack.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{pack.name}</h3>
                <p className="text-sm text-muted-foreground">{pack.topics}</p>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" onClick={() => navigate("/auth")}>
              Browse All Packs
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={ctaBackground} 
            alt="Add learning pack"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/80 to-background/85" />
        </div>
        <div className="container mx-auto max-w-4xl text-center space-y-5 relative z-10">
          <h2 className="text-3xl md:text-4xl font-heading font-bold">Let curiosity bloom safely</h2>
          <p className="text-xl text-muted-foreground">
            Start with 50 free questions per month. Add packs anytime.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg bg-gradient-to-r from-[hsl(var(--curiosity-secondary))] to-[hsl(var(--curiosity-primary))] hover:opacity-90">
            <Brain className="mr-2 h-5 w-5" />
            Add a Learning Pack
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LearningBuddy;
