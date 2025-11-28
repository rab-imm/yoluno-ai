import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Decorative cloud shape for text background
const CloudShape = ({ className = "", fillColor = "#BAE6FD" }: { className?: string; fillColor?: string }) => (
  <svg
    width="300"
    height="120"
    viewBox="0 0 300 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`absolute ${className}`}
    style={{ opacity: 0.4 }}
  >
    <path
      d="M30 60C20 60 10 65 10 75C10 80 15 85 25 85C30 85 35 83 38 80C45 83 52 80 52 72C52 68 50 65 47 63C52 62 56 58 56 53C56 48 51 45 46 45C44 45 42 46 41 47C40 46 38 45 36 45C34 45 32 46 30 45C30 43 30 42 30 40C30 35 25 32 20 32C15 32 10 35 10 40C10 42 10 43 10 45C10 47 10 48 10 50C10 55 15 58 20 58C22 58 24 57 25 56C26 57 28 58 30 58C35 58 40 55 40 50C40 48 39 46 38 45C39 44 40 42 40 40C40 35 35 32 30 32C25 32 20 35 20 40C20 42 20 43 20 45C20 47 20 48 20 50C20 55 25 58 30 58Z"
      fill={fillColor}
    />
  </svg>
);

export const BrightFuturesSection = () => {
  const navigate = useNavigate();
  // Placeholder for baby image - replace with actual image
  const babyImage = "/src/assets/dashboard.png";

  return (
    <section className="relative py-20 lg:py-28 bg-[#FEF6E4] overflow-hidden">
      {/* Decorative background clouds */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-blue-200 opacity-10"
          style={{ top: "5%", right: "-10%" }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left Side - Text Content */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Decorative cloud behind "Building bright futures" */}
              <CloudShape className="top-0 left-0 -translate-y-8 -translate-x-8 hidden sm:block" fillColor="#BAE6FD" />

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 font-playful leading-tight relative z-10">
              Parent-Curated.
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 font-playful leading-relaxed relative z-10 mb-6">
              Unlike AI tools that answer anything, Yoluno only answers what YOU approve.
              <br className="hidden sm:block" />
               <br className="hidden sm:block" />You choose the topics.
               <br className="hidden sm:block" />
               <br className="hidden sm:block" />You choose the limits.
               <br className="hidden sm:block" />
               <br className="hidden sm:block" />We handle the safety.
              </p>
              <motion.button
                onClick={() => navigate("/auth")}
                className="text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full font-playful text-sm sm:text-base transition-all duration-300 shadow-md hover:shadow-lg"
                style={{ backgroundColor: "#2BD4D0" }}
                whileHover={{ scale: 1.05, backgroundColor: "#24B8B4" }}
                whileTap={{ scale: 0.98 }}
              >
                Get Early Access
              </motion.button>
            </motion.div>

            {/* Right Side - Baby Image with Cloud Cutout */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Cloud-shaped mask container */}
              <div className="relative w-full max-w-4xl mx-auto">
                {/* Decorative cloud shapes around image */}
                <div className="absolute -top-8 -left-8 w-32 h-32 opacity-20">
                  <CloudShape fillColor="#BAE6FD" />
                </div>
                <div className="absolute -bottom-8 -right-8 w-24 h-24 opacity-20">
                  <CloudShape fillColor="#BAE6FD" />
                </div>

                {/* Image with rectangle border */}
                <div className="relative overflow-hidden rounded-lg bg-blue-100 p-4 shadow-lg">
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={babyImage}
                      alt="Happy baby"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

