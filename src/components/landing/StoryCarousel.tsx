import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Story {
  id: string;
  title: string;
  cover: string;
  theme: string;
}

interface StoryCarouselProps {
  stories?: Story[];
  autoPlay?: boolean;
}

const defaultStories: Story[] = [
  {
    id: "1",
    title: "The Magic Forest",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    theme: "Adventure",
  },
  {
    id: "2",
    title: "Space Explorer",
    cover: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop",
    theme: "Space",
  },
  {
    id: "3",
    title: "Underwater Kingdom",
    cover: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    theme: "Ocean",
  },
  {
    id: "4",
    title: "Dinosaur Adventure",
    cover: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop",
    theme: "Dinosaurs",
  },
  {
    id: "5",
    title: "Fairy Tale Castle",
    cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=300&fit=crop",
    theme: "Magic",
  },
];

export const StoryCarousel = ({ 
  stories = defaultStories,
  autoPlay = true 
}: StoryCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    // Auto-play
    if (autoPlay) {
      const interval = setInterval(() => {
        emblaApi.scrollNext();
      }, 4000);

      return () => {
        clearInterval(interval);
        emblaApi.off("select", onSelect);
      };
    }

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, autoPlay]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-baloo">
            Explore Magical Stories
          </h2>
          <p className="text-lg text-muted-foreground font-nunito">
            Discover adventures created just for your child
          </p>
        </motion.div>

        {/* Floating Stars Decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-300 rounded-full"
              style={{
                left: `${10 + i * 12}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2 + i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex gap-6">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="flex-[0_0_85%] md:flex-[0_0_40%] lg:flex-[0_0_30%] min-w-0"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all">
                      <div className="relative h-48 md:h-64 overflow-hidden">
                        <img
                          src={story.cover}
                          alt={story.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <span className="inline-block px-3 py-1 bg-primary/90 text-white text-xs font-semibold rounded-full mb-2 font-fredoka">
                            {story.theme}
                          </span>
                          <h3 className="text-white font-bold text-lg font-baloo drop-shadow-lg">
                            {story.title}
                          </h3>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur hover:bg-background rounded-full shadow-lg"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur hover:bg-background rounded-full shadow-lg"
            onClick={scrollNext}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {stories.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === selectedIndex
                  ? "bg-primary w-8"
                  : "bg-muted hover:bg-primary/50"
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

