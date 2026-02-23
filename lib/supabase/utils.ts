/**
 * Supabase 유틸리티 함수 및 헬퍼
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import { parseSupabaseError, SupabaseQueryError } from './errors'
import type { PaginationParams, SortParams, SupabaseResponse } from './types'

/**
 * Clerk user_id를 기반으로 Supabase 쿼리를 실행합니다.
 * 
 * @param supabase Supabase 클라이언트 인스턴스
 * @param clerkUserId Clerk user ID
 * @param tableName 테이블 이름
 * @param queryFn 쿼리 함수
 * @returns 쿼리 결과
 * 
 * @example
 * ```ts
 * const data = await queryByClerkUserId(
 *   supabase,
 *   clerkUserId,
 *   'user_profiles',
 *   (query) => query.select('*').eq('clerk_user_id', clerkUserId)
 * )
 * ```
 */
export async function queryByClerkUserId<T>(
  supabase: SupabaseClient,
  clerkUserId: string,
  tableName: string,
  queryFn: (query: ReturnType<typeof supabase.from>) => Promise<{ data: T | null; error: any }>
): Promise<SupabaseResponse<T>> {
  try {
    const query = supabase.from(tableName)
    const result = await queryFn(query)

    if (result.error) {
      throw new SupabaseQueryError(
        `Failed to query ${tableName} for clerk_user_id: ${clerkUserId}`,
        result.error.status,
        result.error
      )
    }

    return {
      data: result.data,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: parseSupabaseError(error),
    }
  }
}

/**
 * 페이지네이션을 적용한 쿼리를 실행합니다.
 * 
 * @param query Supabase 쿼리 빌더
 * @param params 페이지네이션 파라미터
 * @returns 페이지네이션이 적용된 쿼리
 */
export function applyPagination<T>(
  query: ReturnType<SupabaseClient['from']>,
  params: PaginationParams
) {
  const { from, to, page, pageSize } = params

  if (from !== undefined && to !== undefined) {
    return query.range(from, to) as typeof query
  }

  if (page !== undefined && pageSize !== undefined) {
    const start = (page - 1) * pageSize
    const end = start + pageSize - 1
    return query.range(start, end) as typeof query
  }

  return query
}

/**
 * 정렬을 적용한 쿼리를 실행합니다.
 * 
 * @param query Supabase 쿼리 빌더
 * @param params 정렬 파라미터
 * @returns 정렬이 적용된 쿼리
 */
export function applySort<T>(
  query: ReturnType<SupabaseClient['from']>,
  params: SortParams
) {
  return query.order(params.column, {
    ascending: params.ascending ?? true,
  }) as typeof query
}

/**
 * Supabase 응답에서 에러를 안전하게 처리합니다.
 * 
 * @param response Supabase 응답
 * @returns 데이터 또는 null
 * @throws {SupabaseError} 에러가 있는 경우
 */
export function handleSupabaseResponse<T>(response: {
  data: T | null
  error: any
}): T {
  if (response.error) {
    throw parseSupabaseError(response.error)
  }

  if (response.data === null) {
    throw new SupabaseQueryError('No data returned from query')
  }

  return response.data
}

/**
 * 여러 Supabase 쿼리를 병렬로 실행합니다.
 * 
 * @param queries 쿼리 함수 배열
 * @returns 모든 쿼리 결과
 */
export async function executeParallelQueries<T>(
  queries: Array<() => Promise<{ data: T | null; error: any }>>
): Promise<Array<SupabaseResponse<T>>> {
  const results = await Promise.allSettled(
    queries.map((query) => query())
  )

  return results.map((result) => {
    if (result.status === 'fulfilled') {
      return {
        data: result.value.data,
        error: result.value.error ? parseSupabaseError(result.value.error) : null,
      }
    } else {
      return {
        data: null,
        error: parseSupabaseError(result.reason),
      }
    }
  })
}

/**
 * Supabase 쿼리 결과를 배열로 변환합니다.
 * null이나 undefined를 빈 배열로 변환합니다.
 */
export function toArray<T>(data: T | T[] | null | undefined): T[] {
  if (data === null || data === undefined) {
    return []
  }
  return Array.isArray(data) ? data : [data]
}

