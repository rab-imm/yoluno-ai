import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import yolunoLogo from "@/assets/yoluno-logo.svg";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isParentLoggedIn, setIsParentLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsParentLoggedIn(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsParentLoggedIn(!!session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Features", path: "/features" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/support" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#EDF7FF] border-b border-blue-200">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img src={yolunoLogo} alt="Yoluno" className="h-10 w-auto" />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`text-[15px] font-medium transition-colors relative py-1 ${isActive(link.path)
                    ? "text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-gray-900" />
                )}
              </button>
            ))}
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden lg:flex items-center">
            {!isParentLoggedIn ? (
              <Button
                onClick={() => navigate("/auth")}
                className="px-6 py-2.5 h-auto text-[15px] font-medium rounded-full text-white shadow-sm"
                style={{ backgroundColor: "#2BD4D0" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#24B8B4"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2BD4D0"}
              >
                Start Free
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-2.5 h-auto text-[15px] font-medium rounded-full text-white shadow-sm"
                style={{ backgroundColor: "#2BD4D0" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#24B8B4"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2BD4D0"}
              >
                Dashboard
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-blue-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-900" />
            ) : (
              <Menu className="h-6 w-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-6 space-y-1 border-t border-blue-200 animate-fade-in">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 text-[15px] font-medium rounded-lg transition-colors ${isActive(link.path)
                    ? "text-gray-900 bg-blue-100"
                    : "text-gray-600 hover:bg-blue-100 hover:text-gray-900"
                  }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-4 px-4">
              {!isParentLoggedIn ? (
                <Button
                  onClick={() => {
                    navigate("/auth");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 h-auto text-[15px] font-medium rounded-full text-white"
                  style={{ backgroundColor: "#2BD4D0" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#24B8B4"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2BD4D0"}
                >
                  Start Free
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    navigate("/dashboard");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 h-auto text-[15px] font-medium rounded-full text-white"
                  style={{ backgroundColor: "#2BD4D0" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#24B8B4"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2BD4D0"}
                >
                  Dashboard
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
