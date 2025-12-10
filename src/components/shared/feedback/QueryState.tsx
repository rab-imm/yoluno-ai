/**
 * QueryState
 *
 * Wrapper component for handling React Query states (loading, error, empty, success).
 * Reduces boilerplate when rendering query results.
 */

import { ReactNode } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { LoadingState, LoadingStateProps } from './LoadingState';
import { ErrorState, ErrorStateProps } from './ErrorState';
import { EmptyState, EmptyStateProps } from './EmptyState';

export interface QueryStateProps<T> {
  /** The React Query result object */
  query: UseQueryResult<T>;
  /** Render function for successful data */
  children: (data: T) => ReactNode;
  /** Function to determine if data is "empty" */
  isEmpty?: (data: T) => boolean;
  /** Custom loading component or props */
  loading?: ReactNode | LoadingStateProps;
  /** Custom error component or props */
  error?: ReactNode | Omit<ErrorStateProps, 'error' | 'onRetry'>;
  /** Custom empty state component or props */
  empty?: ReactNode | Omit<EmptyStateProps, 'onAction'>;
  /** Action for empty state */
  emptyAction?: () => void;
}

/**
 * Default isEmpty checker for arrays
 */
function defaultIsEmpty<T>(data: T): boolean {
  if (Array.isArray(data)) {
    return data.length === 0;
  }
  if (data === null || data === undefined) {
    return true;
  }
  return false;
}

export function QueryState<T>({
  query,
  children,
  isEmpty = defaultIsEmpty,
  loading,
  error,
  empty,
  emptyAction,
}: QueryStateProps<T>) {
  // Loading state
  if (query.isLoading) {
    if (loading && typeof loading !== 'object') {
      return <>{loading}</>;
    }
    return (
      <LoadingState
        {...(typeof loading === 'object' ? loading : {})}
        fullHeight
      />
    );
  }

  // Error state
  if (query.isError) {
    if (error && typeof error !== 'object') {
      return <>{error}</>;
    }
    return (
      <ErrorState
        error={query.error}
        onRetry={() => query.refetch()}
        {...(typeof error === 'object' ? error : {})}
        fullHeight
      />
    );
  }

  // Empty state
  if (query.data && isEmpty(query.data)) {
    if (empty && typeof empty !== 'object') {
      return <>{empty}</>;
    }
    return (
      <EmptyState
        title="No data"
        description="There's nothing here yet."
        onAction={emptyAction}
        {...(typeof empty === 'object' ? empty : {})}
        fullHeight
      />
    );
  }

  // Success state with data
  if (query.data) {
    return <>{children(query.data)}</>;
  }

  // Idle state (shouldn't usually reach here)
  return null;
}

/**
 * Simple wrapper for showing loading/error inline
 */
export function InlineQueryState<T>({
  query,
  children,
  loadingMessage = 'Loading...',
}: {
  query: UseQueryResult<T>;
  children: (data: T) => ReactNode;
  loadingMessage?: string;
}) {
  if (query.isLoading) {
    return (
      <span className="text-muted-foreground text-sm animate-pulse">
        {loadingMessage}
      </span>
    );
  }

  if (query.isError) {
    return (
      <span className="text-destructive text-sm">
        Error loading data
      </span>
    );
  }

  if (query.data) {
    return <>{children(query.data)}</>;
  }

  return null;
}

QueryState.displayName = 'QueryState';
InlineQueryState.displayName = 'InlineQueryState';
