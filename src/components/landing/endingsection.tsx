import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Lottie animation path
const lottiePath = new URL("../../assets/lottie/Mom and Kids.lottie", import.meta.url).href;

export const LocationSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-12 lg:py-16 bg-[#FEF6E4] overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-purple-200 opacity-20"
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
          className="absolute w-24 h-24 rounded-full bg-blue-200 opacity-15"
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
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left Side - Lottie Animation */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-full max-w-md mx-auto lg:max-w-sm" style={{ aspectRatio: "1 / 1", minHeight: "250px" }}>
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
              className="space-y-4 sm:space-y-5"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Heading */}
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 font-playful leading-tight">
                  Where Little Hearts Grow with Love
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 font-playful leading-relaxed mb-4">
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
                <motion.button
                  onClick={() => navigate("/signin")}
                  className="group text-white font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl flex items-center justify-center gap-2 font-playful text-sm sm:text-base transition-all duration-300 shadow-md hover:shadow-lg"
                  style={{
                    backgroundColor: "#2BD4D0",
                    clipPath: "polygon(0% 10%, 5% 0%, 10% 8%, 15% 2%, 20% 7%, 25% 1%, 30% 6%, 35% 0%, 40% 5%, 45% 0%, 50% 4%, 55% 0%, 60% 5%, 65% 2%, 70% 7%, 75% 3%, 80% 9%, 85% 5%, 90% 11%, 95% 7%, 100% 10%, 100% 90%, 95% 100%, 90% 92%, 85% 98%, 80% 93%, 75% 99%, 70% 94%, 65% 100%, 60% 95%, 55% 100%, 50% 96%, 45% 100%, 40% 95%, 35% 100%, 30% 94%, 25% 99%, 20% 93%, 15% 98%, 10% 92%, 5% 100%, 0% 90%)",
                  }}
                  whileHover={{ scale: 1.05, backgroundColor: "#24B8B4" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Early Access
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

