/**
 * Supabase 환경 변수 검증 유틸리티
 * 런타임에 환경 변수가 올바르게 설정되었는지 확인합니다.
 */

const requiredEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
} as const

const optionalEnvVars = {
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
} as const

/**
 * 클라이언트 사이드에서 필요한 환경 변수를 검증합니다.
 * @throws {Error} 필수 환경 변수가 없을 경우
 */
export function validateClientEnv(): void {
  const missing: string[] = []

  if (!requiredEnvVars.NEXT_PUBLIC_SUPABASE_URL) {
    missing.push('NEXT_PUBLIC_SUPABASE_URL')
  }

  if (!requiredEnvVars.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required Supabase environment variables: ${missing.join(', ')}\n` +
        'Please check your .env.local file and ensure all required variables are set.'
    )
  }
}

/**
 * 서버 사이드에서 필요한 환경 변수를 검증합니다.
 * @param requireServiceKey Service Role Key가 필수인지 여부
 * @throws {Error} 필수 환경 변수가 없을 경우
 */
export function validateServerEnv(requireServiceKey = false): void {
  validateClientEnv()

  if (requireServiceKey && !optionalEnvVars.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'Missing required Supabase environment variable: SUPABASE_SERVICE_ROLE_KEY\n' +
        'This key is required for server-side admin operations.'
    )
  }
}

/**
 * 환경 변수 값을 안전하게 가져옵니다.
 */
export function getEnvVar(key: keyof typeof requiredEnvVars): string {
  const value = requiredEnvVars[key]
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`)
  }
  return value
}

/**
 * 선택적 환경 변수 값을 가져옵니다.
 */
export function getOptionalEnvVar(
  key: keyof typeof optionalEnvVars
): string | undefined {
  return optionalEnvVars[key]
}

