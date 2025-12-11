/**
 * Error Handler
 *
 * Centralized error handling with configurable strategies.
 */

import { toast } from 'sonner';
import {
  type AppError,
  type ErrorCode,
  ERROR_MESSAGES,
  httpStatusToErrorCode,
  isNetworkError,
  isTimeoutError,
} from './types';

/**
 * Error handling strategy
 */
export type ErrorStrategy = 'toast' | 'log' | 'throw' | 'silent';

/**
 * Options for error handling
 */
export interface ErrorHandlerOptions {
  /** How to handle the error */
  strategy?: ErrorStrategy;
  /** Custom user-facing message */
  userMessage?: string;
  /** Context for debugging */
  context?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  /** Show retry option in toast */
  showRetry?: boolean;
  /** Retry callback */
  onRetry?: () => void;
}

/**
 * Convert unknown error to AppError
 */
export function normalizeError(error: unknown, context?: string): AppError {
  const timestamp = new Date();

  // Already an AppError
  if (isAppError(error)) {
    return { ...error, timestamp };
  }

  // Network errors
  if (isNetworkError(error)) {
    return {
      code: 'NETWORK',
      message: 'Network request failed',
      userMessage: ERROR_MESSAGES.NETWORK,
      originalError: error,
      context: context ? { location: context } : undefined,
      timestamp,
    };
  }

  // Timeout errors
  if (isTimeoutError(error)) {
    return {
      code: 'TIMEOUT',
      message: 'Request timed out',
      userMessage: ERROR_MESSAGES.TIMEOUT,
      originalError: error,
      context: context ? { location: context } : undefined,
      timestamp,
    };
  }

  // Supabase errors
  if (isSupabaseError(error)) {
    const code = mapSupabaseErrorCode(error.code);
    return {
      code,
      message: error.message,
      userMessage: ERROR_MESSAGES[code],
      originalError: error,
      context: context ? { location: context } : undefined,
      timestamp,
    };
  }

  // HTTP errors with status
  if (hasHttpStatus(error)) {
    const code = httpStatusToErrorCode(error.status);
    return {
      code,
      message: error.message || `HTTP ${error.status}`,
      userMessage: ERROR_MESSAGES[code],
      originalError: error,
      context: context ? { location: context } : undefined,
      timestamp,
    };
  }

  // Standard Error
  if (error instanceof Error) {
    return {
      code: 'UNKNOWN',
      message: error.message,
      userMessage: ERROR_MESSAGES.UNKNOWN,
      originalError: error,
      context: context ? { location: context } : undefined,
      timestamp,
    };
  }

  // Unknown error type
  return {
    code: 'UNKNOWN',
    message: String(error),
    userMessage: ERROR_MESSAGES.UNKNOWN,
    originalError: error,
    context: context ? { location: context } : undefined,
    timestamp,
  };
}

/**
 * Main error handling function
 */
export function handleError(error: unknown, options: ErrorHandlerOptions = {}): AppError {
  const {
    strategy = 'toast',
    userMessage,
    context,
    metadata,
    showRetry = false,
    onRetry,
  } = options;

  const appError = normalizeError(error, context);

  // Override user message if provided
  if (userMessage) {
    appError.userMessage = userMessage;
  }

  // Add metadata
  if (metadata) {
    appError.context = { ...appError.context, ...metadata };
  }

  // Execute strategy
  switch (strategy) {
    case 'toast':
      showErrorToast(appError, showRetry, onRetry);
      logError(appError);
      break;
    case 'log':
      logError(appError);
      break;
    case 'throw':
      logError(appError);
      throw appError;
    case 'silent':
      // Do nothing
      break;
  }

  return appError;
}

/**
 * Create a context-bound error handler
 */
export function createErrorHandler(context: string) {
  return (error: unknown, options: Omit<ErrorHandlerOptions, 'context'> = {}) =>
    handleError(error, { ...options, context });
}

/**
 * Show error toast notification
 */
function showErrorToast(error: AppError, showRetry: boolean, onRetry?: () => void): void {
  if (showRetry && onRetry) {
    toast.error(error.userMessage, {
      action: {
        label: 'Retry',
        onClick: onRetry,
      },
    });
  } else {
    toast.error(error.userMessage);
  }
}

/**
 * Log error for debugging
 */
function logError(error: AppError): void {
  const logData = {
    code: error.code,
    message: error.message,
    context: error.context,
    timestamp: error.timestamp.toISOString(),
  };

  if (process.env.NODE_ENV === 'development') {
    console.error('[AppError]', logData, error.originalError);
  } else {
    // In production, could send to error tracking service
    console.error('[AppError]', logData);
  }
}

/**
 * Type guards
 */
function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'userMessage' in error
  );
}

interface SupabaseError {
  code: string;
  message: string;
  details?: string;
}

function isSupabaseError(error: unknown): error is SupabaseError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof (error as SupabaseError).code === 'string'
  );
}

function hasHttpStatus(error: unknown): error is { status: number; message?: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as { status: number }).status === 'number'
  );
}

/**
 * Map Supabase error codes to app error codes
 */
function mapSupabaseErrorCode(code: string): ErrorCode {
  const codeMap: Record<string, ErrorCode> = {
    '23505': 'VALIDATION', // Unique violation
    '23503': 'VALIDATION', // Foreign key violation
    '42501': 'FORBIDDEN', // Insufficient privilege
    'PGRST116': 'NOT_FOUND', // Row not found
    'PGRST301': 'AUTH_REQUIRED', // JWT required
    '429': 'RATE_LIMIT',
  };
  return codeMap[code] || 'UNKNOWN';
}
