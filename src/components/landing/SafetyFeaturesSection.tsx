import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, Shield, CheckCircle, Eye } from "lucide-react";
import { WavyCTAButton } from "./WavyCTAButton";
import FamilyConnectionImage from "@/assets/family-connection.jpg";

// Top Wave Component
const WaveTop = () => (
    <svg className="w-full h-auto block" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '80px', minHeight: '60px' }}>
        <path fill="#EDF7FF" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
    </svg>
);
// Bottom Wave Component
const WaveBottom = () => (
    <svg className="w-full h-auto block -mt-px" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="#EDF7FF" fillOpacity="1" d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,122.7C672,107,768,117,864,138.7C960,160,1056,192,1152,186.7C1248,181,1344,139,1392,117.3L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
    </svg>
);
export const SafetyFeaturesSection = () => {
    const navigate = useNavigate();

    return (
        <div className="relative w-full">
            {/* Top Wave */}
            <div className="relative -mb-px">
                <WaveTop />
            </div>
            <section className="relative py-0 bg-[#EDF7FF] overflow-hidden -mb-4">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-7xl mx-auto pt-4 sm:pt-6 md:pt-8 lg:pt-12 pb-2">
                        {/* Hero Section - Text Left, Image Right */}
                        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center mb-4 sm:mb-6 lg:mb-8">
                            {/* Left Side - Text Content */}
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 mb-2 sm:mb-3 md:mb-4 font-playful leading-tight relative z-10">
                                    Designed with Child Psychologists + AI Experts.
                                </h2>
                                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 font-playful leading-relaxed relative z-10">
                                    Your family's safety is not a feature. <span className="font-bold">It's the foundation.</span>
                                </p>
                            </motion.div>

                            {/* Right Side - Image */}
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <div className="relative w-full max-w-lg mx-auto">
                                    <div className="w-full h-auto rounded-2xl overflow-hidden" style={{ aspectRatio: "1 / 1", minHeight: "200px" }}>
                                        <img 
                                            src={FamilyConnectionImage} 
                                            alt="Family connection" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Safety Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                            {[
                                {
                                    icon: <Lock className="w-8 h-8" />,
                                    title: "Parent Allowlist Only",
                                    description: "Every piece of content starts with your green light.",
                                    borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                                },
                                {
                                    icon: <Shield className="w-8 h-8" />,
                                    title: "Closed Knowledge Sandbox",
                                    description: "Responses drawn exclusively from your approved library.",
                                    borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
                                },
                                {
                                    icon: <CheckCircle className="w-8 h-8" />,
                                    title: "Child-Safe Tone & Filters",
                                    description: "Warm, age-appropriate language with built-in empathy.",
                                    borderRadius: "50% 50% 50% 50% / 60% 40% 60% 40%",
                                },
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-300"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: index * 0.15,
                                        duration: 0.5
                                    }}
                                    whileHover={{
                                        scale: 1.02,
                                        y: -4
                                    }}
                                >
                                    <div className="flex flex-row items-start gap-2 sm:gap-3 text-left">
                                        {/* Icon */}
                                        <div
                                            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center flex-shrink-0 bg-white"
                                            style={{ borderRadius: feature.borderRadius }}
                                        >
                                            <div className="text-black">
                                                {feature.icon}
                                            </div>
                                        </div>
                                        {/* Text Content */}
                                        <div className="flex-1">
                                            {/* Title */}
                                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2 font-playful">
                                                {feature.title}
                                            </h3>
                                            {/* Description */}
                                            <p className="text-xs sm:text-sm md:text-base text-gray-700 font-playful leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Full Conversation Logs Section */}
                        <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-16">
                            <motion.div
                                className="max-w-4xl mx-auto"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                {/* Main Card */}
                                <div className="rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 mb-0 bg-[#F4D5F7]">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                                        {/* Icon */}
                                        <div
                                            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center flex-shrink-0 bg-white"
                                            style={{ borderRadius: "40% 60% 60% 40% / 70% 30% 70% 30%" }}
                                        >
                                            <div className="text-black">
                                                <Eye className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 w-full sm:w-auto">
                                            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 font-playful">
                                                Full Conversation Logs
                                            </h3>
                                            <p className="text-xs sm:text-sm md:text-base text-gray-700 font-playful leading-relaxed mb-2 sm:mb-3">
                                                Review, export, or share anytime. Plus, automatic alerts for any flagged moments.
                                            </p>
                                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 italic font-playful">
                                                Our Safety Charter outlines it all—audited annually for COPPA compliance.
                                            </p>
                                        </div>

                                        {/* CTA Button */}
                                        <div className="flex items-center flex-shrink-0 w-full sm:w-auto">
                                            <WavyCTAButton
                                                onClick={() => navigate("/safety")}
                                                text="Read Our Safety Charter"
                                                size="sm"
                                                className="w-full sm:w-auto"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Bottom Wave */}
            <WaveBottom />
        </div>
    );
};
