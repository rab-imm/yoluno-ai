import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Sparkles, Heart } from "lucide-react";
import { WavyCTAButton } from "./WavyCTAButton";

interface BenefitCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  borderRadius?: string;
}

const BenefitCard = ({ benefit, delay }: { benefit: BenefitCard; delay: number }) => {
  return (
    <motion.div
      className="bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div 
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center mb-2 sm:mb-3 md:mb-4 bg-white"
          style={{ borderRadius: benefit.borderRadius || "60% 40% 30% 70% / 60% 30% 70% 40%" }}
        >
          <div className="text-black">
            {benefit.icon}
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 font-playful">
          {benefit.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 font-playful text-[10px] sm:text-xs md:text-sm leading-relaxed">
          {benefit.description}
        </p>
      </div>
    </motion.div>
  );
};

export const FeaturesGrid = () => {
  const navigate = useNavigate();

  const benefits: BenefitCard[] = [
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Lifetime Loyalty Discount",
      description: "Lock in special pricing forever",
      borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Exclusive "Founding Seedling" Badge',
      description: "Digital collectible for early adopters",
      borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Priority Feature Requests",
      description: "Shape the future of Yoluno",
      borderRadius: "50% 50% 50% 50% / 60% 40% 60% 40%",
    },
  ];

  return (
    <section className="relative py-10 sm:py-16 md:py-20 lg:py-28 bg-[#FEF6E4] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-6 sm:mb-8"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 mb-3 sm:mb-4 font-playful px-2 leading-tight">
              Join the Founding Families
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg font-playful mt-2 sm:mt-3 md:mt-4 px-2">
              Early access comes with:
            </p>
          </motion.div>

          {/* Benefits Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-6 sm:mb-8 md:mb-12">
            {benefits.map((benefit, index) => (
              <BenefitCard
                key={index}
                benefit={benefit}
                delay={index * 0.15}
              />
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <WavyCTAButton 
              onClick={() => navigate("/auth")} 
              text="Claim Your Spot"
              size="sm"
            />
            <p className="text-gray-500 text-xs sm:text-sm font-playful">
              Limited spots available
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

