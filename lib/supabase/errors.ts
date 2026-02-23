/**
 * Supabase 관련 커스텀 에러 클래스
 */

export class SupabaseError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly originalError?: unknown
  ) {
    super(message)
    this.name = 'SupabaseError'
    Object.setPrototypeOf(this, SupabaseError.prototype)
  }
}

export class SupabaseConnectionError extends SupabaseError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'CONNECTION_ERROR', originalError)
    this.name = 'SupabaseConnectionError'
    Object.setPrototypeOf(this, SupabaseConnectionError.prototype)
  }
}

export class SupabaseQueryError extends SupabaseError {
  constructor(
    message: string,
    public readonly statusCode?: number,
    originalError?: unknown
  ) {
    super(message, 'QUERY_ERROR', originalError)
    this.name = 'SupabaseQueryError'
    Object.setPrototypeOf(this, SupabaseQueryError.prototype)
  }
}

export class SupabaseAuthError extends SupabaseError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'AUTH_ERROR', originalError)
    this.name = 'SupabaseAuthError'
    Object.setPrototypeOf(this, SupabaseAuthError.prototype)
  }
}

/**
 * Supabase 에러를 파싱하고 적절한 커스텀 에러로 변환합니다.
 */
export function parseSupabaseError(error: unknown): SupabaseError {
  if (error instanceof SupabaseError) {
    return error
  }

  if (error instanceof Error) {
    // 네트워크 에러
    if (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('Failed to fetch')
    ) {
      return new SupabaseConnectionError(
        'Failed to connect to Supabase. Please check your internet connection.',
        error
      )
    }

    // 인증 에러
    if (
      error.message.includes('auth') ||
      error.message.includes('JWT') ||
      error.message.includes('token')
    ) {
      return new SupabaseAuthError('Authentication error occurred.', error)
    }

    return new SupabaseError(error.message, undefined, error)
  }

  return new SupabaseError(
    'An unknown error occurred while interacting with Supabase.',
    'UNKNOWN_ERROR',
    error
  )
}

