import { motion } from "framer-motion";

interface ShapeImageProps {
  src: string;
  alt: string;
  className?: string;
  borderColor?: string;
  backgroundColor?: string;
}

export const CloudImage: React.FC<ShapeImageProps> = ({ 
  src, 
  alt, 
  className = "",
  borderColor = "#FCD34D",
  backgroundColor = "#FEF3C7"
}) => {
  // Fluffy cloud shape using organic border-radius
  const cloudRadius = "60% 40% 50% 50% / 55% 45% 55% 45%";

  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        background: backgroundColor,
        border: `4px solid ${borderColor}`,
        borderRadius: cloudRadius,
        padding: "12px",
      }}
      animate={{
        y: [0, -5, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      whileHover={{ scale: 1.05, rotate: 2 }}
    >
      <div className="absolute inset-3 overflow-hidden" style={{ borderRadius: cloudRadius }}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          style={{
            borderRadius: cloudRadius,
          }}
        />
      </div>
    </motion.div>
  );
};
