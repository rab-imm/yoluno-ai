import { Navigation } from "@/components/landing/Navigation";
import { Hero } from "@/components/landing/Hero";
import { StatsSection } from "@/components/landing/StatsSection";
import { LocationSection } from "@/components/landing/endingsection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { Footer } from "@/components/landing/Footer";

const IndexNew = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <StatsSection />
      <LocationSection />
      <FeaturesGrid />
      {/* More sections will be added here */}
      <Footer />
    </div>
  );
};

export default IndexNew;

