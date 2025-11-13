import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Users, Sparkles } from "lucide-react";

export const FirstTimePrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900/95 via-pink-900/95 to-blue-900/95 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-lg mx-4 border-2 border-primary/20 shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-xl opacity-50"></div>
              <div className="relative p-6 bg-gradient-to-br from-primary to-accent rounded-full">
                <Users className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to Paliyo! 👨‍👩‍👧‍👦
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            First time here? No problem!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-3">
            <p className="text-base text-foreground">
              We need a parent to set things up first.
            </p>
            <p className="text-sm text-muted-foreground">
              It only takes a minute to create profiles for your kids and start exploring the magic of Paliyo!
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Button 
              size="lg"
              onClick={() => navigate(`/auth?returnTo=${encodeURIComponent('/?kids=true')}`)}
              className="w-full text-lg py-6 shadow-xl hover:shadow-2xl transition-all group"
            >
              <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              Ask a Parent to Log In
            </Button>
            
            <Button 
              variant="ghost" 
              size="lg"
              onClick={() => navigate("/")}
              className="w-full"
            >
              Back to Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
