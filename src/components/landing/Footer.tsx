import { useNavigate } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import familyStorytimeImage from "@/assets/family-storytime.jpg";
import familyConnectionImage from "@/assets/family-connection.jpg";
import journeyProgressImage from "@/assets/journey-progress.jpg";

export const Footer = () => {
  const navigate = useNavigate();

  const helpfulLinks = [
    { label: "About us", path: "/about" },
    { label: "Features", path: "/features" },
    { label: "Blog", path: "/blog" },
    { label: "Support", path: "/support" },
  ];

  const otherLinks = [
    { label: "Privacy policy", path: "/legal/privacy" },
    { label: "Terms & conditions", path: "/legal/terms" },
    { label: "COPPA", path: "/legal/coppa" },
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

  // Images for Instagram section
  const instagramImages = [
    familyStorytimeImage,
    familyConnectionImage,
    journeyProgressImage,
  ];

  return (
    <footer className="bg-[#EDF7FF]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Top Section: Instagram + Links */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12 lg:mb-16">
          {/* Left: Follow us on Instagram */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 font-playful">Follow us on Instagram</h3>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
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
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 font-playful">Helpful links</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                {helpfulLinks.map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-xs sm:text-sm text-gray-700 hover:text-gray-900 transition-colors font-playful text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 font-playful">Other links</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                {otherLinks.map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-xs sm:text-sm text-gray-700 hover:text-gray-900 transition-colors font-playful text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-3 sm:mt-4 space-y-1">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.path}
                    className="text-xs sm:text-sm text-gray-700 hover:text-gray-900 transition-colors font-playful block break-words"
                  >
                    {info.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright + Social Icons */}
        <div className="pt-6 sm:pt-8 border-t border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Copyright */}
          <p className="text-xs sm:text-sm text-gray-700 font-playful text-center sm:text-left">
            © 2025 Yoluno. All rights reserved.
          </p>

          {/* Social Media Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
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
                  <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};
