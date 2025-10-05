import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { useNavigate } from "react-router-dom";
import { Sun, Globe, Heart, Rocket, Leaf } from "lucide-react";

const LearningFeature = () => {
  const navigate = useNavigate();

  const packs = [
    {
      icon: Leaf,
      title: "Nature Wonders",
      description: "Explore plants, animals, weather, and ecosystems through age-appropriate facts and experiments.",
      topics: ["Why do leaves change color?", "How do butterflies grow?", "What makes rain?"]
    },
    {
      icon: Rocket,
      title: "Space Basics",
      description: "Journey through the solar system with safe, verified space facts and stargazing activities.",
      topics: ["Why do stars twinkle?", "How big is the sun?", "What are planets made of?"]
    },
    {
      icon: Heart,
      title: "Emotional ABCs",
      description: "Navigate feelings with empathy-building scenarios and emotional vocabulary for healthy expression.",
      topics: ["Why do I feel sad sometimes?", "How can I be a good friend?", "What is bravery?"]
    },
    {
      icon: Globe,
      title: "World Cultures",
      description: "Discover traditions, foods, and stories from around the world with respectful, kid-friendly content.",
      topics: ["How do people celebrate?", "What languages exist?", "Why are cultures different?"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 bg-gradient-to-br from-amber-50 to-blue-50 dark:from-amber-950/20 dark:to-blue-950/20">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Safe Curiosity: Answers That Spark, Never Scare
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            "Why is the sky blue?" Paliyo draws from your approved packs—science, history, values—delivering bite-sized explanations with visuals and "Try this!" experiments.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="text-lg px-8 py-6"
          >
            <Sun className="mr-2 h-5 w-5" />
            Ask Your First Question: Start Free
          </Button>
        </div>
      </section>

      {/* Packs Carousel Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Curated Learning Packs</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Each pack is parent-customizable and vetted by experts. Over 500 safe facts ready to satisfy endless curiosity.
          </p>
          
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {packs.map((pack, index) => {
                const IconComponent = pack.icon;
                return (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="p-6 h-full hover:shadow-lg transition-all">
                      <IconComponent className="h-12 w-12 mb-4 text-primary" />
                      <h3 className="text-xl font-bold mb-3">{pack.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{pack.description}</p>
                      <div className="space-y-2 mb-4">
                        <p className="text-xs font-semibold">Sample Topics:</p>
                        {pack.topics.map((topic, i) => (
                          <p key={i} className="text-xs text-muted-foreground">• {topic}</p>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/auth")}>
                        Try This Pack Free
                      </Button>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Safety Layer Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Safe by Design</h2>
          <Card className="p-8">
            <p className="text-lg text-muted-foreground mb-6">
              All sources are vetted and age-appropriate. If a question goes off-rails, Paliyo gently pivots: "That's a big question—let's ask Mom or Dad first!" No scolding, just safe redirection.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="font-semibold mb-2">500+ Vetted Facts</p>
                <p className="text-sm text-muted-foreground">Curated by educators</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="font-semibold mb-2">Parent-Approved Only</p>
                <p className="text-sm text-muted-foreground">You control the content</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="font-semibold mb-2">Gentle Redirects</p>
                <p className="text-sm text-muted-foreground">Never shaming or scary</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Parent Insights Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Parent Insights Dashboard</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Question Logs & Learning Gaps</h3>
              <p className="text-muted-foreground">
                See what your child asks most and discover suggested packs to fill knowledge gaps.
              </p>
              <Card className="p-6 bg-gradient-to-br from-amber-50 to-blue-50 dark:from-amber-950/20 dark:to-blue-950/20">
                <p className="font-semibold mb-2">This Week's Report:</p>
                <p className="text-sm mb-4">"Your child asked 12 'why' questions this week—mostly about space! Suggested Pack: Space Basics."</p>
                <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
                  Get Your Insights: Sign Up Free
                </Button>
              </Card>
            </div>
            <div className="bg-gradient-to-br from-amber-100 to-blue-100 dark:from-amber-900/20 dark:to-blue-900/20 rounded-lg p-8 aspect-video flex items-center justify-center">
              <p className="text-muted-foreground">Sample analytics report preview</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Try It Now</h2>
          <Card className="p-8">
            <p className="text-lg mb-6">Ask Paliyo a sample question and see how safe, engaging learning works.</p>
            <div className="bg-background rounded-lg p-6 mb-6 text-left">
              <p className="text-sm text-muted-foreground mb-2">Sample Interaction:</p>
              <p className="mb-2"><strong>Child:</strong> "Why do stars twinkle?"</p>
              <p className="mb-2"><strong>Paliyo:</strong> "Great question! Stars twinkle because their light passes through Earth's atmosphere, which is always moving. It's like looking at something through water—the light bends and shimmers! Want to learn more about stars?"</p>
            </div>
            <Button size="lg" onClick={() => navigate("/auth")}>
              Explore More Packs Free
            </Button>
          </Card>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-amber-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Explore Packs Free</h2>
          <p className="text-lg mb-6 opacity-90">
            Give your child safe, endless answers to their biggest questions—starting today.
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
            Start Free Trial
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LearningFeature;
