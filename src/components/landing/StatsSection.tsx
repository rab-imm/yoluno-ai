import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import PlaneIcon from "../../assets/plane.svg";

interface StatItemProps {
  endValue: string;
  label: string;
  delay?: number;
}

const AnimatedCounter = ({ endValue, delay = 0 }: { endValue: string; delay?: number }) => {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (!isInView) return;
    
    const timeout = setTimeout(() => {
      // Extract number and suffix
      const match = endValue.match(/^(\d+)(.*)$/);
      if (!match) {
        setDisplayValue(endValue);
        return;
      }
      
      const [, numStr, suffix] = match;
      const target = parseInt(numStr);
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setDisplayValue(endValue);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current) + suffix);
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [isInView, endValue, delay]);
  
  return <span ref={ref}>{displayValue}</span>;
};

const StatItem = ({ endValue, label, delay = 0 }: StatItemProps) => {
  return (
    <motion.div
      className="text-center p-6 bg-white rounded-xl shadow-sm"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <motion.div 
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-purple-600 mb-2 font-playful"
        initial={{ scale: 0.5 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.2, type: "spring" }}
      >
        <AnimatedCounter endValue={endValue} delay={delay * 1000} />
      </motion.div>
      <p className="text-sm md:text-base text-gray-800 font-playful">
        {label}
      </p>
    </motion.div>
  );
};

export const StatsSection = () => {
  return (
    <section className="relative py-12 lg:py-16 bg-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-20 h-20 rounded-full bg-purple-200 opacity-10"
          style={{ top: "15%", left: "8%" }}
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
        <motion.div
          className="absolute w-16 h-16 rounded-full bg-pink-200 opacity-10"
          style={{ bottom: "20%", right: "10%" }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="bg-purple-50/60 rounded-3xl p-6 lg:p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            {/* Left Side - Text */}
            <motion.div
              className="text-left"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 font-playful">
                Numbers That Tell Our Story
              </h2>
              <p className="text-base md:text-lg text-gray-700 font-playful leading-relaxed">
                Behind every number is a child's laugh, a parent's peace of mind, and a team that truly cares every single day.
              </p>
            </motion.div>

            {/* Right Side - Stats Cards */}
            <div className="relative">
              <div className="grid grid-cols-3 gap-4 relative">
                <StatItem 
                  endValue="10+" 
                  label="Years Of Experience"
                  delay={0.1}
                />
                
                {/* Paper airplane between first and second card */}
                <motion.div
                  className="hidden md:block absolute top-1/2 left-[calc(33.333%-8px)] transform -translate-y-1/2 z-10 pointer-events-none"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 0.4, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <img 
                    src={PlaneIcon} 
                    alt="plane" 
                    className="w-5 h-5"
                    style={{ filter: "brightness(0.6)" }}
                  />
                </motion.div>
                
                <StatItem 
                  endValue="25K+" 
                  label="Smiles Shared"
                  delay={0.2}
                />
                
                {/* Paper airplane between second and third card */}
                <motion.div
                  className="hidden md:block absolute top-1/2 left-[calc(66.666%-8px)] transform -translate-y-1/2 z-10 pointer-events-none"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 0.4, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <img 
                    src={PlaneIcon} 
                    alt="plane" 
                    className="w-5 h-5"
                    style={{ filter: "brightness(0.6)" }}
                  />
                </motion.div>
                
                <StatItem 
                  endValue="8" 
                  label="Total Groups"
                  delay={0.3}
                />
              </div>
            </div>
          </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
