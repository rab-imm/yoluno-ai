import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { useNavigate } from "react-router-dom";
import { Sparkles, Heart, Sun, Home } from "lucide-react";

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: "Stories",
      description: "Bedtime tales crafted just for them, where they're the brave explorer or clever inventor. Narrated in soothing voices, with pauses for their input—ending in dreams, not screens.",
      path: "/features/stories",
      color: "text-purple-400"
    },
    {
      icon: Heart,
      title: "Journeys",
      description: "Bite-sized daily missions to nurture habits like kindness or tidying up. Earn badges, track streaks, and celebrate wins with virtual high-fives that build real confidence.",
      path: "/features/journeys",
      color: "text-pink-400"
    },
    {
      icon: Sun,
      title: "Learning",
      description: "Endless 'why' and 'how' answered safely. From 'Why do stars twinkle?' to 'How do plants grow?'—pulled from curated packs you approve, with fun facts and follow-up questions.",
      path: "/features/learning",
      color: "text-amber-400"
    },
    {
      icon: Home,
      title: "Family History",
      description: "Chat with echoes of your family's past. 'Tell me about Grandma's adventures'—and Paliyo shares stories from your uploaded memories, keeping heritage alive in their voice.",
      path: "/features/family",
      color: "text-emerald-400",
      premium: true
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Discover Paliyo's World
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Where Kids Explore and Parents Empower. Dive deeper into the modes that make Paliyo indispensable.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Start Free Trial & Unlock All Features
          </Button>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Every feature serves two hearts: The child's spark of joy, and the parent's gift of guidance.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={feature.title}
                  className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer relative overflow-hidden"
                  onClick={() => navigate(feature.path)}
                >
                  {feature.premium && (
                    <span className="absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      Premium
                    </span>
                  )}
                  <IconComponent className={`h-12 w-12 mb-4 ${feature.color}`} />
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex flex-col gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      navigate(feature.path);
                    }}>
                      Learn More
                    </Button>
                    <Button size="sm" onClick={(e) => {
                      e.stopPropagation();
                      navigate("/auth");
                    }}>
                      Try Free
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6"
            >
              Pick Your Favorite Feature: Start Free Now
            </Button>
          </div>
        </div>
      </section>

      {/* Sidebar Quick Actions - Sticky on Desktop */}
      <div className="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 z-50">
        <Card className="p-4 space-y-3 shadow-xl">
          <p className="text-sm font-semibold mb-2">Quick Actions</p>
          <Button size="sm" className="w-full" onClick={() => navigate("/auth")}>
            Start Free
          </Button>
          <Button size="sm" variant="outline" className="w-full" onClick={() => navigate("/pricing")}>
            Compare Plans
          </Button>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Features;
