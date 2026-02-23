/**
 * Supabase 관련 공통 타입 정의
 */

import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * 데이터베이스 스키마 타입
 * 향후 Supabase CLI로 생성된 타입을 여기에 import할 수 있습니다.
 *
 * 예시:
 * import type { Database } from '@/lib/supabase/database.types'
 * export type SupabaseClient = SupabaseClient<Database>
 */
export type Database = Record<string, never>

/**
 * 클라이언트 타입
 */
export type SupabaseClientType = SupabaseClient<Database>

/**
 * Clerk user_id와 Supabase를 연동하기 위한 타입
 */
export interface ClerkUserMapping {
  clerk_user_id: string
  supabase_user_id?: string
  created_at: string
  updated_at: string
}

/**
 * 공통 응답 타입
 */
export interface SupabaseResponse<T> {
  data: T | null
  error: Error | null
}

/**
 * 페이지네이션 파라미터
 */
export interface PaginationParams {
  page?: number
  pageSize?: number
  from?: number
  to?: number
}

/**
 * 정렬 파라미터
 */
export interface SortParams {
  column: string
  ascending?: boolean
}

