import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Sparkles, Heart } from "lucide-react";

interface BenefitCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconColor: string;
  iconBgColor: string;
}

const BenefitCard = ({ benefit, delay }: { benefit: BenefitCard; delay: number }) => {
  return (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: benefit.iconBgColor }}
        >
          <div style={{ color: benefit.iconColor }}>
            {benefit.icon}
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 font-playful">
          {benefit.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 font-playful text-sm leading-relaxed">
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
      iconColor: "#10B981",
      iconBgColor: "#D1FAE5",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Exclusive "Founding Seedling" Badge',
      description: "Digital collectible for early adopters",
      iconColor: "#F97316",
      iconBgColor: "#FED7AA",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Priority Feature Requests",
      description: "Shape the future of Yoluno",
      iconColor: "#EF4444",
      iconBgColor: "#FEE2E2",
    },
  ];

  return (
    <section className="relative py-20 lg:py-28 bg-[#FEF6E4] overflow-hidden">
      <div className="container mx-auto px-[30px] relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 font-playful">
              Join the Founding Families
            </h2>
            <p className="text-gray-600 text-lg font-playful mt-4">
              Early access comes with:
            </p>
          </motion.div>

          {/* Benefits Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
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
              className="bg-white rounded-xl px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 text-gray-900 font-bold font-playful flex items-center gap-2"
              style={{ backgroundColor: "#2BD4D0", color: "white" }}
              whileHover={{ scale: 1.05, y: -2, backgroundColor: "#24B8B4" }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-5 h-5" />
              Claim Your Spot
            </motion.button>
            <p className="text-gray-500 text-sm font-playful">
              Limited spots available
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

