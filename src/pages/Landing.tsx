/**
 * Landing Page
 *
 * Public marketing/home page.
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, BookOpen, Shield, Users } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="container mx-auto flex items-center justify-between px-4 py-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Yoluno</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
          AI-Powered Learning
          <br />
          <span className="text-primary">For Curious Kids</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground">
          Safe, engaging, and personalized educational experiences powered by AI.
          Help your children explore, learn, and grow with Yoluno.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link to="/signup">
            <Button size="lg" className="gap-2">
              <Sparkles className="h-5 w-5" />
              Start Free Trial
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold">Why Parents Love Yoluno</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon={Shield}
            title="Safety First"
            description="Three-layer content safety validation ensures age-appropriate interactions every time."
          />
          <FeatureCard
            icon={BookOpen}
            title="Personalized Stories"
            description="AI-generated stories tailored to your child's interests, age, and learning goals."
          />
          <FeatureCard
            icon={Users}
            title="Family Learning"
            description="Create family trees, share stories, and learn together as a family."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Yoluno. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
