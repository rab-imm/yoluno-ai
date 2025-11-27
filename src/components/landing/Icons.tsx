// Icons for the Nurturing childcare website

export const BabyFootprintIcon = ({ className = "", size = 20 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2C10 2 8 3 8 5C8 7 10 8 12 8C14 8 16 7 16 5C16 3 14 2 12 2Z"
      fill="currentColor"
    />
    <path
      d="M7 9C5 9 3 10 3 12C3 14 5 15 7 15C9 15 11 14 11 12C11 10 9 9 7 9Z"
      fill="currentColor"
    />
    <path
      d="M17 9C15 9 13 10 13 12C13 14 15 15 17 15C19 15 21 14 21 12C21 10 19 9 17 9Z"
      fill="currentColor"
    />
    <path
      d="M12 16C10 16 8 17 8 19C8 21 10 22 12 22C14 22 16 21 16 19C16 17 14 16 12 16Z"
      fill="currentColor"
    />
  </svg>
);

export const BunnyFaceIcon = ({ className = "", size = 90 }: { className?: string; size?: number }) => (
  <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    {/* Bunny ears - extending upward */}
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
      <div 
        className="rounded-full bg-[#9333EA]" 
        style={{ 
          width: size * 0.25, 
          height: size * 0.4,
          transform: "rotate(15deg)",
        }}
      ></div>
      <div 
        className="rounded-full bg-[#9333EA]" 
        style={{ 
          width: size * 0.25, 
          height: size * 0.4,
          transform: "rotate(-15deg)",
        }}
      ></div>
    </div>
    {/* Bunny face circle */}
    <div 
      className="rounded-full bg-white border-4 border-gray-300 relative overflow-hidden shadow-md"
      style={{ width: size, height: size }}
    >
      {/* Inner pink tint */}
      <div className="absolute inset-0 bg-pink-50 opacity-30"></div>
      {/* Eyes */}
      <div 
        className="absolute rounded-full bg-black"
        style={{ 
          top: "30%", 
          left: "28%", 
          width: size * 0.12, 
          height: size * 0.12 
        }}
      ></div>
      <div 
        className="absolute rounded-full bg-black"
        style={{ 
          top: "30%", 
          right: "28%", 
          width: size * 0.12, 
          height: size * 0.12 
        }}
      ></div>
      {/* Nose */}
      <div 
        className="absolute rounded-full bg-pink-300"
        style={{ 
          top: "45%", 
          left: "50%", 
          transform: "translateX(-50%)",
          width: size * 0.08, 
          height: size * 0.08 
        }}
      ></div>
      {/* Mouth */}
      <div 
        className="absolute"
        style={{ 
          top: "52%", 
          left: "50%", 
          transform: "translateX(-50%)",
          width: size * 0.3, 
          height: size * 0.15 
        }}
      >
        <div 
          className="w-full h-full border-2 border-black border-t-transparent rounded-b-full"
        ></div>
      </div>
    </div>
  </div>
);

export const HeartIcon = ({ className = "", size = 16 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
    />
  </svg>
);

export const SunIcon = ({ className = "", size = 16 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" />
    <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" />
    <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" />
    <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// Feature icons matching the design
export const TeddyBearIcon = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Star */}
    <path d="M20 2L22 8L28 8L23 12L25 18L20 14L15 18L17 12L12 8L18 8L20 2Z" fill="currentColor" />
    {/* Teddy bear head */}
    <circle cx="20" cy="28" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
    {/* Eyes */}
    <circle cx="17" cy="26" r="1.5" fill="currentColor" />
    <circle cx="23" cy="26" r="1.5" fill="currentColor" />
    {/* Nose */}
    <ellipse cx="20" cy="29" rx="1" ry="1.5" fill="currentColor" />
    {/* Mouth */}
    <path d="M18 31 Q20 32 22 31" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
);

export const FamilyIcon = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Adult 1 */}
    <circle cx="12" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M12 14 L12 22" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 18 L12 18 L12 22 L16 18" stroke="currentColor" strokeWidth="1.5" fill="none" />
    {/* Adult 2 */}
    <circle cx="28" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M28 14 L28 22" stroke="currentColor" strokeWidth="1.5" />
    <path d="M24 18 L28 18 L28 22 L32 18" stroke="currentColor" strokeWidth="1.5" fill="none" />
    {/* Child 1 */}
    <circle cx="16" cy="26" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M16 29 L16 34" stroke="currentColor" strokeWidth="1.5" />
    {/* Child 2 */}
    <circle cx="24" cy="26" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M24 29 L24 34" stroke="currentColor" strokeWidth="1.5" />
    {/* Hands connecting */}
    <path d="M16 18 L20 20 L24 18" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

export const BowlSteamIcon = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Bowl */}
    <ellipse cx="20" cy="28" rx="12" ry="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M8 28 L8 24 Q8 20 12 20 L28 20 Q32 20 32 24 L32 28" stroke="currentColor" strokeWidth="1.5" fill="none" />
    {/* Steam lines */}
    <path d="M14 18 Q14 14 14 10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M20 18 Q20 14 20 10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M26 18 Q26 14 26 10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
);

