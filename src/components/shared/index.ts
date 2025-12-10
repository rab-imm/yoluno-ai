/**
 * Shared Components Index
 *
 * Central export point for all shared components.
 *
 * @example
 * ```tsx
 * import {
 *   FormDialog,
 *   ConfirmDialog,
 *   LoadingState,
 *   ErrorState,
 *   EmptyState,
 *   QueryState,
 * } from '@/components/shared';
 * ```
 */

// Dialog components
export {
  FormDialog,
  ConfirmDialog,
  ControlledConfirmDialog,
  type FormDialogProps,
  type ConfirmDialogProps,
  type ControlledConfirmDialogProps,
} from './dialogs';

// Feedback components
export {
  LoadingState,
  LoadingSpinner,
  LoadingSkeleton,
  ErrorState,
  InlineError,
  EmptyState,
  EmptyList,
  QueryState,
  InlineQueryState,
  type LoadingStateProps,
  type ErrorStateProps,
  type EmptyStateProps,
  type QueryStateProps,
} from './feedback';
