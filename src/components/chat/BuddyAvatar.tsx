interface BuddyAvatarProps {
  size?: "sm" | "md" | "lg";
  avatar?: string;
  customAvatarUrl?: string;
  isThinking?: boolean;
  isSpeaking?: boolean;
  expression?: "neutral" | "happy" | "thinking" | "excited";
}

export function BuddyAvatar({ 
  size = "md", 
  avatar = "🤖", 
  customAvatarUrl,
  isThinking = false,
  isSpeaking = false,
  expression = "neutral"
}: BuddyAvatarProps) {
  const sizeClasses = {
    sm: "w-10 h-10 text-2xl",
    md: "w-16 h-16 text-4xl",
    lg: "w-24 h-24 text-6xl",
  };

  // Animation classes based on state
  const getAnimationClass = () => {
    if (isThinking) return "animate-bounce";
    if (isSpeaking) return "animate-pulse";
    return "animate-float";
  };

  // Expression-based styling
  const getExpressionStyle = () => {
    switch (expression) {
      case "happy":
        return "from-yellow-200 to-child-primary/30 shadow-yellow-300/50";
      case "thinking":
        return "from-blue-200 to-child-primary/30 shadow-blue-300/50";
      case "excited":
        return "from-pink-200 to-child-primary/30 shadow-pink-300/50";
      default:
        return "from-white to-child-primary/20";
    }
  };

  // Speaking animation with pulsing ring
  const speakingRing = isSpeaking ? (
    <div className="absolute inset-0 rounded-full border-4 border-child-primary/50 animate-ping" />
  ) : null;

  return (
    <div className="relative">
      {speakingRing}
      <div
        className={`
          ${sizeClasses[size]} 
          rounded-full 
          bg-gradient-to-br 
          ${getExpressionStyle()}
          flex items-center justify-center 
          shadow-lg 
          ${getAnimationClass()}
          transition-all duration-300
          relative
          overflow-hidden
        `}
      >
        {customAvatarUrl ? (
          <img 
            src={customAvatarUrl} 
            alt="Buddy avatar" 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="relative z-10">{avatar}</span>
        )}
        
        {/* Breathing effect */}
        {!isThinking && !isSpeaking && (
          <div className="absolute inset-0 bg-white/20 animate-[pulse_4s_ease-in-out_infinite]" />
        )}
      </div>
    </div>
  );
}
