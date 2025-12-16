import { motion } from "framer-motion";

interface WavyCTAButtonProps {
  onClick: () => void;
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const WavyCTAButton = ({
  onClick,
  text = "Enquire for free",
  size = "md",
  className = ""
}: WavyCTAButtonProps) => {
  // Size-based classes
  const sizeClasses = {
    sm: "text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3",
    md: "text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5",
    lg: "text-base sm:text-lg md:text-xl px-8 sm:px-10 md:px-14 py-4 sm:py-5 md:py-6",
  };

  return (
    <motion.button
      onClick={onClick}
      className={`relative group text-white font-bold ${sizeClasses[size]} inline-block cursor-pointer overflow-hidden ${className}`}
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
          {text}
        </motion.span>
      </span>
    </motion.button>
  );
};
