import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FamilyStorytimeImage from "@/assets/family-storytime.jpg";
import { Prohibit, Users, ShieldCheck, ArrowClockwise, CaretDown } from "phosphor-react";
import { WavyCTAButton } from "./WavyCTAButton";
import { HeartIcon, BabyFootprintIcon } from "./Icons";
import { BlobImage, CloudImage, CandyBubbleImage } from "./shape-images";

// Use existing images as placeholders
const childImage1 = FamilyStorytimeImage;
const childImage2 = FamilyStorytimeImage;
const childImage3 = FamilyStorytimeImage;
const childImage4 = FamilyStorytimeImage;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
  },
};

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <>
      <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden pt-8 sm:pt-12 pb-8 sm:pb-12 lg:pt-16 lg:pb-16 flex flex-col justify-center">
        {/* Decorative background dots and shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
          {/* Animated Dots - Scattered across the screen */}
          <motion.div
            className="absolute w-2 h-2 bg-pink-400 rounded-full opacity-50"
            style={{ top: "18%", left: "15%" }}
            animate={{
              y: [0, -12, 0],
              opacity: [0.5, 0.8, 0.5],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-3 h-3 bg-blue-400 rounded-full opacity-40"
            style={{ top: "28%", right: "18%" }}
            animate={{
              y: [0, 12, 0],
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
          <motion.div
            className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-50"
            style={{ bottom: "35%", left: "12%" }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 0.75, 0.5],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute w-3 h-3 bg-pink-400 rounded-full opacity-45"
            style={{ bottom: "22%", right: "20%" }}
            animate={{
              y: [0, 14, 0],
              opacity: [0.45, 0.7, 0.45],
              scale: [1, 1.25, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          />

          {/* Floating Bubbles - Large soft backgrounds */}
          <motion.div
            className="absolute w-32 h-32 rounded-full bg-purple-200 opacity-10"
            style={{ top: "25%", left: "18%" }}
            animate={{
              y: [0, -35, 0],
              scale: [1, 1.25, 1],
              opacity: [0.08, 0.18, 0.08],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-40 h-40 rounded-full bg-pink-200 opacity-10"
            style={{ top: "35%", right: "15%" }}
            animate={{
              y: [0, 30, 0],
              scale: [1, 1.2, 1],
              opacity: [0.07, 0.15, 0.07],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          />
          <motion.div
            className="absolute w-36 h-36 rounded-full bg-blue-200 opacity-10"
            style={{ bottom: "18%", left: "25%" }}
            animate={{
              y: [0, -28, 0],
              scale: [1, 1.18, 1],
              opacity: [0.09, 0.2, 0.09],
            }}
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8,
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
          <motion.div
            className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center justify-between"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Column - 2 Images */}
            <motion.div
              className="hidden lg:flex flex-col gap-8 items-center"
              style={{ flex: '0 0 20%', marginLeft: '-10%' }}
              variants={itemVariants}
            >
              {/* Top Left Image - Blob Shape */}
              <motion.div
                className="w-48 h-48 lg:w-64 lg:h-64 xl:w-72 xl:h-72 relative"
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                <BlobImage
                  src={childImage1}
                  alt="Family reading together"
                  className="w-full h-full"
                  borderColor="#E85D4D"
                  backgroundColor="#DBEAFE"
                />
                <motion.div
                  className="absolute top-4 right-4 bg-white/90 rounded-full p-1.5 z-20"
                  whileHover={{ scale: 1.2 }}
                >
                  <BabyFootprintIcon size={20} className="text-blue-400" />
                </motion.div>
              </motion.div>
              {/* Bottom Left Image - Cloud Shape */}
              <motion.div
                className="w-48 h-48 lg:w-64 lg:h-64 xl:w-72 xl:h-72 relative"
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
              >
                <CloudImage
                  src={childImage3}
                  alt="Children playing with blocks"
                  className="w-full h-full"
                  borderColor="#F472B6"
                  backgroundColor="#FCE7F3"
                />
                <motion.div
                  className="absolute bottom-4 left-4 bg-white/90 rounded-full p-1.5 z-20"
                  whileHover={{ scale: 1.2 }}
                >
                  <HeartIcon size={16} className="text-pink-400" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Center Column - Text and Button */}
            <motion.div
              className="flex-1 space-y-4 sm:space-y-5 text-center px-2 sm:px-4 lg:px-8"
              variants={itemVariants}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-extrabold text-gray-900 leading-tight font-playful">
                Safe AI
                <br />
                for Growing Minds
              </h1>
              <motion.p
                className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-black-900 leading-relaxed max-w-2xl mx-auto font-playful px-2 sm:px-4"
                variants={itemVariants}
              >
               Spark imagination, build confidence, and learn through play
               <br className="hidden sm:block" />
               with an AI companion that's warm, wise, and always
               <br className="hidden sm:block" />
               parent-approved.
              </motion.p>

              {/* Wavy/scalloped button with yellow hover */}
              <motion.div
                className="pt-6 flex justify-center items-center w-full"
                variants={itemVariants}
              >
                <WavyCTAButton onClick={() => navigate("/auth")} />
              </motion.div>
            </motion.div>

            {/* Right Column - 2 Images */}
            <motion.div
              className="hidden lg:flex flex-col gap-8 items-center"
              style={{ flex: '0 0 20%', marginRight: '-5%' }}
              variants={itemVariants}
            >
              {/* Top Right Image - Cloud Shape */}
              <motion.div
                className="w-48 h-48 lg:w-64 lg:h-64 xl:w-72 xl:h-72 relative"
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              >
                <CloudImage
                  src={childImage2}
                  alt="Child reading"
                  className="w-full h-full"
                  borderColor="#F472B6"
                  backgroundColor="#FCE7F3"
                />
                <motion.div
                  className="absolute bottom-4 left-4 bg-white/90 rounded-full p-1.5 z-20"
                  whileHover={{ scale: 1.2 }}
                >
                  <HeartIcon size={16} className="text-pink-400" />
                </motion.div>
              </motion.div>
              {/* Bottom Right Image - Candy Bubble (Circle) Shape */}
              <motion.div
                className="w-48 h-48 lg:w-64 lg:h-64 xl:w-72 xl:h-72 relative"
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5 }}
              >
                <CandyBubbleImage
                  src={childImage4}
                  alt="Mother and child"
                  className="w-full h-full"
                  borderColor="#A78BFA"
                  backgroundColor="#F3E8FF"
                />
                <motion.div
                  className="absolute bottom-4 left-4 bg-white/90 rounded-full p-2 z-20"
                  whileHover={{ scale: 1.2 }}
                >
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Feature Pills - Bottom of Hero Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl pt-4 sm:pt-6 pb-6 sm:pb-8">
          <motion.div
            className="flex flex-wrap justify-center items-center gap-2 sm:gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {[
              { text: "No ads, ever", icon: Prohibit },
              { text: "Parent-controlled", icon: Users },
              { text: "COPPA certified", icon: ShieldCheck },
              { text: "Cancel anytime", icon: ArrowClockwise }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={item.text}
                  className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-white/80 backdrop-blur-sm border-2 border-gray-300 rounded-full text-[10px] sm:text-xs font-semibold text-gray-700 font-playful shadow-md flex items-center gap-1 sm:gap-1.5 md:gap-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.05, borderColor: "#9333EA" }}
                  style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
                >
                  <IconComponent size={10} weight="bold" className="text-gray-700 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
                  <span className="whitespace-nowrap">{item.text}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Scroll Down Animation - Positioned at end of hero section */}
        <motion.div
          className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-[40%] z-20 flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <motion.div
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="cursor-pointer"
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth",
              });
            }}
          >
            <CaretDown
              size={32}
              weight="bold"
              className="text-gray-600 hover:text-[#2BD4D0] transition-colors"
            />
          </motion.div>
          <motion.p
            className="text-xs text-gray-500 font-playful"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Scroll
          </motion.p>
        </motion.div>
      </section>
    </>
  );
};
