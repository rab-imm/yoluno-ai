import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, Heart, Lock, Sparkles, MessageSquare, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6 mb-12">
            <div className="inline-block p-4 bg-gradient-to-br from-primary to-accent rounded-3xl mb-4 animate-float">
              <Shield className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Safe AI Buddy for Kids
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              An AI chat companion designed for children, locked to parent-approved topics. 
              Complete control. Complete safety. Pure learning magic. ✨
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" onClick={() => navigate("/auth")} className="text-lg">
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
                Parent Sign In
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 bg-card rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <Lock className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Parent-Curated Topics</h3>
              <p className="text-muted-foreground">
                You choose the topics. Your child only chats about what you approve.
              </p>
            </div>
            <div className="p-6 bg-card rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <Heart className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">Safe & Age-Appropriate</h3>
              <p className="text-muted-foreground">
                Built-in safety filters and gentle refusals for out-of-scope questions.
              </p>
            </div>
            <div className="p-6 bg-card rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <Sparkles className="h-10 w-10 text-child-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Playful & Engaging</h3>
              <p className="text-muted-foreground">
                Fun, colorful interface that kids love. Learning through conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Create Parent Account</h3>
                  <p className="text-muted-foreground">
                    Sign up in seconds and access your parent dashboard
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Add Child Profiles</h3>
                  <p className="text-muted-foreground">
                    Create profiles for each child with custom avatars
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Select Topics</h3>
                  <p className="text-muted-foreground">
                    Choose approved topics like Space, Math, Animals, and more
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Let Them Chat!</h3>
                  <p className="text-muted-foreground">
                    Your child explores, learns, and has fun in a safe environment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-child-primary/10 to-child-secondary/10">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to Give Your Child a Safe AI Buddy?</h2>
          <p className="text-xl text-muted-foreground">
            Join parents who trust us to provide safe, educational AI conversations
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg">
            <Users className="mr-2 h-5 w-5" />
            Start Your Free Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 Safe AI Buddy for Kids. Built with care for curious minds.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
