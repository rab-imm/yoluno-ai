/**
 * Query State
 *
 * Wrapper component for React Query states.
 */

import { type ReactNode } from 'react';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import { type LucideIcon } from 'lucide-react';

interface QueryStateProps<T> {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  data: T | undefined;
  children: (data: T) => ReactNode;
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  onRetry?: () => void;
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
  isEmpty?: (data: T) => boolean;
}

export function QueryState<T>({
  isLoading,
  isError,
  error,
  data,
  children,
  loadingMessage,
  errorTitle,
  errorMessage,
  onRetry,
  emptyIcon,
  emptyTitle = 'No items found',
  emptyDescription,
  emptyAction,
  isEmpty,
}: QueryStateProps<T>) {
  if (isLoading) {
    return <LoadingState message={loadingMessage} />;
  }

  if (isError) {
    return (
      <ErrorState
        title={errorTitle}
        message={errorMessage ?? error?.message}
        onRetry={onRetry}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  // Check if data is empty using custom isEmpty function or array length
  const isDataEmpty = isEmpty
    ? isEmpty(data)
    : Array.isArray(data) && data.length === 0;

  if (isDataEmpty) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return <>{children(data)}</>;
}
