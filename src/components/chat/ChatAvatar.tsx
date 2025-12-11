/**
 * Chat Avatar Component
 *
 * Animated AI avatar with expressions.
 */

import { cn } from '@/lib/utils';
import type { AvatarExpression } from '@/types/domain';

interface ChatAvatarProps {
  imageUrl?: string;
  expression?: AvatarExpression;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-16 w-16',
  md: 'h-24 w-24',
  lg: 'h-32 w-32',
};

const expressionStyles: Record<AvatarExpression, string> = {
  neutral: '',
  happy: 'animate-bounce-gentle',
  thinking: 'animate-pulse',
  excited: 'animate-wiggle',
};

export function ChatAvatar({
  imageUrl,
  expression = 'neutral',
  size = 'md',
  className,
}: ChatAvatarProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-primary/10',
        sizeClasses[size],
        expressionStyles[expression],
        className
      )}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="AI Avatar"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-1/2 w-1/2 rounded-full bg-primary/30" />
        </div>
      )}

      {/* Expression indicator */}
      {expression === 'thinking' && (
        <div className="absolute -right-1 -top-1 flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary delay-0" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary delay-100" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary delay-200" />
        </div>
      )}
    </div>
  );
}
