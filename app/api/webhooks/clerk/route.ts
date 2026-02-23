/**
 * Clerk Webhook API
 * 
 * Clerk에서 사용자 생성/업데이트/삭제 이벤트를 받아서
 * Supabase에 자동으로 동기화합니다.
 * 
 * Clerk 대시보드에서 webhook URL을 설정하세요:
 * https://your-domain.com/api/webhooks/clerk
 */

import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

if (!WEBHOOK_SECRET) {
  throw new Error('CLERK_WEBHOOK_SECRET 환경 변수가 설정되지 않았습니다.')
}

export async function POST(req: Request) {
  // Webhook 시그니처 검증
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Webhook 헤더가 없습니다', { status: 400 })
  }

  // 요청 본문 가져오기
  const payload = await req.json()

  // Svix를 사용하여 webhook 검증
  // WEBHOOK_SECRET은 상단에서 체크되므로 undefined가 아님을 보장
  const wh = new Webhook(WEBHOOK_SECRET as string)

  let evt: any

  try {
    evt = wh.verify(JSON.stringify(payload), {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as any
  } catch (err) {
    console.error('Webhook 검증 실패:', err)
    return new NextResponse('Webhook 검증 실패', { status: 400 })
  }

  // 이벤트 타입에 따라 처리
  const eventType = evt.type
  const supabase = createAdminClient()

  try {
    switch (eventType) {
      case 'user.created':
        await syncUserToSupabase(supabase, evt.data)
        break

      case 'user.updated':
        await syncUserToSupabase(supabase, evt.data)
        break

      case 'user.deleted':
        await deleteUserFromSupabase(supabase, evt.data.id)
        break

      default:
        console.log(`처리하지 않는 이벤트 타입: ${eventType}`)
    }

    return new NextResponse(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Webhook 처리 중 오류:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Webhook 처리 실패' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

/**
 * Clerk 사용자 정보를 Supabase에 동기화
 */
async function syncUserToSupabase(supabase: any, clerkUser: any) {
  const userData = {
    clerk_user_id: clerkUser.id,
    email: clerkUser.email_addresses?.[0]?.email_address || null,
    first_name: clerkUser.first_name || null,
    last_name: clerkUser.last_name || null,
    username: clerkUser.username || null,
    image_url: clerkUser.image_url || null,
    last_sign_in_at: clerkUser.last_sign_in_at
      ? new Date(clerkUser.last_sign_in_at).toISOString()
      : null,
    metadata: {
      email_addresses: clerkUser.email_addresses || [],
      phone_numbers: clerkUser.phone_numbers || [],
      external_accounts: clerkUser.external_accounts || [],
      public_metadata: clerkUser.public_metadata || {},
      private_metadata: clerkUser.private_metadata || {},
    },
    updated_at: new Date().toISOString(),
  }

  // Upsert (있으면 업데이트, 없으면 생성)
  const { data, error } = await supabase
    .from('users')
    .upsert(userData, {
      onConflict: 'clerk_user_id',
      ignoreDuplicates: false,
    })
    .select()

  if (error) {
    console.error('Supabase 동기화 오류:', error)
    throw error
  }

  console.log(`사용자 동기화 완료: ${clerkUser.id}`)
  return data
}

/**
 * Supabase에서 사용자 삭제
 */
async function deleteUserFromSupabase(supabase: any, clerkUserId: string) {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('clerk_user_id', clerkUserId)

  if (error) {
    console.error('사용자 삭제 오류:', error)
    throw error
  }

  console.log(`사용자 삭제 완료: ${clerkUserId}`)
}


