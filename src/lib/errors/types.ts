/**
 * Error Types
 *
 * Custom error types and interfaces for consistent error handling.
 */

/** Error codes for categorizing errors */
export type ErrorCode =
  | 'UNKNOWN'
  | 'NETWORK'
  | 'TIMEOUT'
  | 'AUTH_REQUIRED'
  | 'AUTH_EXPIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'CONFLICT'
  | 'RATE_LIMIT'
  | 'SERVER_ERROR'
  | 'DATABASE_ERROR'
  | 'STORAGE_ERROR';

/** Structured application error */
export interface AppError {
  /** Error code for programmatic handling */
  code: ErrorCode;
  /** Technical error message (for logging) */
  message: string;
  /** User-friendly error message (for display) */
  userMessage: string;
  /** Additional context about the error */
  context?: Record<string, unknown>;
  /** Original error if wrapped */
  originalError?: unknown;
  /** Stack trace if available */
  stack?: string;
}

/** Error handling strategy */
export type ErrorStrategy =
  | 'toast'    // Show toast notification
  | 'throw'    // Re-throw as AppError
  | 'silent'   // Swallow error silently
  | 'log'      // Log to console only
  | 'return';  // Return error object without throwing

/** Options for error handling */
export interface ErrorHandlerOptions {
  /** How to handle the error */
  strategy?: ErrorStrategy;
  /** Custom user-friendly message */
  userMessage?: string;
  /** Context identifier for logging */
  context?: string;
  /** Additional data to attach to error */
  metadata?: Record<string, unknown>;
  /** Whether to include stack trace in logs */
  includeStack?: boolean;
}

/** Supabase error shape */
export interface SupabaseErrorLike {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

/** Check if error looks like a Supabase error */
export function isSupabaseError(error: unknown): error is SupabaseErrorLike {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as SupabaseErrorLike).message === 'string'
  );
}

/** Check if error is an AppError */
export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'userMessage' in error
  );
}
