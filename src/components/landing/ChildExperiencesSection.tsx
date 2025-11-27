import { motion } from "framer-motion";
import { Shield, Sparkles, Heart } from "lucide-react";
import { BunnyFaceIcon } from "./Icons";

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
}

const features: FeatureCard[] = [
  {
    title: "Safety",
    description: "Parent-approved content only",
    icon: <Shield className="w-6 h-6" />,
    iconColor: "#14B8A6", // Teal-green
  },
  {
    title: "Learning",
    description: "Curated knowledge packs",
    icon: <Sparkles className="w-6 h-6" />,
    iconColor: "#F97316", // Orange
  },
  {
    title: "Magic",
    description: "Personalized stories & adventures",
    icon: <Sparkles className="w-6 h-6" />,
    iconColor: "#9333EA", // Purple
  },
  {
    title: "Emotional Care",
    description: "Listens, encourages, grows with them",
    icon: <Heart className="w-6 h-6" />,
    iconColor: "#EC4899", // Pink
  },
];

// Decorative cloud shape for text background
const CloudShape = ({ className = "", fillColor = "#FBCFE8" }: { className?: string; fillColor?: string }) => (
  <svg
    width="200"
    height="80"
    viewBox="0 0 200 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`absolute ${className}`}
    style={{ opacity: 0.3 }}
  >
    <path
      d="M20 40C10 40 0 45 0 55C0 60 5 65 15 65C20 65 25 63 28 60C35 63 42 60 42 52C42 48 40 45 37 43C42 42 46 38 46 33C46 28 41 25 36 25C34 25 32 26 31 27C30 26 28 25 26 25C24 25 22 26 20 25C20 23 20 22 20 20C20 15 15 12 10 12C5 12 0 15 0 20C0 22 0 23 0 25C0 27 0 28 0 30C0 35 5 38 10 38C12 38 14 37 15 36C16 37 18 38 20 38C25 38 30 35 30 30C30 28 29 26 28 25C29 24 30 22 30 20C30 15 25 12 20 12C15 12 10 15 10 20C10 22 10 23 10 25C10 27 10 28 10 30C10 35 15 38 20 38Z"
      fill={fillColor}
    />
  </svg>
);

const FeatureCard = ({ feature, delay }: { feature: FeatureCard; delay: number }) => {
  return (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex flex-col items-center text-center">
        {/* Icon Circle */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: feature.iconColor }}
        >
          <div className="text-white">
            {feature.icon}
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 font-playful">
          {feature.title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-gray-600 font-playful leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
};

export const ChildExperiencesSection = () => {
  return (
    <section className="relative py-20 lg:py-28 bg-[#FEF6E4] overflow-hidden">
      <div className="container mx-auto px-[30px] relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-12 relative"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative cloud behind title */}
            <CloudShape className="top-0 left-1/2 -translate-x-1/2 -translate-y-4" />
            
            {/* Bunny ears decoration */}
            <div className="absolute top-0 right-0 opacity-20">
              <BunnyFaceIcon size={60} />
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 font-playful relative z-10">
              What Makes Yoluno Different?
            </h2>
            <p className="text-lg md:text-xl text-gray-700 font-playful max-w-3xl mx-auto leading-relaxed">
              Because kids deserve more than a chatbot. They deserve safety, learning, magic, and emotional care. Yoluno delivers all four — in one beautiful experience.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                feature={feature}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

