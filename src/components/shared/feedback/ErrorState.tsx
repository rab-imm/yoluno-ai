/**
 * ErrorState
 *
 * Consistent error display component.
 */

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ErrorStateProps {
  /** Error title */
  title?: string;
  /** Error message to display */
  message?: string;
  /** The error object (will extract message if string not provided) */
  error?: Error | unknown;
  /** Retry callback */
  onRetry?: () => void;
  /** Retry button label */
  retryLabel?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to center in container */
  centered?: boolean;
  /** Whether to take full height */
  fullHeight?: boolean;
  /** Additional className */
  className?: string;
}

const iconSizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
};

const titleSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function ErrorState({
  title = 'Something went wrong',
  message,
  error,
  onRetry,
  retryLabel = 'Try again',
  size = 'md',
  centered = true,
  fullHeight = false,
  className,
}: ErrorStateProps) {
  // Extract message from error if not provided
  const displayMessage =
    message ||
    (error instanceof Error ? error.message : undefined) ||
    'An unexpected error occurred. Please try again.';

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 p-4',
        centered && 'justify-center',
        fullHeight && 'min-h-[200px]',
        className
      )}
    >
      <div className="rounded-full bg-destructive/10 p-3">
        <AlertCircle
          className={cn('text-destructive', iconSizeClasses[size])}
        />
      </div>

      <div className="text-center space-y-1">
        <h3 className={cn('font-semibold', titleSizeClasses[size])}>{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md">{displayMessage}</p>
      </div>

      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

/**
 * Inline error message
 */
export function InlineError({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2 text-sm text-destructive', className)}>
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

ErrorState.displayName = 'ErrorState';
InlineError.displayName = 'InlineError';
