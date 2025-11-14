import { useNavigate } from "react-router-dom";
import { Shield, Twitter, Instagram, Music2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const Footer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const footerLinks = {
    Features: [
      { label: "Stories", path: "/features/stories" },
      { label: "Journeys", path: "/features/journeys" },
      { label: "Learning", path: "/features/learning" },
      { label: "Family History", path: "/features/family" },
      { label: "Pricing", path: "/pricing" },
      { label: "Safety", path: "/safety" },
    ],
    Company: [
      { label: "About", path: "/about" },
      { label: "Blog", path: "/blog" },
      { label: "Support", path: "/support" },
    ],
    Legal: [
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Terms of Service", path: "/terms" },
      { label: "COPPA Compliance", path: "/coppa" },
      { label: "Safety Charter", path: "/safety" },
    ],
  };

  const socialLinks = [
    { icon: Twitter, label: "X (Twitter)", url: "https://twitter.com/yoluno" },
    { icon: Instagram, label: "Instagram", url: "https://instagram.com/yoluno" },
    { icon: Music2, label: "TikTok", url: "https://tiktok.com/@yoluno" },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Subscribed!",
      description: "You'll receive weekly tips and updates.",
    });
    setEmail("");
  };

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        {/* Top Row: Logo + Links */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">YOLUNO</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Safe AI for growing minds. Your child's smart, gentle, and parent-approved AI buddy.
            </p>
            
            {/* Newsletter Signup */}
            <div className="pt-4">
              <p className="text-sm font-semibold mb-2">Stay Magical: Weekly Tips</p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-sm"
                  required
                />
                <Button type="submit" size="sm">
                  <Mail className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4 text-sm">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Middle Row: Social Icons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pb-8 border-b">
          {socialLinks.map((social) => {
            const IconComponent = social.icon;
            return (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label={social.label}
              >
                <IconComponent className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </a>
            );
          })}
        </div>

        {/* Bottom Row: Copyright + COPPA Badge */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="text-center sm:text-left">
            © 2025 Paliyo Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              COPPA Certified
            </div>
            <Button 
              variant="link" 
              size="sm" 
              className="p-0 h-auto text-xs"
              onClick={() => navigate("/safety")}
            >
              View Safety Charter
            </Button>
          </div>
        </div>

        {/* Quick Start CTA - Mobile Sticky */}
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40 animate-fade-in">
          <Button 
            onClick={() => navigate("/auth")} 
            className="w-full shadow-2xl"
            size="lg"
          >
            Start Free Today
          </Button>
        </div>
      </div>
    </footer>
  );
};
