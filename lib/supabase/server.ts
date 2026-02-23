/**
 * 서버 사이드 Supabase 클라이언트
 * 
 * 이 파일은 서버 컴포넌트, API 라우트, Server Actions에서 사용됩니다.
 * 
 * - createServerClient: RLS가 적용된 클라이언트 (사용자 세션 기반)
 * - supabaseAdmin: Service Role Key를 사용하는 관리자 클라이언트 (RLS 우회)
 * 
 * @example
 * ```ts
 * import { createServerClient } from '@/lib/supabase/server'
 * 
 * const supabase = createServerClient()
 * const { data } = await supabase.from('users').select('*')
 * ```
 */

import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { validateServerEnv, getEnvVar, getOptionalEnvVar } from './env'
import type { Database } from './types'

// 환경 변수 검증
validateServerEnv()

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL')
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')

/**
 * 서버 컴포넌트용 Supabase 클라이언트 생성
 * 
 * Next.js App Router의 서버 컴포넌트에서 사용합니다.
 * 쿠키를 통해 사용자 세션을 관리합니다.
 * 
 * @returns Supabase 클라이언트 인스턴스
 */
export function createServerClient() {
  // cookies()는 Next.js 16에서 동기 함수이지만 타입 정의가 Promise로 되어 있을 수 있음
  // 실제 런타임에서는 동기적으로 동작하므로 타입 단언 사용
  const cookieStore = cookies() as unknown as Awaited<ReturnType<typeof cookies>>

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    // cookies 옵션은 Supabase에서 지원하지만 타입 정의에 포함되지 않았을 수 있음
    // 실제 런타임에서는 정상 동작하므로 타입 단언 사용
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // 쿠키 설정은 서버 액션에서만 가능합니다
          // 서버 컴포넌트에서는 읽기만 가능
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: '', ...options })
        } catch (error) {
          // 쿠키 삭제는 서버 액션에서만 가능합니다
        }
      },
    },
  } as Parameters<typeof createClient<Database>>[2])
}

/**
 * 관리자용 Supabase 클라이언트 (Service Role Key 사용)
 * 
 * ⚠️ 주의: 이 클라이언트는 Row Level Security (RLS)를 우회합니다.
 * 신뢰할 수 있는 서버 사이드 코드에서만 사용하세요.
 * 
 * 사용 사례:
 * - 관리자 작업
 * - 배치 작업
 * - 시스템 레벨 데이터 접근
 * 
 * @returns Supabase 관리자 클라이언트 인스턴스
 */
export function createAdminClient() {
  const serviceRoleKey = getOptionalEnvVar('SUPABASE_SERVICE_ROLE_KEY')

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is required for admin operations. ' +
        'This key should only be used in secure server-side code.'
    )
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * 레거시 호환성을 위한 관리자 클라이언트
 * @deprecated createAdminClient()를 사용하세요
 * 
 * 주의: 이 변수는 지연 초기화됩니다. 실제 사용 시점에 환경 변수를 확인합니다.
 */
export function getSupabaseAdmin() {
  return createAdminClient()
}

/**
 * 레거시 호환성을 위한 관리자 클라이언트 (getter)
 * @deprecated createAdminClient() 또는 getSupabaseAdmin()를 사용하세요
 */
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createAdminClient>, {
  get(_target, prop) {
    const admin = createAdminClient()
    return (admin as any)[prop]
  },
})

