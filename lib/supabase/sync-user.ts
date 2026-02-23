/**
 * Clerk 사용자 정보를 Supabase에 동기화하는 유틸리티
 * 
 * 이 함수는 사용자가 로그인할 때나 프로필이 업데이트될 때
 * Clerk의 사용자 정보를 Supabase에 저장합니다.
 */

import { currentUser } from '@clerk/nextjs/server'
import { createAdminClient } from './server'

export interface ClerkUserData {
  id: string
  emailAddresses: Array<{ emailAddress: string }>
  firstName: string | null
  lastName: string | null
  username: string | null
  imageUrl: string
  lastSignInAt: number | null
  publicMetadata?: Record<string, any>
  privateMetadata?: Record<string, any>
}

/**
 * 현재 로그인한 사용자를 Supabase에 동기화
 * 
 * @returns 동기화된 사용자 데이터 또는 null
 */
export async function syncCurrentUser() {
  try {
    const user = await currentUser()

    if (!user) {
      return null
    }

    return await syncUserToSupabase({
      id: user.id,
      emailAddresses: user.emailAddresses,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      imageUrl: user.imageUrl,
      lastSignInAt: user.lastSignInAt,
      publicMetadata: user.publicMetadata,
      privateMetadata: user.privateMetadata,
    })
  } catch (error) {
    console.error('사용자 동기화 오류:', error)
    return null
  }
}

/**
 * Clerk 사용자 정보를 Supabase에 동기화
 * 
 * @param clerkUser Clerk 사용자 객체
 * @returns 동기화된 사용자 데이터
 */
export async function syncUserToSupabase(clerkUser: ClerkUserData) {
  const supabase = createAdminClient()

  const userData = {
    clerk_user_id: clerkUser.id,
    email: clerkUser.emailAddresses?.[0]?.emailAddress || null,
    first_name: clerkUser.firstName || null,
    last_name: clerkUser.lastName || null,
    username: clerkUser.username || null,
    image_url: clerkUser.imageUrl || null,
    last_sign_in_at: clerkUser.lastSignInAt
      ? new Date(clerkUser.lastSignInAt).toISOString()
      : null,
    metadata: {
      email_addresses: clerkUser.emailAddresses || [],
      public_metadata: clerkUser.publicMetadata || {},
      private_metadata: clerkUser.privateMetadata || {},
    },
    updated_at: new Date().toISOString(),
  }

  // Upsert (있으면 업데이트, 없으면 생성)
  // Database 타입이 Record<string, never>로 정의되어 있어 타입 추론이 되지 않음
  // 실제 런타임에서는 정상 동작하므로 타입 단언 사용
  const { data, error } = await supabase
    .from('users')
    .upsert(userData as any, {
      onConflict: 'clerk_user_id',
      ignoreDuplicates: false,
    })
    .select()
    .single()

  if (error) {
    console.error('Supabase 동기화 오류:', error)
    throw error
  }

  return data
}

/**
 * Clerk user ID로 Supabase에서 사용자 조회
 * 
 * @param clerkUserId Clerk 사용자 ID
 * @returns 사용자 데이터 또는 null
 */
export async function getUserByClerkId(clerkUserId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // 사용자를 찾을 수 없음
      return null
    }
    console.error('사용자 조회 오류:', error)
    throw error
  }

  return data
}


