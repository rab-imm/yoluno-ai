import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import blogBedtimeSacred from "@/assets/blog-bedtime-sacred.jpg";
import blogAISafetyGuide from "@/assets/blog-ai-safety-guide.jpg";
import blogKindnessJourney from "@/assets/blog-kindness-journey.jpg";
import blogFamilyHeritage from "@/assets/blog-family-heritage.jpg";
import blogScreenBalance from "@/assets/blog-screen-balance.jpg";

const Blog = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const posts = [
    {
      title: "5 Ways Paliyo Keeps Bedtime Sacred (Even on Weeknights)",
      excerpt: "Discover how busy families use Paliyo to maintain bedtime routines that actually stick, creating magical moments even when life gets hectic.",
      image: blogBedtimeSacred,
      readTime: "4 min",
      category: "Family Stories"
    },
    {
      title: "The Parent's Guide to Kid-Safe AI in 2025",
      excerpt: "Everything you need to know about AI safety for children, from understanding guardrails to evaluating content filters.",
      image: blogAISafetyGuide,
      readTime: "6 min",
      category: "AI Tips"
    },
    {
      title: "Real Talk: How Journeys Boosted Our Family's Kindness Quotient",
      excerpt: "A parent's honest account of using Paliyo's journey feature to transform sibling dynamics and build lasting habits.",
      image: blogKindnessJourney,
      readTime: "5 min",
      category: "Habit Hacks"
    },
    {
      title: "Why Family Stories Matter More Than Ever",
      excerpt: "The psychology behind heritage storytelling and how it shapes children's identity and emotional resilience.",
      image: blogFamilyHeritage,
      readTime: "7 min",
      category: "Family Stories"
    },
    {
      title: "Screen Time vs. Story Time: Finding the Balance",
      excerpt: "Practical strategies for managing digital engagement while fostering meaningful connections with your kids.",
      image: blogScreenBalance,
      readTime: "5 min",
      category: "AI Tips"
    }
  ];

  const categories = ["All Posts", "AI Tips", "Family Stories", "Habit Hacks", "Product Updates"];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Subscribed!",
      description: "Check your email for your free trial code and weekly tips.",
    });
    setEmail("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Insights for Modern Families
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            AI, Parenting, and the Joy In Between. Real advice for raising curious, kind kids.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="text-lg px-8 py-6"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Read & Apply: Start Free Trial
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant="ghost"
                      className="w-full justify-start"
                      size="sm"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
                <h3 className="text-lg font-bold mb-3">Subscribe & Save</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get Weekly Wins + Free Trial Code
                </p>
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full" size="sm">
                    Subscribe
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-2">
                  Bonus: Free Month Trial included!
                </p>
              </Card>
            </aside>

            {/* Posts Grid */}
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-2 gap-6">
                {posts.map((post, index) => (
                  <Card 
                    key={index}
                    className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => navigate("/auth")}
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="link" className="p-0 h-auto group-hover:underline">
                          Read Full Story <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                        <span className="text-muted-foreground">·</span>
                        <Button variant="link" className="p-0 h-auto text-primary">
                          Try Tip in Paliyo Free
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-12">
                <Button size="lg" variant="outline">
                  Load More Posts
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe for Weekly Wins</h2>
          <p className="text-lg mb-6 opacity-90">
            Exclusive tips, stories, and parenting hacks delivered to your inbox—plus a free month trial!
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white text-foreground"
              required
            />
            <Button type="submit" variant="secondary" size="lg">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
