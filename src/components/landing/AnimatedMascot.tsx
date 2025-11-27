import { motion } from "framer-motion";
import { useState } from "react";

interface AnimatedMascotProps {
  size?: "sm" | "md" | "lg";
  animation?: "idle" | "wave" | "bounce";
  className?: string;
}

export const AnimatedMascot = ({ 
  size = "md", 
  animation = "idle",
  className = "" 
}: AnimatedMascotProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  // Simple SVG mascot - friendly robot/character
  const MascotSVG = () => (
    <svg
      viewBox="0 0 100 100"
      className={`${sizeClasses[size]} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Head */}
      <motion.circle
        cx="50"
        cy="35"
        r="20"
        fill="hsl(283 89% 68%)"
        animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3 }}
      />
      
      {/* Eyes */}
      <motion.circle
        cx="45"
        cy="32"
        r="3"
        fill="white"
        animate={animation === "idle" ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.circle
        cx="55"
        cy="32"
        r="3"
        fill="white"
        animate={animation === "idle" ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
      />
      
      {/* Smile */}
      <motion.path
        d="M 40 40 Q 50 45 60 40"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        animate={isHovered ? { d: "M 40 42 Q 50 48 60 42" } : {}}
        transition={{ duration: 0.3 }}
      />
      
      {/* Body */}
      <motion.rect
        x="35"
        y="55"
        width="30"
        height="35"
        rx="5"
        fill="hsl(340 82% 67%)"
        animate={animation === "bounce" ? { y: [55, 50, 55] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      
      {/* Arms */}
      <motion.line
        x1="25"
        y1="60"
        x2="35"
        y2="70"
        stroke="hsl(340 82% 67%)"
        strokeWidth="4"
        strokeLinecap="round"
        animate={
          animation === "wave"
            ? { rotate: [0, 20, -20, 0], transformOrigin: "25 60" }
            : {}
        }
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      <motion.line
        x1="75"
        y1="60"
        x2="65"
        y2="70"
        stroke="hsl(340 82% 67%)"
        strokeWidth="4"
        strokeLinecap="round"
        animate={
          animation === "wave"
            ? { rotate: [0, -20, 20, 0], transformOrigin: "75 60" }
            : {}
        }
        transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }}
      />
      
      {/* Legs */}
      <rect x="40" y="85" width="8" height="12" rx="2" fill="hsl(283 89% 68%)" />
      <rect x="52" y="85" width="8" height="12" rx="2" fill="hsl(283 89% 68%)" />
    </svg>
  );

  return (
    <motion.div
      className="inline-block"
      animate={
        animation === "idle"
          ? {
              y: [0, -8, 0],
            }
          : animation === "bounce"
          ? {
              y: [0, -15, 0],
            }
          : {}
      }
      transition={{
        duration: animation === "idle" ? 3 : 0.6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      whileHover={{ scale: 1.1 }}
    >
      <MascotSVG />
    </motion.div>
  );
};


