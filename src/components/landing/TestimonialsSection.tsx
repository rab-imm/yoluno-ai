import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatarColor: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah T.",
    role: "Mom of Two",
    text: "Finally, an AI I trust my 5-year-old with. I set the topics on dinosaurs and emotions—Yoluno weaves them into stories that spark her imagination. Game-changer for solo evenings.",
    avatarColor: "#FBCFE8",
  },
  {
    name: "Mike R.",
    role: "Dad on the Road",
    text: "Traveling for work used to mean missing bedtime. Now, my daughter hears my voice in Yoluno's tales, and I get the recap. It's like I'm there.",
    avatarColor: "#BAE6FD",
  },
  {
    name: "Lena K.",
    role: "Family of Four",
    text: "The kindness journeys? Transformative. My kids went from 'mine!' to sharing stickers. Plus, the reports help me reinforce at dinner.",
    avatarColor: "#FDE68A",
  },
];

const AvatarCircle = ({ name, color }: { name: string; color: string }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center text-base sm:text-lg lg:text-xl font-bold text-gray-800 font-playful"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
};

const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial; delay: number }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      {/* Decorative quote icon */}
      <div className="absolute top-4 right-4 opacity-10 hidden sm:block">
        <Quote className="w-16 h-16 text-purple-400" />
      </div>

      <div className="relative z-10">
        {/* Testimonial Text */}
        <p className="text-gray-700 mb-3 sm:mb-4 md:mb-6 leading-relaxed font-playful text-xs sm:text-sm md:text-base lg:text-lg">
          "{testimonial.text}"
        </p>

        {/* Author Info */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
          <AvatarCircle name={testimonial.name} color={testimonial.avatarColor} />
          <div>
            <h4 className="font-bold text-gray-900 font-playful text-sm sm:text-base md:text-lg">
              {testimonial.name}
            </h4>
            <p className="text-gray-600 font-playful text-[10px] sm:text-xs md:text-sm">
              {testimonial.role}
            </p>
          </div>
        </div>

        {/* Get Early Access Link */}
        <motion.button
          onClick={() => navigate("/auth")}
          className="font-semibold text-[10px] sm:text-xs md:text-sm font-playful flex items-center gap-1 group"
          style={{ color: "#2BD4D0" }}
          whileHover={{ x: 4, color: "#24B8B4" }}
          transition={{ duration: 0.2 }}
        >
          Like {testimonial.name.split(' ')[0]}? Get Early Access
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export const TestimonialsSection = () => {
  return (
    <section className="relative pt-6 sm:pt-8 md:pt-0 pb-10 sm:pb-16 md:pb-20 lg:pb-28 bg-[#FEF6E4] overflow-hidden -mt-6 sm:-mt-8 md:-mt-16">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-purple-200 opacity-10 hidden sm:block"
          style={{ top: "10%", left: "-5%" }}
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
          className="absolute w-48 h-48 rounded-full bg-pink-200 opacity-10 hidden sm:block"
          style={{ bottom: "15%", right: "-3%" }}
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 mb-3 sm:mb-4 md:mb-6 font-playful px-2 leading-tight">
              What Families Are Saying
            </h2>
          </motion.div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                testimonial={testimonial}
                delay={index * 0.15}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
