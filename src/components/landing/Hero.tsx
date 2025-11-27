import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HeartIcon, SunIcon, BabyFootprintIcon } from "./Icons";
import { BlobImage, CloudImage, StarImage, CandyBubbleImage } from "./shape-images";
import ScribbleIcon from "../../assets/WpwgArNxqyKCPZAJDK2mtLjSU.svg";
import SparksIcon from "../../assets/sparks.svg";
import { Prohibit, Users, ShieldCheck, ArrowClockwise, CaretDown } from "phosphor-react";

// Placeholder images - these should be replaced with actual child images
const childImage1 = "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop";
const childImage2 = "https://images.unsplash.com/photo-1504025468847-0e438279542c?w=400&h=400&fit=crop";
const childImage3 = "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop";
const childImage4 = "https://images.unsplash.com/photo-1504025468847-0e438279542c?w=400&h=400&fit=crop";

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

// Enhanced wavy/scalloped button component with hover-only animations
const WavyButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.button
      onClick={onClick}
      className="relative group text-white font-bold text-lg px-12 py-5 inline-block cursor-pointer overflow-hidden"
      whileTap={{ scale: 0.95 }}
      style={{
        background: "#2BD4D0",
        borderRadius: "35px",
        border: "none",
        clipPath: "polygon(0% 15%, 5% 5%, 10% 12%, 15% 4%, 20% 10%, 25% 3%, 30% 9%, 35% 2%, 40% 8%, 45% 1%, 50% 7%, 55% 2%, 60% 8%, 65% 4%, 70% 10%, 75% 6%, 80% 12%, 85% 8%, 90% 14%, 95% 10%, 100% 15%, 100% 85%, 95% 95%, 90% 88%, 85% 96%, 80% 90%, 75% 97%, 70% 91%, 65% 98%, 60% 92%, 55% 98%, 50% 93%, 45% 99%, 40% 92%, 35% 98%, 30% 91%, 25% 97%, 20% 90%, 15% 96%, 10% 88%, 5% 95%, 0% 85%)",
        filter: "drop-shadow(0 4px 12px rgba(43, 212, 208, 0.4))",
      }}
      initial={{
        backgroundColor: "#2BD4D0",
      }}
      whileHover={{
        scale: 1.08,
        backgroundColor: "#24B8B4",
        boxShadow: "0 8px 24px rgba(43, 212, 208, 0.6)",
        filter: "drop-shadow(0 8px 24px rgba(43, 212, 208, 0.6))",
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Shimmer effect - only on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0, x: "-100%" }}
        whileHover={{
          opacity: [0, 1, 1, 0],
          x: ["-100%", "100%"],
        }}
        transition={{
          opacity: { duration: 0.3 },
          x: {
            duration: 1.2,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 0.5,
          },
        }}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)",
          borderRadius: "35px",
          clipPath: "polygon(0% 15%, 5% 5%, 10% 12%, 15% 4%, 20% 10%, 25% 3%, 30% 9%, 35% 2%, 40% 8%, 45% 1%, 50% 7%, 55% 2%, 60% 8%, 65% 4%, 70% 10%, 75% 6%, 80% 12%, 85% 8%, 90% 14%, 95% 10%, 100% 15%, 100% 85%, 95% 95%, 90% 88%, 85% 96%, 80% 90%, 75% 97%, 70% 91%, 65% 98%, 60% 92%, 55% 98%, 50% 93%, 45% 99%, 40% 92%, 35% 98%, 30% 91%, 25% 97%, 20% 90%, 15% 96%, 10% 88%, 5% 95%, 0% 85%)",
          width: "150%",
        }}
      />
      
      {/* Sparkle particles - only animate on hover */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full pointer-events-none"
          style={{
            left: `${20 + i * 18}%`,
            top: "-10px",
            opacity: 0,
          }}
          whileHover={{
            opacity: [0, 1, 0],
            y: [0, -20, -40],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
      
      <span className="relative z-10 flex items-center gap-2 font-playful">
        <motion.span
          initial={{ color: "#FFFFFF" }}
          whileHover={{ color: "#1F2937" }}
          transition={{ duration: 0.3 }}
        >
          Enquire for free
        </motion.span>
        <motion.span
          initial={{ x: 0, color: "#FFFFFF" }}
          whileHover={{ x: 4, color: "#1F2937" }}
          transition={{ duration: 0.3 }}
        >
          →
        </motion.span>
      </span>
    </motion.button>
  );
};

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <>
      <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden pt-0 pb-12 lg:pt-0 lg:pb-16 px-[10px] flex flex-col justify-center">
        {/* Decorative background dots and shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Floating Scribble 1 - Top Left */}
          <motion.img
            src={ScribbleIcon}
            alt="scribble"
            className="absolute w-12 h-16 md:w-16 md:h-20 opacity-50"
            style={{ top: "8%", left: "5%", filter: "brightness(1.4)" }}
            animate={{
              y: [0, -25, 0],
              x: [0, 15, 0],
              rotate: [0, 15, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Floating Scribble 2 - Top Right */}
          <motion.img
            src={ScribbleIcon}
            alt="scribble"
            className="absolute w-10 h-14 md:w-14 md:h-18 opacity-48"
            style={{ top: "12%", right: "8%", filter: "brightness(1.4)" }}
            animate={{
              y: [0, 20, 0],
              x: [0, -12, 0],
              rotate: [0, -12, 0],
              scale: [1, 0.95, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          {/* Floating Scribble 3 - Bottom Left */}
          <motion.img
            src={ScribbleIcon}
            alt="scribble"
            className="absolute w-13 h-17 md:w-17 md:h-21 opacity-52"
            style={{ bottom: "15%", left: "10%", filter: "brightness(1.4)" }}
            animate={{
              y: [0, -20, 0],
              x: [0, 16, 0],
              rotate: [0, 14, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 9.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          />

          {/* Sparks 1 - Top Center */}
          <motion.img
            src={SparksIcon}
            alt="sparks"
            className="absolute w-16 h-16 md:w-20 md:h-20"
            style={{ top: "10%", left: "50%", filter: "brightness(1.5)" }}
            animate={{
              y: [0, -15, 0],
              x: [0, 10, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Sparks 2 - Middle Left */}
          <motion.img
            src={SparksIcon}
            alt="sparks"
            className="absolute w-14 h-14 md:w-18 md:h-18"
            style={{ top: "45%", left: "8%", filter: "brightness(1.5)" }}
            animate={{
              y: [0, 20, 0],
              x: [0, -12, 0],
              rotate: [0, -360],
              scale: [1, 1.15, 1],
              opacity: [0.48, 0.68, 0.48],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          {/* Sparks 3 - Middle Right */}
          <motion.img
            src={SparksIcon}
            alt="sparks"
            className="absolute w-15 h-15 md:w-19 md:h-19"
            style={{ top: "50%", right: "10%", filter: "brightness(1.5)" }}
            animate={{
              y: [0, -18, 0],
              x: [0, 15, 0],
              rotate: [360, 0],
              scale: [1, 1.18, 1],
              opacity: [0.45, 0.65, 0.45],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />

          {/* Sparks 4 - Bottom Center */}
          <motion.img
            src={SparksIcon}
            alt="sparks"
            className="absolute w-12 h-12 md:w-16 md:h-16"
            style={{ bottom: "18%", left: "45%", filter: "brightness(1.5)" }}
            animate={{
              y: [0, 22, 0],
              x: [0, -10, 0],
              rotate: [0, 360],
              scale: [1, 1.1, 1],
              opacity: [0.47, 0.67, 0.47],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />

          {/* Sparks 5 - Bottom Right */}
          <motion.img
            src={SparksIcon}
            alt="sparks"
            className="absolute w-13 h-13 md:w-17 md:h-17"
            style={{ bottom: "25%", right: "15%", filter: "brightness(1.5)" }}
            animate={{
              y: [0, -20, 0],
              x: [0, 12, 0],
              rotate: [-360, 0],
              scale: [1, 1.14, 1],
              opacity: [0.46, 0.66, 0.46],
            }}
            transition={{
              duration: 17,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.8,
            }}
          />

          {/* Sparks 6 - Upper Left */}
          <motion.img
            src={SparksIcon}
            alt="sparks"
            className="absolute w-11 h-11 md:w-15 md:h-15"
            style={{ top: "30%", left: "20%", filter: "brightness(1.5)" }}
            animate={{
              y: [0, 16, 0],
              x: [0, -8, 0],
              rotate: [0, 360],
              scale: [1, 1.12, 1],
              opacity: [0.49, 0.69, 0.49],
            }}
            transition={{
              duration: 19,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8,
            }}
          />

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
          <motion.div
            className="absolute w-2.5 h-2.5 bg-purple-400 rounded-full opacity-40"
            style={{ top: "42%", left: "22%" }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.4, 0.65, 0.4],
              y: [0, -8, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-2.5 h-2.5 bg-yellow-300 rounded-full opacity-35"
            style={{ bottom: "48%", right: "25%" }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.35, 0.6, 0.35],
              y: [0, 10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute w-3 h-3 bg-pink-300 rounded-full opacity-40"
            style={{ top: "62%", left: "28%" }}
            animate={{
              x: [0, 12, 0],
              y: [0, -12, 0],
              opacity: [0.4, 0.65, 0.4],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-2 h-2 bg-blue-300 rounded-full opacity-45"
            style={{ bottom: "38%", right: "32%" }}
            animate={{
              x: [0, -10, 0],
              y: [0, 10, 0],
              opacity: [0.45, 0.7, 0.45],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
          <motion.div
            className="absolute w-2 h-2 bg-purple-300 rounded-full opacity-40"
            style={{ top: "52%", right: "15%" }}
            animate={{
              x: [0, 8, 0],
              y: [0, -8, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8,
            }}
          />
          <motion.div
            className="absolute w-2.5 h-2.5 bg-yellow-400 rounded-full opacity-38"
            style={{ top: "72%", left: "35%" }}
            animate={{
              y: [0, -15, 0],
              scale: [1, 1.35, 1],
              opacity: [0.38, 0.62, 0.38],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2,
            }}
          />
          <motion.div
            className="absolute w-3 h-3 bg-blue-400 rounded-full opacity-42"
            style={{ bottom: "58%", left: "42%" }}
            animate={{
              y: [0, 11, 0],
              scale: [1, 1.28, 1],
              opacity: [0.42, 0.68, 0.42],
            }}
            transition={{
              duration: 4.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />
          <motion.div
            className="absolute w-2 h-2 bg-pink-400 rounded-full opacity-36"
            style={{ top: "82%", right: "38%" }}
            animate={{
              x: [0, -9, 0],
              y: [0, 9, 0],
              opacity: [0.36, 0.58, 0.36],
            }}
            transition={{
              duration: 5.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.8,
            }}
          />

          {/* Floating Bubbles - Large soft backgrounds */}
          <motion.div
            className="absolute w-32 h-32 rounded-full bg-purple-200 opacity-8"
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
            className="absolute w-40 h-40 rounded-full bg-pink-200 opacity-7"
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
            className="absolute w-36 h-36 rounded-full bg-blue-200 opacity-9"
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
          <motion.div
            className="absolute w-28 h-28 rounded-full bg-yellow-200 opacity-8"
            style={{ top: "58%", left: "45%" }}
            animate={{
              y: [0, 25, 0],
              x: [0, 15, 0],
              scale: [1, 1.15, 1],
              opacity: [0.08, 0.16, 0.08],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          <motion.div
            className="absolute w-44 h-44 rounded-full bg-purple-100 opacity-6"
            style={{ bottom: "35%", right: "22%" }}
            animate={{
              y: [0, -32, 0],
              x: [0, -12, 0],
              scale: [1, 1.22, 1],
              opacity: [0.06, 0.14, 0.06],
            }}
            transition={{
              duration: 13,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          
          {/* Star Twinkles */}
          <motion.div
            className="absolute w-1 h-1 bg-yellow-400"
            style={{ top: "15%", left: "25%", clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }}
            animate={{
              opacity: [0.3, 0.9, 0.3],
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-1 h-1 bg-pink-400"
            style={{ top: "68%", right: "28%", clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.4, 1],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          />
          <motion.div
            className="absolute w-1 h-1 bg-blue-400"
            style={{ bottom: "25%", left: "35%", clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }}
            animate={{
              opacity: [0.25, 0.85, 0.25],
              scale: [1, 1.6, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8,
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 max-w-7xl -translate-x-4">
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
                  alt="Child playing"
                  className="w-full h-full"
                  borderColor="#60A5FA"
                  backgroundColor="#DBEAFE"
                />
                <motion.div
                  className="absolute top-4 right-4 bg-white/90 rounded-full p-1.5 z-20"
                  whileHover={{ scale: 1.2 }}
                >
                  <BabyFootprintIcon size={20} className="text-blue-400" />
                </motion.div>
              </motion.div>

              {/* Bottom Left Image - Star Shape */}
              <motion.div
                className="w-48 h-48 lg:w-64 lg:h-64 xl:w-72 xl:h-72 relative"
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
              >
                <StarImage
                  src={childImage3}
                  alt="Child playing with toy"
                  className="w-full h-full"
                  borderColor="#FCD34D"
                  backgroundColor="#FEF3C7"
                />
                <motion.div
                  className="absolute top-4 left-4 bg-white/90 rounded-full p-2 z-20"
                  whileHover={{ scale: 1.2 }}
                >
                  <SunIcon size={20} className="text-yellow-500" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Center Column - Text and Button */}
            <motion.div
              className="flex-1 space-y-5 text-center px-4 lg:px-8"
              variants={itemVariants}
            >
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight font-playful whitespace-nowrap">
                Safe AI for Growing Minds.
              </h1>
              <motion.p
                className="text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto font-playful"
                variants={itemVariants}
              >
               Your child's smart, gentle, and parent-approved AI buddy.
              </motion.p>

              {/* Wavy/scalloped button with yellow hover */}
              <motion.div
                className="pt-6 flex justify-center items-center w-full"
                variants={itemVariants}
              >
                <WavyButton onClick={() => navigate("/auth")} />
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
                  alt="Child smiling"
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
                  alt="Child with stacking toy"
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
        <div className="container mx-auto px-4 relative z-10 max-w-7xl pt-4 pb-8">
          <motion.div
            className="flex flex-wrap justify-center items-center gap-3"
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
                  className="px-4 py-2 bg-white/80 backdrop-blur-sm border-2 border-gray-300 rounded-full text-xs font-semibold text-gray-700 font-playful shadow-md flex items-center gap-2 whitespace-nowrap"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.05, borderColor: "#9333EA" }}
                  style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
                >
                  <IconComponent size={14} weight="bold" className="text-gray-700" />
                  {item.text}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Scroll Down Animation */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
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

