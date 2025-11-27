import { useState, useEffect } from "react";
import { Navigation } from "@/components/landing/Navigation";
import { Hero } from "@/components/landing/Hero";
import { Footer } from "@/components/landing/Footer";
import { LocationSection } from "@/components/landing/endingsection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { GentleSmartSection } from "@/components/landing/GentleSmartSection";
import { SafetyFeaturesSection } from "@/components/landing/SafetyFeaturesSection";
import { BrightFuturesSection } from "@/components/landing/BrightFuturesSection";
import { ChildExperiencesSection } from "@/components/landing/ChildExperiencesSection";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FirstTimePrompt } from "@/components/kids/FirstTimePrompt";
import { NetflixProfileSelector } from "@/components/kids/NetflixProfileSelector";
const Index = () => {
  const [searchParams] = useSearchParams();
  const [isParentLoggedIn, setIsParentLoggedIn] = useState(false);
  const [showKidsMode, setShowKidsMode] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  
  useEffect(() => {
    // Check for kids mode parameter
    const kidsParam = searchParams.get("kids");

    // Check parent session
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setIsParentLoggedIn(!!session);
      setCheckingSession(false);

      // If kids mode is requested
      if (kidsParam === "true") {
        setShowKidsMode(true);
      }

      // Store last mode preference
      if (kidsParam === "true") {
        localStorage.setItem("last_mode", "kids");
      }
    });
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsParentLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, [searchParams]);

  // Loading state while checking session
  if (checkingSession) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>;
  }

  // Show Kids Mode if requested
  if (showKidsMode) {
    // If parent is logged in, show Netflix profile selector
    if (isParentLoggedIn) {
      return <NetflixProfileSelector />;
    }
    // If parent is NOT logged in, show first-time prompt
    return <FirstTimePrompt />;
  }

  // Default: Show childcare landing page
  return (
    <div className="min-h-screen bg-[#FEF6E4]">
      <Navigation />
      <div className="px-[10px]">
        <Hero />
        <ChildExperiencesSection />
        <BrightFuturesSection />
        <GentleSmartSection />
        <SafetyFeaturesSection />
        <TestimonialsSection />
        <FeaturesGrid />
        <LocationSection />
      </div>
      <Footer />
    </div>
  );
};
export default Index;
