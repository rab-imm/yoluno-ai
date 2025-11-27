import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Lottie animation path
const familyLottiePath = new URL("../../assets/lottie/Family.lottie", import.meta.url).href;

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

export const GentleSmartSection = () => {
  return (
    <section className="relative py-6 lg:py-8 bg-[#FEF6E4] overflow-hidden">
      <div className="container mx-auto px-[30px] relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Lottie Animation at Top */}
          <motion.div
            className="flex justify-center mb-2 lg:mb-3"
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] lg:w-[180px] lg:h-[180px] flex-shrink-0">
              <DotLottieReact
                src={familyLottiePath}
                loop
                autoplay
                className="w-full h-full"
              />
            </div>
          </motion.div>

          {/* Section Header */}
          <motion.div
            className="text-center mb-4 relative"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative cloud behind "Our amazing" */}
            <CloudShape className="top-0 left-1/4 -translate-y-4" fillColor="#BAE6FD" />
            
            {/* Spark decorative element */}
            <div className="absolute top-0 right-1/4 opacity-30">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2 L13 8 L19 8 L14 12 L16 18 L12 14 L8 18 L10 12 L5 8 L11 8 Z" fill="#FBCFE8" />
              </svg>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 font-playful relative z-10">
              Gentle, Smart, Emotionally Aware.
            </h2>
          </motion.div>

          {/* Cards Section */}
          <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
            {[
              { text: "Yoluno doesn't just respond.", bgColor: "#E0F2FE", circleColor: "#60A5FA", borderColor: "#BAE6FD" },
              { text: "It listens.", bgColor: "#FCE7F3", circleColor: "#F472B6", borderColor: "#FBCFE8" },
              { text: "It encourages.", bgColor: "#FEF3C7", circleColor: "#FCD34D", borderColor: "#FDE68A" },
              { text: "And it grows with your child.", bgColor: "#E9D5FF", circleColor: "#A78BFA", borderColor: "#D8B4FE" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="inline-flex rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 border-2"
                style={{ 
                  backgroundColor: item.bgColor,
                  borderColor: item.borderColor
                }}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.15, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -8,
                  borderColor: "#2BD4D0",
                  boxShadow: "0 12px 24px rgba(43, 212, 208, 0.2)"
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Decorative circle */}
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.circleColor }}
                  />
                  <p className="text-base md:text-lg font-semibold text-gray-900 font-playful whitespace-nowrap">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

