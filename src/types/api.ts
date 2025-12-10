/**
 * API Types
 *
 * Types for API responses, async states, and data fetching patterns.
 */

// ============================================================================
// Async State Types
// ============================================================================

/** Generic async state for data fetching */
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

/** Helper to check if state is loading */
export function isLoading<T>(state: AsyncState<T>): state is { status: 'loading' } {
  return state.status === 'loading';
}

/** Helper to check if state has data */
export function hasData<T>(state: AsyncState<T>): state is { status: 'success'; data: T } {
  return state.status === 'success';
}

/** Helper to check if state has error */
export function hasError<T>(state: AsyncState<T>): state is { status: 'error'; error: Error } {
  return state.status === 'error';
}

// ============================================================================
// API Response Types
// ============================================================================

/** Standard API response wrapper */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

/** API error structure */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/** Paginated response */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** Pagination parameters */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// Supabase Query Types
// ============================================================================

/** Supabase query result (matches Supabase SDK pattern) */
export interface SupabaseQueryResult<T> {
  data: T | null;
  error: SupabaseError | null;
  count?: number | null;
  status: number;
  statusText: string;
}

/** Supabase error structure */
export interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

// ============================================================================
// React Query Types
// ============================================================================

/** Query key factory type */
export type QueryKeyFactory<T extends string> = {
  [K in T]: readonly unknown[];
};

/** Standard query options */
export interface QueryOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  retry?: number | boolean;
}

/** Mutation result type */
export interface MutationResult<TData, TError = Error> {
  data?: TData;
  error?: TError;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

// ============================================================================
// Filter & Search Types
// ============================================================================

/** Generic filter parameters */
export interface FilterParams {
  search?: string;
  category?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

/** Sort parameters */
export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

/** Combined list parameters */
export interface ListParams extends PaginationParams, FilterParams {
  sort?: SortParams;
}

// ============================================================================
// Form Submission Types
// ============================================================================

/** Form submission state */
export interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

/** Form validation error */
export interface ValidationError {
  field: string;
  message: string;
}

/** Form submission result */
export interface FormResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}
