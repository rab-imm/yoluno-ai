import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Sparkles, Heart, Sun, Home, Gamepad2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import yolunoLogo from "@/assets/yoluno-logo.svg";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(false);
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

  const handleKidsModeClick = () => {
    if (isParentLoggedIn) {
      navigate("/?kids=true");
    } else {
      navigate("/?kids=true");
    }
  };

  const featureLinks = [
    { label: "Stories", path: "/features/stories", icon: Sparkles, color: "text-purple-500" },
    { label: "Journeys", path: "/features/journeys", icon: Heart, color: "text-pink-500" },
    { label: "Learning", path: "/features/learning", icon: Sun, color: "text-amber-500" },
    { label: "Family History", path: "/features/family", icon: Home, color: "text-emerald-500", premium: true },
  ];

  const mainLinks = [
    { label: "Safety", path: "/safety" },
    { label: "Pricing", path: "/pricing" },
    { label: "About", path: "/about" },
    { label: "Blog", path: "/blog" },
    { label: "Support", path: "/support" },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img src={yolunoLogo} alt="Yoluno" className="h-10 w-auto" />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger 
                    className={`${isActive('/features') ? 'text-primary' : ''}`}
                  >
                    Features
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4">
                      <div className="mb-3">
                        <h3 className="text-sm font-semibold mb-1">Discover Yoluno</h3>
                        <p className="text-xs text-muted-foreground">Explore features for kids and parents</p>
                      </div>
                      <div className="grid gap-2">
                        {featureLinks.map((link) => {
                          const IconComponent = link.icon;
                          return (
                            <button
                              key={link.path}
                              onClick={() => navigate(link.path)}
                              className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left group"
                            >
                              <IconComponent className={`h-5 w-5 mt-0.5 ${link.color}`} />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium group-hover:text-primary transition-colors">
                                    {link.label}
                                  </span>
                                  {link.premium && (
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                                      Premium
                                    </span>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                        <button
                          onClick={() => navigate("/features")}
                          className="mt-2 text-sm text-primary hover:underline"
                        >
                          View All Features →
                        </button>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {mainLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md ${
                  isActive(link.path) ? "text-primary bg-primary/5" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleKidsModeClick}
              className="min-h-[44px] border-2 border-primary/20 hover:border-primary/40 bg-gradient-to-r from-purple-500/10 to-pink-500/10"
            >
              <Gamepad2 className="mr-2 h-4 w-4" />
              Kids Mode
            </Button>
            {!isParentLoggedIn && (
              <>
                <Button variant="ghost" onClick={() => navigate("/auth")} className="min-h-[44px]">
                  Login
                </Button>
                <Button onClick={() => navigate("/auth")} className="shadow-lg min-h-[44px]">
                  Start Free
                </Button>
              </>
            )}
            {isParentLoggedIn && (
              <Button onClick={() => navigate("/dashboard")} className="shadow-lg min-h-[44px]">
                Dashboard
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t animate-fade-in">
            {/* Features Dropdown */}
            <div className="space-y-2">
              <button
                onClick={() => setMobileFeaturesOpen(!mobileFeaturesOpen)}
                className="flex items-center justify-between w-full px-4 py-2 text-left font-medium hover:bg-secondary rounded-lg transition-colors"
              >
                <span>Features</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileFeaturesOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileFeaturesOpen && (
                <div className="ml-4 space-y-1 animate-fade-in">
                  {featureLinks.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <button
                        key={link.path}
                        onClick={() => {
                          navigate(link.path);
                          setMobileMenuOpen(false);
                          setMobileFeaturesOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm hover:bg-secondary rounded-lg transition-colors"
                      >
                        <IconComponent className={`h-4 w-4 ${link.color}`} />
                        <span>{link.label}</span>
                        {link.premium && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500 to-orange-500 text-white ml-auto">
                            Premium
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {mainLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </button>
            ))}
            
            <div className="flex flex-col gap-2 px-4 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  handleKidsModeClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full min-h-[44px] border-2 border-primary/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10"
              >
                <Gamepad2 className="mr-2 h-4 w-4" />
                Kids Mode
              </Button>
              {!isParentLoggedIn && (
                <>
                  <Button variant="outline" onClick={() => navigate("/auth")} className="w-full min-h-[44px]">
                    Login
                  </Button>
                  <Button onClick={() => navigate("/auth")} className="w-full min-h-[44px]">
                    Start Free
                  </Button>
                </>
              )}
              {isParentLoggedIn && (
                <Button onClick={() => navigate("/dashboard")} className="w-full min-h-[44px]">
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
