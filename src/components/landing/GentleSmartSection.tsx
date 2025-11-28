import { motion } from "framer-motion";

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
  const bulletPoints = [
    { text: "Yoluno doesn't just respond.", bgColor: "#E0F2FE" }, // Light blue
    { text: "It listens.", bgColor: "#FCE7F3" }, // Light pink
    { text: "It encourages.", bgColor: "#FEF3C7" }, // Light yellow
    { text: "And it grows with your child.", bgColor: "#E9D5FF" } // Light purple
  ];

  return (
    <section className="relative py-6 lg:py-8 bg-[#FEF6E4] overflow-hidden">
      <div className="container mx-auto px-[30px] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
            {/* Left Side - Content */}
            <div className="flex-1 w-full">
              {/* Section Header */}
              <motion.div
                className="text-left mb-6 relative"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Decorative cloud behind title */}
                <CloudShape className="top-0 left-0 -translate-y-4" fillColor="#BAE6FD" />
                
                {/* Spark decorative element */}
                <div className="absolute top-0 right-0 opacity-30">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2 L13 8 L19 8 L14 12 L16 18 L12 14 L8 18 L10 12 L5 8 L11 8 Z" fill="#FBCFE8" />
                  </svg>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 font-playful relative z-10">
                  Gentle, Smart, 
                  <br />
                  Emotionally Aware.
                </h2>
              </motion.div>
            </div>

            {/* Right Side - Subtitle */}
            <div className="flex flex-col items-end lg:items-start flex-shrink-0">
              {/* Subtitle Text */}
              <motion.p
                className="text-base md:text-lg text-gray-700 font-playful leading-relaxed max-w-md text-left"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Designed to nurture both heart and mind. Yoluno celebrates small victories, comforts big feelings, sparks curiosity, and always chooses gentle words, giving your child a companion who's as emotionally intelligent as they need.
              </motion.p>
            </div>
          </div>

          {/* Bullet Points as Pills - Full Width Centered */}
          <motion.div
            className="flex flex-nowrap gap-4 md:gap-6 lg:gap-8 list-none justify-center items-center w-full pt-12"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {bulletPoints.map((point, index) => (
              <motion.div
                key={index}
                className="inline-flex items-center rounded-full px-6 py-3 shadow-sm hover:shadow-md transition-all duration-300 flex-shrink-0"
                style={{ backgroundColor: point.bgColor }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <p className="text-sm md:text-base font-semibold text-gray-900 font-playful whitespace-nowrap">
                  {point.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

