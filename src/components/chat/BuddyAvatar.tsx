interface BuddyAvatarProps {
  size?: "sm" | "md" | "lg";
  avatar?: string;
  isThinking?: boolean;
}

export function BuddyAvatar({ size = "md", avatar = "🤖", isThinking = false }: BuddyAvatarProps) {
  const sizeClasses = {
    sm: "w-10 h-10 text-2xl",
    md: "w-16 h-16 text-4xl",
    lg: "w-24 h-24 text-6xl",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-white to-child-primary/20 flex items-center justify-center shadow-lg ${
        isThinking ? "animate-bounce" : "animate-float"
      }`}
    >
      {avatar}
    </div>
  );
}
