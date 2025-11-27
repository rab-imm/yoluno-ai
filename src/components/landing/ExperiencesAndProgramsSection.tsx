import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, Shield, CheckCircle, Eye } from "lucide-react";

// Decorative cloud shape for text background
const CloudShape = ({ className = "", fillColor = "#FBCFE8" }: { className?: string; fillColor?: string }) => (
  <svg
    width="200"
    height="80"
    viewBox="0 0 200 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`absolute ${className}`}
    style={{ opacity: 0.3 }}
  >
    <path
      d="M20 40C10 40 0 45 0 55C0 60 5 65 15 65C20 65 25 63 28 60C35 63 42 60 42 52C42 48 40 45 37 43C42 42 46 38 46 33C46 28 41 25 36 25C34 25 32 26 31 27C30 26 28 25 26 25C24 25 22 26 20 25C20 23 20 22 20 20C20 15 15 12 10 12C5 12 0 15 0 20C0 22 0 23 0 25C0 27 0 28 0 30C0 35 5 38 10 38C12 38 14 37 15 36C16 37 18 38 20 38C25 38 30 35 30 30C30 28 29 26 28 25C29 24 30 22 30 20C30 15 25 12 20 12C15 12 10 15 10 20C10 22 10 23 10 25C10 27 10 28 10 30C10 35 15 38 20 38Z"
      fill={fillColor}
    />
  </svg>
);

export const ExperiencesAndProgramsSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 lg:py-28 bg-[#FEF6E4] overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Our Amazing Programs Section */}
          <div>
            {/* Section Header */}
            <motion.div
              className="text-center mb-12 relative"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Decorative cloud behind "Our amazing" */}
              <CloudShape className="top-0 left-1/4 -translate-y-4" fillColor="#BAE6FD" />
              
              {/* Spark decorative element */}
              <div className="absolute top-0 right-1/4 opacity-30">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2 L13 8 L19 8 L14 12 L16 18 L12 14 L8 18 L10 12 L5 8 L11 8 Z" fill="#FBCFE8" />
                </svg>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-8 font-playful relative z-10">
              Gentle, Smart, Emotionally Aware.
              </h2>
            </motion.div>

            {/* Cards Section */}
            <div className="flex flex-wrap justify-center gap-4 lg:gap-6 px-4">
              {[
                { text: "Yoluno doesn't just respond.", bgColor: "#E0F2FE", circleColor: "#60A5FA", borderColor: "#BAE6FD" },
                { text: "It listens.", bgColor: "#FCE7F3", circleColor: "#F472B6", borderColor: "#FBCFE8" },
                { text: "It encourages.", bgColor: "#FEF3C7", circleColor: "#FCD34D", borderColor: "#FDE68A" },
                { text: "And it grows with your child.", bgColor: "#E9D5FF", circleColor: "#A78BFA", borderColor: "#D8B4FE" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="inline-flex rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 border-2"
                  style={{ 
                    backgroundColor: item.bgColor,
                    borderColor: item.borderColor
                  }}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.15, 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -8,
                    borderColor: "#2BD4D0",
                    boxShadow: "0 12px 24px rgba(43, 212, 208, 0.2)"
                  }}
                >
                  <div className="flex items-center gap-3">
                    {/* Decorative circle */}
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.circleColor }}
                    />
                    <p className="text-base md:text-lg font-semibold text-gray-900 font-playful whitespace-nowrap">
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Safety Features Section */}
          <div className="mt-20 lg:mt-28">
            {/* Section Header */}
            <motion.div
              className="text-center mb-12 relative"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Padlock Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 font-playful relative z-10">
                Designed with Child Psychologists + AI Experts.
              </h2>
              <p className="text-lg md:text-xl text-gray-700 font-playful max-w-3xl mx-auto leading-relaxed">
                Your family's safety is not a feature. <span className="font-bold">It's the foundation.</span>
              </p>
            </motion.div>

            {/* Safety Cards Grid */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: <Lock className="w-8 h-8" style={{ color: "#60A5FA" }} />,
                  title: "Parent Allowlist Only",
                  description: "Every piece of content starts with your green light.",
                  bgColor: "#F0F9FF",
                  borderColor: "#BFDBFE",
                  iconBgColor: "#DBEAFE",
                },
                {
                  icon: <Shield className="w-8 h-8" style={{ color: "#34D399" }} />,
                  title: "Closed Knowledge Sandbox",
                  description: "Responses drawn exclusively from your approved library.",
                  bgColor: "#F0FDF4",
                  borderColor: "#BBF7D0",
                  iconBgColor: "#D1FAE5",
                },
                {
                  icon: <CheckCircle className="w-8 h-8" style={{ color: "#A78BFA" }} />,
                  title: "Child-Safe Tone & Filters",
                  description: "Warm, age-appropriate language with built-in empathy.",
                  bgColor: "#FAF5FF",
                  borderColor: "#E9D5FF",
                  iconBgColor: "#F3E8FF",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="rounded-xl p-6 border-2 shadow-sm hover:shadow-md transition-all duration-300"
                  style={{
                    backgroundColor: feature.bgColor,
                    borderColor: feature.borderColor,
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.15, 
                    duration: 0.5 
                  }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -4,
                    borderColor: "#2BD4D0"
                  }}
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Icon */}
                    <div 
                      className="mb-4 w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: feature.iconBgColor }}
                    >
                      {feature.icon}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 font-playful">
                      {feature.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-700 font-playful leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Full Conversation Logs Section */}
          <div className="mt-20 lg:mt-28">
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Main Card */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-200 mb-6">
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Eye className="w-8 h-8 text-blue-600" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 font-playful">
                      Full Conversation Logs
                    </h3>
                    <p className="text-gray-700 font-playful leading-relaxed mb-4">
                      Review, export, or share anytime. Plus, automatic alerts for any flagged moments.
                    </p>
                    <p className="text-gray-600 italic font-playful text-sm">
                      Our Safety Charter outlines it all—audited annually for COPPA compliance.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex justify-center">
                <motion.button
                  onClick={() => navigate("/safety")}
                  className="rounded-xl px-8 py-4 shadow-md hover:shadow-lg transition-all duration-300 text-white font-semibold font-playful"
                  style={{ backgroundColor: "#2BD4D0" }}
                  whileHover={{ scale: 1.05, y: -2, backgroundColor: "#24B8B4" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Read Our Safety Charter
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

