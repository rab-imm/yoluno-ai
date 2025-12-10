/**
 * EmptyState
 *
 * Consistent empty state display component.
 */

import { ReactNode } from 'react';
import { Inbox, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  /** Icon to display (defaults to Inbox) */
  icon?: ReactNode;
  /** Empty state title */
  title: string;
  /** Description message */
  description?: string;
  /** Action button label */
  actionLabel?: string;
  /** Action button callback */
  onAction?: () => void;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to center in container */
  centered?: boolean;
  /** Whether to take full height */
  fullHeight?: boolean;
  /** Additional className */
  className?: string;
  /** Children (for custom action buttons or content) */
  children?: ReactNode;
}

const iconContainerSizes = {
  sm: 'p-2',
  md: 'p-3',
  lg: 'p-4',
};

const iconSizes = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

const titleSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  size = 'md',
  centered = true,
  fullHeight = false,
  className,
  children,
}: EmptyStateProps) {
  const defaultIcon = (
    <Inbox className={cn('text-muted-foreground', iconSizes[size])} />
  );

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 p-6',
        centered && 'justify-center',
        fullHeight && 'min-h-[200px]',
        className
      )}
    >
      <div
        className={cn(
          'rounded-full bg-muted',
          iconContainerSizes[size]
        )}
      >
        {icon || defaultIcon}
      </div>

      <div className="text-center space-y-1">
        <h3 className={cn('font-semibold', titleSizes[size])}>{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground max-w-md">
            {description}
          </p>
        )}
      </div>

      {(onAction && actionLabel) && (
        <Button onClick={onAction} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      )}

      {children}
    </div>
  );
}

/**
 * Simple empty state for lists
 */
export function EmptyList({
  message = 'No items found',
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-center py-8 text-sm text-muted-foreground',
        className
      )}
    >
      {message}
    </div>
  );
}

EmptyState.displayName = 'EmptyState';
EmptyList.displayName = 'EmptyList';
