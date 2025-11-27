import { motion } from "framer-motion";

interface ShapeImageProps {
  src: string;
  alt: string;
  className?: string;
  borderColor?: string;
  backgroundColor?: string;
}

export const BlobImage: React.FC<ShapeImageProps> = ({ 
  src, 
  alt, 
  className = "",
  borderColor = "#60A5FA",
  backgroundColor = "#DBEAFE"
}) => {
  // Wavy blob shape using organic border-radius
  const blobRadius = "30% 70% 70% 30% / 30% 30% 70% 70%";

  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        background: backgroundColor,
        border: `4px solid ${borderColor}`,
        borderRadius: blobRadius,
        padding: "12px",
        minHeight: "100%",
        width: "100%",
        height: "100%",
      }}
      whileHover={{ scale: 1.05, rotate: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div 
        className="absolute overflow-hidden" 
        style={{ 
          borderRadius: blobRadius,
          top: "12px",
          right: "12px",
          bottom: "12px",
          left: "12px",
          width: "calc(100% - 24px)",
          height: "calc(100% - 24px)",
        }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          style={{
            borderRadius: blobRadius,
            display: "block",
          }}
          onError={(e) => {
            console.error("Image failed to load:", src);
            (e.target as HTMLImageElement).style.backgroundColor = backgroundColor;
          }}
        />
      </div>
    </motion.div>
  );
};
