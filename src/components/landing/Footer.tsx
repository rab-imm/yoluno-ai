import { useNavigate } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export const Footer = () => {
  const navigate = useNavigate();

  const helpfulLinks = [
    { label: "About us", path: "/about" },
    { label: "Programs", path: "/programs" },
    { label: "Blog", path: "/blog" },
    { label: "FAQ", path: "/faq" },
  ];

  const otherLinks = [
    { label: "Privacy policy", path: "/privacy" },
    { label: "Terms & condition", path: "/terms" },
    { label: "404", path: "/404" },
  ];

  const contactInfo = [
    { label: "hello@yoluno.com", path: "mailto:hello@yoluno.com" },
    { label: "+44 (0)20 7946 1234", path: "tel:+442079461234" },
  ];

  const socialLinks = [
    { icon: Facebook, label: "Facebook", url: "https://facebook.com/yoluno" },
    { icon: Instagram, label: "Instagram", url: "https://instagram.com/yoluno" },
    { icon: Twitter, label: "X (Twitter)", url: "https://twitter.com/yoluno" },
    { icon: Linkedin, label: "LinkedIn", url: "https://linkedin.com/company/yoluno" },
  ];

  // Placeholder child images for Instagram section
  const instagramImages = [
    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1504025468847-0e438279542c?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=150&h=150&fit=crop",
  ];

  return (
    <footer className="bg-[#EDF7FF]">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        {/* Top Section: Instagram + Links */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Left: Follow us on Instagram */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 font-playful">Follow us on Instagram</h3>
            <div className="grid grid-cols-3 gap-2">
              {instagramImages.map((img, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden">
                  <img 
                    src={img} 
                    alt={`Instagram post ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Navigation Links */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 font-playful">Helpful links</h4>
              <ul className="space-y-2">
                {helpfulLinks.map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-playful"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 font-playful">Other links</h4>
              <ul className="space-y-2">
                {otherLinks.map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-playful"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-1">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.path}
                    className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-playful block"
                  >
                    {info.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright + Social Icons */}
        <div className="pt-8 border-t border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-gray-700 font-playful">
            © 2025 Yoluno. All rights reserved.
          </p>

          {/* Social Media Icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                  aria-label={social.label}
                >
                  <IconComponent className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};
