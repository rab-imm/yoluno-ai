import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

export const Footer = () => {
  const navigate = useNavigate();

  const footerLinks = {
    Product: [
      { label: "Story Buddy", path: "/story-buddy" },
      { label: "Learning Buddy", path: "/learning-buddy" },
      { label: "Pricing", path: "/pricing" },
    ],
    Company: [
      { label: "About", path: "/about" },
      { label: "Safety", path: "/safety" },
    ],
    Legal: [
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Terms of Service", path: "/terms" },
    ],
  };

  return (
    <footer className="border-t bg-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">Safe AI Buddy</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI you can trust with your children. Safe by design.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
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

        <div className="pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2025 Safe AI Buddy for Kids. Built with care for curious minds.</p>
        </div>
      </div>
    </footer>
  );
};
