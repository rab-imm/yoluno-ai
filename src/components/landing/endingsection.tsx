import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { WavyCTAButton } from "./WavyCTAButton";

// Lottie animation path
const lottiePath = new URL("../../assets/lottie/Children And Their Mom.lottie", import.meta.url).href;

export const LocationSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-10 sm:py-12 md:py-14 lg:py-16 bg-[#FEF6E4] overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-purple-200 opacity-20 hidden sm:block"
          style={{ top: "10%", right: "5%" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-24 h-24 rounded-full bg-blue-200 opacity-15 hidden sm:block"
          style={{ bottom: "15%", left: "8%" }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center">
            {/* Left Side - Lottie Animation */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-full max-w-lg mx-auto lg:max-w-md" style={{ aspectRatio: "1 / 1", minHeight: "250px" }}>
                <DotLottieReact
                  src={lottiePath}
                  loop
                  autoplay
                  className="w-full h-full"
                />
              </div>
            </motion.div>

            {/* Right Side - Content */}
            <motion.div
              className="space-y-3 sm:space-y-4 md:space-y-5"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Heading */}
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 mb-2 sm:mb-3 font-playful leading-tight">
                  Where Little Hearts Grow with Love
                </h2>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 font-playful leading-relaxed mb-3 sm:mb-4">
                  We offer a nurturing space where every child feels safe, inspired to grow, explore, learn, and thrive with joy and confidence.
                </p>
              </div>

              {/* CTA Button */}
              <motion.div
                className="pt-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <WavyCTAButton 
                  onClick={() => navigate("/signin")} 
                  text="Get Early Access"
                  size="sm"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

