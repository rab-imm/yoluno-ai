import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BuddyAvatarProps {
  avatar: string; // Can be emoji or avatar_library_id
  customAvatarUrl?: string;
  avatarLibraryId?: string;
  isSpeaking?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  expression?: "neutral" | "happy" | "thinking" | "excited";
}

export function BuddyAvatar({
  avatar,
  customAvatarUrl,
  avatarLibraryId,
  isSpeaking = false,
  className,
  size = "md",
  expression: propExpression,
}: BuddyAvatarProps) {
  // Use propExpression if provided, otherwise determine based on isSpeaking
  const expression = propExpression || (isSpeaking ? "excited" : "neutral");

  // Fetch avatar from library if avatarLibraryId is provided
  const { data: avatarData } = useQuery({
    queryKey: ["avatar-library-single", avatarLibraryId],
    queryFn: async () => {
      if (!avatarLibraryId) return null;
      
      const { data, error } = await supabase
        .from("avatar_library")
        .select("*")
        .eq("id", avatarLibraryId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!avatarLibraryId,
    staleTime: 10 * 60 * 1000,
  });

  const sizeClasses = {
    sm: "w-12 h-12 text-2xl",
    md: "w-16 h-16 text-3xl",
    lg: "w-24 h-24 text-4xl",
    xl: "w-32 h-32 text-5xl",
    "2xl": "w-40 h-40 text-6xl",
    "3xl": "w-48 h-48 text-7xl",
  };

  // Priority: avatarData > customAvatarUrl > emoji
  const getAvatarSource = () => {
    if (avatarData) {
      // Get the correct expression from avatar library
      const expressionKey = `avatar_${expression}` as keyof typeof avatarData;
      return avatarData[expressionKey] as string;
    }
    if (customAvatarUrl) {
      return customAvatarUrl;
    }
    return null;
  };

  const avatarSource = getAvatarSource();

  if (avatarSource) {
    return (
      <motion.div
        className={cn(
          "rounded-full overflow-hidden shadow-2xl relative",
          sizeClasses[size],
          className
        )}
        animate={{
          scale: isSpeaking ? [1, 1.05, 1] : 1,
          rotate: isSpeaking ? [0, -2, 2, 0] : 0,
        }}
        transition={{
          duration: 0.6,
          repeat: isSpeaking ? Infinity : 0,
          ease: "easeInOut",
        }}
        style={{
          border: avatarData
            ? `4px solid ${avatarData.primary_color}`
            : "4px solid hsl(var(--child-accent))",
          boxShadow: isSpeaking
            ? `0 0 30px ${avatarData?.primary_color || "hsl(var(--child-primary))"}`
            : undefined,
        }}
      >
        <img
          src={avatarSource}
          alt="Buddy avatar"
          className="w-full h-full object-cover"
        />
        
        {/* Speaking indicator */}
        {isSpeaking && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.div>
    );
  }

  // Fallback to emoji
  return (
    <motion.div
      className={cn(
        "rounded-full flex items-center justify-center",
        "bg-gradient-to-br from-child-primary to-child-secondary",
        "border-4 border-child-accent shadow-xl",
        sizeClasses[size],
        className
      )}
      animate={{
        scale: isSpeaking ? [1, 1.1, 1] : expression === "thinking" ? [1, 1.05, 1] : 1,
      }}
      transition={{
        duration: 0.5,
        repeat: isSpeaking || expression === "thinking" ? Infinity : 0,
      }}
    >
      <span className={expression === "thinking" ? "animate-pulse" : ""}>
        {avatar}
      </span>
    </motion.div>
  );
}
