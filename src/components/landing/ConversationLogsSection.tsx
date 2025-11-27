import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

export const ConversationLogsSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 lg:py-28 bg-[#FEF6E4] overflow-hidden">
      <div className="container mx-auto px-[30px] relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Card */}
            <div className="bg-[#FEF6E4] rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-200 mb-6">
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
    </section>
  );
};

