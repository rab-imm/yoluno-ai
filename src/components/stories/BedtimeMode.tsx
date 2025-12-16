import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Pause, Play, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BedtimeModeProps {
  story: {
    title: string;
    content: string;
    audio_content?: string | null;
    illustrations?: any;
    duration_seconds?: number | null;
  };
  childName: string;
  onClose: () => void;
}

export function BedtimeMode({ story, childName, onClose }: BedtimeModeProps) {
  const [phase, setPhase] = useState<"greeting" | "story" | "goodnight">("greeting");
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [currentIllustration, setCurrentIllustration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startStory = () => {
    setPhase("story");
    
    if (story.audio_content) {
      const audio = new Audio(`data:audio/mp3;base64,${story.audio_content}`);
      audioRef.current = audio;
      
      // Simple text display (display all text at once, sync illustrations with time)
      setCurrentText(story.content);
      
      // Update illustrations based on time
      audio.ontimeupdate = () => {
        if (story.duration_seconds && Array.isArray(story.illustrations) && story.illustrations.length > 0) {
          const progress = audio.currentTime / story.duration_seconds;
          const illustrationIndex = Math.min(
            Math.floor(progress * story.illustrations.length),
            story.illustrations.length - 1
          );
          setCurrentIllustration(illustrationIndex);
        }
      };

      audio.onended = () => {
        setPhase("goodnight");
      };

      audio.play();
    } else {
      // Fallback to text-only display
      setCurrentText(story.content);
      setTimeout(() => setPhase("goodnight"), story.content.length * 50);
    }
  };

  const togglePause = () => {
    if (audioRef.current) {
      if (isPaused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onClose();
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/10"
        onClick={handleClose}
      >
        <X className="w-6 h-6" />
      </Button>

      <AnimatePresence mode="wait">
        {phase === "greeting" && (
          <motion.div
            key="greeting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full text-center px-8"
          >
            <motion.div
              className="text-8xl mb-8"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🌙
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Good evening, {childName}!
            </h2>
            <p className="text-xl text-white/80 mb-8">
              I have a special story about you tonight.
            </p>
            <Button
              size="lg"
              onClick={startStory}
              className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
            >
              Start Story
            </Button>
          </motion.div>
        )}

        {phase === "story" && (
          <motion.div
            key="story"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full"
          >
            {/* Title */}
            <div className="text-center pt-8 pb-4 flex-shrink-0">
              <h2 className="text-3xl font-bold text-white">{story.title}</h2>
            </div>

            {/* Illustration */}
            {story.illustrations && story.illustrations.length > 0 && (
              <div className="px-8 pb-6 flex-shrink-0">
                <motion.div
                  key={currentIllustration}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={story.illustrations[currentIllustration]?.imageUrl}
                    alt={`Scene ${currentIllustration + 1}`}
                    className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-2xl shadow-2xl"
                  />
                </motion.div>
              </div>
            )}

            {/* Story Text Section Wrapper */}
            <div className="flex-1 relative">
              {/* Scroll Container - absolutely positioned to fill parent */}
              <div className="absolute inset-0 overflow-y-auto overscroll-contain">
                <div className="px-8 pb-32">
                  <div className="max-w-3xl mx-auto">
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1 }}
                      className="text-xl leading-relaxed text-white/90 whitespace-pre-wrap"
                    >
                      {currentText}
                    </motion.p>
                  </div>
                </div>
              </div>
              
              {/* Top gradient overlay - positioned outside scroll container */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-indigo-950 via-indigo-950/80 to-transparent pointer-events-none z-10" />
              
              {/* Bottom gradient overlay - positioned outside scroll container */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-indigo-950 via-indigo-950/80 to-transparent pointer-events-none z-10" />
              
              {/* Scroll hint - positioned outside scroll container */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-20 left-0 right-0 flex justify-center pointer-events-none"
              >
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ↓
                  </motion.div>
                  Scroll for more
                </div>
              </motion.div>
            </div>

            {/* Controls */}
            <div className="fixed bottom-6 left-0 right-0 flex justify-center z-20">
              <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md rounded-full px-6 py-3">
                {audioRef.current && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={togglePause}
                      className="bg-white/20 hover:bg-white/30 text-white rounded-full w-14 h-14"
                    >
                      {isPaused ? <Play className="w-7 h-7" /> : <Pause className="w-7 h-7" />}
                    </Button>
                    <div className="text-white/70 text-sm">
                      <Volume2 className="w-5 h-5" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {phase === "goodnight" && (
          <motion.div
            key="goodnight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full text-center px-8"
          >
            <motion.div
              className="text-8xl mb-8"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 2 }}
            >
              ⭐
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-4">The End</h2>
            <p className="text-xl text-white/80 mb-8">
              Sweet dreams, {childName}.<br />
              Tomorrow, we'll go on another adventure!
            </p>
            <Button
              size="lg"
              onClick={handleClose}
              className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
            >
              Close
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
