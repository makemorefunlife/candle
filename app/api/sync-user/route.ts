/**
 * 사용자 동기화 API
 * 
 * 로그인한 사용자의 Clerk 정보를 Supabase에 동기화합니다.
 * 클라이언트에서 호출하거나 서버에서 자동으로 호출할 수 있습니다.
 */

import { auth, currentUser } from '@clerk/nextjs/server'
import { syncUserToSupabase } from '@/lib/supabase/sync-user'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      )
    }

    const user = await currentUser()

    if (!user) {
      return NextResponse.json(
        { error: '사용자 정보를 가져올 수 없습니다.' },
        { status: 404 }
      )
    }

    // Supabase에 동기화
    const syncedUser = await syncUserToSupabase({
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

    return NextResponse.json({
      success: true,
      user: syncedUser,
    })
  } catch (error) {
    console.error('사용자 동기화 오류:', error)
    return NextResponse.json(
      { error: '사용자 동기화에 실패했습니다.' },
      { status: 500 }
    )
  }
}