export const TreeBirdIcon = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Tree trunk */}
    <rect x="18" y="20" width="4" height="12" fill="currentColor" />
    {/* Tree top */}
    <path d="M20 8 Q12 12 8 20 Q8 28 12 28 Q12 24 16 20 Q16 16 20 12 Q24 16 24 20 Q28 24 28 28 Q32 28 32 20 Q28 12 20 8Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    {/* Bird on branch */}
    <circle cx="24" cy="22" r="2" fill="currentColor" />
    <path d="M22 22 L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M26 22 L28 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const MoonSleepIcon = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Crescent moon */}
    <path d="M20 8 Q28 12 30 20 Q28 28 20 32 Q16 28 16 20 Q16 12 20 8Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M20 8 Q24 10 25 15 Q24 20 20 22" stroke="currentColor" strokeWidth="1.5" fill="currentColor" />
    {/* Z's for sleep */}
    <path d="M12 26 L16 26 M14 28 L18 28 M16 30 L20 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const DoorArrowIcon = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Door frame */}
    <rect x="10" y="8" width="20" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" />
    {/* Door */}
    <rect x="12" y="10" width="16" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" />
    {/* Door handle */}
    <circle cx="24" cy="20" r="1.5" fill="currentColor" />
    {/* Arrow pointing out */}
    <path d="M30 20 L34 20 M32 18 L34 20 L32 22" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Icons for "Building bright futures" section
export const DailyUpdatesIcon = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Clock circle */}
    <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="1.5" fill="none" />
    {/* Clock hands */}
    <line x1="20" y1="20" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="20" y1="20" x2="26" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Refresh arrow */}
    <path d="M10 14 Q8 12 8 10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M8 10 L6 10 L6 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Checkmark */}
    <path d="M28 14 L30 16 L32 12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const WorkshopsEventsIcon = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Calendar */}
    <rect x="8" y="10" width="24" height="22" stroke="currentColor" strokeWidth="1.5" fill="none" rx="2" />
    <line x1="20" y1="10" x2="20" y2="32" stroke="currentColor" strokeWidth="1.5" />
    <line x1="8" y1="18" x2="32" y2="18" stroke="currentColor" strokeWidth="1.5" />
    {/* Highlighted date square */}
    <rect x="12" y="22" width="6" height="6" fill="currentColor" rx="1" />
  </svg>
);

export const SharedGoalsIcon = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Target circle */}
    <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="20" cy="20" r="4" fill="currentColor" />
    {/* Arrow pointing to center */}
    <path d="M8 20 L12 20 M10 18 L12 20 L10 22" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    {/* Checkmark at center */}
    <path d="M18 20 L19 21 L22 18" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Icons for "What Your Child Experiences" section
