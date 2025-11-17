import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { useNavigate } from "react-router-dom";
import { Home, Upload, Lock, Heart } from "lucide-react";
import familyTreeBuilder from "@/assets/family-tree-builder-interface.jpg";
import familyPhotoLibrary from "@/assets/family-photo-library-grid.jpg";
import familyStoryRecorder from "@/assets/family-story-recorder.jpg";

const FamilyFeature = () => {
  const navigate = useNavigate();

  const setupSteps = [
    {
      number: "1",
      title: "Upload Your Memories",
      description: "Photos, stories, recipes, voice recordings—anything that captures your family's essence.",
      icon: Upload
    },
    {
      number: "2",
      title: "Tag for Sensitivity",
      description: "Mark age-appropriate content and set access levels for different family members.",
      icon: Lock
    },
    {
      number: "3",
      title: "Chat & Explore",
      description: "Ask 'What was Grandma like as a kid?' and Yoluno narrates timelines with warmth and accuracy.",
      icon: Heart
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/20 dark:to-amber-950/20">
        <div className="max-w-5xl mx-auto text-center">
          <Badge className="mb-4 text-lg px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500">
            Premium Feature
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Family History, Alive in Conversation
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Upload photos, stories, recipes—Yoluno turns them into interactive chats. "What was Dad like as a kid?" Answers with warmth, accuracy, and your curated details.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/pricing")}
            className="text-lg px-8 py-6"
          >
            <Home className="mr-2 h-5 w-5" />
            Preview Family Mode: Start Free Trial
          </Button>
        </div>
      </section>

      {/* Setup Guide Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How Family History Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {setupSteps.map((step) => {
              const IconComponent = step.icon;
              return (
                <Card key={step.number} className="p-6 text-center hover:shadow-lg transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-amber-500 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <IconComponent className="h-10 w-10 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  {step.number === "3" && (
                    <Button variant="link" onClick={() => navigate("/pricing")}>
                      Upload Now: Free Premium Preview →
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Emotional Edge Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Building Identity & Bonds</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Family History mode doesn't just preserve memories—it brings them to life. Children develop stronger identity, cultural connection, and emotional bonds when they can "meet" their ancestors through stories.
              </p>
              <Card className="p-6 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/20 dark:to-amber-950/20">
                <p className="font-semibold mb-2 text-emerald-600 dark:text-emerald-400">What Families Say:</p>
                <p className="italic mb-3">"It's like time travel with hugs. My daughter asks about her great-grandmother every night, and Yoluno shares stories I uploaded last month. She feels connected to family she never met."</p>
                <p className="text-sm text-muted-foreground">— Maria K., Premium User</p>
              </Card>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src={familyTreeBuilder} 
                alt="Interactive family tree builder interface with photos and relationship connections"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Premium Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 overflow-hidden group">
              <div className="aspect-video rounded-lg overflow-hidden mb-4">
                <img 
                  src={familyPhotoLibrary} 
                  alt="Family photo library with organized albums"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="text-xl font-bold mb-3">Unlimited Uploads</h3>
              <p className="text-sm text-muted-foreground">
                No storage limits—upload your entire family archive without worry.
              </p>
            </Card>
            <Card className="p-6 overflow-hidden group">
              <div className="aspect-video rounded-lg overflow-hidden mb-4">
                <img 
                  src={familyStoryRecorder} 
                  alt="Voice recording interface for family stories"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="text-xl font-bold mb-3">Voice Recordings</h3>
              <p className="text-sm text-muted-foreground">
                Preserve Grandma's voice telling her favorite story—Yoluno can play it back contextually.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">Auto-Journals</h3>
              <p className="text-sm text-muted-foreground">
                Monthly family journals capture evolving conversations and milestone memories.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">Role-Play Mode</h3>
              <p className="text-sm text-muted-foreground">
                "Talk" to ancestors as if they're present—Yoluno role-plays based on your stories.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">Timeline Builder</h3>
              <p className="text-sm text-muted-foreground">
                Visual family timelines that children can explore interactively.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">Export Options</h3>
              <p className="text-sm text-muted-foreground">
                Print family books or share digital albums with extended family.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Audio Sample Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Hear It in Action</h2>
          <Card className="p-8">
            <p className="text-lg mb-6">Sample conversation: Child asks about family heritage</p>
            <div className="bg-background rounded-lg p-6 mb-6 text-left space-y-4">
              <p><strong>Child:</strong> "What was Dad like when he was my age?"</p>
              <p><strong>Yoluno:</strong> "Your dad was brave and curious, just like you! When he was 7, he loved exploring the woods behind your grandparents' house. One time, he found a secret fort and spent all summer fixing it up with his friends."</p>
              <p className="text-sm text-muted-foreground italic">(Based on stories and photos you've uploaded)</p>
            </div>
            <Button size="lg" onClick={() => navigate("/pricing")}>
              Hear a Sample Memory: Play Free
            </Button>
          </Card>
        </div>
      </section>

      {/* Storage Limits Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-8 bg-gradient-to-r from-emerald-50 to-amber-50 dark:from-emerald-950/20 dark:to-amber-950/20">
            <h3 className="text-2xl font-bold mb-4">Storage & Access</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <p className="font-semibold mb-2">Free Trial:</p>
                <p className="text-sm text-muted-foreground">Upload 50 items to preview Family mode features</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Premium:</p>
                <p className="text-sm text-muted-foreground">Unlimited uploads, advanced features, voice recordings</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-emerald-600 to-amber-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Upgrade to Premium for Family Mode</h2>
          <p className="text-lg mb-6 opacity-90">
            Keep your family's stories alive for generations—start with a free trial to experience the magic.
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/pricing")}>
            Start Free to Test
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FamilyFeature;
