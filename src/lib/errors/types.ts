/**
 * Error Types
 *
 * Standardized error types and codes for the application.
 */

/**
 * Error codes for categorizing errors
 */
export type ErrorCode =
  | 'UNKNOWN'
  | 'NETWORK'
  | 'TIMEOUT'
  | 'AUTH_REQUIRED'
  | 'AUTH_EXPIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'RATE_LIMIT'
  | 'QUOTA_EXCEEDED'
  | 'SERVER_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'SAFETY_BLOCKED'
  | 'CONTENT_FLAGGED';

/**
 * Structured application error
 */
export interface AppError {
  code: ErrorCode;
  message: string;
  userMessage: string;
  context?: Record<string, unknown>;
  originalError?: unknown;
  timestamp: Date;
}

/**
 * Error code to user-friendly message mapping
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  UNKNOWN: 'Something went wrong. Please try again.',
  NETWORK: 'Unable to connect. Please check your internet connection.',
  TIMEOUT: 'The request took too long. Please try again.',
  AUTH_REQUIRED: 'Please sign in to continue.',
  AUTH_EXPIRED: 'Your session has expired. Please sign in again.',
  FORBIDDEN: 'You don\'t have permission to do this.',
  NOT_FOUND: 'The requested item could not be found.',
  VALIDATION: 'Please check your input and try again.',
  RATE_LIMIT: 'Too many requests. Please wait a moment.',
  QUOTA_EXCEEDED: 'You\'ve reached your limit. Upgrade to continue.',
  SERVER_ERROR: 'Server error. Our team has been notified.',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable. Please try later.',
  SAFETY_BLOCKED: 'This content has been blocked for safety.',
  CONTENT_FLAGGED: 'This content needs review before posting.',
};

/**
 * HTTP status code to error code mapping
 */
export function httpStatusToErrorCode(status: number): ErrorCode {
  switch (status) {
    case 400:
      return 'VALIDATION';
    case 401:
      return 'AUTH_REQUIRED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 408:
      return 'TIMEOUT';
    case 429:
      return 'RATE_LIMIT';
    case 500:
      return 'SERVER_ERROR';
    case 503:
      return 'SERVICE_UNAVAILABLE';
    default:
      return status >= 500 ? 'SERVER_ERROR' : 'UNKNOWN';
  }
}

/**
 * Check if an error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return true;
  }
  if (error instanceof Error && error.name === 'NetworkError') {
    return true;
  }
  return false;
}

/**
 * Check if an error is a timeout error
 */
export function isTimeoutError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.name === 'TimeoutError' || error.message.includes('timeout');
  }
  return false;
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: AppError): boolean {
  const retryableCodes: ErrorCode[] = [
    'NETWORK',
    'TIMEOUT',
    'SERVER_ERROR',
    'SERVICE_UNAVAILABLE',
  ];
  return retryableCodes.includes(error.code);
}