export const WarmWelcomeIcon = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Two hands shaking */}
    <path d="M8 20 Q8 16 12 16 Q14 16 14 18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M14 18 L14 24 Q14 26 16 26 Q18 26 18 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M32 20 Q32 16 28 16 Q26 16 26 18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M26 18 L26 24 Q26 26 24 26 Q22 26 22 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Heart above */}
    <path d="M20 8 Q18 10 18 12 Q18 14 20 16 Q22 14 22 12 Q22 10 20 8Z" fill="currentColor" />
  </svg>
);

export const PlayfulLearningIcon = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Block A */}
    <rect x="8" y="12" width="8" height="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M10 16 L14 16 M12 14 L12 18" stroke="currentColor" strokeWidth="1.5" />
    {/* Block B */}
    <rect x="16" y="12" width="8" height="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M18 14 L20 14 M18 16 L20 16 M18 18 L20 18" stroke="currentColor" strokeWidth="1.5" />
    {/* Block C */}
    <rect x="24" y="12" width="8" height="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M26 16 Q28 14 30 16" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

export const EmotionalGrowthIcon = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Two hands cupping */}
    <path d="M10 22 Q10 18 14 18 Q16 18 16 20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M16 20 Q16 24 20 26 Q24 24 24 20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M24 20 Q24 18 26 18 Q30 18 30 22" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Heart in center */}
    <path d="M20 20 Q18 22 18 24 Q18 26 20 28 Q22 26 22 24 Q22 22 20 20Z" fill="currentColor" />
  </svg>
);

export const ParentConnectionIcon = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Left hand */}
    <path d="M6 24 Q6 20 10 20 Q12 20 12 22" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M12 22 L12 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Right hand */}
    <path d="M34 24 Q34 20 30 20 Q28 20 28 22" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M28 22 L28 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Heart in center */}
    <path d="M20 18 Q18 20 18 22 Q18 24 20 26 Q22 24 22 22 Q22 20 20 18Z" fill="currentColor" />
  </svg>
);

export const CelebratingMilestonesIcon = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Target circle */}
    <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="20" cy="20" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
    {/* Star in center */}
    <path d="M20 14 L21 17 L24 17 L21.5 19 L22.5 22 L20 20 L17.5 22 L18.5 19 L16 17 L19 17 Z" fill="currentColor" />
  </svg>
);

export const ComfortingRoutinesIcon = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Calendar */}
    <rect x="10" y="8" width="20" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" rx="2" />
    <line x1="20" y1="8" x2="20" y2="32" stroke="currentColor" strokeWidth="1.5" />
    <line x1="10" y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="1.5" />
    {/* Checkmarks */}
    <path d="M14 22 L16 24 L18 22" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 28 L16 30 L18 28" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const HealthyHabitsIcon = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Milk bottle */}
    <rect x="12" y="10" width="6" height="14" stroke="currentColor" strokeWidth="1.5" fill="none" rx="1" />
    <path d="M12 10 Q15 8 18 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
    {/* Carrot */}
    <path d="M22 16 L26 12 L26 20 Q26 24 24 26 Q22 24 22 20 Z" fill="currentColor" />
    <path d="M24 26 L24 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M22 30 L26 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const CreativeExplorationIcon = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Palette */}
    <path d="M10 18 Q10 14 14 14 L26 14 Q30 14 30 18 L30 26 Q30 30 26 30 L14 30 Q10 30 10 26 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    {/* Color dots */}
    <circle cx="16" cy="20" r="2" fill="#EF4444" />
    <circle cx="20" cy="20" r="2" fill="#3B82F6" />
    <circle cx="24" cy="20" r="2" fill="#10B981" />
    {/* Brush */}
    <rect x="26" y="12" width="4" height="8" rx="1" fill="currentColor" />
    <path d="M28 8 L28 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

