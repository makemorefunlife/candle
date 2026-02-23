/**
 * 브라우저 클라이언트용 Supabase 클라이언트
 * 
 * 이 클라이언트는 클라이언트 컴포넌트에서 사용됩니다.
 * Row Level Security (RLS) 정책이 적용됩니다.
 * 
 * @example
 * ```tsx
 * 'use client'
 * import { supabase } from '@/lib/supabase/client'
 * 
 * const { data, error } = await supabase
 *   .from('users')
 *   .select('*')
 * ```
 */

import { createClient } from '@supabase/supabase-js'
import { validateClientEnv, getEnvVar } from './env'
import type { Database } from './types'

// 환경 변수 검증
if (typeof window !== 'undefined') {
  validateClientEnv()
}

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL')
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

