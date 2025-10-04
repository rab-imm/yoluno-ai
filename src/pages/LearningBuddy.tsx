import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { useNavigate } from "react-router-dom";
import { Brain, Package, Upload, Eye, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

const LearningBuddy = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Package,
      title: "Parent-Curated Packs",
      description: "Dinosaurs, space, math drills, nature — all chosen by you. Only topics you approve.",
      color: "text-[hsl(var(--learning-primary))]"
    },
    {
      icon: Upload,
      title: "Add Your Own Content",
      description: "Upload bedtime stories, worksheets, or family folktales. Make it truly personal.",
      color: "text-accent"
    },
    {
      icon: Eye,
      title: "Transparent Logs",
      description: "Review every conversation. See exactly what Buddy said and which pack it came from.",
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
      <section className="py-20 px-4 bg-gradient-to-br from-[hsl(var(--learning-bg))] via-background to-[hsl(var(--learning-primary))]/5">
        <div className="container mx-auto max-w-6xl text-center space-y-6">
          <div className="inline-block p-4 bg-gradient-to-br from-[hsl(var(--learning-primary))] to-[hsl(var(--learning-secondary))] rounded-3xl mb-4 animate-float">
            <Brain className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[hsl(var(--learning-primary))] to-[hsl(var(--learning-secondary))] bg-clip-text text-transparent">
            Curiosity that's safe
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            During the day, Buddy becomes a safe exploration companion. Your child asks questions. You control the topics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg bg-gradient-to-r from-[hsl(var(--learning-primary))] to-[hsl(var(--learning-secondary))] hover:opacity-90">
              <Sparkles className="mr-2 h-5 w-5" />
              Add Your First Pack
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/pricing")}>
              See All Packs
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="p-8 hover:shadow-lg transition-shadow text-center">
                <feature.icon className={`h-12 w-12 mx-auto mb-4 ${feature.color}`} />
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Example Q&A */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12">How it works</h2>
          <div className="space-y-6">
            <Card className="p-6 border-l-4 border-l-[hsl(var(--learning-primary))]">
              <p className="text-lg font-medium mb-2">Child asks:</p>
              <p className="text-2xl text-muted-foreground italic">"Why do stars twinkle?"</p>
            </Card>
            <Card className="p-6 bg-[hsl(var(--learning-bg))] border-l-4 border-l-[hsl(var(--learning-secondary))]">
              <p className="text-lg font-medium mb-2">Buddy responds:</p>
              <p className="text-xl leading-relaxed">
                "Because the air around Earth bends starlight as it travels to your eyes! It's like looking at something underwater — 
                it wiggles a little bit. That's from your <span className="font-semibold text-[hsl(var(--learning-primary))]">Space Pack!</span>"
              </p>
            </Card>
          </div>
          <p className="text-center text-muted-foreground mt-8 text-lg">
            Every answer cites its source pack. Parents can review and remove any content.
          </p>
        </div>
      </section>

      {/* Sample Packs */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-center mb-12">Popular Learning Packs</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packs.map((pack) => (
              <Card key={pack.name} className="p-6 hover:shadow-lg transition-shadow cursor-pointer group text-center">
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
      <section className="py-20 px-4 bg-gradient-to-br from-child-primary/10 to-child-secondary/10">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-4xl font-bold">Let curiosity bloom safely</h2>
          <p className="text-xl text-muted-foreground">
            Start with 50 free questions per month. Add packs anytime.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg">
            <Brain className="mr-2 h-5 w-5" />
            Start Learning Today
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LearningBuddy;
