'use client'

/**
 * 컴포넌트가 마운트될 때 사용자 정보를 Supabase에 동기화하는 컴포넌트
 * 
 * 회원가입 후 첫 페이지에서 사용하여 사용자 정보를 자동으로 동기화합니다.
 */

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'

export function SyncUserOnMount() {
  const { user, isLoaded } = useUser()
  const [synced, setSynced] = useState(false)

  useEffect(() => {
    if (!isLoaded || !user || synced) {
      return
    }

    // 사용자 정보를 Supabase에 동기화
    const syncUser = async () => {
      try {
        const response = await fetch('/api/sync-user', {
          method: 'POST',
        })

        if (response.ok) {
          setSynced(true)
          console.log('✅ 사용자 정보가 Supabase에 동기화되었습니다.')
        } else {
          console.error('사용자 동기화 실패:', await response.text())
        }
      } catch (error) {
        console.error('사용자 동기화 오류:', error)
      }
    }

    syncUser()
  }, [user, isLoaded, synced])

  return null // UI 렌더링 없음
}


