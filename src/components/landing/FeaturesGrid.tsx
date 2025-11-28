import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Sparkles, Heart } from "lucide-react";

interface BenefitCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  borderRadius?: string;
}

const BenefitCard = ({ benefit, delay }: { benefit: BenefitCard; delay: number }) => {
  return (
    <motion.div
      className="bg-white rounded-xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div 
          className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center mb-3 sm:mb-4 bg-white"
          style={{ borderRadius: benefit.borderRadius || "60% 40% 30% 70% / 60% 30% 70% 40%" }}
        >
          <div className="text-black">
            {benefit.icon}
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 font-playful">
          {benefit.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 font-playful text-xs sm:text-sm leading-relaxed">
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
    <section className="relative py-12 sm:py-20 lg:py-28 bg-[#FEF6E4] overflow-hidden">
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-3 sm:mb-4 font-playful px-2">
              Join the Founding Families
            </h2>
            <p className="text-gray-600 text-base sm:text-lg font-playful mt-3 sm:mt-4 px-2">
              Early access comes with:
            </p>
          </motion.div>

          {/* Benefits Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
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
            <motion.button
              onClick={() => navigate("/auth")}
              className="bg-white rounded-xl px-6 sm:px-8 py-3 sm:py-4 shadow-lg hover:shadow-xl transition-all duration-300 text-gray-900 font-bold font-playful flex items-center gap-2 text-sm sm:text-base"
              style={{ backgroundColor: "#2BD4D0", color: "white" }}
              whileHover={{ scale: 1.05, y: -2, backgroundColor: "#24B8B4" }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              Claim Your Spot
            </motion.button>
            <p className="text-gray-500 text-xs sm:text-sm font-playful">
              Limited spots available
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

