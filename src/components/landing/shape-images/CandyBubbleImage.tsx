import { motion } from "framer-motion";

interface ShapeImageProps {
  src: string;
  alt: string;
  className?: string;
  borderColor?: string;
  backgroundColor?: string;
}

export const CandyBubbleImage: React.FC<ShapeImageProps> = ({ 
  src, 
  alt, 
  className = "",
  borderColor = "#A78BFA",
  backgroundColor = "#F3E8FF"
}) => {
  return (
    <motion.div
      className={`relative rounded-full ${className}`}
      style={{
        background: backgroundColor,
        border: `4px solid ${borderColor}`,
        padding: "12px",
      }}
      animate={{
        scale: [1, 1.02, 1],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      whileHover={{ scale: 1.08, rotate: -3 }}
    >
      <div className="absolute inset-3 rounded-full overflow-hidden">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    </motion.div>
  );
};
