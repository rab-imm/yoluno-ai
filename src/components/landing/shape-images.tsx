// Shape mask components for organic image displays

interface ShapeImageProps {
  src: string;
  alt: string;
  className?: string;
  borderColor?: string;
  backgroundColor?: string;
}

export const BlobImage = ({ src, alt, className = "", borderColor = "#E85D4D", backgroundColor = "#DBEAFE" }: ShapeImageProps) => {
  return (
    <div className={`relative ${className}`}>
      <div
        className="w-full h-full overflow-hidden"
        style={{
          borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
          border: `4px solid ${borderColor}`,
          backgroundColor,
        }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export const CloudImage = ({ src, alt, className = "", borderColor = "#F472B6", backgroundColor = "#FCE7F3" }: ShapeImageProps) => {
  return (
    <div className={`relative ${className}`}>
      <div
        className="w-full h-full overflow-hidden"
        style={{
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
          border: `4px solid ${borderColor}`,
          backgroundColor,
        }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export const StarImage = ({ src, alt, className = "", borderColor = "#FBBF24", backgroundColor = "#FEF3C7" }: ShapeImageProps) => {
  return (
    <div className={`relative ${className}`}>
      <div
        className="w-full h-full overflow-hidden"
        style={{
          borderRadius: "50% 50% 50% 50% / 60% 40% 60% 40%",
          border: `4px solid ${borderColor}`,
          backgroundColor,
        }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export const CandyBubbleImage = ({ src, alt, className = "", borderColor = "#A78BFA", backgroundColor = "#F3E8FF" }: ShapeImageProps) => {
  return (
    <div className={`relative ${className}`}>
      <div
        className="w-full h-full overflow-hidden rounded-full"
        style={{
          border: `4px solid ${borderColor}`,
          backgroundColor,
        }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
};
