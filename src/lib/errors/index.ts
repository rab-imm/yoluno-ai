/**
 * Error Handling Module
 *
 * Centralized error handling utilities.
 *
 * @example
 * ```ts
 * import { handleError, createErrorHandler, tryAsync } from '@/lib/errors';
 *
 * // Simple usage - shows toast
 * handleError(error);
 *
 * // With custom message
 * handleError(error, { userMessage: 'Failed to save' });
 *
 * // Create context-specific handler
 * const handleServiceError = createErrorHandler('myService');
 *
 * // Try/catch alternative
 * const { data, error } = await tryAsync(() => fetchData());
 * ```
 */

export * from './types';
export * from './handler';
