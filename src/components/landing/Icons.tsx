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
