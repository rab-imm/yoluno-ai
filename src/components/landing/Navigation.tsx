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
    <nav className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 sm:px-6 lg:px-8 bg-transparent" style={{ position: 'fixed' }}>
      <div className="container mx-auto">
        <div className="bg-[#EDF7FF]/50 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl shadow-blue-100/20">
          <div className="flex items-center justify-between gap-6 h-20 sm:h-24 px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <img src={yolunoLogo} alt="Yoluno" className="h-14 sm:h-20 w-auto" />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`text-lg font-bold transition-colors relative py-1 ${isActive(link.path)
                      ? "text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center gap-4 ml-4">
              {!isParentLoggedIn ? (
                <Button
                  onClick={() => navigate("/auth")}
                  className="px-6 py-2.5 h-auto text-lg font-bold rounded-full text-white shadow-sm"
                  style={{ backgroundColor: "#2BD4D0" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#24B8B4"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2BD4D0"}
                >
                  Start Free
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="px-6 py-2.5 h-auto text-lg font-bold rounded-full text-white shadow-sm"
                    style={{ backgroundColor: "#2BD4D0" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#24B8B4"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2BD4D0"}
                  >
                    Dashboard
                  </Button>
                  <Button
                    onClick={() => navigate("/kids")}
                    className="px-6 py-2.5 h-auto text-lg font-bold rounded-full text-white shadow-sm bg-child-secondary hover:opacity-90"
                  >
                    Kids Mode
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-white/30 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-7 w-7 text-gray-900" />
              ) : (
                <Menu className="h-7 w-7 text-gray-900" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-6 space-y-1 border-t border-white/30 animate-fade-in rounded-b-2xl">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => {
                    navigate(link.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 text-lg font-bold rounded-lg transition-colors ${isActive(link.path)
                      ? "text-gray-900 bg-white/40"
                      : "text-gray-600 hover:bg-white/30 hover:text-gray-900"
                    }`}
                >
                  {link.label}
                </button>
              ))}

              <div className="pt-4 px-4 space-y-3">
                {!isParentLoggedIn ? (
                  <Button
                    onClick={() => {
                      navigate("/auth");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-3 h-auto text-lg font-bold rounded-full text-white"
                    style={{ backgroundColor: "#2BD4D0" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#24B8B4"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2BD4D0"}
                  >
                    Start Free
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => {
                        navigate("/dashboard");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-3 h-auto text-lg font-bold rounded-full text-white"
                      style={{ backgroundColor: "#2BD4D0" }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#24B8B4"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2BD4D0"}
                    >
                      Dashboard
                    </Button>
                    <Button
                      onClick={() => {
                        navigate("/kids");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-3 h-auto text-lg font-bold rounded-full text-white bg-child-secondary hover:opacity-90"
                    >
                      Kids Mode
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
