import { motion } from "framer-motion";
import { Shield, Sparkles, Heart, BookOpen } from "lucide-react";
import { BunnyFaceIcon } from "./Icons";

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  borderRadius: string;
}

const features: FeatureCard[] = [
  {
    title: "Safety",
    description: "Parent-approved content only",
    icon: <Shield className="w-6 h-6" />,
    iconColor: "#14B8A6",
    bgColor: "#CCFBF1",
    borderColor: "#99F6E4",
    borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
  },
  {
    title: "Learning",
    description: "Curated knowledge packs",
    icon: <BookOpen className="w-6 h-6" />,
    iconColor: "#F97316",
    bgColor: "#FED7AA",
    borderColor: "#FDBA74",
    borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
  },
  {
    title: "Magic",
    description: "Personalized stories & adventures",
    icon: <Sparkles className="w-6 h-6" />,
    iconColor: "#9333EA",
    bgColor: "#F3E8FF",
    borderColor: "#E9D5FF",
    borderRadius: "50% 50% 50% 50% / 60% 40% 60% 40%",
  },
  {
    title: "Emotional Care",
    description: "Listens, encourages, grows with them",
    icon: <Heart className="w-6 h-6" />,
    iconColor: "#EC4899",
    bgColor: "#FBCFE8",
    borderColor: "#F9A8D4",
    borderRadius: "40% 60% 60% 40% / 70% 30% 70% 30%",
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
      className="rounded-xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-sm hover:shadow-md transition-all duration-300 min-h-[180px] sm:min-h-[200px] md:min-h-[250px] w-full"
      style={{
        backgroundColor: feature.bgColor,
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex flex-col items-center text-center">
        {/* Icon with Abstract Blob Shape */}
        <div
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center mb-3 sm:mb-4 md:mb-6 bg-white"
          style={{
            borderRadius: feature.borderRadius,
          }}
        >
          <div className="text-black">
            {feature.icon}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 font-playful">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm md:text-base text-gray-600 font-playful leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
};

export const ChildExperiencesSection = () => {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-28 bg-[#FEF6E4] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-6 sm:mb-8 md:mb-12 relative"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative cloud behind title */}
            <CloudShape className="top-0 left-1/2 -translate-x-1/2 -translate-y-4 hidden sm:block" />

            {/* Bunny ears decoration */}
            <div className="absolute top-0 right-0 opacity-20 hidden sm:block">
              <BunnyFaceIcon size={60} />
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 mb-3 sm:mb-4 md:mb-6 font-playful relative z-10 px-2 leading-tight">
              What Makes Yoluno Different?
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 font-playful max-w-3xl mx-auto leading-relaxed px-2">
              Because kids deserve more than a chatbot. They deserve safety, learning, magic, and emotional care. Yoluno delivers all four — in one beautiful experience.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
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
