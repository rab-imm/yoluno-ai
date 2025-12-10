/**
 * Error Handler
 *
 * Centralized error handling utility for consistent error processing.
 */

import { toast } from 'sonner';
import type {
  AppError,
  ErrorCode,
  ErrorStrategy,
  ErrorHandlerOptions,
  SupabaseErrorLike,
} from './types';
import { isSupabaseError, isAppError } from './types';

/** Default user-friendly messages by error code */
const DEFAULT_USER_MESSAGES: Record<ErrorCode, string> = {
  UNKNOWN: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  TIMEOUT: 'Request timed out. Please try again.',
  AUTH_REQUIRED: 'Please sign in to continue.',
  AUTH_EXPIRED: 'Your session has expired. Please sign in again.',
  FORBIDDEN: 'You don\'t have permission to do this.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  CONFLICT: 'This action conflicts with existing data.',
  RATE_LIMIT: 'Too many requests. Please wait a moment.',
  SERVER_ERROR: 'Server error. Please try again later.',
  DATABASE_ERROR: 'Database error. Please try again.',
  STORAGE_ERROR: 'Storage error. Please try again.',
};

/** Map Supabase error codes to app error codes */
function mapSupabaseErrorCode(code?: string): ErrorCode {
  if (!code) return 'DATABASE_ERROR';

  const codeMap: Record<string, ErrorCode> = {
    'PGRST116': 'NOT_FOUND',      // No rows returned
    '23505': 'CONFLICT',          // Unique violation
    '23503': 'VALIDATION',        // Foreign key violation
    '42501': 'FORBIDDEN',         // Insufficient privilege
    '42P01': 'NOT_FOUND',         // Undefined table
    'JWT expired': 'AUTH_EXPIRED',
    '401': 'AUTH_REQUIRED',
    '403': 'FORBIDDEN',
    '404': 'NOT_FOUND',
    '409': 'CONFLICT',
    '422': 'VALIDATION',
    '429': 'RATE_LIMIT',
    '500': 'SERVER_ERROR',
  };

  return codeMap[code] || 'DATABASE_ERROR';
}

/** Normalize any error into an AppError */
export function normalizeError(
  error: unknown,
  userMessage?: string
): AppError {
  // Already an AppError
  if (isAppError(error)) {
    return userMessage ? { ...error, userMessage } : error;
  }

  // Supabase error
  if (isSupabaseError(error)) {
    const code = mapSupabaseErrorCode(error.code);
    return {
      code,
      message: error.message,
      userMessage: userMessage || error.hint || DEFAULT_USER_MESSAGES[code],
      context: error.details ? { details: error.details } : undefined,
      originalError: error,
    };
  }

  // Standard Error
  if (error instanceof Error) {
    // Check for network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        code: 'NETWORK',
        message: error.message,
        userMessage: userMessage || DEFAULT_USER_MESSAGES.NETWORK,
        originalError: error,
        stack: error.stack,
      };
    }

    // Check for timeout
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return {
        code: 'TIMEOUT',
        message: error.message,
        userMessage: userMessage || DEFAULT_USER_MESSAGES.TIMEOUT,
        originalError: error,
        stack: error.stack,
      };
    }

    return {
      code: 'UNKNOWN',
      message: error.message,
      userMessage: userMessage || DEFAULT_USER_MESSAGES.UNKNOWN,
      originalError: error,
      stack: error.stack,
    };
  }

  // String error
  if (typeof error === 'string') {
    return {
      code: 'UNKNOWN',
      message: error,
      userMessage: userMessage || error,
    };
  }

  // Unknown error shape
  return {
    code: 'UNKNOWN',
    message: String(error),
    userMessage: userMessage || DEFAULT_USER_MESSAGES.UNKNOWN,
    originalError: error,
  };
}

/**
 * Handle an error with the specified strategy
 *
 * @param error - The error to handle
 * @param options - Handling options
 * @returns The normalized AppError
 *
 * @example
 * ```ts
 * // Show toast notification (default)
 * handleError(error);
 *
 * // Custom message
 * handleError(error, { userMessage: 'Failed to save profile' });
 *
 * // Log only
 * handleError(error, { strategy: 'log', context: 'useChildProfiles' });
 *
 * // Throw for React Query to handle
 * handleError(error, { strategy: 'throw' });
 * ```
 */
export function handleError(
  error: unknown,
  options: ErrorHandlerOptions = {}
): AppError {
  const {
    strategy = 'toast',
    userMessage,
    context,
    metadata,
    includeStack = false,
  } = options;

  const appError = normalizeError(error, userMessage);

  // Attach metadata if provided
  if (metadata) {
    appError.context = { ...appError.context, ...metadata };
  }

  // Log the error (for all strategies except silent)
  if (strategy !== 'silent') {
    const logPrefix = context ? `[${context}]` : '[Error]';
    console.error(logPrefix, appError.message, {
      code: appError.code,
      context: appError.context,
      ...(includeStack && appError.stack ? { stack: appError.stack } : {}),
    });
  }

  // Apply strategy
  switch (strategy) {
    case 'toast':
      toast.error(appError.userMessage);
      break;

    case 'throw':
      throw appError;

    case 'log':
      // Already logged above
      break;

    case 'silent':
      // Do nothing
      break;

    case 'return':
      // Just return the error
      break;
  }

  return appError;
}

/**
 * Create a typed error handler for a specific context
 *
 * @param context - The context name for logging
 * @returns A pre-configured error handler
 *
 * @example
 * ```ts
 * const handleServiceError = createErrorHandler('childProfilesService');
 *
 * try {
 *   await someOperation();
 * } catch (error) {
 *   handleServiceError(error, { userMessage: 'Failed to load profiles' });
 * }
 * ```
 */
export function createErrorHandler(context: string) {
  return (error: unknown, options: Omit<ErrorHandlerOptions, 'context'> = {}) =>
    handleError(error, { ...options, context });
}

/**
 * Wrap an async function with error handling
 *
 * @param fn - The async function to wrap
 * @param options - Error handling options
 * @returns The wrapped function
 *
 * @example
 * ```ts
 * const safeDelete = withErrorHandling(
 *   deleteProfile,
 *   { userMessage: 'Failed to delete profile' }
 * );
 *
 * await safeDelete(profileId);
 * ```
 */
export function withErrorHandling<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: ErrorHandlerOptions = {}
): (...args: TArgs) => Promise<TResult | null> {
  return async (...args: TArgs) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, options);
      return null;
    }
  };
}

/**
 * Try an operation and return a result object
 *
 * @param fn - The async function to execute
 * @returns Object with data or error
 *
 * @example
 * ```ts
 * const { data, error } = await tryAsync(() => fetchProfiles());
 * if (error) {
 *   // Handle error
 * }
 * ```
 */
export async function tryAsync<T>(
  fn: () => Promise<T>
): Promise<{ data: T; error: null } | { data: null; error: AppError }> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error) {
    const appError = normalizeError(error);
    return { data: null, error: appError };
  }
}
