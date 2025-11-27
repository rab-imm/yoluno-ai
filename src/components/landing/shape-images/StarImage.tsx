import { motion } from "framer-motion";
import { useState } from "react";

interface ShapeImageProps {
  src: string;
  alt: string;
  className?: string;
  borderColor?: string;
  backgroundColor?: string;
}

export const StarImage: React.FC<ShapeImageProps> = ({ 
  src, 
  alt, 
  className = "",
  borderColor = "#F472B6",
  backgroundColor = "#FCE7F3"
}) => {
  const [clipId] = useState(() => `star-clip-${Math.random().toString(36).substr(2, 9)}`);
  
  // Rounded 5-pointed star path with smooth curves
  const starPath = "M100,10 C103,30 110,35 130,38 C110,42 103,47 100,67 C97,47 90,42 70,38 C90,35 97,30 100,10 Z M140,60 C143,75 148,78 163,80 C148,83 143,88 140,103 C137,88 132,83 117,80 C132,78 137,75 140,60 Z M60,60 C63,75 68,78 83,80 C68,83 63,88 60,103 C57,88 52,83 37,80 C52,78 57,75 60,60 Z M130,120 C132,132 137,136 148,138 C137,140 132,145 130,157 C128,145 123,140 112,138 C123,136 128,132 130,120 Z M70,120 C72,132 77,136 88,138 C77,140 72,145 70,157 C68,145 63,140 52,138 C63,136 68,132 70,120 Z";

  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        rotate: [0, 1, -1, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      whileHover={{ scale: 1.05, rotate: 5 }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id={clipId}>
            {/* 5-pointed star with rounded tips */}
            <path d="M100,15 L115,70 L175,70 L125,105 L145,160 L100,125 L55,160 L75,105 L25,70 L85,70 Z" />
          </clipPath>
        </defs>
        
        {/* Background */}
        <path
          d="M100,15 L115,70 L175,70 L125,105 L145,160 L100,125 L55,160 L75,105 L25,70 L85,70 Z"
          fill={backgroundColor}
          stroke={borderColor}
          strokeWidth="8"
          strokeLinejoin="round"
        />
        
        {/* Image */}
        <image
          href={src}
          alt={alt}
          width="200"
          height="200"
          clipPath={`url(#${clipId})`}
          preserveAspectRatio="xMidYMid slice"
        />
      </svg>
    </motion.div>
  );
};
