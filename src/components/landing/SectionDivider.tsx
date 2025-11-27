import { motion } from "framer-motion";

interface SectionDividerProps {
  variant?: "wave" | "curve" | "blob";
  flip?: boolean;
  className?: string;
}

export const SectionDivider = ({ 
  variant = "wave", 
  flip = false,
  className = "" 
}: SectionDividerProps) => {
  const wavePath = flip
    ? "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
    : "M0,224L48,208C96,192,192,160,288,160C384,160,480,192,576,208C672,224,768,224,864,208C960,192,1056,160,1152,160C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";

  const curvePath = flip
    ? "M0,160L1440,80L1440,320L0,320Z"
    : "M0,80L1440,160L1440,320L0,320Z";

  const blobPath = flip
    ? "M0,128C240,96,480,64,720,80C960,96,1200,160,1440,128L1440,320L0,320Z"
    : "M0,192C240,224,480,256,720,240C960,224,1200,160,1440,128L1440,320L0,320Z";

  const path = variant === "wave" ? wavePath : variant === "curve" ? curvePath : blobPath;

  return (
    <div className={`relative w-full h-24 md:h-32 overflow-hidden ${className}`}>
      <motion.svg
        className="absolute bottom-0 left-0 w-full h-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.path
          d={path}
          fill="currentColor"
          className="text-warm-section"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </motion.svg>
    </div>
  );
};


