import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAvatarLibrary } from "@/hooks/dashboard/useAvatarLibrary";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AvatarSelectorProps {
  selectedAvatarId: string; // Now accepts avatar_library id or emoji
  onSelect: (avatarId: string, avatarData?: any) => void;
  showLibrary?: boolean; // Toggle between library and emoji fallback
}

export function AvatarSelector({ selectedAvatarId, onSelect, showLibrary = true }: AvatarSelectorProps) {
  const [category, setCategory] = useState<string>("all");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  const { data: avatars = [], isLoading } = useAvatarLibrary(category);

  if (!showLibrary) {
    // Fallback to emoji avatars (for backward compatibility)
    const EMOJI_AVATARS = [
      { emoji: "🤖", name: "Robot" },
      { emoji: "🦄", name: "Unicorn" },
      { emoji: "🐉", name: "Dragon" },
      { emoji: "🚀", name: "Rocket" },
      { emoji: "🦖", name: "Dinosaur" },
      { emoji: "🐱", name: "Cat" },
      { emoji: "🐶", name: "Dog" },
      { emoji: "🦊", name: "Fox" },
      { emoji: "🐼", name: "Panda" },
      { emoji: "🦁", name: "Lion" },
      { emoji: "🐸", name: "Frog" },
      { emoji: "🐙", name: "Octopus" },
    ];

    return (
      <div className="space-y-3">
        <Label>Choose Buddy Avatar</Label>
        <div className="grid grid-cols-6 gap-2">
          {EMOJI_AVATARS.map((avatar) => (
            <button
              key={avatar.emoji}
              onClick={() => onSelect(avatar.emoji)}
              className={`
                aspect-square rounded-xl flex items-center justify-center text-3xl
                transition-all duration-200 hover:scale-110
                ${
                  selectedAvatarId === avatar.emoji
                    ? "bg-child-primary shadow-lg ring-2 ring-child-primary ring-offset-2"
                    : "bg-secondary hover:bg-secondary/80"
                }
              `}
              title={avatar.name}
            >
              {avatar.emoji}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-lg font-bold">Choose Your Buddy Character</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Select a Pixar-style character that will be your child's learning companion
        </p>
      </div>

      <Tabs value={category} onValueChange={setCategory} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="animal">Animals</TabsTrigger>
          <TabsTrigger value="fantasy">Fantasy</TabsTrigger>
          <TabsTrigger value="everyday">Everyday</TabsTrigger>
        </TabsList>

        <TabsContent value={category} className="mt-4">
          {isLoading ? (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl" />
              ))}
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="popLayout">
                {avatars.map((avatar) => {
                  const isSelected = selectedAvatarId === avatar.id;
                  const isHovered = hoveredId === avatar.id;
                  
                  return (
                    <motion.button
                      key={avatar.id}
                      onClick={() => onSelect(avatar.id, avatar)}
                      onHoverStart={() => setHoveredId(avatar.id)}
                      onHoverEnd={() => setHoveredId(null)}
                      className={`
                        relative group aspect-square rounded-2xl overflow-hidden
                        transition-all duration-300 cursor-pointer
                        ${
                          isSelected
                            ? "ring-4 ring-primary shadow-2xl scale-105"
                            : "hover:scale-105 hover:shadow-xl"
                        }
                      `}
                      style={{
                        background: isSelected
                          ? `linear-gradient(135deg, ${avatar.primary_color}, ${avatar.secondary_color})`
                          : "hsl(var(--muted))",
                      }}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Avatar Image */}
                      <div className="relative w-full h-full p-2">
                        <img
                          src={isHovered ? avatar.avatar_happy : avatar.avatar_neutral}
                          alt={avatar.character_name}
                          className="w-full h-full object-cover rounded-xl transition-all duration-300"
                        />
                        
                        {/* Character Name Overlay */}
                        <div 
                          className={`
                            absolute inset-x-0 bottom-0 p-2 text-center
                            bg-gradient-to-t from-black/80 to-transparent
                            transition-all duration-300
                            ${isHovered || isSelected ? 'opacity-100' : 'opacity-0'}
                          `}
                        >
                          <p className="text-xs font-bold text-white truncate">
                            {avatar.character_name}
                          </p>
                        </div>

                        {/* Selected Checkmark */}
                        {isSelected && (
                          <motion.div
                            className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}

          {!isLoading && avatars.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">No characters found in this category.</p>
              <p className="text-sm mt-2">Try selecting a different category or contact support.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Selected Character Info */}
      {selectedAvatarId && avatars.find(a => a.id === selectedAvatarId) && (
        <motion.div
          className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3">
            <img
              src={avatars.find(a => a.id === selectedAvatarId)?.avatar_happy}
              alt="Selected character"
              className="w-16 h-16 rounded-xl"
            />
            <div className="flex-1">
              <h4 className="font-bold text-lg">
                {avatars.find(a => a.id === selectedAvatarId)?.character_name}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {avatars.find(a => a.id === selectedAvatarId)?.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
