/**
 * LoadingState
 *
 * Consistent loading indicator component.
 */

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  /** Loading message */
  message?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to center in container */
  centered?: boolean;
  /** Whether to take full height */
  fullHeight?: boolean;
  /** Additional className */
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function LoadingState({
  message = 'Loading...',
  size = 'md',
  centered = true,
  fullHeight = false,
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3',
        centered && 'justify-center',
        fullHeight && 'min-h-[200px]',
        className
      )}
    >
      <Loader2
        className={cn('animate-spin text-primary', sizeClasses[size])}
      />
      {message && (
        <p
          className={cn(
            'text-muted-foreground animate-pulse',
            textSizeClasses[size]
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
}

/**
 * Inline loading spinner
 */
export function LoadingSpinner({
  size = 'sm',
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  return (
    <Loader2
      className={cn('animate-spin text-primary', sizeClasses[size], className)}
    />
  );
}

/**
 * Skeleton loading placeholder
 */
export function LoadingSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

LoadingState.displayName = 'LoadingState';
LoadingSpinner.displayName = 'LoadingSpinner';
LoadingSkeleton.displayName = 'LoadingSkeleton';
